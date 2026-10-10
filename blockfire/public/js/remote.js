// Other players, drawn slightly in the past by interpolating server snapshots.

import { makeAvatar } from './models.js';

function lerpAngle(a, b, k) {
  let d = (b - a) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d < -Math.PI) d += Math.PI * 2;
  return a + d * k;
}

export class RemotePlayer {
  constructor(info, scene, castShadow = false) {
    this.id = info.id;
    this.name = info.name;
    this.color = info.color;
    this.scene = scene;
    this.model = makeAvatar(info.color, info.name, castShadow);
    this.model.root.visible = false;
    scene.add(this.model.root);
    this.buffer = []; // [{ t, x, y, z, yaw, pitch, flags, w, hp }]
    this.pos = { x: 0, y: 0, z: 0 };
    this.crouch = false;
    this.alive = false;
    this.hp = 100;
    this.walk = 0;
    this.deathTime = 0;
    this.weapon = -1;
  }

  push(t, e) {
    this.buffer.push({ t, x: e[1], y: e[2], z: e[3], yaw: e[4], pitch: e[5], flags: e[6], w: e[7], hp: e[8] });
    while (this.buffer.length > 30) this.buffer.shift();
  }

  sample(renderT) {
    const b = this.buffer;
    if (b.length === 0) return null;
    if (renderT <= b[0].t) return b[0];
    for (let i = b.length - 1; i >= 0; i--) {
      if (b[i].t <= renderT) {
        const a = b[i];
        const n = b[i + 1];
        if (!n) return a;
        // snap instead of sliding across the map on respawn
        if (!(a.flags & 2) || !(n.flags & 2) || Math.hypot(n.x - a.x, n.z - a.z) > 5) return a;
        const k = (renderT - a.t) / (n.t - a.t || 1);
        return {
          ...a,
          x: a.x + (n.x - a.x) * k,
          y: a.y + (n.y - a.y) * k,
          z: a.z + (n.z - a.z) * k,
          yaw: lerpAngle(a.yaw, n.yaw, k),
          pitch: a.pitch + (n.pitch - a.pitch) * k,
        };
      }
    }
    return b[0];
  }

  update(renderT, dt) {
    const s = this.sample(renderT);
    if (!s) return;
    const m = this.model;
    const alive = !!(s.flags & 2);
    const speed = dt > 0 ? Math.hypot(s.x - this.pos.x, s.z - this.pos.z) / dt : 0;
    const vy = dt > 0 ? (s.y - this.pos.y) / dt : 0;
    this.pos.x = s.x;
    this.pos.y = s.y;
    this.pos.z = s.z;
    this.crouch = !!(s.flags & 1);
    this.hp = s.hp;

    if (alive !== this.alive) {
      this.alive = alive;
      this.deathTime = alive ? 0 : performance.now();
      m.body.rotation.x = 0;
      m.root.visible = alive;
    }
    if (!alive) {
      // tip over, then disappear
      const since = (performance.now() - this.deathTime) / 1000;
      if (since < 1.2) {
        m.root.visible = true;
        m.body.rotation.x = Math.min(1, since / 0.25) * (Math.PI / 2);
        m.tag.sprite.visible = false;
      } else {
        m.root.visible = false;
      }
      return;
    }

    m.root.position.set(s.x, s.y, s.z);
    m.root.rotation.y = s.yaw;
    m.arms.rotation.x = s.pitch;
    m.head.rotation.x = s.pitch * 0.6;
    m.tag.sprite.visible = true;
    m.tag.draw(s.hp);
    // flash while spawn protected
    m.body.visible = !(s.flags & 4) || Math.floor(performance.now() / 120) % 2 === 0;

    if (s.w !== this.weapon) {
      this.weapon = s.w;
      m.guns.forEach((g, i) => { g.group.visible = i === s.w; });
    }

    const crouchY = this.crouch ? -0.6 : 0;
    m.upper.position.y += (crouchY - m.upper.position.y) * Math.min(1, dt * 15);
    m.tag.sprite.position.y = 2.25 + m.upper.position.y;
    const legScale = this.crouch ? 0.25 : 1;
    const airborne = Math.abs(vy) > 1;
    this.walk += dt * Math.min(speed, 12) * 1.6;
    const swing = airborne ? 0.4 : Math.sin(this.walk) * Math.min(speed / 7, 1) * 0.8;
    m.legs.forEach((leg, i) => {
      leg.scale.y = legScale;
      leg.position.y = 0.8 * legScale;
      leg.rotation.x = i === 0 ? swing : -swing;
    });
  }

  muzzleWorld(target) {
    const g = this.model.guns[Math.max(0, this.weapon)];
    return g.muzzle.getWorldPosition(target);
  }

  dispose() {
    this.scene.remove(this.model.root);
    this.model.tag.sprite.material.map.dispose();
    this.model.tag.sprite.material.dispose();
  }
}
