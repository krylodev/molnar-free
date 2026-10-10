// Tracers, bullet holes and particle bursts, all pooled.

import * as THREE from 'three';

const unitBox = new THREE.BoxGeometry(1, 1, 1);
const tmp = new THREE.Vector3();

export class Effects {
  constructor(scene) {
    this.scene = scene;
    this.tracers = [];
    this.particles = [];
    this.decals = [];
    this.decalIndex = 0;

    this.tracerMat = new THREE.MeshBasicMaterial({
      color: 0xffe08a, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const decalMat = new THREE.MeshBasicMaterial({
      color: 0x1a1a1a, transparent: true, opacity: 0.85, depthWrite: false,
      polygonOffset: true, polygonOffsetFactor: -4,
    });
    const decalGeo = new THREE.PlaneGeometry(0.14, 0.14);
    for (let i = 0; i < 96; i++) {
      const m = new THREE.Mesh(decalGeo, decalMat);
      m.visible = false;
      scene.add(m);
      this.decals.push(m);
    }
  }

  tracer(from, to) {
    const len = from.distanceTo(to);
    if (len < 0.5) return;
    const mat = this.tracerMat.clone();
    const m = new THREE.Mesh(unitBox, mat);
    m.scale.set(0.025, 0.025, len);
    m.position.copy(from).lerp(to, 0.5);
    m.lookAt(to);
    this.scene.add(m);
    this.tracers.push({ m, life: 0.07, max: 0.07 });
  }

  decal(point, normal) {
    const m = this.decals[this.decalIndex];
    this.decalIndex = (this.decalIndex + 1) % this.decals.length;
    m.position.set(point.x + normal.x * 0.01, point.y + normal.y * 0.01, point.z + normal.z * 0.01);
    m.lookAt(tmp.set(point.x + normal.x, point.y + normal.y, point.z + normal.z));
    m.visible = true;
  }

  burst(point, color, count = 6, speed = 4) {
    const mat = new THREE.MeshBasicMaterial({ color });
    for (let i = 0; i < count; i++) {
      const m = new THREE.Mesh(unitBox, mat);
      const s = 0.04 + Math.random() * 0.05;
      m.scale.set(s, s, s);
      m.position.copy(point);
      this.scene.add(m);
      this.particles.push({
        m,
        v: new THREE.Vector3((Math.random() - 0.5) * speed, Math.random() * speed, (Math.random() - 0.5) * speed),
        life: 0.35 + Math.random() * 0.2,
      });
    }
  }

  update(dt) {
    for (let i = this.tracers.length - 1; i >= 0; i--) {
      const t = this.tracers[i];
      t.life -= dt;
      t.m.material.opacity = Math.max(0, t.life / t.max) * 0.9;
      if (t.life <= 0) {
        this.scene.remove(t.m);
        t.m.material.dispose();
        this.tracers.splice(i, 1);
      }
    }
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      p.v.y -= 15 * dt;
      p.m.position.addScaledVector(p.v, dt);
      if (p.life <= 0) {
        this.scene.remove(p.m);
        this.particles.splice(i, 1);
      }
    }
  }
}
