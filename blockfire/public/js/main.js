import * as THREE from 'three';
import { CLIENT_SEND_RATE } from '/shared/constants.js';
import { WEAPONS } from '/shared/weapons.js';
import { MAPS, getMap } from '/shared/maps/index.js';
import { World } from './world.js';
import { Graphics } from './graphics.js';
import { loadModels } from './models.js';
import { Net } from './net.js';
import { Input } from './input.js';
import { Hud } from './hud.js';
import { Sfx } from './audio.js';
import { Effects } from './effects.js';
import { RemotePlayer } from './remote.js';
import { LocalPlayer } from './local.js';

const $ = (id) => document.getElementById(id);

// --- settings -------------------------------------------------------------------
const DEFAULTS = { sens: 1, fov: 85, vol: 0.6, name: '', quality: 'auto', scale: 1, map: '' };
function loadSettings() {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem('blockfire') ?? '{}') };
  } catch {
    return { ...DEFAULTS };
  }
}
function saveSettings() {
  try {
    localStorage.setItem('blockfire', JSON.stringify(settings));
  } catch { /* storage unavailable */ }
}
const settings = loadSettings();

// --- renderer and scenes ----------------------------------------------------------
// anti-aliasing is fixed when the context is created, so it follows the saved setting
const renderer = new THREE.WebGLRenderer({
  antialias: settings.quality === 'high',
  powerPreference: 'high-performance',
  stencil: false,
});
renderer.setPixelRatio(1);
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = false;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.autoClear = false;
$('game').append(renderer.domElement);

const scene = new THREE.Scene();
const world = new World(scene, renderer);
const camera = new THREE.PerspectiveCamera(settings.fov, innerWidth / innerHeight, 0.05, 400);
camera.rotation.order = 'YXZ';
let currentMap = null;

// first-person weapons render in their own pass so they never clip into walls
const viewScene = new THREE.Scene();
viewScene.add(new THREE.HemisphereLight(0xffffff, 0x556644, 2));
const viewSun = new THREE.DirectionalLight(0xffffff, 1.5);
viewSun.position.set(1, 2, 1);
viewScene.add(viewSun);
const viewCamera = new THREE.PerspectiveCamera(62, innerWidth / innerHeight, 0.01, 10);

addEventListener('resize', () => {
  renderer.setSize(innerWidth, innerHeight);
  for (const c of [camera, viewCamera]) {
    c.aspect = innerWidth / innerHeight;
    c.updateProjectionMatrix();
  }
});

// --- game objects -----------------------------------------------------------------
$('play').disabled = true;
$('play').textContent = 'Loading…';
try {
  await loadModels();
} catch (err) {
  $('menu-error').textContent = `Could not load models: ${err.message}`;
  throw err;
}
$('play').disabled = false;
$('play').textContent = 'Play';

const net = new Net();
const input = new Input(renderer.domElement);
const hud = new Hud();
const sfx = new Sfx();
sfx.setVolume(settings.vol);
const effects = new Effects(scene);
const remotes = new Map();
const players = new Map(); // id -> { id, name, color, kills, deaths, bot }
const local = new LocalPlayer({ camera, viewScene, effects, sfx, net, hud, remotes, settings });
let dynamicShadows = false;
const graphics = new Graphics(renderer, world, (on) => {
  dynamicShadows = on;
  for (const rp of remotes.values()) rp.model.setCastShadow(on);
});

function loadMap(id) {
  const map = getMap(id);
  if (currentMap === map) return;
  currentMap = map;
  world.load(map);
  effects.clear();
  local.boxes = map.boxes;
  camera.far = map.theme.fogFar + 10;
  camera.updateProjectionMatrix();
}

let myId = null;
let inGame = false;
let match = { st: 'play', end: 0, win: null, winName: null };
let respawnTime = 2.5;
let deathAt = 0;
let killerName = '';
let chatOpen = false;

function sysChat(text) {
  hud.chat(null, 0, text);
}

