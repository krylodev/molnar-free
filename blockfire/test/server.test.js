import test from 'node:test';
import assert from 'node:assert/strict';
import WebSocket from 'ws';
import { Room } from '../server/room.js';
import { startServer } from '../server.js';
import { MATCH } from '../shared/constants.js';
import { WEAPONS } from '../shared/weapons.js';
import { MAPS, MAP_ROTATION } from '../shared/maps/index.js';

function fakeSocket() {
  return { readyState: 1, bufferedAmount: 0, sent: [], send(d) { this.sent.push(JSON.parse(d)); } };
}

function setupDuel() {
  const room = new Room('test', { minPlayers: 0 });
  const a = room.addPlayer('A', fakeSocket());
  const b = room.addPlayer('B', fakeSocket());
  room.stop();
  // open ground in the south-west, facing each other along x
  Object.assign(a, { x: -34, y: 0, z: 10, protectUntil: 0 });
  Object.assign(b, { x: -24, y: 0, z: 10, protectUntil: 0 });
  // keep the movement budget out of the way of these direct position edits
  a.history = [];
  b.history = [];
  return { room, a, b };
}

const sent = (p, type) => p.ws.sent.filter((m) => m.t === type);

test('welcome and spawn are sent on join', () => {
  const room = new Room('t', { minPlayers: 0 });
  const p = room.addPlayer('Solo', fakeSocket());
  room.stop();
  assert.equal(p.ws.sent[0].t, 'welcome');
  assert.equal(sent(p, 'sp').length, 1);
  assert.ok(p.alive);
});

test('body shots damage, headshots do more, kills are counted', () => {
  const { room, a, b } = setupDuel();
  const rifle = WEAPONS[0];
  assert.ok(room.handleShot(a, 0, [-34, 1.6, 10], [[1, -0.06, 0]], 0));
  assert.equal(b.hp, MATCH.maxHealth - rifle.damage);
  assert.equal(sent(a, 'hm')[0].h, false);

  a.lastShot[0] = -Infinity;
  assert.ok(room.handleShot(a, 0, [-34, 1.6, 10], [[1, 0, 0]], 0));
  assert.equal(b.hp, MATCH.maxHealth - rifle.damage - rifle.damage * rifle.headMult);
  assert.equal(sent(a, 'hm')[1].h, true);

  // finish them with the sniper
  assert.ok(room.handleShot(a, 1, [-34, 1.6, 10], [[1, 0, 0]], 0));
  assert.equal(b.alive, false);
  assert.equal(a.kills, 1);
  assert.equal(b.deaths, 1);
  assert.equal(sent(b, 'k').length, 1);
});

test('walls block shots', () => {
  const { room, a, b } = setupDuel();
  // put B behind the south-west house's east wall
  Object.assign(b, { x: -22, z: 22 });
  Object.assign(a, { x: -12, z: 22 });
  room.handleShot(a, 1, [-12, 1.6, 22], [[-1, 0, 0]], 0);
  assert.equal(b.hp, MATCH.maxHealth);
});

test('fire rate, ammo and spawn protection are enforced', () => {
  const { room, a, b } = setupDuel();
  assert.ok(room.handleShot(a, 1, [-34, 1.6, 10], [[1, -0.06, 0]], 0));
  assert.equal(room.handleShot(a, 1, [-34, 1.6, 10], [[1, -0.06, 0]], 0), false, 'too fast');
  assert.equal(room.handleShot(a, 2, [-34, 1.6, 10], [[1, 0, 0]], 0), false, 'wrong pellet count');

  a.ammo[0] = 0;
  assert.equal(room.handleShot(a, 0, [-34, 1.6, 10], [[1, 0, 0]], 0), false, 'empty mag');

  b.hp = MATCH.maxHealth;
  b.protectUntil = Infinity;
  a.lastShot[1] = -Infinity;
  room.handleShot(a, 1, [-34, 1.6, 10], [[1, 0, 0]], 0);
  assert.equal(b.hp, MATCH.maxHealth, 'spawn protection');
});

test('shots are checked against where the target was (lag compensation)', () => {
  const { room, a, b } = setupDuel();
  // B was in line of fire 200ms ago but has since moved 5m away
  const t = performance.now();
  b.history = [
    { t: t - 300, x: -24, y: 0, z: 10, c: false },
    { t: t - 100, x: -24, y: 0, z: 10, c: false },
  ];
  b.z = 15;
  room.handleShot(a, 1, [-34, 1.6, 10], [[1, -0.06, 0]], t - 200);
  assert.ok(b.hp < MATCH.maxHealth);
});

