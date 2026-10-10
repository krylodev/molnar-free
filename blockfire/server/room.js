// One game room: players, match state, hit detection and the tick loop.
//
// Movement is client-authoritative (clients simulate themselves for zero-lag
// controls) but checked against a speed budget and the map. Everything that
// decides a fight — ammo, fire rate, hit detection, damage, kills — runs here.

import { performance } from 'node:perf_hooks';
import {
  TICK_RATE, MAX_REWIND, MAX_PLAYERS, PLAYER, MOVE, MATCH, PLAYER_COLORS,
} from '../shared/constants.js';
import { WEAPONS, damageAt } from '../shared/weapons.js';
import { BOXES, SPAWNS, MAP_HALF } from '../shared/map.js';
import {
  collidesAt, eyeHeight, playerHeight, playerHitboxes, rayAABB, raycastBoxes, normalize,
} from '../shared/physics.js';
import { Bot } from './bot.js';

const now = () => performance.now();
const round2 = (v) => Math.round(v * 100) / 100;
const round3 = (v) => Math.round(v * 1000) / 1000;
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const isVec = (v) => Array.isArray(v) && v.length === 3 && v.every(isNum);

const BOT_NAMES = ['Ada', 'Bolt', 'Cinder', 'Dash', 'Echo', 'Flint', 'Grit', 'Halo', 'Ion', 'Jinx'];

export function sanitizeName(name) {
  const clean = String(name ?? '').replace(/[^\p{L}\p{N} _\-.]/gu, '').trim().slice(0, 16);
  return clean || `Player${Math.floor(Math.random() * 900 + 100)}`;
}

export class Room {
  constructor(name, { minPlayers = 4, onEmpty } = {}) {
    this.name = name;
    this.minPlayers = minPlayers;
    this.onEmpty = onEmpty;
    this.players = new Map();
    this.nextId = 1;
    this.timer = null;
    this.lastTick = now();
    this.match = { state: 'play', endsAt: now() + MATCH.timeLimit * 1000, winner: null };
  }

  get humanCount() {
    let n = 0;
    for (const p of this.players.values()) if (!p.bot) n++;
    return n;
  }

  isFull() {
    return this.humanCount >= MAX_PLAYERS;
  }

  // --- membership -----------------------------------------------------------

  addPlayer(name, ws = null, bot = false) {
    const id = this.nextId++;
    const used = new Set([...this.players.values()].map((p) => p.color));
    const color = PLAYER_COLORS.find((c) => !used.has(c)) ?? PLAYER_COLORS[id % PLAYER_COLORS.length];
    const p = {
      id, name, ws, color, bot: null,
      x: 0, y: 0, z: 0, yaw: 0, pitch: 0, crouch: false, weapon: 0,
      hp: MATCH.maxHealth, alive: false, respawnAt: 0, protectUntil: 0, lastDamage: 0,
      kills: 0, deaths: 0, streak: 0,
      sq: 0, lastStateAt: now(), moveBudget: 0, vBudget: 0,
      history: [],
      ammo: WEAPONS.map((w) => w.mag), reloadUntil: 0, reloadWeapon: -1,
      lastShot: WEAPONS.map(() => -Infinity),
      chatAt: 0,
    };
    if (bot) p.bot = new Bot(this, p);
    this.players.set(id, p);

    if (ws) {
      this.send(p, {
        t: 'welcome', id, room: this.name, now: Math.round(now()),
        players: [...this.players.values()].map((o) => this.publicInfo(o)),
        match: this.matchInfo(),
        config: { respawnTime: MATCH.respawnTime, scoreLimit: MATCH.scoreLimit },
      });
    }
    this.broadcast({ t: 'pj', ...this.publicInfo(p) }, p);
    this.spawn(p);
    if (!bot) this.balanceBots();
    this.start();
    return p;
  }

  removePlayer(id) {
    const p = this.players.get(id);
    if (!p) return;
    this.players.delete(id);
    this.broadcast({ t: 'pl', id });
    if (!p.bot) this.balanceBots();
    if (this.humanCount === 0) {
      this.stop();
      this.onEmpty?.(this);
    }
  }