function addPlayer(info) {
  players.set(info.id, { ...info });
  if (info.id !== myId && !remotes.has(info.id)) remotes.set(info.id, new RemotePlayer(info, scene, dynamicShadows));
}

function removePlayer(id) {
  players.delete(id);
  remotes.get(id)?.dispose();
  remotes.delete(id);
}

function resetGame() {
  for (const id of [...players.keys()]) removePlayer(id);
  myId = null;
  inGame = false;
  local.alive = false;
  hud.show(false);
}

// --- network handlers ----------------------------------------------------------------
net.on('welcome', (m) => {
  myId = m.id;
  match = m.match;
  loadMap(match.map);
  respawnTime = m.config.respawnTime;
  for (const p of m.players) addPlayer(p);
  inGame = true;
  hud.show(true);
  $('menu').classList.add('hidden');
  $('play').disabled = false;
  $('play').textContent = 'Play';
  $('play').classList.add('hidden');
  $('resume').classList.remove('hidden');
  $('invite').classList.remove('hidden');
  history.replaceState(null, '', `?room=${encodeURIComponent(m.room)}`);
  sysChat(`Joined room "${m.room}". First to ${m.config.scoreLimit} kills wins.`);
  input.lock();
});

net.on('pj', (m) => {
  addPlayer(m);
  sysChat(`${m.name} joined`);
});

net.on('pl', (m) => {
  const p = players.get(m.id);
  if (p) sysChat(`${p.name} left`);
  removePlayer(m.id);
});

net.on('snap', (m) => {
  for (const e of m.p) {
    if (e[0] === myId) {
      if (local.alive) local.hp = e[8];
    } else {
      remotes.get(e[0])?.push(m.s, e);
    }
  }
});

net.on('sp', (m) => {
  local.spawn(m.p, m.yaw, m.sq, m.hp);
  hud.death(false);
});

net.on('tp', (m) => local.teleport(m.p, m.sq));

net.on('sh', (m) => {
  const rp = remotes.get(m.id);
  if (!rp) return;
  const from = rp.alive ? rp.muzzleWorld(new THREE.Vector3()) : new THREE.Vector3(...m.o);
  for (const e of m.e) {
    const to = new THREE.Vector3(...e);
    // shots that hit us would otherwise draw straight into the camera
    const nearMe = to.distanceTo(camera.position) < 2;
    if (nearMe) to.lerp(from, Math.min(1, 2 / Math.max(from.distanceTo(to), 2)));
    effects.tracer(from, to);
    if (!nearMe) effects.burst(to, 0xd8cfb8, 2, 2);
  }
  sfx.shot(WEAPONS[m.w]?.id, { x: camera.position.x, y: camera.position.y, z: camera.position.z, yaw: local.yaw },
    { x: m.o[0], y: m.o[1], z: m.o[2] });
});

net.on('hm', (m) => {
  hud.hit(m.h, m.k);
  sfx.hit(m.h);
  if (m.k) sfx.kill();
});

net.on('dmg', (m) => {
  local.hp = m.hp;
  sfx.hurt();
  const bearing = Math.atan2(-(m.from[0] - local.pos.x), -(m.from[1] - local.pos.z)) - local.yaw;
  hud.damageFrom(-bearing);
});

const STREAKS = { 2: 'Double Kill', 3: 'Triple Kill', 5: 'Rampage', 7: 'Unstoppable', 10: 'Legendary' };
net.on('k', (m) => {
  const killer = players.get(m.k);
  const victim = players.get(m.v);
  hud.killFeed(killer, victim, WEAPONS[m.w]?.name ?? '', m.h, m.k === myId || m.v === myId);
  if (m.v === myId) {
    local.die(m.k);
    deathAt = performance.now();
    killerName = killer && m.k !== myId ? killer.name : '';
  } else if (m.k === myId) {
    hud.announce(STREAKS[m.st] ?? (m.h ? 'Headshot' : `Eliminated ${victim?.name ?? ''}`));
  }
});

