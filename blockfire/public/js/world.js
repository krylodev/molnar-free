// Builds the scene for a map. All boxes that share a material are merged into
// one mesh and all props into another, so a whole map draws in a handful of
// calls, which matters most on weak GPUs.

import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { propGeometry, vertexMaterial } from './models.js';

const TEX_SCALE = 2; // meters per texture tile

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

function line(g, x1, y1, x2, y2) {
  g.beginPath();
  g.moveTo(x1, y1);
  g.lineTo(x2, y2);
  g.stroke();
}

// Small grayscale canvas textures; map colors tint them.
function makeTexture(kind) {
  const size = 64;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  const rand = mulberry(kind.length * 977 + kind.charCodeAt(0));
  g.fillStyle = '#ffffff';
  g.fillRect(0, 0, size, size);

  if (kind === 'floor') {
    g.fillStyle = '#e2e2e2';
    g.fillRect(0, 0, 32, 32);
    g.fillRect(32, 32, 32, 32);
  }
  const speckles = { sand: 900, snow: 250, ice: 120, concrete: 700 }[kind] ?? 500;
  const depth = { snow: 18, ice: 25, sand: 45 }[kind] ?? 40;
  for (let i = 0; i < speckles; i++) {
    const v = 255 - Math.floor(rand() * depth);
    g.fillStyle = `rgb(${v},${v},${v})`;
    g.fillRect(Math.floor(rand() * size), Math.floor(rand() * size), 2, 2);
  }

  g.strokeStyle = 'rgba(0,0,0,0.22)';
  g.lineWidth = 2;
  switch (kind) {
    case 'crate':
      g.lineWidth = 4;
      g.strokeRect(2, 2, size - 4, size - 4);
      g.lineWidth = 2;
      line(g, 4, 22, size - 4, 22);
      line(g, 4, 42, size - 4, 42);
      line(g, 4, 4, size - 4, size - 4);
      break;
    case 'brick':
      for (let row = 0; row < 4; row++) {
        const y = row * 16;
        line(g, 0, y, size, y);
        for (let x = row % 2 ? 16 : 0; x < size; x += 32) line(g, x, y, x, y + 16);
      }
      break;
    case 'plank':
      for (let y = 0; y < size; y += 16) line(g, 0, y, size, y);
      line(g, 40, 0, 40, 16);
      line(g, 12, 16, 12, 32);
      line(g, 52, 32, 52, 48);
      line(g, 24, 48, 24, 64);
      break;
    case 'ice':
      g.strokeStyle = 'rgba(255,255,255,0.6)';
      line(g, 8, 50, 30, 20);
      line(g, 30, 20, 50, 34);
      g.strokeStyle = 'rgba(0,0,0,0.1)';
      g.strokeRect(1, 1, size - 2, size - 2);
      break;
    case 'sand':
    case 'snow':
      break;
    case 'concrete':
      g.strokeStyle = 'rgba(0,0,0,0.15)';
      g.strokeRect(1, 1, size - 2, size - 2);
      break;
    default:
      g.strokeRect(1, 1, size - 2, size - 2);
      if (kind === 'grid') {
        g.strokeStyle = 'rgba(0,0,0,0.1)';
        line(g, 0, 32, size, 32);
        line(g, 32, 0, 32, 32);
        line(g, 16, 32, 16, size);
        line(g, 48, 32, 48, size);
      }
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.magFilter = THREE.NearestFilter;
  return tex;
}

// Box geometry whose UVs tile with the box size instead of stretching.
function tiledBox(b) {
  const w = b.max[0] - b.min[0];
  const h = b.max[1] - b.min[1];
  const d = b.max[2] - b.min[2];
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
  geo.translate((b.min[0] + b.max[0]) / 2, (b.min[1] + b.max[1]) / 2, (b.min[2] + b.max[2]) / 2);
  return geo;
}

export class World {
  constructor(scene, renderer) {
    this.scene = scene;
    this.renderer = renderer;
    this.map = null;
    this.meshes = [];
    this.textures = new Map();
    this.materials = new Map();
    this.shadowMode = 'off';
    this.anisotropy = 1;

    // lights live as long as the world so switching maps never adds lights
    // (which would force every shader to recompile)
    this.hemi = new THREE.HemisphereLight(0xffffff, 0x6b7a5a, 1.6);
    this.sun = new THREE.DirectionalLight(0xfff1d6, 2.2);
    this.sun.shadow.bias = -0.0005;
    this.sun.shadow.normalBias = 0.03;
    scene.add(this.hemi, this.sun, this.sun.target);
    scene.fog = new THREE.Fog(0x8ec9ff, 70, 170);
    scene.background = new THREE.Color(0x8ec9ff);
  }

  material(tex, color) {
    const key = `${tex}:${color}`;
    if (!this.materials.has(key)) {
      if (!this.textures.has(tex)) this.textures.set(tex, makeTexture(tex));
      const map = this.textures.get(tex);
      map.anisotropy = this.anisotropy;
      this.materials.set(key, new THREE.MeshLambertMaterial({ map, color }));
    }
    return this.materials.get(key);
  }

  load(map) {
    this.clear();
    this.map = map;
    const t = map.theme;
    this.scene.background.set(t.sky);
    this.scene.fog.color.set(t.sky);
    this.scene.fog.near = t.fogNear;
    this.scene.fog.far = t.fogFar;
    this.hemi.groundColor.set(t.ground);
    this.hemi.intensity = t.hemiIntensity;
    this.sun.color.set(t.sun);
    this.sun.intensity = t.sunIntensity;
    const h = map.half;
    this.sun.position.set(h * 0.75, h * 1.25, h * 0.45);
    const sc = this.sun.shadow.camera;
    sc.left = sc.bottom = -(h + 8);
    sc.right = sc.top = h + 8;
    sc.near = 1;
    sc.far = h * 4;
    sc.updateProjectionMatrix();

    // merge boxes by material
    const groups = new Map();
    for (const b of map.boxes) {
      if (b.prop) continue;
      const key = `${b.tex}:${b.color}`;
      if (!groups.has(key)) groups.set(key, { tex: b.tex, color: b.color, geos: [] });
      groups.get(key).geos.push(tiledBox(b));
    }
    for (const g of groups.values()) {
      const geo = mergeGeometries(g.geos);
      for (const part of g.geos) part.dispose();
      this.addMesh(geo, this.material(g.tex, g.color), g.tex !== map.theme.floorTex);
    }

    // merge every prop into one vertex-colored mesh
    const propGeos = [];
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const up = new THREE.Vector3(0, 1, 0);
    for (const p of map.props) {
      const src = propGeometry(p.type);
      if (!src) continue;
      m.compose(new THREE.Vector3(p.x, p.y, p.z), q.setFromAxisAngle(up, p.rot), new THREE.Vector3(1, 1, 1));
      propGeos.push(src.clone().applyMatrix4(m));
    }
    if (propGeos.length) {
      const geo = mergeGeometries(propGeos);
      for (const part of propGeos) part.dispose();
      this.addMesh(geo, vertexMaterial, true);
    }
    this.renderer.shadowMap.needsUpdate = true;
  }

  addMesh(geo, material, castShadow) {
    const mesh = new THREE.Mesh(geo, material);
    mesh.castShadow = castShadow;
    mesh.receiveShadow = true;
    mesh.matrixAutoUpdate = false;
    this.scene.add(mesh);
    this.meshes.push(mesh);
  }

  clear() {
    for (const mesh of this.meshes) {
      this.scene.remove(mesh);
      mesh.geometry.dispose();
    }
    this.meshes = [];
  }

  // 'off', 'static' (drawn once per map, players have blob shadows) or
  // 'dynamic' (redrawn every frame so players cast real shadows).
  setShadows(mode, size) {
    const r = this.renderer;
    const enabled = mode !== 'off';
    if (enabled !== r.shadowMap.enabled) {
      r.shadowMap.enabled = enabled;
      // shaders are compiled with or without shadow support
      this.scene.traverse((o) => {
        if (o.material) o.material.needsUpdate = true;
      });
      vertexMaterial.needsUpdate = true;
    }
    this.sun.castShadow = enabled;
    if (this.sun.shadow.mapSize.x !== size) {
      this.sun.shadow.mapSize.set(size, size);
      this.sun.shadow.map?.dispose();
      this.sun.shadow.map = null;
    }
    r.shadowMap.autoUpdate = mode === 'dynamic';
    r.shadowMap.needsUpdate = true;
    this.shadowMode = mode;
  }

  setAnisotropy(n) {
    this.anisotropy = n;
    for (const tex of this.textures.values()) {
      tex.anisotropy = n;
      tex.needsUpdate = true;
    }
  }
}