  // Top the room up with bots so there is always someone to fight.
  balanceBots() {
    const humans = this.humanCount;
    const bots = [...this.players.values()].filter((p) => p.bot);
    const want = humans === 0 ? 0 : Math.max(0, this.minPlayers - humans);
    for (let i = bots.length; i < want; i++) {
      const taken = new Set(bots.map((b) => b.name));
      const name = BOT_NAMES.map((n) => `[BOT] ${n}`).find((n) => !taken.has(n)) ?? `[BOT] ${i}`;
      bots.push(this.addPlayer(name, null, true));
    }
    while (bots.length > want) this.removePlayer(bots.pop().id);
  }

  publicInfo(p) {
    return { id: p.id, name: p.name, color: p.color, kills: p.kills, deaths: p.deaths, bot: !!p.bot };
  }

  matchInfo() {
    const w = this.match.winner && this.players.get(this.match.winner);
    return {
      st: this.match.state,
      end: Math.round(this.match.endsAt),
      win: w ? w.id : null,
      winName: w ? w.name : null,
    };
  }

  // --- messaging --------------------------------------------------------------

  send(p, msg) {
    if (p.ws && p.ws.readyState === 1) p.ws.send(typeof msg === 'string' ? msg : JSON.stringify(msg));
  }

  broadcast(msg, except = null) {
    const data = JSON.stringify(msg);
    for (const p of this.players.values()) if (p !== except) this.send(p, data);
  }

  broadcastScores() {
    this.broadcast({ t: 'sc', s: [...this.players.values()].map((p) => [p.id, p.kills, p.deaths]) });
  }

  handleMessage(p, msg) {
    switch (msg.t) {
      case 'ping':
        if (isNum(msg.c)) this.send(p, { t: 'pong', c: msg.c, s: Math.round(now()) });
        break;
      case 's':
        this.handleState(p, msg);
        break;
      case 'sh':
        if (Number.isInteger(msg.w) && Array.isArray(msg.d) && isVec(msg.o) && isNum(msg.rt)) {
          this.handleShot(p, msg.w, msg.o, msg.d, msg.rt);
        }
        break;
      case 'rl':
        this.handleReload(p, msg.w);
        break;
      case 'c':
        this.handleChat(p, msg.m);
        break;
    }
  }

  // --- movement -----------------------------------------------------------------

  handleState(p, m) {
    if (!p.alive || m.sq !== p.sq || !isVec(m.p) || !isNum(m.y) || !isNum(m.x)) return;
    const t = now();
    const dt = Math.min((t - p.lastStateAt) / 1000, 1);
    p.lastStateAt = t;
    const [x, y, z] = m.p;
    const crouch = !!m.c;

    // Movement budgets absorb network jitter without letting speed hacks through.
    p.moveBudget = Math.min(p.moveBudget + dt * MOVE.maxSpeed * 1.25, 6);
    p.vBudget = Math.min(p.vBudget + dt * MOVE.maxFall * 1.25, 10);
    const horiz = Math.hypot(x - p.x, z - p.z);
    const vert = Math.abs(y - p.y);
    const inBounds = Math.abs(x) < MAP_HALF && Math.abs(z) < MAP_HALF && y > -5 && y < 40;
    const solid = collidesAt(BOXES, x, y + 0.15, z, playerHeight(crouch) - 0.3, PLAYER.radius - 0.1);
    if (horiz > p.moveBudget + 0.3 || vert > p.vBudget + 0.5 || !inBounds || solid) {
      p.sq++;
      p.moveBudget = 0;
      p.vBudget = 0;
      this.send(p, { t: 'tp', p: [round3(p.x), round3(p.y), round3(p.z)], sq: p.sq });
      return;
    }
    p.moveBudget = Math.max(0, p.moveBudget - horiz);
    p.vBudget = Math.max(0, p.vBudget - vert);
    p.x = x;
    p.y = y;
    p.z = z;
    p.yaw = m.y;
    p.pitch = Math.max(-1.6, Math.min(1.6, m.x));
    p.crouch = crouch;
    if (Number.isInteger(m.w) && WEAPONS[m.w] && m.w !== p.weapon) {
      p.weapon = m.w;
      p.reloadUntil = 0;
      p.reloadWeapon = -1;
    }
  }

  // --- combat ---------------------------------------------------------------------

  finishReload(p, t) {
    if (p.reloadWeapon >= 0 && t >= p.reloadUntil) {
      p.ammo[p.reloadWeapon] = WEAPONS[p.reloadWeapon].mag;
      p.reloadWeapon = -1;
    }
  }

