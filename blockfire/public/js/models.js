// Blocky player avatars and gun models, built from boxes.

import * as THREE from 'three';

const boxGeo = new THREE.BoxGeometry(1, 1, 1);
const matCache = new Map();

function mat(color) {
  if (!matCache.has(color)) matCache.set(color, new THREE.MeshLambertMaterial({ color }));
  return matCache.get(color);
}

function part(parent, color, w, h, d, x, y, z) {
  const m = new THREE.Mesh(boxGeo, mat(color));
  m.scale.set(w, h, d);
  m.position.set(x, y, z);
  m.castShadow = true;
  parent.add(m);
  return m;
}

// Guns point down -z with the grip at the origin. `muzzle` marks the barrel tip.
export function makeGun(id) {
  const g = new THREE.Group();
  const dark = 0x2b2f36;
  const metal = 0x4a505a;
  const muzzle = new THREE.Object3D();
  if (id === 'rifle') {
    part(g, dark, 0.08, 0.1, 0.5, 0, 0.03, -0.18);
    part(g, metal, 0.04, 0.04, 0.3, 0, 0.05, -0.58);
    part(g, 0xffb400, 0.085, 0.03, 0.2, 0, 0.095, -0.2);
    part(g, dark, 0.06, 0.16, 0.08, 0, -0.08, -0.22);
    part(g, dark, 0.06, 0.12, 0.06, 0, -0.06, 0.0);
    part(g, metal, 0.07, 0.09, 0.2, 0, 0.02, 0.15);
    muzzle.position.set(0, 0.05, -0.75);
  } else if (id === 'sniper') {
    part(g, 0x3b4a3a, 0.07, 0.09, 0.7, 0, 0.03, -0.2);
    part(g, metal, 0.035, 0.035, 0.5, 0, 0.05, -0.8);
    part(g, dark, 0.07, 0.07, 0.28, 0, 0.13, -0.2);
    part(g, 0x66ccff, 0.05, 0.05, 0.01, 0, 0.13, -0.345);
    part(g, dark, 0.05, 0.12, 0.06, 0, -0.06, 0.0);
    part(g, 0x3b4a3a, 0.07, 0.12, 0.25, 0, 0.0, 0.25);
    muzzle.position.set(0, 0.05, -1.06);
  } else {
    part(g, 0x7a4a26, 0.09, 0.1, 0.45, 0, 0.02, -0.12);
    part(g, metal, 0.05, 0.05, 0.45, 0, 0.07, -0.5);
    part(g, 0x5c3a1e, 0.08, 0.07, 0.2, 0, 0.0, -0.45);
    part(g, dark, 0.06, 0.12, 0.06, 0, -0.06, 0.02);
    part(g, 0x7a4a26, 0.08, 0.12, 0.22, 0, 0.0, 0.2);
    muzzle.position.set(0, 0.07, -0.74);
  }
  g.add(muzzle);
  return { group: g, muzzle };
}

export const GUN_IDS = ['rifle', 'sniper', 'shotgun'];

function nameTag(name) {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 64;
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthWrite: false }));
  sprite.scale.set(1.6, 0.4, 1);
  sprite.position.y = 2.25;
  sprite.renderOrder = 10;
  let lastHp = -1;
  const draw = (hp) => {
    if (hp === lastHp) return;
    lastHp = hp;
    const g = c.getContext('2d');
    g.clearRect(0, 0, 256, 64);
    g.font = 'bold 26px Segoe UI, system-ui, sans-serif';
    g.textAlign = 'center';
    g.lineWidth = 5;
    g.strokeStyle = 'rgba(0,0,0,0.7)';
    g.strokeText(name, 128, 30);
    g.fillStyle = '#fff';
    g.fillText(name, 128, 30);
    g.fillStyle = 'rgba(0,0,0,0.6)';
    g.fillRect(48, 42, 160, 10);
    g.fillStyle = hp > 35 ? '#4ee07f' : '#ff4d4d';
    g.fillRect(50, 44, 156 * Math.max(0, hp) / 100, 6);
    tex.needsUpdate = true;
  };
  draw(100);
  return { sprite, draw };
}

// Player avatar. Feet are at the group origin and it faces -z.
export function makeAvatar(color, name) {
  const root = new THREE.Group();
  const body = new THREE.Group(); // tilts when the player dies
  root.add(body);

  const skin = 0xf0c8a0;
  const pants = 0x2d3440;
  const legs = [];
  for (const side of [-1, 1]) {
    const hip = new THREE.Group();
    hip.position.set(side * 0.13, 0.8, 0);
    part(hip, pants, 0.24, 0.8, 0.26, 0, -0.4, 0);
    part(hip, 0x1a1d22, 0.26, 0.12, 0.32, 0, -0.74, -0.03);
    body.add(hip);
    legs.push(hip);
  }

  const upper = new THREE.Group(); // torso and head, lowered when crouching
  body.add(upper);
  part(upper, color, 0.62, 0.62, 0.34, 0, 1.1, 0);
  part(upper, 0x1a1d22, 0.64, 0.08, 0.36, 0, 0.82, 0);
  const head = new THREE.Group();
  head.position.y = 1.4;
  part(head, skin, 0.4, 0.4, 0.4, 0, 0.2, 0);
  part(head, color, 0.44, 0.12, 0.44, 0, 0.4, 0);
  part(head, 0x111111, 0.3, 0.07, 0.02, 0, 0.24, -0.205);
  upper.add(head);

  // arms pivot at the shoulders so they follow the view pitch
  const arms = new THREE.Group();
  arms.position.set(0, 1.32, 0);
  upper.add(arms);
  part(arms, color, 0.16, 0.16, 0.5, 0.3, -0.06, -0.2);
  part(arms, color, 0.16, 0.16, 0.42, -0.2, -0.08, -0.28);
  part(arms, skin, 0.14, 0.14, 0.1, 0.3, -0.06, -0.48);
  const guns = GUN_IDS.map((id) => {
    const { group, muzzle } = makeGun(id);
    group.position.set(0.16, -0.02, -0.45);
    group.visible = false;
    arms.add(group);
    return { group, muzzle };
  });

  const tag = nameTag(name);
  root.add(tag.sprite);

  return { root, body, upper, head, arms, legs, guns, tag };
}
