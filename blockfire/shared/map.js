// The arena, built from axis-aligned boxes. Every box is solid for movement
// and blocks bullets. Positions are in meters; y is up and the floor is y = 0.

const boxes = [];

const C = {
  floor: 0x8fa37a,
  outer: 0xc9c2b0,
  plaza: 0xd8d2c4,
  lane: 0xe0b04a,
  houseA: 0x5b8fb9,
  houseB: 0xb95b5b,
  roof: 0x4a4f5a,
  tower: 0x7a6a9c,
  crate: 0xc8913c,
  cover: 0x9aa0a6,
};

// Box from a center x/z, a bottom y and a size.
function box(x, y, z, w, h, d, color, tex = 'grid') {
  boxes.push({ min: [x - w / 2, y, z - d / 2], max: [x + w / 2, y + h, z + d / 2], color, tex });
}

// Solid staircase that climbs to topH, starting at (x, z) and running away
// from it along dir (one of 'x+', 'x-', 'z+', 'z-'). The highest step is
// placed at (x, z), so (x, z) should sit right against the ledge it reaches.
function stairs(x, z, dir, width, topH, color, depth = 0.7) {
  const steps = Math.round(topH / 0.5) - 1;
  const sx = dir === 'x+' ? 1 : dir === 'x-' ? -1 : 0;
  const sz = dir === 'z+' ? 1 : dir === 'z-' ? -1 : 0;
  for (let k = 0; k < steps; k++) {
    const h = topH - 0.5 * (k + 1);
    const off = (k + 0.5) * depth;
    const cx = x + sx * off;
    const cz = z + sz * off;
    if (sx !== 0) box(cx, 0, cz, depth, h, width, color);
    else box(cx, 0, cz, width, h, depth, color);
  }
}

function crate(x, z, size = 1.2, y = 0) {
  box(x, y, z, size, size, size, C.crate, 'crate');
}

// Hollow building with a walkable roof and stairs to it.
function house(cx, cz, color, doorSides, stair) {
  const s = 12;
  const half = s / 2;
  const t = 0.5;
  const h = 4.5;
  const door = 3;
  const wall = (side) => {
    const hasDoor = doorSides.includes(side);
    const alongX = side === 'n' || side === 's';
    const fixed = side === 'n' ? cz - half : side === 's' ? cz + half : side === 'w' ? cx - half : cx + half;
    const center = alongX ? cx : cz;
    const pieces = hasDoor
      ? [[center - half, center - door / 2], [center + door / 2, center + half]]
      : [[center - half, center + half]];
    for (const [a, b] of pieces) {
      const len = b - a;
      const mid = (a + b) / 2;
      if (alongX) box(mid, 0, fixed, len + (hasDoor ? 0 : t), h, t, color);
      else box(fixed, 0, mid, t, h, len, color);
    }
    // lintel above the door
    if (hasDoor) {
      if (alongX) box(center, 3, fixed, door, h - 3, t, color);
      else box(fixed, 3, center, t, h - 3, door, color);
    }
  };
  for (const side of ['n', 's', 'w', 'e']) wall(side);
  box(cx, h, cz, s + t, 0.5, s + t, C.roof);
  // roof cover
  box(cx - 2.5, h + 0.5, cz + 2.5, 1.2, 1, 1.2, C.crate, 'crate');
  box(cx + 3, h + 0.5, cz - 2, 3, 1, 0.5, C.cover);
  stairs(stair.x, stair.z, stair.dir, 2.5, h + 0.5, color);
}

