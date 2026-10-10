// Player avatars, guns and props, loaded from the GLB files that
// blender/build_models.py exports. Every model uses vertex colors with one
// shared material, so there are no textures to load or switch between.

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export const GUN_IDS = ['rifle', 'sniper', 'shotgun'];
const GUN_NODES = { rifle: 'Rifle', sniper: 'Sniper', shotgun: 'Shotgun' };

export const vertexMaterial = new THREE.MeshLambertMaterial({ vertexColors: true });
const accentMaterials = new Map();
const shadowGeo = new THREE.CircleGeometry(0.45, 12).rotateX(-Math.PI / 2);
const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.28, depthWrite: false });

let assets = null;

// Accent parts take the player's color, multiplied with their vertex shading.
function accentMaterial(color) {
  if (!accentMaterials.has(color)) {
    accentMaterials.set(color, new THREE.MeshLambertMaterial({ vertexColors: true, color }));
  }
  return accentMaterials.get(color);
}

export async function loadModels() {
  const loader = new GLTFLoader();
  const [character, weapons, props] = await Promise.all(
    ['character', 'weapons', 'props'].map((n) => loader.loadAsync(`/models/${n}.glb`)),
  );
  for (const gltf of [character, weapons, props]) {
    gltf.scene.traverse((o) => {
      if (!o.isMesh) return;
      o.userData.accent = o.material.name === 'Accent';
      o.material.dispose();
      o.material = vertexMaterial;
    });
  }
  assets = {
    character: character.scene.getObjectByName('Character'),
    weapons: weapons.scene,
    props: props.scene,
  };
  return assets;
}

// Geometry of a prop by name (props.glb has one mesh per prop).
export function propGeometry(type) {
  return assets.props.getObjectByName(type)?.geometry ?? null;
}

// Guns point down -z with the grip at the origin. `muzzle` marks the barrel tip.
export function makeGun(id) {
  const node = GUN_NODES[id];
  const group = assets.weapons.getObjectByName(node).clone(true);
  group.position.set(0, 0, 0);
  group.rotation.set(0, 0, 0);
  return { group, muzzle: group.getObjectByName(`${node}Muzzle`) };
}

function nameTag(name) {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 64;
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.generateMipmaps = false;
  tex.minFilter = THREE.LinearFilter;
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

// Player avatar. Feet are at the root's origin and it faces -z.
export function makeAvatar(color, name, castShadow = false) {
  const root = assets.character.clone(true);
  root.position.set(0, 0, 0);
  const accent = accentMaterial(color);
  const meshes = [];
  root.traverse((o) => {
    if (!o.isMesh) return;
    if (o.userData.accent) o.material = accent;
    o.castShadow = castShadow;
    meshes.push(o);
  });

  const socket = root.getObjectByName('GunSocket');
  const guns = GUN_IDS.map((id) => {
    const gun = makeGun(id);
    gun.group.visible = false;
    gun.group.traverse((o) => {
      if (!o.isMesh) return;
      o.castShadow = castShadow;
      meshes.push(o);
    });
    socket.add(gun.group);
    return gun;
  });

  // cheap blob shadow; real shadows are only drawn on high quality
  const shadow = new THREE.Mesh(shadowGeo, shadowMat);
  shadow.position.y = 0.02;
  root.add(shadow);

  const tag = nameTag(name);
  root.add(tag.sprite);

  return {
    root,
    body: root.getObjectByName('Body'),
    upper: root.getObjectByName('Upper'),
    head: root.getObjectByName('Head'),
    arms: root.getObjectByName('Arms'),
    legs: [root.getObjectByName('LegL'), root.getObjectByName('LegR')],
    guns,
    tag,
    setCastShadow(on) {
      for (const m of meshes) m.castShadow = on;
    },
  };
}
