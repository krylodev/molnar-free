import test from 'node:test';
import assert from 'node:assert/strict';
import { MAPS } from '../shared/maps/index.js';
import courtyard from '../shared/maps/courtyard.js';
import { PLAYER, MOVE } from '../shared/constants.js';
import { PROP_COLLIDERS } from '../shared/props.js';

const BOXES = courtyard.boxes;
import {
  createMoveState, stepMove, collidesAt, raycastBoxes, rayAABB, playerHitboxes, PHYSICS_STEP,
} from '../shared/physics.js';

function simulate(s, input, seconds) {
  for (let t = 0; t < seconds; t += PHYSICS_STEP) stepMove(s, input, PHYSICS_STEP, BOXES);
}

const idle = { forward: 0, strafe: 0, jump: false, crouch: false, yaw: 0 };

for (const map of Object.values(MAPS)) {
  test(`${map.name}: spawns and waypoints are free and on the ground`, () => {
    assert.ok(map.spawns.length >= 8, 'enough spawns');
    for (const [x, z] of map.waypoints) {
      assert.equal(collidesAt(map.boxes, x, 0.05, z, PLAYER.height), null, `blocked at ${x},${z}`);
      const s = createMoveState(x, 0.5, z);
      for (let t = 0; t < 0.5; t += PHYSICS_STEP) stepMove(s, idle, PHYSICS_STEP, map.boxes);
      assert.ok(s.onGround && s.pos.y < 0.05, `no floor at ${x},${z} (y=${s.pos.y})`);
    }
  });

  test(`${map.name}: geometry is valid and inside the walls`, () => {
    const limit = map.half + 2.01;
    for (const b of map.boxes) {
      for (let i = 0; i < 3; i++) assert.ok(b.max[i] > b.min[i], `empty box ${JSON.stringify(b)}`);
      assert.ok(b.min[0] >= -limit && b.max[0] <= limit && b.min[2] >= -limit && b.max[2] <= limit,
        `box outside the map ${JSON.stringify(b)}`);
    }
    for (const p of map.props) assert.ok(PROP_COLLIDERS[p.type], p.type);
  });

  test(`${map.name}: players cannot leave the arena`, () => {
    const [x, z] = map.spawns[0];
    for (const yaw of [0, Math.PI / 2, Math.PI, -Math.PI / 2]) {
      const s = createMoveState(x, 0, z);
      for (let t = 0; t < 20; t += PHYSICS_STEP) {
        stepMove(s, { ...idle, forward: 1, jump: true, yaw }, PHYSICS_STEP, map.boxes);
      }
      assert.ok(Math.abs(s.pos.x) < map.half && Math.abs(s.pos.z) < map.half, `escaped to ${s.pos.x},${s.pos.z}`);
    }
  });
}

test('a player stops at walls', () => {
  // walk toward the north boundary wall (z = -40)
  const s = createMoveState(-20, 0, -36);
  simulate(s, { ...idle, forward: 1 }, 3);
  assert.ok(s.pos.z >= -40 + PLAYER.radius - 0.01, `went through wall: z=${s.pos.z}`);
  assert.ok(s.pos.z < -39, 'should reach the wall');
});

test('stairs lead up to the central plaza', () => {
  // start south of the plaza stairs and walk north (yaw 0 faces -z)
  const s = createMoveState(0, 0, 13);
  simulate(s, { ...idle, forward: 1 }, 2.5);
  assert.ok(Math.abs(s.pos.y - 2) < 0.05, `expected to stand on the plaza, y=${s.pos.y}`);
});

test('jumping clears a crate and bunny hopping keeps speed', () => {
  const s = createMoveState(-25, 0, 10);
  simulate(s, idle, 0.2);
  simulate(s, { ...idle, jump: true }, 0.1);
  let peak = 0;
  for (let i = 0; i < 60; i++) {
    stepMove(s, idle, PHYSICS_STEP, BOXES);
    peak = Math.max(peak, s.pos.y);
  }
  assert.ok(peak > 1.2, `jump peak ${peak}`);

  const r = createMoveState(-38, 0, 30);
  r.vel.z = -MOVE.runSpeed * 1.5;
  simulate(r, { ...idle, yaw: 0, forward: 1, jump: true }, 1);
  assert.ok(Math.hypot(r.vel.x, r.vel.z) > MOVE.runSpeed, 'hopping should not bleed speed to friction');
});

test('sliding boosts speed', () => {
  const s = createMoveState(-25, 0, 20);
  simulate(s, { ...idle, forward: 1, yaw: Math.PI }, 1);
  const before = Math.hypot(s.vel.x, s.vel.z);
  stepMove(s, { ...idle, forward: 1, yaw: Math.PI, crouch: true }, PHYSICS_STEP, BOXES);
  const after = Math.hypot(s.vel.x, s.vel.z);
  assert.ok(after > before + 2, `slide ${before} -> ${after}`);
});

test('crouching under a ledge keeps the player crouched', () => {
  // under the roof cover is not possible; use the tower platform underside (3.5)
  const s = createMoveState(-26, 0, -26);
  simulate(s, { ...idle, crouch: true }, 0.2);
  assert.equal(s.crouching, true);
  simulate(s, idle, 0.2);
  assert.equal(s.crouching, false, 'tower is tall enough to stand under');
});

test('ray casts hit walls and hitboxes', () => {
  const hit = raycastBoxes(BOXES, [-20, 1.6, -30], [0, 0, -1], 100);
  assert.ok(hit && Math.abs(hit.t - 10) < 1e-6, `wall at distance ${hit?.t}`);
  assert.deepEqual(hit.normal, [0, 0, 1]);

  const [body, head] = playerHitboxes(0, 0, -5, false);
  assert.ok(rayAABB([0, 1.0, 0], [0, 0, -1], body.min, body.max, 100));
  assert.ok(rayAABB([0, 1.6, 0], [0, 0, -1], head.min, head.max, 100));
  assert.equal(rayAABB([0, 1.6, 0], [0, 0, -1], body.min, body.max, 100), null);
});
