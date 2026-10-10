// Dunes: a big desert map with long sightlines. Sniper ridges on both sides,
// a roofed temple in the middle for cover, mesas and broken walls between.

import { MapBuilder } from './builder.js';

const C = {
  stone: 0xd8b27a,
  darkStone: 0xb98550,
  ridge: 0xc8955a,
  ruin: 0xcfae7c,
  roof: 0xa9845a,
};

const m = new MapBuilder({
  id: 'dunes',
  name: 'Dunes',
  half: 48,
  wallHeight: 8,
  theme: {
    sky: 0xf3d3a0, fogNear: 90, fogFar: 220,
    sun: 0xfff0d0, sunIntensity: 2.6, ground: 0xc8a070, hemiIntensity: 1.5,
    floor: 0xe2c48a, floorTex: 'sand', wall: 0xc79a5b, wallTex: 'sand',
  },
});

// temple: raised floor, pillars, a roof for shade from the ridges
m.box(0, 0, 0, 14, 1.5, 14, C.stone);
m.stairs(0, 7, 'z+', 4, 1.5, C.stone);
m.stairs(0, -7, 'z-', 4, 1.5, C.stone);
m.stairs(7, 0, 'x+', 4, 1.5, C.stone);
m.stairs(-7, 0, 'x-', 4, 1.5, C.stone);
for (const [x, z] of [[-5.5, -5.5], [5.5, -5.5], [-5.5, 5.5], [5.5, 5.5]]) m.box(x, 1.5, z, 1, 4, 1, C.darkStone);
m.box(0, 5.5, 0, 14, 0.6, 14, C.roof);
m.box(0, 1.5, -3, 4, 1.1, 0.6, C.darkStone);
m.box(0, 1.5, 3, 4, 1.1, 0.6, C.darkStone);

// sniper ridges with battlements facing the middle
for (const s of [-1, 1]) {
  m.box(s * 34, 0, 0, 6, 3, 56, C.ridge, 'sand');
  m.stairs(s * 34, 28, 'z+', 4, 3, C.ridge);
  m.stairs(s * 34, -28, 'z-', 4, 3, C.ridge);
  for (const z of [-24, -12, 0, 12, 24]) m.box(s * 31.3, 3, z, 0.6, 1, 4, C.darkStone);
  m.box(s * 36.7, 3, -6, 0.6, 1, 4, C.darkStone);
  m.box(s * 36.7, 3, 6, 0.6, 1, 4, C.darkStone);
}

// mesas, each with a crate to climb on
for (const [x, z, sx] of [[16, 22, 1], [-16, -22, -1], [-18, 18, -1], [18, -18, 1]]) {
  m.box(x, 0, z, 6, 2, 5, C.ridge, 'sand');
  m.box(x + sx * 0.5, 2, z, 3.5, 1.4, 3, C.darkStone, 'sand');
  m.crate(x - sx * 3.6, z, 1.2);
}

// ruined walls
for (const s of [-1, 1]) {
  m.box(-4, 0, s * 20, 6, 3, 0.8, C.ruin);
  m.box(3, 0, s * 20, 4, 2, 0.8, C.ruin);
  m.box(6, 0, s * 20, 2, 1, 0.8, C.ruin);
  m.box(s * 22, 0, 0, 0.8, 2.5, 6, C.ruin);
  m.box(s * 22, 0, s * 6, 0.8, 1.2, 3, C.ruin);
}

// props
for (const [x, z] of [[-26, 34], [26, -34], [-10, 38], [10, -38], [-40, 40], [40, -40], [28, 12], [-28, -12]]) {
  m.prop('cactus', x, z, { rot: x * 0.37 });
}
for (const [x, z, r] of [[12, 34, 0], [-12, -34, 1], [40, 20, 2], [-40, -20, 3], [8, -28, 4], [-8, 28, 5]]) {
  m.prop('rock_sand', x, z, { rot: r });
}
m.prop('barrel', 9, 9).prop('barrel', -9, -9).prop('barrel_blue', 9.9, 9.4).prop('barrel_blue', -9.9, -9.4);
m.prop('sandbags', 12, 0, { rot: Math.PI / 2 }).prop('sandbags', -12, 0, { rot: Math.PI / 2 });
m.prop('sandbags', 0, 12).prop('sandbags', 0, -12);
m.prop('pallet', 9, -9).prop('pallet', -9, 9);

m.spawn(
  [42, -30], [42, 0], [42, 30], [-42, -30], [-42, 0], [-42, 30],
  [0, 40], [0, -40], [20, 40], [-20, -40], [-20, 40], [20, -40],
);
m.waypoint(
  [0, 14], [0, -14], [14, 0], [-14, 0], [26, 0], [-26, 0],
  [10, 30], [-10, -30], [26, 26], [-26, -26],
);

export default m.build();