net.on('sc', (m) => {
  for (const [id, kills, deaths] of m.s) {
    const p = players.get(id);
    if (p) Object.assign(p, { kills, deaths });
  }
});

net.on('m', (m) => {
  match = m;
  if (m.st === 'end') {
    hud.announce(m.win === myId ? 'You win!' : `${m.winName ?? 'Nobody'} wins`);
    sysChat(`Match over. ${m.winName ?? 'Nobody'} wins! Next map: ${getMap(m.next).name}`);
  } else {
    loadMap(m.map);
    sysChat(`New match on ${getMap(m.map).name}`);
  }
});

net.on('c', (m) => {
  const p = players.get(m.id);
  hud.chat(p?.name ?? '?', p?.color ?? 0xffffff, m.m);
});

net.on('error', (m) => {
  $('menu-error').textContent = m.m;
});

net.on('close', () => {
  const wasInGame = inGame;
  resetGame();
  input.unlock();
  $('menu').classList.remove('hidden');
  $('play').classList.remove('hidden');
  $('play').disabled = false;
  $('play').textContent = 'Play';
  $('resume').classList.add('hidden');
  $('invite').classList.add('hidden');
  if (wasInGame) $('menu-error').textContent = 'Disconnected from server.';
  else if (!$('menu-error').textContent) $('menu-error').textContent = 'Could not connect to the server.';
});

// --- menu -------------------------------------------------------------------------
const params = new URLSearchParams(location.search);
$('name').value = settings.name;
$('room').value = params.get('room') ?? '';

function bindSlider(id, key, fmt, apply) {
  const el = $(id);
  const out = $(`${id}-val`);
  el.value = settings[key];
  out.textContent = fmt(settings[key]);
  el.addEventListener('input', () => {
    settings[key] = Number(el.value);
    out.textContent = fmt(settings[key]);
    apply?.(settings[key]);
    saveSettings();
  });
}
bindSlider('sens', 'sens', (v) => v.toFixed(2));
bindSlider('fov', 'fov', (v) => String(v));
bindSlider('vol', 'vol', (v) => `${Math.round(v * 100)}%`, (v) => sfx.setVolume(v));
bindSlider('scale', 'scale', (v) => `${Math.round(v * 100)}%`, () => graphics.apply(settings.quality, settings.scale));

// graphics quality
const startQuality = settings.quality;
$('quality').value = settings.quality;
function syncQualityUi() {
  $('scale').disabled = settings.quality === 'auto';
  const aaChanged = (settings.quality === 'high') !== (startQuality === 'high');
  $('quality-note').textContent = aaChanged ? 'Reload the page to switch anti-aliasing.' : '';
}
$('quality').addEventListener('change', () => {
  settings.quality = $('quality').value;
  saveSettings();
  graphics.apply(settings.quality, settings.scale);
  syncQualityUi();
});
graphics.apply(settings.quality, settings.scale);
syncQualityUi();

// map picker: applies when you are the one who opens the room
$('map').replaceChildren(new Option('Map rotation', ''), ...Object.values(MAPS).map((m) => new Option(m.name, m.id)));
$('map').value = Object.hasOwn(MAPS, settings.map) ? settings.map : '';
loadMap($('map').value || undefined);
$('map').addEventListener('change', () => {
  settings.map = $('map').value;
  saveSettings();
  if (!inGame) loadMap(settings.map || undefined);
});

$('play').addEventListener('click', () => {
  sfx.init();
  settings.name = $('name').value.trim();
  saveSettings();
  $('menu-error').textContent = '';
  $('play').disabled = true;
  $('play').textContent = 'Connecting…';
  net.connect(settings.name, $('room').value.trim(), settings.map || undefined);
});
for (const id of ['name', 'room']) {
  $(id).addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !$('play').disabled && !inGame) $('play').click();
  });
}
$('resume').addEventListener('click', () => {
  sfx.init();
  input.lock();
});
$('invite').addEventListener('click', async () => {
  const url = location.href;
  try {
    await navigator.clipboard.writeText(url);
    $('invite').textContent = 'Link copied!';
  } catch {
    prompt('Share this link with friends:', url);
  }
  setTimeout(() => { $('invite').textContent = 'Copy invite link'; }, 1500);
});