test('impossible movement is corrected', () => {
  const { room, a } = setupDuel();
  a.lastStateAt = performance.now() - 33;
  room.handleState(a, { t: 's', sq: a.sq, p: [-34.2, 0, 10], y: 0, x: 0, c: 0, w: 0 });
  assert.equal(a.x, -34.2);
  const sq = a.sq;
  room.handleState(a, { t: 's', sq: a.sq, p: [10, 0, 10], y: 0, x: 0, c: 0, w: 0 });
  assert.equal(a.x, -34.2);
  assert.equal(sent(a, 'tp').length, 1);
  assert.equal(a.sq, sq + 1);
  // states from before the correction are ignored
  room.handleState(a, { t: 's', sq, p: [-34.3, 0, 10], y: 0, x: 0, c: 0, w: 0 });
  assert.equal(a.x, -34.2);
});

// Runs the room's tick loop on a fake clock.
function fastForward(room, seconds) {
  const real = performance.now;
  let t = real.call(performance);
  try {
    for (let i = 0; i < seconds * 30; i++) {
      t += 1000 / 30;
      performance.now = () => t;
      room.tick();
    }
  } finally {
    performance.now = real;
  }
}

for (const map of Object.values(MAPS)) {
  test(`bots fill the room and fight on ${map.name}`, () => {
    const room = new Room('bots', { minPlayers: 6, map: map.id });
    const human = room.addPlayer('Human', fakeSocket());
    room.stop();
    assert.equal(room.map.id, map.id);
    assert.equal(room.players.size, 6);
    fastForward(room, 60);
    const kills = [...room.players.values()].reduce((n, p) => n + p.kills, 0);
    assert.ok(kills > 0, 'bots should find and kill each other');
    room.removePlayer(human.id);
    assert.equal(room.players.size, 0, 'bots leave with the last human');
  });
}

test('maps rotate between matches and players respawn on the new map', () => {
  const room = new Room('rotation', { minPlayers: 0, map: 'nope' });
  const p = room.addPlayer('A', fakeSocket());
  room.stop();
  assert.equal(room.map.id, MAP_ROTATION[0], 'unknown maps fall back to the rotation');
  room.endMatch(performance.now());
  assert.equal(sent(p, 'm').at(-1).next, MAP_ROTATION[1]);
  room.startMatch(performance.now());
  assert.equal(room.map.id, MAP_ROTATION[1]);
  const types = p.ws.sent.map((m) => m.t);
  assert.ok(types.lastIndexOf('m') < types.lastIndexOf('sp'), 'map change is sent before the spawn');
  const spawn = sent(p, 'sp').at(-1).p;
  assert.ok(room.map.spawns.some(([x, z]) => x === spawn[0] && z === spawn[2]));
});

test('server serves the client and runs a websocket game', async () => {
  const srv = await startServer({ port: 0, minPlayers: 0 });
  try {
    const page = await fetch(`http://localhost:${srv.port}/`);
    assert.equal(page.status, 200);
    assert.match(await page.text(), /Blockfire/);
    assert.equal((await fetch(`http://localhost:${srv.port}/vendor/three.module.js`)).status, 200);
    assert.equal((await fetch(`http://localhost:${srv.port}/shared/maps/index.js`)).status, 200);
    assert.equal((await fetch(`http://localhost:${srv.port}/addons/loaders/GLTFLoader.js`)).status, 200);
    const glb = await fetch(`http://localhost:${srv.port}/models/character.glb`);
    assert.equal(glb.headers.get('content-type'), 'model/gltf-binary');
    assert.equal((await fetch(`http://localhost:${srv.port}/..%2fserver.js`)).status, 404);

    const ws = new WebSocket(`ws://localhost:${srv.port}/ws`);
    const seen = new Set();
    await new Promise((resolve, reject) => {
      ws.on('open', () => ws.send(JSON.stringify({ t: 'join', name: 'Tester', room: 'ci' })));
      ws.on('message', (d) => {
        seen.add(JSON.parse(d).t);
        if (seen.has('welcome') && seen.has('sp') && seen.has('snap')) resolve();
      });
      ws.on('error', reject);
      setTimeout(() => reject(new Error(`timed out, saw ${[...seen]}`)), 3000);
    });
    assert.ok(srv.rooms.has('ci'));
    ws.close();
  } finally {
    await srv.close();
  }
});
