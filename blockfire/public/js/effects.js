// Tracers, bullet holes and particle bursts. Everything is pooled so firing
// never allocates meshes or materials.

import * as THREE from 'three';

const unitBox = new THREE.BoxGeometry(1, 1, 1);
const tmp = new THREE.Vector3();

export class Effects {
  constructor(scene) {
    this.scene = scene;
    this.tracers = [];
    this.tracerIndex = 0;
    this.particles = [];
    this.particleIndex = 0;
    this.decals = [];
    this.decalIndex = 0;
    this.particleMats = new Map();

    for (let i = 0; i < 32; i++) {
      const m = new THREE.Mesh(unitBox, new THREE.MeshBasicMaterial({
        color: 0xffe08a, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false,
      }));
      m.visible = false;
      m.frustumCulled = false;
      scene.add(m);
      this.tracers.push({ m, life: 0 });
    }
    for (let i = 0; i < 96; i++) {
      const m = new THREE.Mesh(unitBox, this.particleMaterial(0xffffff));
      m.visible = false;
      scene.add(m);
      this.particles.push({ m, v: new THREE.Vector3(), life: 0 });
    }
    const decalMat = new THREE.MeshBasicMaterial({
      color: 0x1a1a1a, transparent: true, opacity: 0.85, depthWrite: false,
      polygonOffset: true, polygonOffsetFactor: -4,
    });
    const decalGeo = new THREE.PlaneGeometry(0.14, 0.14);
    for (let i = 0; i < 64; i++) {
      const m = new THREE.Mesh(decalGeo, decalMat);
      m.visible = false;
      scene.add(m);
      this.decals.push(m);
    }
  }

  particleMaterial(color) {
    if (!this.particleMats.has(color)) this.particleMats.set(color, new THREE.MeshBasicMaterial({ color }));
    return this.particleMats.get(color);
  }

  tracer(from, to) {
    const len = from.distanceTo(to);
    if (len < 0.5) return;
    const t = this.tracers[this.tracerIndex];
    this.tracerIndex = (this.tracerIndex + 1) % this.tracers.length;
    t.m.scale.set(0.025, 0.025, len);
    t.m.position.copy(from).lerp(to, 0.5);
    t.m.lookAt(to);
    t.m.visible = true;
    t.life = 0.07;
  }

  decal(point, normal) {
    const m = this.decals[this.decalIndex];
    this.decalIndex = (this.decalIndex + 1) % this.decals.length;
    m.position.set(point.x + normal.x * 0.01, point.y + normal.y * 0.01, point.z + normal.z * 0.01);
    m.lookAt(tmp.set(point.x + normal.x, point.y + normal.y, point.z + normal.z));
    m.visible = true;
  }

  burst(point, color, count = 6, speed = 4) {
    const mat = this.particleMaterial(color);
    for (let i = 0; i < count; i++) {
      const p = this.particles[this.particleIndex];
      this.particleIndex = (this.particleIndex + 1) % this.particles.length;
      const s = 0.04 + Math.random() * 0.05;
      p.m.scale.set(s, s, s);
      p.m.position.copy(point);
      p.m.material = mat;
      p.m.visible = true;
      p.v.set((Math.random() - 0.5) * speed, Math.random() * speed, (Math.random() - 0.5) * speed);
      p.life = 0.35 + Math.random() * 0.2;
    }
  }

  // hide everything, e.g. when the map changes
  clear() {
    for (const t of this.tracers) t.m.visible = false;
    for (const p of this.particles) p.m.visible = false;
    for (const d of this.decals) d.visible = false;
  }

  update(dt) {
    for (const t of this.tracers) {
      if (!t.m.visible) continue;
      t.life -= dt;
      t.m.material.opacity = Math.max(0, t.life / 0.07) * 0.9;
      if (t.life <= 0) t.m.visible = false;
    }
    for (const p of this.particles) {
      if (!p.m.visible) continue;
      p.life -= dt;
      p.v.y -= 15 * dt;
      p.m.position.addScaledVector(p.v, dt);
      if (p.life <= 0) p.m.visible = false;
    }
  }
}
