// Builds the three.js scene for the arena from the shared map boxes.

import * as THREE from 'three';
import { BOXES } from '/shared/map.js';

const TEX_SCALE = 2; // meters per texture tile

function makeTexture(kind, renderer) {
  const size = 64;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  const rand = mulberry(kind.length * 977);

  if (kind === 'floor') {
    for (let y = 0; y < 2; y++) {
      for (let x = 0; x < 2; x++) {
        g.fillStyle = (x + y) % 2 ? '#f2f2f2' : '#e2e2e2';
        g.fillRect(x * 32, y * 32, 32, 32);
      }
    }
  } else {
    g.fillStyle = '#ffffff';
    g.fillRect(0, 0, size, size);
  }
  // speckle noise
  for (let i = 0; i < 500; i++) {
    const v = 215 + Math.floor(rand() * 40);
    g.fillStyle = `rgb(${v},${v},${v})`;
    g.fillRect(Math.floor(rand() * size), Math.floor(rand() * size), 2, 2);
  }
  g.strokeStyle = 'rgba(0,0,0,0.22)';
  g.lineWidth = 2;
  if (kind === 'crate') {
    g.lineWidth = 4;
    g.strokeRect(2, 2, size - 4, size - 4);
    g.lineWidth = 2;
    for (const y of [22, 42]) {
      g.beginPath();
      g.moveTo(4, y);
      g.lineTo(size - 4, y);
      g.stroke();
    }
    g.beginPath();
    g.moveTo(4, 4);
    g.lineTo(size - 4, size - 4);
    g.stroke();
  } else {
    g.strokeRect(1, 1, size - 2, size - 2);
    if (kind === 'grid') {
      g.strokeStyle = 'rgba(0,0,0,0.1)';
      g.beginPath();
      g.moveTo(0, 32);
      g.lineTo(size, 32);
      g.moveTo(32, 0);
      g.lineTo(32, 32);
      g.moveTo(16, 32);
      g.lineTo(16, size);
      g.moveTo(48, 32);
      g.lineTo(48, size);
      g.stroke();
    }
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.magFilter = THREE.NearestFilter;
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return tex;
}

function mulberry(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Box geometry whose UVs tile with the box size instead of stretching.
function tiledBox(w, h, d) {
  const geo = new THREE.BoxGeometry(w, h, d);
  const uv = geo.attributes.uv;
  // faces: +x, -x, +y, -y, +z, -z; four vertices each
  const sizes = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
  for (let f = 0; f < 6; f++) {
    for (let v = 0; v < 4; v++) {
      const i = f * 4 + v;
      uv.setXY(i, (uv.getX(i) * sizes[f][0]) / TEX_SCALE, (uv.getY(i) * sizes[f][1]) / TEX_SCALE);
    }
  }
  return geo;
}

export function buildWorld(scene, renderer) {
  const sky = new THREE.Color(0x8ec9ff);
  scene.background = sky;
  scene.fog = new THREE.Fog(sky, 70, 170);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x6b7a5a, 1.6));
  const sun = new THREE.DirectionalLight(0xfff1d6, 2.2);
  sun.position.set(30, 50, 18);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  const sc = sun.shadow.camera;
  sc.left = sc.bottom = -48;
  sc.right = sc.top = 48;
  sc.near = 1;
  sc.far = 140;
  sun.shadow.bias = -0.0005;
  sun.shadow.normalBias = 0.03;
  scene.add(sun);

  const textures = {};
  const materials = new Map();
  const material = (tex, color) => {
    const key = `${tex}:${color}`;
    if (!materials.has(key)) {
      textures[tex] ??= makeTexture(tex, renderer);
      materials.set(key, new THREE.MeshLambertMaterial({ map: textures[tex], color }));
    }
    return materials.get(key);
  };

  for (const b of BOXES) {
    const w = b.max[0] - b.min[0];
    const h = b.max[1] - b.min[1];
    const d = b.max[2] - b.min[2];
    const mesh = new THREE.Mesh(tiledBox(w, h, d), material(b.tex, b.color));
    mesh.position.set((b.min[0] + b.max[0]) / 2, (b.min[1] + b.max[1]) / 2, (b.min[2] + b.max[2]) / 2);
    mesh.castShadow = b.tex !== 'floor';
    mesh.receiveShadow = true;
    mesh.matrixAutoUpdate = false;
    mesh.updateMatrix();
    scene.add(mesh);
  }
}
