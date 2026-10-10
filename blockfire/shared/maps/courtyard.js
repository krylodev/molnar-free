// Courtyard: the original arena. A raised plaza in the middle, two houses,
// two sniper towers and lanes in between. Medium size, all-round.

import { MapBuilder } from './builder.js';

const C = {
  plaza: 0xd8d2c4,
  lane: 0xe0b04a,
  houseA: 0x5b8fb9,
  houseB: 0xb95b5b,
  roof: 0x4a4f5a,
  tower: 0x7a6a9c,
  cover: 0x9aa0a6,
};

const m = new MapBuilder({
  id: 'courtyard',
  name: 'Courtyard',
  half: 40,
  theme: {
    sky: 0x8ec9ff, fogNear: 70, fogFar: 170,
    sun: 0xfff1d6, sunIntensity: 2.2, ground: 0x6b7a5a, hemiIntensity: 1.6,
    floor: 0x8fa37a, floorTex: 'floor', wall: 0xc9c2b0, wallTex: 'grid',
  },
});

// central plaza
m.box(0, 0, 0, 12, 2, 12, C.plaza);
m.stairs(0, 6, 'z+', 4, 2, C.plaza);
m.stairs(0, -6, 'z-', 4, 2, C.plaza);
m.stairs(6, 0, 'x+', 4, 2, C.plaza);
m.stairs(-6, 0, 'x-', 4, 2, C.plaza);
m.box(0, 2, 0, 2, 3, 2, C.cover);
m.box(-4, 2, -4, 2.5, 1, 0.5, C.cover);
m.box(4, 2, 4, 2.5, 1, 0.5, C.cover);
m.box(4, 2, -4, 0.5, 1, 2.5, C.cover);
m.box(-4, 2, 4, 0.5, 1, 2.5, C.cover);

// lane walls around the plaza
for (const s of [-1, 1]) {
  m.box(s * 14, 0, -6.5, 1, 3, 9, C.lane);
  m.box(s * 14, 0, 6.5, 1, 3, 9, C.lane);
  m.box(-6.5, 0, s * 14, 9, 3, 1, C.lane);
  m.box(6.5, 0, s * 14, 9, 3, 1, C.lane);
}

// buildings and towers
m.house(24, -24, { color: C.houseA, roof: C.roof, doors: ['w', 's'], stair: { x: 17.75, z: -20.25, dir: 'x-' } });
m.house(-24, 24, { color: C.houseB, roof: C.roof, doors: ['e', 'n'], stair: { x: -17.75, z: 20.25, dir: 'x+' } });
m.crate(21.5, -21.5, 1.2, 5);
m.box(27, 5, -26, 3, 1, 0.5, C.cover);
m.crate(-26.5, 26.5, 1.2, 5);
m.box(-21, 5, 22, 3, 1, 0.5, C.cover);
m.tower(-26, -26, 'x+', { color: C.tower, cover: C.cover });
m.tower(26, 26, 'x-', { color: C.tower, cover: C.cover });

// crates and cover
m.crate(-8, -21).crate(-6.8, -21).crate(-7.4, -21, 1.2, 1.2);
m.crate(8, 21).crate(9.2, 21).crate(8.6, 21, 1.2, 1.2);
m.crate(21, 6, 2).crate(-21, -6, 2);
m.crate(31, -6).crate(-31, 6);
m.crate(10, -32, 2).crate(-10, 32, 2);
m.crate(33, 8).crate(-33, -8);
m.crate(20, 33).crate(-20, -33);
m.crate(-34, 33, 2).crate(34, -33, 2);
m.box(0, 0, -30, 10, 1.3, 0.8, C.cover);
m.box(0, 0, 30, 10, 1.3, 0.8, C.cover);
m.box(-30, 0, 0, 0.8, 1.3, 10, C.cover);
m.box(30, 0, 0, 0.8, 1.3, 10, C.cover);
m.box(-20, 0, 12, 4, 2.2, 0.8, C.cover);
m.box(20, 0, -12, 4, 2.2, 0.8, C.cover);

// props
for (const [x, z] of [[9, 9], [-9, 9], [9, -9], [-9, -9]]) m.prop('lamp', x, z, { rot: Math.atan2(x, z) });
m.prop('barrel', 16, -15).prop('barrel_blue', 16.9, -15.6).prop('barrel', -16, 15).prop('barrel_blue', -16.9, 15.6);
m.prop('barrel', 30, 22).prop('barrel', -30, -22);
m.prop('pine', 36, 24).prop('pine', -36, -24).prop('pine', 12, 36).prop('pine', -12, -36);
m.prop('pine', 36, -26).prop('pine', -36, 26);
m.prop('sandbags', 0, -24).prop('sandbags', 0, 24);
m.prop('rock', 26, 6).prop('rock', -26, -6, { rot: 2 });

m.spawn(
  [-34, -14], [-34, 16], [34, -16], [34, 14],
  [-14, 34], [16, 34], [-16, -34], [14, -34],
  [-6, -24], [6, 24], [-24, 6], [24, -6],
);
m.waypoint(
  [0, 10], [0, -10], [10, 0], [-10, 0],
  [20, 20], [-20, -20], [12, 18], [-12, -18],
  [24, -20], [-24, 20], [-24, 0], [24, 0],
);

export default m.build();
