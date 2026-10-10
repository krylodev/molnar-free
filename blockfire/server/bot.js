// Simple server-side bots so a room is never empty. They use the same
// movement code as players and fire through the same hit detection.

import { WEAPONS } from '../shared/weapons.js';
import { createMoveState, stepMove, eyeHeight, raycastBoxes, viewDir, PHYSICS_STEP } from '../shared/physics.js';

const RIFLE = 0;
const TURN_SPEED = 7; // rad/s
const AIM_ERROR = 0.035; // rad

function angleDiff(a, b) {
  let d = (b - a) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d < -Math.PI) d += Math.PI * 2;
  return d;
}

function gaussian() {
  return (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
}

export class Bot {
  constructor(room, player) {
    this.room = room;
    this.p = player;
    this.move = createMoveState();
    this.onSpawn();
  }

  onSpawn() {
    const p = this.p;
    this.move = createMoveState(p.x, p.y, p.z);
    this.yaw = p.yaw;
    this.pitch = 0;
    this.target = null;
    this.reactAt = 0;
    this.waypoint = null;
    this.strafe = Math.random() < 0.5 ? -1 : 1;
    this.nextStrafeSwap = 0;
    this.burstLeft = 0;
    this.burstPauseUntil = 0;
    this.stuckTime = 0;
    this.nextJump = 0;
    this.thinkAt = 0;
  }

  onDamaged(attacker) {
    if (!this.target && attacker !== this.p) {
      this.target = attacker;
      this.reactAt = performance.now() + 250;
    }
  }

  canSee(q) {
    const p = this.p;
    const o = [p.x, p.y + eyeHeight(p.crouch), p.z];
    const t = [q.x, q.y + 1.2, q.z];
    const d = [t[0] - o[0], t[1] - o[1], t[2] - o[2]];
    const dist = Math.hypot(d[0], d[1], d[2]);
    if (dist > 60 || dist < 0.01) return false;
    const dir = [d[0] / dist, d[1] / dist, d[2] / dist];
    return !raycastBoxes(this.room.map.boxes, o, dir, dist);
  }

  pickWaypoint() {
    const p = this.p;
    const options = this.room.map.waypoints.filter(([x, z]) => Math.hypot(x - p.x, z - p.z) > 8);
    const [x, z] = options[Math.floor(Math.random() * options.length)];
    this.waypoint = { x, z };
  }

  think(t) {
    const p = this.p;
    if (this.target && (!this.target.alive || !this.room.players.has(this.target.id) || !this.canSee(this.target))) {
      this.target = null;
    }
    if (!this.target) {
      let best = null;
      let bestD = Infinity;
      for (const q of this.room.players.values()) {
        if (q === p || !q.alive) continue;
        const d = Math.hypot(q.x - p.x, q.z - p.z);
        if (d < bestD && this.canSee(q)) {
          best = q;
          bestD = d;
        }
      }
      if (best) {
        this.target = best;
        this.reactAt = t + 450 + Math.random() * 350;
      }
    }
  }

  update(dt, t) {
    const p = this.p;
    if (!p.alive) return;

    if (t >= this.thinkAt) {
      this.thinkAt = t + 200;
      this.think(t);
    }

    const input = { forward: 0, strafe: 0, jump: false, crouch: false, yaw: this.yaw, speedMul: 1 };
    let wantYaw = this.yaw;
    let wantPitch = 0;

    if (this.target) {
      const q = this.target;
      const dx = q.x - p.x;
      const dz = q.z - p.z;
      const dist = Math.hypot(dx, dz);
      const dy = q.y + (q.crouch ? 0.8 : 1.2) - (p.y + eyeHeight(p.crouch));
      wantYaw = Math.atan2(-dx, -dz);
      wantPitch = Math.atan2(dy, dist);
      if (t >= this.nextStrafeSwap) {
        this.strafe = -this.strafe;
        this.nextStrafeSwap = t + 500 + Math.random() * 700;
      }
      input.strafe = this.strafe;
      input.forward = dist > 16 ? 1 : dist < 6 ? -1 : 0;
      if (t >= this.nextJump && Math.random() < 0.02) {
        input.jump = true;
        this.nextJump = t + 1500;
      }
    } else {
      if (!this.waypoint || Math.hypot(this.waypoint.x - p.x, this.waypoint.z - p.z) < 2) this.pickWaypoint();
      wantYaw = Math.atan2(-(this.waypoint.x - p.x), -(this.waypoint.z - p.z));
      input.forward = 1;
      const speed = Math.hypot(this.move.vel.x, this.move.vel.z);
      this.stuckTime = speed < 1 ? this.stuckTime + dt : 0;
      if (this.stuckTime > 0.5) input.jump = true;
      if (this.stuckTime > 1.5) {
        this.pickWaypoint();
        this.stuckTime = 0;
      }
    }

    const maxTurn = TURN_SPEED * dt;
    this.yaw += Math.max(-maxTurn, Math.min(maxTurn, angleDiff(this.yaw, wantYaw)));
    this.pitch += Math.max(-maxTurn, Math.min(maxTurn, wantPitch - this.pitch));
    input.yaw = this.yaw;

    for (let left = dt; left > 1e-6; left -= PHYSICS_STEP) {
      stepMove(this.move, input, Math.min(PHYSICS_STEP, left), this.room.map.boxes);
    }
    p.x = this.move.pos.x;
    p.y = this.move.pos.y;
    p.z = this.move.pos.z;
    p.yaw = this.yaw;
    p.pitch = this.pitch;
    p.crouch = this.move.crouching;
    p.weapon = RIFLE;

    if (this.target && t >= this.reactAt) this.shoot(t, wantYaw, wantPitch);
  }

  shoot(t, wantYaw, wantPitch) {
    const p = this.p;
    const W = WEAPONS[RIFLE];
    this.room.finishReload(p, t);
    if (p.reloadWeapon >= 0) return;
    if (p.ammo[RIFLE] <= 0) {
      this.room.handleReload(p, RIFLE);
      return;
    }
    if (t < this.burstPauseUntil || t - p.lastShot[RIFLE] < W.fireInterval * 1000) return;
    if (Math.abs(angleDiff(this.yaw, wantYaw)) > 0.12 || Math.abs(wantPitch - this.pitch) > 0.12) return;
    if (this.burstLeft <= 0) this.burstLeft = 3 + Math.floor(Math.random() * 3);

    const dir = viewDir(this.yaw + gaussian() * AIM_ERROR, this.pitch + gaussian() * AIM_ERROR);
    const origin = [p.x, p.y + eyeHeight(p.crouch), p.z];
    this.room.handleShot(p, RIFLE, origin, [dir], t);
    if (--this.burstLeft <= 0) this.burstPauseUntil = t + 600 + Math.random() * 500;
  }
}