// Raised sniper platform on pillars.
function tower(cx, cz, stairDir) {
  const s = 6;
  const top = 4;
  for (const [px, pz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    box(cx + px * (s / 2 - 0.4), 0, cz + pz * (s / 2 - 0.4), 0.8, top - 0.5, 0.8, C.tower);
  }
  box(cx, top - 0.5, cz, s, 0.5, s, C.tower);
  // half walls on three sides, open where the stairs arrive
  const edges = { 'x+': [s / 2, 0], 'x-': [-s / 2, 0], 'z+': [0, s / 2], 'z-': [0, -s / 2] };
  for (const [dir, [ex, ez]] of Object.entries(edges)) {
    if (dir === stairDir) continue;
    if (ex !== 0) box(cx + ex - Math.sign(ex) * 0.2, top, cz, 0.4, 1, s, C.cover);
    else box(cx, top, cz + ez - Math.sign(ez) * 0.2, s, 1, 0.4, C.cover);
  }
  const [ex, ez] = edges[stairDir];
  stairs(cx + ex + Math.sign(ex) * 0.0, cz + ez + Math.sign(ez) * 0.0, stairDir, 2.5, top, C.tower);
}

// --- Floor and boundary -----------------------------------------------------
export const MAP_HALF = 40;
box(0, -1, 0, 84, 1, 84, C.floor, 'floor');
box(0, 0, -41, 84, 10, 2, C.outer);
box(0, 0, 41, 84, 10, 2, C.outer);
box(-41, 0, 0, 2, 10, 80, C.outer);
box(41, 0, 0, 2, 10, 80, C.outer);

// --- Central plaza ------------------------------------------------------------
box(0, 0, 0, 12, 2, 12, C.plaza);
stairs(0, 6, 'z+', 4, 2, C.plaza);
stairs(0, -6, 'z-', 4, 2, C.plaza);
stairs(6, 0, 'x+', 4, 2, C.plaza);
stairs(-6, 0, 'x-', 4, 2, C.plaza);
box(0, 2, 0, 2, 3, 2, C.cover);
box(-4, 2, -4, 2.5, 1, 0.5, C.cover);
box(4, 2, 4, 2.5, 1, 0.5, C.cover);
box(4, 2, -4, 0.5, 1, 2.5, C.cover);
box(-4, 2, 4, 0.5, 1, 2.5, C.cover);

// --- Lane walls around the plaza --------------------------------------------
for (const s of [-1, 1]) {
  box(s * 14, 0, -6.5, 1, 3, 9, C.lane);
  box(s * 14, 0, 6.5, 1, 3, 9, C.lane);
  box(-6.5, 0, s * 14, 9, 3, 1, C.lane);
  box(6.5, 0, s * 14, 9, 3, 1, C.lane);
}

// --- Buildings and towers ---------------------------------------------------
house(24, -24, C.houseA, ['w', 's'], { x: 17.75, z: -20.25, dir: 'x-' });
house(-24, 24, C.houseB, ['e', 'n'], { x: -17.75, z: 20.25, dir: 'x+' });
tower(-26, -26, 'x+');
tower(26, 26, 'x-');

// --- Crates and cover ---------------------------------------------------------
crate(-8, -21);
crate(-6.8, -21);
crate(-7.4, -21, 1.2, 1.2);
crate(8, 21);
crate(9.2, 21);
crate(8.6, 21, 1.2, 1.2);
crate(21, 6, 2);
crate(-21, -6, 2);
crate(31, -6);
crate(-31, 6);
crate(10, -32, 2);
crate(-10, 32, 2);
crate(33, 8);
crate(-33, -8);
crate(20, 33);
crate(-20, -33);
crate(-34, 33, 2);
crate(34, -33, 2);
box(0, 0, -30, 10, 1.3, 0.8, C.cover);
box(0, 0, 30, 10, 1.3, 0.8, C.cover);
box(-30, 0, 0, 0.8, 1.3, 10, C.cover);
box(30, 0, 0, 0.8, 1.3, 10, C.cover);
box(-20, 0, 12, 4, 2.2, 0.8, C.cover);
box(20, 0, -12, 4, 2.2, 0.8, C.cover);

export const BOXES = boxes;

// Ground-level spawn points [x, z]. Players face the middle when they spawn.
export const SPAWNS = [
  [-34, -14], [-34, 16], [34, -16], [34, 14],
  [-14, 34], [16, 34], [-16, -34], [14, -34],
  [-6, -24], [6, 24], [-24, 6], [24, -6],
];

// Points bots wander between.
export const WAYPOINTS = [
  ...SPAWNS,
  [0, 10], [0, -10], [10, 0], [-10, 0],
  [20, 20], [-20, -20], [12, 18], [-12, -18],
  [24, -20], [-24, 20], [-24, 0], [24, 0],
];