renderer.domElement.addEventListener('click', () => {
  if (inGame && !input.locked) input.lock();
});

input.onLockChange = (locked) => {
  if (!inGame) return;
  if (chatOpen) closeChat();
  $('menu').classList.toggle('hidden', locked);
};

// --- chat -------------------------------------------------------------------------
function openChat() {
  chatOpen = true;
  input.enabled = false;
  input.keys.clear();
  hud.openChat(true);
}
function closeChat() {
  chatOpen = false;
  input.enabled = true;
  hud.openChat(false);
}
$('chat-input').addEventListener('keydown', (e) => {
  e.stopPropagation();
  if (e.key === 'Enter') {
    const text = e.target.value.trim();
    if (text) net.send({ t: 'c', m: text });
    closeChat();
  } else if (e.key === 'Escape') {
    closeChat();
  }
});

// --- main loop ----------------------------------------------------------------------
let last = performance.now();
let sendTimer = 0;
let fpsFrames = 0;
let fpsTime = 0;
let fps = 0;
let hudTimer = 0;

// text, timer and scoreboard only change a few times a second
function slowHud() {
  hud.setStats(fps, Math.round(net.rtt));
  let leader = null;
  for (const p of players.values()) if (!leader || p.kills > leader.kills) leader = p;
  const remaining = (match.end - net.serverNow()) / 1000;
  const mapName = currentMap?.name ?? '';
  hud.setTimer(remaining, match.st === 'end'
    ? `Next map: ${getMap(match.next).name}`
    : leader && leader.kills > 0 ? `${mapName} · Leader: ${leader.name} (${leader.kills})` : `${mapName} · Free for all`);
  const showBoard = input.keys.has('Tab') || match.st === 'end';
  hud.scoreboard(showBoard, players.values(), myId,
    match.st === 'end' ? `${match.winName ?? 'Nobody'} wins!` : 'Scoreboard');
}

function frame() {
  requestAnimationFrame(frame);
  const now = performance.now();
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;

  fpsFrames++;
  fpsTime += dt;
  if (fpsTime >= 0.5) {
    fps = Math.round(fpsFrames / fpsTime);
    fpsFrames = 0;
    fpsTime = 0;
  }

  if (inGame) {
    if (input.locked && !chatOpen && (input.wasPressed('Enter') || input.wasPressed('KeyT'))) openChat();
    local.update(dt, input, now);

    sendTimer += dt;
    if (sendTimer >= 1 / CLIENT_SEND_RATE) {
      sendTimer = 0;
      if (local.alive) net.send(local.stateMessage());
    }

    const renderT = net.renderTime();
    for (const rp of remotes.values()) rp.update(renderT, dt);

    hud.setHealth(local.alive ? local.hp : 0);
    hud.setWeapon(local.weapon, local.ammo[local.weapon], local.reloading);
    if (!local.alive) hud.death(true, killerName, respawnTime - (now - deathAt) / 1000);
    hudTimer -= dt;
    if (hudTimer <= 0 || input.wasPressed('Tab')) {
      hudTimer = 0.2;
      slowHud();
    }
  } else {
    // slow fly-over behind the menu
    const t = now / 1000;
    const r = (currentMap?.half ?? 40) * 0.75;
    camera.position.set(Math.sin(t * 0.08) * r, r * 0.45, Math.cos(t * 0.08) * r);
    camera.lookAt(0, 2, 0);
  }
  graphics.tick(dt);

  effects.update(dt);
  renderer.clear();
  renderer.render(scene, camera);
  if (inGame && local.alive) {
    renderer.clearDepth();
    renderer.render(viewScene, viewCamera);
  }
  input.endFrame();
}
requestAnimationFrame(frame);

// handy in the browser console: blockfire.renderer.info
window.blockfire = { renderer, graphics, world };
