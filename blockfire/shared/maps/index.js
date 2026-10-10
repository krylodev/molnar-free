import courtyard from './courtyard.js';
import dunes from './dunes.js';
import warehouse from './warehouse.js';
import frostbite from './frostbite.js';

export const MAPS = { courtyard, dunes, warehouse, frostbite };

// Order matches play after each match.
export const MAP_ROTATION = ['courtyard', 'warehouse', 'dunes', 'frostbite'];

export function getMap(id) {
  return Object.hasOwn(MAPS, id) ? MAPS[id] : MAPS[MAP_ROTATION[0]];
}

export function nextMapId(id) {
  const i = MAP_ROTATION.indexOf(id);
  return MAP_ROTATION[(i + 1) % MAP_ROTATION.length];
}
