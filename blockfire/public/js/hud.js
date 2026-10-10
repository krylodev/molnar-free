// DOM overlay: health, ammo, kill feed, chat, scoreboard and indicators.

import { WEAPONS } from '/shared/weapons.js';

const $ = (id) => document.getElementById(id);
const hex = (c) => `#${c.toString(16).padStart(6, '0')}`;

function fadeOut(el, after, remove = true) {
  setTimeout(() => {
    el.style.opacity = '0';
    if (remove) setTimeout(() => el.remove(), 1000);
  }, after);
}

export class Hud {
  constructor() {
    this.el = $('hud');
    this.crosshair = $('crosshair');
    this.hitmarker = $('hitmarker');
    this.slots = $('slots');
    this.hitTimer = 0;
    this.announceTimer = 0;
    this.lastHp = -1;
    this.lastAmmoKey = '';
    this.slots.replaceChildren(...WEAPONS.map((w, i) => {
      const s = document.createElement('div');
      s.className = 'slot';
      s.textContent = `${i + 1} ${w.name}`;
      return s;
    }));
  }

  show(on) {
    this.el.classList.toggle('hidden', !on);
  }

  setHealth(hp) {
    hp = Math.max(0, Math.round(hp));
    if (hp === this.lastHp) return;
    this.lastHp = hp;
    $('hp-text').textContent = hp;
    $('hp-fill').style.width = `${hp}%`;
    $('hp-fill').classList.toggle('low', hp <= 35);
    $('vignette').style.opacity = hp <= 35 ? String(0.4 + (35 - hp) / 60) : '0';
  }

  setWeapon(index, ammo, reloading) {
    const key = `${index}:${ammo}:${reloading}`;
    if (key === this.lastAmmoKey) return;
    this.lastAmmoKey = key;
    const w = WEAPONS[index];
    $('ammo-cur').textContent = ammo;
    $('ammo-max').textContent = `/ ${w.mag}`;
    $('weapon-name').textContent = reloading ? 'Reloading…' : w.name;
    $('ammo').classList.toggle('reloading', reloading);
    [...this.slots.children].forEach((s, i) => s.classList.toggle('active', i === index));
  }

  setSpread(px) {
    const gap = Math.round(4 + px);
    if (gap === this.lastGap) return;
    this.lastGap = gap;
    this.crosshair.style.setProperty('--gap', `${gap}px`);
  }

  setScope(on) {
    on = !!on;
    if (on === this.lastScope) return;
    this.lastScope = on;
    $('scope').classList.toggle('show', on);
    this.crosshair.style.display = on ? 'none' : '';
  }

  hit(head, kill) {
    this.hitmarker.classList.add('show');
    this.hitmarker.classList.toggle('head', head && !kill);
    this.hitmarker.classList.toggle('kill', kill);
    clearTimeout(this.hitTimer);
    this.hitTimer = setTimeout(() => this.hitmarker.classList.remove('show'), 120);
  }

  damageFrom(angle) {
    const a = document.createElement('div');
    a.className = 'dmg-arrow';
    a.style.transform = `rotate(${angle}rad)`;
    $('damage-arrows').append(a);
    fadeOut(a, 400);
  }

  killFeed(killer, victim, weapon, head, mine) {
    const row = document.createElement('div');
    row.className = 'kf' + (mine ? ' me' : '');
    const k = document.createElement('span');
    const v = document.createElement('span');
    const w = document.createElement('span');
    w.className = 'w' + (head ? ' hs' : '');
    w.textContent = `[${weapon}${head ? ' ✦' : ''}]`;
    if (killer) {
      k.textContent = killer.name;
      k.style.color = hex(killer.color);
    }
    v.textContent = victim?.name ?? '?';
    if (victim) v.style.color = hex(victim.color);
    row.append(k, w, v);
    $('killfeed').prepend(row);
    while ($('killfeed').children.length > 6) $('killfeed').lastChild.remove();
    fadeOut(row, 5000);
  }

  announce(text) {
    const a = $('announce');
    a.textContent = text;
    a.classList.add('show');
    clearTimeout(this.announceTimer);
    this.announceTimer = setTimeout(() => a.classList.remove('show'), 1600);
  }

  chat(name, color, text) {
    const line = document.createElement('div');
    line.className = 'chat-line' + (name ? '' : ' sys');
    if (name) {
      const b = document.createElement('b');
      b.textContent = `${name}:`;
      b.style.color = hex(color);
      line.append(b);
    }
    line.append(document.createTextNode(text));
    $('chat-log').append(line);
    while ($('chat-log').children.length > 8) $('chat-log').firstChild.remove();
    fadeOut(line, 8000, false);
  }

  openChat(open) {
    $('chat').classList.toggle('open', open);
    const input = $('chat-input');
    if (open) {
      input.value = '';
      input.focus();
    } else {
      input.blur();
    }
  }

  setTimer(seconds, leaderText) {
    const s = Math.max(0, Math.ceil(seconds));
    $('timer').textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
    $('leader').textContent = leaderText;
  }

  setStats(fps, ping) {
    $('fps').textContent = fps;
    $('ping').textContent = ping;
  }

  death(show, byName, seconds) {
    $('death').classList.toggle('hidden', !show);
    if (!show) return;
    $('death-by').textContent = byName ? `by ${byName}` : '';
    $('death-timer').textContent = seconds > 0 ? `Respawning in ${seconds.toFixed(1)}s` : '';
  }

  scoreboard(show, players, myId, title) {
    $('scoreboard').classList.toggle('hidden', !show);
    if (!show) return;
    $('sb-title').textContent = title;
    const rows = [...players].sort((a, b) => b.kills - a.kills || a.deaths - b.deaths).map((p, i) => {
      const tr = document.createElement('tr');
      if (p.id === myId) tr.className = 'me';
      const cells = [String(i + 1), null, String(p.kills), String(p.deaths)].map((txt) => {
        const td = document.createElement('td');
        if (txt !== null) td.textContent = txt;
        return td;
      });
      const sw = document.createElement('span');
      sw.className = 'swatch';
      sw.style.background = hex(p.color);
      cells[1].append(sw, document.createTextNode(p.name));
      tr.append(...cells);
      return tr;
    });
    $('sb-rows').replaceChildren(...rows);
  }
}
