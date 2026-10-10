// Tuning values shared by the server and the browser client.

export const TICK_RATE = 30; // server simulation + snapshot rate (Hz)
export const CLIENT_SEND_RATE = 30; // how often clients report their state (Hz)
export const INTERP_DELAY = 100; // ms remote players are rendered in the past
export const MAX_REWIND = 400; // ms of lag compensation the server allows
export const MAX_PLAYERS = 12; // humans per room

export const PLAYER = {
  radius: 0.35, // half width of the collision box
  height: 1.8,
  crouchHeight: 1.2,
  eye: 1.6,
  crouchEye: 1.05,
  headHeight: 0.4, // top slice of the body that counts as the head
  headRadius: 0.25,
};

export const MOVE = {
  gravity: 24,
  jumpSpeed: 8,
  runSpeed: 7.5,
  crouchSpeed: 3.6,
  adsSpeedMul: 0.7,
  groundAccel: 10,
  airAccel: 12,
  airCap: 0.8, // quake-style air strafing cap
  friction: 6,
  stopSpeed: 2.5,
  slideBoost: 3.5,
  slideMaxSpeed: 13,
  slideTime: 0.7,
  slideFriction: 0.9,
  slideCooldown: 1.0,
  stepHeight: 0.55,
  maxSpeed: 20,
  maxFall: 40,
};

export const MATCH = {
  scoreLimit: 25,
  timeLimit: 300, // seconds
  intermission: 8, // seconds
  respawnTime: 2.5,
  spawnProtect: 1.5,
  maxHealth: 100,
  regenDelay: 5,
  regenRate: 25, // hp per second
};

export const PLAYER_COLORS = [
  0xe74c3c, 0x3498db, 0x2ecc71, 0xf1c40f, 0x9b59b6, 0xe67e22,
  0x1abc9c, 0xff6fb5, 0x95a5a6, 0x34495e, 0xc0392b, 0x16a085,
];