  handleReload(p, w) {
    if (!p.alive || !Number.isInteger(w) || !WEAPONS[w] || p.reloadWeapon >= 0) return;
    if (p.ammo[w] >= WEAPONS[w].mag) return;
    p.weapon = w;
    p.reloadWeapon = w;
    // small tolerance so client and server reload timers agree under lag
    p.reloadUntil = now() + WEAPONS[w].reload * 1000 * 0.85;
  }

  // Position of a player at a past server time, from their movement history.
  positionAt(p, t) {
    const h = p.history;
    if (h.length === 0 || t >= h[h.length - 1].t) return { x: p.x, y: p.y, z: p.z, c: p.crouch };
    if (t <= h[0].t) return h[0];
    for (let i = h.length - 1; i > 0; i--) {
      const a = h[i - 1];
      const b = h[i];
      if (t >= a.t) {
        const k = (t - a.t) / (b.t - a.t || 1);
        return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, z: a.z + (b.z - a.z) * k, c: k < 0.5 ? a.c : b.c };
      }
    }
    return h[0];
  }

  // Returns false when the shot was rejected.
  handleShot(p, w, origin, dirs, renderTime) {
    const W = WEAPONS[w];
    const t = now();
    if (!W || !p.alive || this.match.state !== 'play') return false;
    if (dirs.length !== W.pellets || !dirs.every(isVec)) return false;
    this.finishReload(p, t);
    if (p.reloadWeapon >= 0) return false;
    if (p.ammo[w] <= 0) return false;
    if (t - p.lastShot[w] < W.fireInterval * 1000 * 0.75) return false;
    p.lastShot[w] = t;
    p.ammo[w]--;
    p.weapon = w;
    p.protectUntil = 0;

    const eye = [p.x, p.y + eyeHeight(p.crouch), p.z];
    const o = Math.hypot(origin[0] - eye[0], origin[1] - eye[1], origin[2] - eye[2]) <= 1.5 ? origin : eye;
    const rewindTo = Math.max(t - MAX_REWIND, Math.min(t, renderTime));

    const targets = [];
    for (const q of this.players.values()) {
      if (q === p || !q.alive) continue;
      const pos = this.positionAt(q, rewindTo);
      targets.push({ q, boxes: playerHitboxes(pos.x, pos.y, pos.z, pos.c) });
    }

    const damage = new Map();
    const ends = [];
    for (const raw of dirs) {
      const d = normalize(raw);
      const wall = raycastBoxes(BOXES, o, d, W.range);
      let best = wall ? wall.t : W.range;
      let hitTarget = null;
      let head = false;
      for (const tg of targets) {
        for (const hb of tg.boxes) {
          const hit = rayAABB(o, d, hb.min, hb.max, best);
          if (hit && hit.t < best) {
            best = hit.t;
            hitTarget = tg.q;
            head = hb.head;
          }
        }
      }
      ends.push([round2(o[0] + d[0] * best), round2(o[1] + d[1] * best), round2(o[2] + d[2] * best)]);
      if (hitTarget) {
        const entry = damage.get(hitTarget) ?? { dmg: 0, head: false };
        entry.dmg += damageAt(W, best) * (head ? W.headMult : 1);
        entry.head ||= head;
        damage.set(hitTarget, entry);
      }
    }

    this.broadcast({ t: 'sh', id: p.id, w, o: o.map(round2), e: ends }, p);
    for (const [victim, { dmg, head }] of damage) this.applyDamage(victim, p, dmg, head, w, t);
    return true;
  }

  applyDamage(victim, attacker, dmg, head, w, t) {
    if (!victim.alive || victim.protectUntil > t) return;
    victim.hp -= dmg;
    victim.lastDamage = t;
    const killed = victim.hp <= 0;
    this.send(attacker, { t: 'hm', d: Math.round(dmg), h: head, k: killed });
    this.send(victim, { t: 'dmg', hp: Math.max(0, Math.round(victim.hp)), from: [round2(attacker.x), round2(attacker.z)] });
    victim.bot?.onDamaged(attacker);
    if (killed) this.kill(victim, attacker, w, head, t);
  }

  kill(victim, killer, w, head, t) {
    victim.alive = false;
    victim.hp = 0;
    victim.deaths++;
    victim.streak = 0;
    victim.respawnAt = t + MATCH.respawnTime * 1000;
    if (killer && killer !== victim) {
      killer.kills++;
      killer.streak++;
    }
    this.broadcast({ t: 'k', k: killer?.id ?? null, v: victim.id, w, h: head, st: killer?.streak ?? 0 });
    this.broadcastScores();
    if (killer && killer.kills >= MATCH.scoreLimit) this.endMatch(t);
  }

  handleChat(p, text) {
    const t = now();
    if (typeof text !== 'string' || t - p.chatAt < 500) return;
    const m = text.replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, 120);
    if (!m) return;
    p.chatAt = t;
    this.broadcast({ t: 'c', id: p.id, m });
  }

  // --- spawning ---------------------------------------------------------------------

  pickSpawn(p) {
    const enemies = [...this.players.values()].filter((q) => q !== p && q.alive);
    const scored = SPAWNS.map(([x, z]) => {
      let minD = Infinity;
      for (const e of enemies) minD = Math.min(minD, Math.hypot(e.x - x, e.z - z));
      return { x, z, score: minD + Math.random() * 6 };
    });
    scored.sort((a, b) => b.score - a.score);
    return scored[Math.floor(Math.random() * Math.min(3, scored.length))];
  }

  spawn(p) {
    const s = this.pickSpawn(p);
    const t = now();
    p.x = s.x;
    p.y = 0;
    p.z = s.z;
    p.yaw = Math.atan2(s.x, s.z);
    p.pitch = 0;
    p.crouch = false;
    p.hp = MATCH.maxHealth;
    p.alive = true;
    p.protectUntil = t + MATCH.spawnProtect * 1000;
    p.ammo = WEAPONS.map((w) => w.mag);
    p.reloadWeapon = -1;
    p.reloadUntil = 0;
    p.history = [];
    p.moveBudget = 0;
    p.vBudget = 0;
    p.lastStateAt = t;
    p.sq++;
    p.bot?.onSpawn();
    this.send(p, { t: 'sp', p: [p.x, p.y, p.z], yaw: round3(p.yaw), sq: p.sq, hp: p.hp });
  }

  // --- match flow ---------------------------------------------------------------------

  endMatch(t) {
    if (this.match.state !== 'play') return;
    let winner = null;
    for (const p of this.players.values()) if (!winner || p.kills > winner.kills) winner = p;
    this.match = { state: 'end', endsAt: t + MATCH.intermission * 1000, winner: winner?.id ?? null };
    this.broadcast({ t: 'm', ...this.matchInfo() });
  }

  startMatch(t) {
    this.match = { state: 'play', endsAt: t + MATCH.timeLimit * 1000, winner: null };
    for (const p of this.players.values()) {
      p.kills = 0;
      p.deaths = 0;
      p.streak = 0;
      this.spawn(p);
    }
    this.broadcast({ t: 'm', ...this.matchInfo() });
    this.broadcastScores();
  }

  // --- loop -------------------------------------------------------------------------

  start() {
    if (this.timer) return;
    this.lastTick = now();
    this.timer = setInterval(() => this.tick(), 1000 / TICK_RATE);
  }

  stop() {
    clearInterval(this.timer);
    this.timer = null;
  }

  tick() {
    const t = now();
    const dt = Math.min((t - this.lastTick) / 1000, 0.1);
    this.lastTick = t;

    if (t >= this.match.endsAt) {
      if (this.match.state === 'play') this.endMatch(t);
      else this.startMatch(t);
    }

    const snap = [];
    for (const p of this.players.values()) {
      if (p.bot) p.bot.update(dt, t);
      if (!p.alive) {
        if (t >= p.respawnAt && this.match.state === 'play') this.spawn(p);
      } else {
        if (p.hp < MATCH.maxHealth && t - p.lastDamage > MATCH.regenDelay * 1000) {
          p.hp = Math.min(MATCH.maxHealth, p.hp + MATCH.regenRate * dt);
        }
        p.history.push({ t, x: p.x, y: p.y, z: p.z, c: p.crouch });
        while (p.history.length && p.history[0].t < t - 1000) p.history.shift();
      }
      const flags = (p.crouch ? 1 : 0) | (p.alive ? 2 : 0) | (p.protectUntil > t ? 4 : 0);
      snap.push([p.id, round2(p.x), round2(p.y), round2(p.z), round3(p.yaw), round3(p.pitch), flags, p.weapon, Math.ceil(p.hp)]);
    }

    const data = JSON.stringify({ t: 'snap', s: Math.round(t), p: snap });
    for (const p of this.players.values()) {
      if (p.ws && p.ws.readyState === 1 && p.ws.bufferedAmount < 256 * 1024) p.ws.send(data);
    }
  }
}
