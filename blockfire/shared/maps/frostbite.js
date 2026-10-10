// Frostbite: a snowy valley around a frozen lake. Two cabins with roof
// access, two watchtowers, ice blocks and pine trees for cover.

import { MapBuilder } from './builder.js';

const C = {
  wood: 0x8a5a3c,
  snowRoof: 0xe8eef3,
  tower: 0x6f5a46,
  cover: 0x9fb3c4,
  ice: 0xbfe3f5,
  snow: 0xf5f8fb,
};

const m = new MapBuilder({
  id: 'frostbite',
  name: 'Frostbite',
  half: 38,
  wallHeight: 7,
  theme: {
    sky: 0xd7e6f2, fogNear: 35, fogFar: 120,
    sun: 0xffffff, sunIntensity: 2.0, ground: 0xbfcfdc, hemiIntensity: 1.8,
    floor: 0xeef3f8, floorTex: 'snow', wall: 0xa9c6dc, wallTex: 'ice',
  },
});

// frozen lake (a thin slab you walk onto)
m.box(0, 0, 0, 22, 0.02, 16, 0x9fd3ee, 'ice');

// cabins and watchtowers
m.house(-22, -20, { color: C.wood, roof: C.snowRoof, doors: ['e', 's'], tex: 'plank', stair: { x: -28.25, z: -16.25, dir: 'x-' } });
m.house(22, 20, { color: C.wood, roof: C.snowRoof, doors: ['w', 'n'], tex: 'plank', stair: { x: 28.25, z: 16.25, dir: 'x+' } });
m.crate(-19, -23, 1.2, 5).crate(19, 23, 1.2, 5);
m.tower(22, -22, 'x-', { color: C.tower, cover: C.cover });
m.tower(-22, 22, 'x+', { color: C.tower, cover: C.cover });

// ice blocks and snow walls
for (const s of [-1, 1]) {
  m.box(s * -8, 0, s * 12, 3, 1.5, 2, C.ice, 'ice');
  m.box(s * -7.5, 1.5, s * 12, 1.5, 1, 1.5, C.ice, 'ice');
  m.box(s * 30, 0, 0, 2, 2.2, 4, C.ice, 'ice');
  m.box(0, 0, s * 28, 5, 1.2, 1.5, C.ice, 'ice');
  m.box(s * 14, 0, s * 4, 0.8, 1.2, 6, C.snow, 'snow');
  m.box(s * 26, 0, s * -30, 6, 1.2, 0.8, C.snow, 'snow');
}

// props
for (const [x, z] of [
  [-34, -34], [34, 34], [34, -34], [-34, 34], [-34, -2], [34, 2], [-12, -34],
  [12, 34], [-2, 34], [2, -34], [-30, 14], [30, -14], [-14, 30], [14, -30],
]) m.prop('pine_snow', x, z, { rot: (x + z) * 0.3 });
m.prop('snowman', 5, 10, { rot: Math.PI }).prop('snowman', -5, -10);
m.prop('rock', -18, 6, { rot: 1 }).prop('rock', 18, -6, { rot: 4 }).prop('rock', -6, -22, { rot: 2 }).prop('rock', 6, 22);
for (const [x, z] of [[12, 9], [-12, 9], [12, -9], [-12, -9]]) m.prop('lamp', x, z, { rot: Math.atan2(x, z) });
m.prop('barrel', -14.5, -12).prop('barrel', 14.5, 12);

m.spawn(
  [-32, -10], [32, 10], [-32, 10], [32, -10],
  [-10, -32], [10, 32], [10, -32], [-10, 32],
  [-14, 0], [14, 0], [0, -12], [0, 12],
);
m.waypoint([-22, -20], [22, 20], [0, -20], [0, 20], [-20, 0], [20, 0]);

export default m.build();
