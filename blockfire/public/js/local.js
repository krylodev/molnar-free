// The player you control: predicted movement, weapons and the first-person
// view model.

import * as THREE from 'three';
import { MOVE } from '/shared/constants.js';
import { WEAPONS } from '/shared/weapons.js';
import {
  createMoveState, stepMove, eyeHeight, raycastBoxes, rayAABB, playerHitboxes, PHYSICS_STEP,
} from '/shared/physics.js';
import { makeGun, GUN_IDS } from './models.js';

const SWITCH_TIME = 300; // ms
const HIP = new THREE.Vector3(0.15, -0.15, -0.36);
const ADS = new THREE.Vector3(0, -0.095, -0.3);
const VIEW_SCALE = 0.62;

const v1 = new THREE.Vector3();
const v2 = new THREE.Vector3();
const fwd = new THREE.Vector3();
const right = new THREE.Vector3();
const up = new THREE.Vector3();

export class LocalPlayer {
  constructor({ camera, viewScene, effects, sfx, net, hud, remotes, settings }) {
    Object.assign(this, { camera, effects, sfx, net, hud, remotes, settings });
    this.move = createMoveState();
    this.yaw = 0;
    this.pitch = 0;
    this.alive = false;
    this.hp = 100;
    this.sq = 0;
    this.weapon = 0;
    this.lastWeapon = 1;
    this.ammo = WEAPONS.map((w) => w.mag);
    this.reloading = false;
    this.reloadStart = 0;
    this.reloadEnd = 0;
    this.nextFire = 0;
    this.switchEnd = 0;
    this.triggerReleased = true;
    this.ads = 0;
    this.punch = 0;
    this.kick = 0;
    this.bobPhase = 0;
    this.sway = new THREE.Vector2();
    this.eye = eyeHeight(false);
    this.accum = 0;
    this.killer = null;
    this.spread = 0;
    this.boxes = []; // collision boxes of the current map

    const flashMat = new THREE.MeshBasicMaterial({
      color: 0xffd27a, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false,
    });
    this.guns = GUN_IDS.map((id) => {
      const gun = makeGun(id);
      gun.group.traverse((o) => { o.castShadow = false; });
      const hand = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.12, 0.12), new THREE.MeshLambertMaterial({ color: 0x1a1d22 }));
      hand.position.set(0.0, -0.08, 0.03);
      gun.group.add(hand);
      const flash = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.2), flashMat);
      flash.rotation.z = Math.PI / 4;
      flash.visible = false;
      gun.muzzle.add(flash);
      gun.flash = flash;
      gun.group.visible = false;
      gun.group.scale.setScalar(VIEW_SCALE);
      viewScene.add(gun.group);
      return gun;
    });
    this.flashUntil = 0;
  }

  get w() {
    return WEAPONS[this.weapon];
  }

  get pos() {
    return this.move.pos;
  }

  spawn(p, yaw, sq, hp) {
    this.move = createMoveState(p[0], p[1], p[2]);
    this.yaw = yaw;
    this.pitch = 0;
    this.sq = sq;
    this.hp = hp;
    this.alive = true;
    this.killer = null;
    this.ammo = WEAPONS.map((w) => w.mag);
    this.reloading = false;
    this.ads = 0;
    this.eye = eyeHeight(false);
    this.switchEnd = performance.now() + SWITCH_TIME;
  }

  teleport(p, sq) {
    this.move.pos.x = p[0];
    this.move.pos.y = p[1];
    this.move.pos.z = p[2];
    this.move.vel.x = this.move.vel.y = this.move.vel.z = 0;
    this.sq = sq;
  }

  die(killer) {
    this.alive = false;
    this.killer = killer;
    this.reloading = false;
    this.ads = 0;
  }

  // Message sent to the server describing where we are.
  stateMessage() {
    const r = (v) => Math.round(v * 1000) / 1000;
    return {
      t: 's', sq: this.sq,
      p: [r(this.pos.x), r(this.pos.y), r(this.pos.z)],
      y: r(this.yaw), x: r(this.pitch), c: this.move.crouching ? 1 : 0, w: this.weapon,
    };
  }

  switchTo(i, now) {
    if (i === this.weapon || !WEAPONS[i]) return;
    this.lastWeapon = this.weapon;
    this.weapon = i;
    this.reloading = false;
    this.switchEnd = now + SWITCH_TIME;
    this.sfx.swap();
  }

  startReload(now) {
    if (this.reloading || this.ammo[this.weapon] >= this.w.mag || now < this.switchEnd) return;
    this.reloading = true;
    this.reloadStart = now;
    this.reloadEnd = now + this.w.reload * 1000;
    this.net.send({ t: 'rl', w: this.weapon });
    this.sfx.reload();
  }

  computeSpread() {
    const w = this.w;
    const s = this.move;
    const speed = Math.hypot(s.vel.x, s.vel.z);
    let spread = w.spreadHip + (w.spreadAds - w.spreadHip) * this.ads;
    spread += w.moveSpread * Math.min(speed / MOVE.runSpeed, 1);
    if (!s.onGround) spread += w.airSpread;
    if (w.scope && this.ads < 0.98) spread = Math.max(spread, w.spreadHip);
    return spread;
  }

  fire(now) {
    const w = this.w;
    if (this.ammo[this.weapon] <= 0) {
      this.sfx.empty();
      this.startReload(now);
      this.nextFire = now + 250;
      return;
    }
    this.ammo[this.weapon]--;
    this.nextFire = now + w.fireInterval * 1000;

    const cam = this.camera;
    cam.updateMatrixWorld();
    cam.getWorldDirection(fwd);
    right.set(1, 0, 0).applyQuaternion(cam.quaternion);
    up.set(0, 1, 0).applyQuaternion(cam.quaternion);
    const spread = this.computeSpread();
    const dirs = [];
    for (let i = 0; i < w.pellets; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * spread;
      v1.copy(fwd).addScaledVector(right, Math.cos(a) * r).addScaledVector(up, Math.sin(a) * r).normalize();
      dirs.push([v1.x, v1.y, v1.z]);
    }
    const o = cam.position;
    const r4 = (v) => Math.round(v * 10000) / 10000;
    this.net.send({
      t: 'sh', w: this.weapon,
      o: [r4(o.x), r4(o.y), r4(o.z)],
      d: dirs.map((d) => d.map(r4)),
      rt: Math.round(this.net.renderTime()),
    });

    // local effects; the server decides what actually hit
    const gun = this.guns[this.weapon];
    gun.muzzle.getWorldPosition(v2).applyMatrix4(cam.matrixWorld);
    const origin = [o.x, o.y, o.z];
    for (const d of dirs) {
      const wall = raycastBoxes(this.boxes, origin, d, w.range);
      let best = wall ? wall.t : w.range;
      let hitPlayer = false;
      for (const rp of this.remotes.values()) {
        if (!rp.alive) continue;
        for (const hb of playerHitboxes(rp.pos.x, rp.pos.y, rp.pos.z, rp.crouch)) {
          const hit = rayAABB(origin, d, hb.min, hb.max, best);
          if (hit && hit.t < best) {
            best = hit.t;
            hitPlayer = true;
          }
        }
      }
      v1.set(o.x + d[0] * best, o.y + d[1] * best, o.z + d[2] * best);
      if (!(w.scope && this.ads > 0.9)) this.effects.tracer(v2, v1);
      if (hitPlayer) this.effects.burst(v1, 0xc0392b, 5, 3);
      else if (wall && best === wall.t) {
        this.effects.decal(v1, { x: wall.normal[0], y: wall.normal[1], z: wall.normal[2] });
        this.effects.burst(v1, 0xd8cfb8, 3, 2.5);
      }
    }

    this.sfx.shot(w.id);
    this.punch += w.recoil;
    this.kick = 1;
    this.flashUntil = now + 45;
    if (this.ammo[this.weapon] === 0) setTimeout(() => this.startReload(performance.now()), w.fireInterval * 1000);
  }

  update(dt, input, now) {
    const cam = this.camera;
    const settings = this.settings;

    if (!this.alive) {
      // death cam: look toward whoever got us
      const k = this.killer && this.remotes.get(this.killer);
      if (k) {
        const dx = k.pos.x - this.pos.x;
        const dz = k.pos.z - this.pos.z;
        const wantYaw = Math.atan2(-dx, -dz);
        let d = (wantYaw - this.yaw) % (Math.PI * 2);
        if (d > Math.PI) d -= Math.PI * 2;
        if (d < -Math.PI) d += Math.PI * 2;
        this.yaw += d * Math.min(1, dt * 4);
        const wantPitch = Math.atan2(k.pos.y + 1 - (this.pos.y + 1.6), Math.hypot(dx, dz));
        this.pitch += (wantPitch - this.pitch) * Math.min(1, dt * 4);
      }
      this.eye += (0.6 - this.eye) * Math.min(1, dt * 5);
      cam.position.set(this.pos.x, this.pos.y + this.eye, this.pos.z);
      cam.rotation.set(this.pitch, this.yaw, 0.25);
      for (const g of this.guns) g.group.visible = false;
      this.hud.setScope(false);
      return;
    }

    const w = this.w;
    const active = input.locked && input.enabled;

    // look; slow the mouse down while zoomed
    const zoom = cam.fov / settings.fov;
    const sens = settings.sens * 0.0022 * zoom;
    this.yaw -= input.mouseDX * sens;
    this.pitch = Math.max(-1.55, Math.min(1.55, this.pitch - input.mouseDY * sens));

    // weapons
    for (let i = 0; i < WEAPONS.length; i++) if (input.wasPressed(`Digit${i + 1}`)) this.switchTo(i, now);
    if (input.wheel) this.switchTo((this.weapon + input.wheel + WEAPONS.length) % WEAPONS.length, now);
    if (input.wasPressed('KeyQ')) this.switchTo(this.lastWeapon, now);
    if (input.wasPressed('KeyR')) this.startReload(now);
    if (this.reloading && now >= this.reloadEnd) {
      this.reloading = false;
      this.ammo[this.weapon] = this.w.mag;
    }
    const wantAds = active && input.buttons.has(2) && !this.reloading && now >= this.switchEnd;
    this.ads = Math.max(0, Math.min(1, this.ads + (wantAds ? 1 : -1) * dt / this.w.adsTime));

    const trigger = active && input.buttons.has(0);
    if (trigger && (w.auto || this.triggerReleased) && now >= this.nextFire && now >= this.switchEnd && !this.reloading) {
      this.fire(now);
    }
    this.triggerReleased = !trigger;

    // movement
    const k = (code) => (active && input.down(code) ? 1 : 0);
    const moveInput = {
      forward: k('KeyW') - k('KeyS'),
      strafe: k('KeyD') - k('KeyA'),
      jump: !!k('Space'),
      crouch: !!(k('ShiftLeft') || k('KeyC')),
      yaw: this.yaw,
      speedMul: 1 + (MOVE.adsSpeedMul - 1) * this.ads,
    };
    this.accum = Math.min(this.accum + dt, PHYSICS_STEP * 12);
    while (this.accum >= PHYSICS_STEP) {
      stepMove(this.move, moveInput, PHYSICS_STEP, this.boxes);
      this.accum -= PHYSICS_STEP;
    }
    if (this.pos.y < -20) this.pos.y = 5;

    // camera
    this.eye += (eyeHeight(this.move.crouching) - this.eye) * Math.min(1, dt * 14);
    this.punch *= Math.exp(-dt * 9);
    cam.position.set(this.pos.x, this.pos.y + this.eye, this.pos.z);
    const slideTilt = this.move.slideTime > 0 ? 0.06 : 0;
    cam.rotation.set(this.pitch + this.punch, this.yaw, slideTilt);
    const fov = settings.fov + (w.adsFov - settings.fov) * this.ads;
    if (Math.abs(cam.fov - fov) > 0.01) {
      cam.fov = fov;
      cam.updateProjectionMatrix();
    }

    this.updateViewModel(dt, input, now);

    this.spread = this.computeSpread();
    const px = (Math.tan(this.spread) / Math.tan(THREE.MathUtils.degToRad(cam.fov / 2))) * (innerHeight / 2);
    this.hud.setSpread(px);
  }

  updateViewModel(dt, input, now) {
    const scoped = !!this.w.scope && this.ads > 0.95;
    this.hud.setScope(scoped);
    const s = this.move;
    const speed = Math.hypot(s.vel.x, s.vel.z);
    if (s.onGround && speed > 0.5) this.bobPhase += dt * speed * 1.3;
    const bobAmt = (s.onGround ? Math.min(speed / MOVE.runSpeed, 1.3) : 0) * (1 - this.ads * 0.85);
    this.kick *= Math.exp(-dt * 14);
    this.sway.x += (-input.mouseDX * 0.0004 - this.sway.x) * Math.min(1, dt * 10);
    this.sway.y += (input.mouseDY * 0.0004 - this.sway.y) * Math.min(1, dt * 10);

    let reloadDip = 0;
    if (this.reloading) {
      const p = (now - this.reloadStart) / (this.reloadEnd - this.reloadStart);
      reloadDip = Math.sin(Math.min(1, Math.max(0, p)) * Math.PI);
    }
    const switchDip = Math.max(0, (this.switchEnd - now) / SWITCH_TIME);

    this.guns.forEach((gun, i) => {
      const g = gun.group;
      g.visible = i === this.weapon && !scoped;
      if (!g.visible) return;
      g.position.lerpVectors(HIP, ADS, this.ads);
      g.position.x += Math.cos(this.bobPhase) * 0.012 * bobAmt + this.sway.x;
      g.position.y += -Math.abs(Math.sin(this.bobPhase)) * 0.012 * bobAmt + this.sway.y;
      g.position.y -= reloadDip * 0.12 + switchDip * 0.3 + (s.onGround ? 0 : 0.01);
      g.position.z += this.kick * 0.06;
      g.rotation.set(this.kick * 0.12 - reloadDip * 0.6, 0, reloadDip * 0.3);
      gun.flash.visible = now < this.flashUntil;
    });
  }
}
