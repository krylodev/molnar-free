// Player movement, collision and ray casting. Runs identically in the browser
// (client prediction) and on the server (bots, validation, hit detection).

import { PLAYER, MOVE } from './constants.js';

const EPS = 0.001;
export const PHYSICS_STEP = 1 / 120;

export function createMoveState(x = 0, y = 0, z = 0) {
  return {
    pos: { x, y, z },
    vel: { x: 0, y: 0, z: 0 },
    onGround: false,
    justLanded: false,
    crouching: false,
    crouchWasDown: false,
    slideTime: 0,
    slideCooldown: 0,
  };
}

export function playerHeight(crouching) {
  return crouching ? PLAYER.crouchHeight : PLAYER.height;
}

export function eyeHeight(crouching) {
  return crouching ? PLAYER.crouchEye : PLAYER.eye;
}

function overlaps(minx, miny, minz, maxx, maxy, maxz, b) {
  return (
    minx < b.max[0] && maxx > b.min[0] &&
    miny < b.max[1] && maxy > b.min[1] &&
    minz < b.max[2] && maxz > b.min[2]
  );
}

export function collidesAt(boxes, x, y, z, h, r = PLAYER.radius) {
  for (const b of boxes) {
    if (overlaps(x - r, y, z - r, x + r, y + h, z + r, b)) return b;
  }
  return null;
}

function applyFriction(vel, amount, dt) {
  const speed = Math.hypot(vel.x, vel.z);
  if (speed < 1e-4) {
    vel.x = 0;
    vel.z = 0;
    return;
  }
  const control = Math.max(speed, MOVE.stopSpeed);
  const scale = Math.max(speed - control * amount * dt, 0) / speed;
  vel.x *= scale;
  vel.z *= scale;
}

function accelerate(vel, wx, wz, wishSpeed, accel, dt) {
  const add = wishSpeed - (vel.x * wx + vel.z * wz);
  if (add <= 0) return;
  const acc = Math.min(accel * wishSpeed * dt, add);
  vel.x += acc * wx;
  vel.z += acc * wz;
}

function airAccelerate(vel, wx, wz, wishSpeed, dt) {
  const add = Math.min(wishSpeed, MOVE.airCap) - (vel.x * wx + vel.z * wz);
  if (add <= 0) return;
  const acc = Math.min(MOVE.airAccel * wishSpeed * dt, add);
  vel.x += acc * wx;
  vel.z += acc * wz;
}

function moveHorizontal(s, axis, delta, boxes, h, canStep) {
  if (delta === 0) return;
  const p = s.pos;
  const r = PLAYER.radius;
  const ai = axis === 'x' ? 0 : 2;
  p[axis] += delta;
  for (const b of boxes) {
    if (!overlaps(p.x - r, p.y, p.z - r, p.x + r, p.y + h, p.z + r, b)) continue;
    const rise = b.max[1] - p.y;
    if (canStep && rise > 0 && rise <= MOVE.stepHeight &&
        !collidesAt(boxes, p.x, b.max[1] + EPS, p.z, h)) {
      p.y = b.max[1] + EPS;
      continue;
    }
    p[axis] = delta > 0 ? b.min[ai] - r - EPS : b.max[ai] + r + EPS;
    s.vel[axis] = 0;
  }
}

function moveVertical(s, delta, boxes, h) {
  const p = s.pos;
  const r = PLAYER.radius;
  p.y += delta;
  s.onGround = false;
  for (const b of boxes) {
    if (!overlaps(p.x - r, p.y, p.z - r, p.x + r, p.y + h, p.z + r, b)) continue;
    if (delta <= 0) {
      p.y = b.max[1];
      s.onGround = true;
    } else {
      p.y = b.min[1] - h - EPS;
    }
    s.vel.y = 0;
  }
}

