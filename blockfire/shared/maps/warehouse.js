// Warehouse: a tight, shotgun-friendly map. Shipping containers make lanes,
// catwalks run along two walls, and a small office sits in the middle.

import { MapBuilder } from './builder.js';

const C = {
  metal: 0x5d6670,
  rail: 0xe0b04a,
  office: 0xd9d4c7,
  roof: 0x4a4f5a,
  step: 0x707a84,
};

const m = new MapBuilder({
  id: 'warehouse',
  name: 'Warehouse',
  half: 30,
  wallHeight: 9,
  theme: {
    sky: 0xb7c4cf, fogNear: 40, fogFar: 110,
    sun: 0xf2f5ff, sunIntensity: 1.6, ground: 0x707a84, hemiIntensity: 1.7,
    floor: 0x9a9a96, floorTex: 'concrete', wall: 0x8a5a44, wallTex: 'brick',
  },
});

// catwalks along the north and south walls
for (const s of [-1, 1]) {
  m.box(0, 3.5, s * 27.5, 60, 0.5, 5, C.metal);
  for (const x of [-24, -12, 0, 12, 24]) m.box(x, 0, s * 25.6, 0.5, 3.5, 0.5, C.metal);
  const stairX = s * -20;
  m.stairs(stairX, s * 25, s < 0 ? 'z+' : 'z-', 3, 4, C.metal);
  // railing with a gap where the stairs arrive
  const railZ = s * 25.15;
  const gapA = stairX - 1.5;
  const gapB = stairX + 1.5;
  m.box((-30 + gapA) / 2, 4, railZ, gapA + 30, 1, 0.3, C.rail);
  m.box((gapB + 30) / 2, 4, railZ, 30 - gapB, 1, 0.3, C.rail);
}

// office with a climbable roof
m.house(0, 0, { w: 8, d: 6, h: 3, color: C.office, roof: C.roof, doors: ['e', 'w'], stair: { x: 2, z: 3.25, dir: 'z+' } });

// shipping containers
m.prop('container_red', -12, -14);
m.prop('container_blue', 12, 14);
m.prop('container_green', -12, 14);
m.prop('container_red', 12, -14);
m.prop('container_blue', 12, -14, { y: 2.6 });
m.prop('container_green', -12, 14, { y: 2.6 });
m.prop('container_blue', -22, 0, { rot: Math.PI / 2 });
m.prop('container_green', 22, 0, { rot: Math.PI / 2 });
// steps up onto two of them
m.box(-8.25, 0, -14, 1.5, 1.3, 2, C.step);
m.box(8.25, 0, 14, 1.5, 1.3, 2, C.step);

// crates
m.crate(-24, -12, 2).crate(-22.4, -12.4).crate(24, 12, 2).crate(22.4, 12.4);
m.crate(-24, 12, 2).crate(24, -12, 2);
m.crate(-6, -20).crate(-4.8, -20).crate(-5.4, -20, 1.2, 1.2);
m.crate(6, 20).crate(4.8, 20).crate(5.4, 20, 1.2, 1.2);
m.crate(-4, 9).crate(4, -9);

// props
m.prop('barrel', -27, -20).prop('barrel_blue', -27.9, -20.6).prop('barrel', -27.2, -21.4);
m.prop('barrel', 27, 20).prop('barrel_blue', 27.9, 20.6).prop('barrel', 27.2, 21.4);
m.prop('barrel_blue', -6, 10).prop('barrel_blue', 6, -10);
m.prop('pallet', -16, 22).prop('pallet', 16, -22).prop('pallet', -16, 22, { y: 0.15 }).prop('pallet', 18, 8);
m.prop('sandbags', -16, -6, { rot: Math.PI / 2 }).prop('sandbags', 16, 6, { rot: Math.PI / 2 });

m.spawn(
  [-26, -16], [26, 16], [-26, 16], [26, -16],
  [-8, -18], [8, 18], [0, -14], [0, 14],
  [-16, 0], [16, 0], [-26, 0], [26, 0],
);
m.waypoint([-20, -10], [20, 10], [-6, 6], [6, -6], [0, -22], [0, 22]);

export default m.build();
