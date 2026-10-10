// Helpers for describing a map out of axis-aligned boxes and props. Every
// box is solid for movement and blocks bullets. Positions are in meters; y is
// up and the floor is y = 0.

import { PROP_COLLIDERS } from '../props.js';

const DIRS = { 'x+': [1, 0], 'x-': [-1, 0], 'z+': [0, 1], 'z-': [0, -1] };

export class MapBuilder {
  constructor({ id, name, half, wallHeight = 10, theme }) {
    this.id = id;
    this.name = name;
    this.half = half;
    this.theme = theme;
    this.boxes = [];
    this.props = [];
    this.spawns = [];
    this.waypoints = [];

    const t = theme;
    const s = half * 2 + 4;
    this.box(0, -1, 0, s, 1, s, t.floor, t.floorTex);
    this.box(0, 0, -half - 1, s, wallHeight, 2, t.wall, t.wallTex);
    this.box(0, 0, half + 1, s, wallHeight, 2, t.wall, t.wallTex);
    this.box(-half - 1, 0, 0, 2, wallHeight, half * 2, t.wall, t.wallTex);
    this.box(half + 1, 0, 0, 2, wallHeight, half * 2, t.wall, t.wallTex);
  }

  // Box from a center x/z, a bottom y and a size.
  box(x, y, z, w, h, d, color, tex = 'grid') {
    this.boxes.push({ min: [x - w / 2, y, z - d / 2], max: [x + w / 2, y + h, z + d / 2], color, tex });
    return this;
  }

  // Solid staircase climbing from baseY to topH. The highest step sits at
  // (x, z), which should touch the ledge it reaches, and the stairs run away
  // from it along dir. Each step rises 0.5 m.
  stairs(x, z, dir, width, topH, color, { depth = 0.7, baseY = 0, tex = 'grid' } = {}) {
    const [sx, sz] = DIRS[dir];
    const steps = Math.round((topH - baseY) / 0.5) - 1;
    for (let k = 0; k < steps; k++) {
      const h = topH - baseY - 0.5 * (k + 1);
      const off = (k + 0.5) * depth;
      if (sx !== 0) this.box(x + sx * off, baseY, z, depth, h, width, color, tex);
      else this.box(x, baseY, z + sz * off, width, h, depth, color, tex);
    }
    return this;
  }

  crate(x, z, size = 1.2, y = 0, color = 0xc8913c) {
    return this.box(x, y, z, size, size, size, color, 'crate');
  }

  // A model from props.glb with its collider. rot is a yaw in radians; the
  // collider turns with it in quarter turns.
  prop(type, x, z, { y = 0, rot = 0 } = {}) {
    const size = PROP_COLLIDERS[type];
    if (!size) throw new Error(`unknown prop ${type}`);
    const quarter = Math.round(rot / (Math.PI / 2));
    const [w, h, d] = quarter % 2 ? [size[2], size[1], size[0]] : size;
    this.props.push({ type, x, y, z, rot });
    this.boxes.push({ min: [x - w / 2, y, z - d / 2], max: [x + w / 2, y + h, z + d / 2], prop: true });
    return this;
  }

  // Hollow building with a walkable roof, door gaps and stairs to the roof.
  house(cx, cz, { w = 12, d = 12, h = 4.5, color, roof, doors = [], stair, tex = 'grid' }) {
    const t = 0.5;
    const door = 3;
    for (const side of ['n', 's', 'w', 'e']) {
      const alongX = side === 'n' || side === 's';
      const len = alongX ? w : d;
      const fixed = { n: cz - d / 2, s: cz + d / 2, w: cx - w / 2, e: cx + w / 2 }[side];
      const center = alongX ? cx : cz;
      const pieces = doors.includes(side)
        ? [[center - len / 2, center - door / 2], [center + door / 2, center + len / 2]]
        : [[center - len / 2, center + len / 2]];
      for (const [a, b] of pieces) {
        const extra = alongX && !doors.includes(side) ? t : 0;
        if (alongX) this.box((a + b) / 2, 0, fixed, b - a + extra, h, t, color, tex);
        else this.box(fixed, 0, (a + b) / 2, t, h, b - a, color, tex);
      }
      if (doors.includes(side) && h > 3) {
        if (alongX) this.box(center, 3, fixed, door, h - 3, t, color, tex);
        else this.box(fixed, 3, center, t, h - 3, door, color, tex);
      }
    }
    this.box(cx, h, cz, w + t, 0.5, d + t, roof);
    if (stair) this.stairs(stair.x, stair.z, stair.dir, 2.5, h + 0.5, color, { tex });
    return this;
  }

  // Raised platform on pillars with half walls and a staircase.
  tower(cx, cz, stairDir, { size = 6, top = 4, color, cover }) {
    const s = size;
    for (const [px, pz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      this.box(cx + px * (s / 2 - 0.4), 0, cz + pz * (s / 2 - 0.4), 0.8, top - 0.5, 0.8, color);
    }
    this.box(cx, top - 0.5, cz, s, 0.5, s, color);
    for (const [dir, [ex, ez]] of Object.entries(DIRS)) {
      if (dir === stairDir) continue;
      if (ex !== 0) this.box(cx + ex * (s / 2 - 0.2), top, cz, 0.4, 1, s, cover);
      else this.box(cx, top, cz + ez * (s / 2 - 0.2), s, 1, 0.4, cover);
    }
    const [ex, ez] = DIRS[stairDir];
    this.stairs(cx + (ex * s) / 2, cz + (ez * s) / 2, stairDir, 2.5, top, color);
    return this;
  }

  spawn(...points) {
    this.spawns.push(...points);
    return this;
  }

  waypoint(...points) {
    this.waypoints.push(...points);
    return this;
  }

  build() {
    return {
      id: this.id,
      name: this.name,
      half: this.half,
      theme: this.theme,
      boxes: this.boxes,
      props: this.props,
      spawns: this.spawns,
      waypoints: [...this.spawns, ...this.waypoints],
    };
  }
}