// Advances a move state by dt seconds.
// input: { forward, strafe (-1..1), jump, crouch (bool), yaw, speedMul }
export function stepMove(s, input, dt, boxes) {
  const wantCrouch = !!input.crouch;
  s.slideCooldown = Math.max(0, s.slideCooldown - dt);

  if (wantCrouch) s.crouching = true;
  else if (s.crouching && !collidesAt(boxes, s.pos.x, s.pos.y, s.pos.z, PLAYER.height)) s.crouching = false;

  // yaw 0 looks down -z, matching three.js cameras
  const sin = Math.sin(input.yaw);
  const cos = Math.cos(input.yaw);
  let wx = -sin * input.forward + cos * input.strafe;
  let wz = -cos * input.forward - sin * input.strafe;
  const wl = Math.hypot(wx, wz);
  if (wl > 0) {
    wx /= wl;
    wz /= wl;
  }

  const hspeed = Math.hypot(s.vel.x, s.vel.z);
  const crouchPressed = wantCrouch && !s.crouchWasDown;
  s.crouchWasDown = wantCrouch;
  if (s.onGround && wantCrouch && s.slideTime <= 0 && s.slideCooldown <= 0 &&
      hspeed > MOVE.runSpeed * 0.7 && (crouchPressed || s.justLanded)) {
    const boosted = Math.min(hspeed + MOVE.slideBoost, MOVE.slideMaxSpeed);
    const k = Math.max(boosted, hspeed) / hspeed;
    s.vel.x *= k;
    s.vel.z *= k;
    s.slideTime = MOVE.slideTime;
    s.slideCooldown = MOVE.slideCooldown;
  }
  if (!wantCrouch) s.slideTime = 0;

  // holding jump bunny hops: jumping before friction keeps momentum
  if (s.onGround && input.jump) {
    s.vel.y = MOVE.jumpSpeed;
    s.onGround = false;
  }

  const speedMul = input.speedMul ?? 1;
  if (s.onGround) {
    if (s.slideTime > 0) {
      applyFriction(s.vel, MOVE.slideFriction, dt);
      s.slideTime -= dt;
    } else {
      applyFriction(s.vel, MOVE.friction, dt);
      const wish = (s.crouching ? MOVE.crouchSpeed : MOVE.runSpeed) * speedMul;
      if (wl > 0) accelerate(s.vel, wx, wz, wish, MOVE.groundAccel, dt);
    }
  } else if (wl > 0) {
    airAccelerate(s.vel, wx, wz, MOVE.runSpeed * speedMul, dt);
  }

  const hs = Math.hypot(s.vel.x, s.vel.z);
  if (hs > MOVE.maxSpeed) {
    s.vel.x *= MOVE.maxSpeed / hs;
    s.vel.z *= MOVE.maxSpeed / hs;
  }
  s.vel.y = Math.max(s.vel.y - MOVE.gravity * dt, -MOVE.maxFall);

  const wasGround = s.onGround;
  const h = playerHeight(s.crouching);
  moveHorizontal(s, 'x', s.vel.x * dt, boxes, h, wasGround);
  moveHorizontal(s, 'z', s.vel.z * dt, boxes, h, wasGround);
  moveVertical(s, s.vel.y * dt, boxes, h);
  s.justLanded = !wasGround && s.onGround;
}

// Hitboxes for a player standing at (x, y, z) with feet at y.
export function playerHitboxes(x, y, z, crouching) {
  const h = playerHeight(crouching);
  const headBottom = y + h - PLAYER.headHeight;
  const r = PLAYER.radius;
  const hr = PLAYER.headRadius;
  return [
    { min: [x - r, y, z - r], max: [x + r, headBottom, z + r], head: false },
    { min: [x - hr, headBottom, z - hr], max: [x + hr, y + h, z + hr], head: true },
  ];
}

// Slab test. Returns { t, normal } for the entry point, or null.
export function rayAABB(o, d, min, max, tMax) {
  let tmin = 0;
  let tmax = tMax;
  let axis = -1;
  let sign = 0;
  for (let i = 0; i < 3; i++) {
    if (Math.abs(d[i]) < 1e-9) {
      if (o[i] < min[i] || o[i] > max[i]) return null;
      continue;
    }
    const inv = 1 / d[i];
    let t1 = (min[i] - o[i]) * inv;
    let t2 = (max[i] - o[i]) * inv;
    let s = -1;
    if (t1 > t2) {
      const tmp = t1;
      t1 = t2;
      t2 = tmp;
      s = 1;
    }
    if (t1 > tmin) {
      tmin = t1;
      axis = i;
      sign = s;
    }
    if (t2 < tmax) tmax = t2;
    if (tmin > tmax) return null;
  }
  const normal = [0, 0, 0];
  if (axis >= 0) normal[axis] = sign;
  return { t: tmin, normal };
}

export function raycastBoxes(boxes, o, d, maxDist) {
  let best = null;
  let bestT = maxDist;
  for (const b of boxes) {
    const hit = rayAABB(o, d, b.min, b.max, bestT);
    if (hit && hit.t < bestT) {
      bestT = hit.t;
      best = hit;
    }
  }
  return best;
}

export function normalize(v) {
  const l = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / l, v[1] / l, v[2] / l];
}

// Unit view direction for a yaw/pitch pair (pitch > 0 looks up).
export function viewDir(yaw, pitch) {
  const cp = Math.cos(pitch);
  return [-Math.sin(yaw) * cp, Math.sin(pitch), -Math.cos(yaw) * cp];
}
