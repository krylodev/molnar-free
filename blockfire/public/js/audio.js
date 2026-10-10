// Sound effects synthesized with Web Audio, so the game ships no audio files.

const SHOT = {
  rifle: { freq: 1800, q: 0.8, len: 0.12, thump: 140, gain: 0.5 },
  sniper: { freq: 900, q: 0.6, len: 0.45, thump: 80, gain: 0.9 },
  shotgun: { freq: 700, q: 0.5, len: 0.3, thump: 90, gain: 0.85 },
};

export class Sfx {
  constructor() {
    this.ctx = null;
    this.volume = 0.6;
  }

  // Must be called from a user gesture.
  init() {
    if (this.ctx) {
      this.ctx.resume();
      return;
    }
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    this.ctx = new Ctx();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.volume;
    this.master.connect(this.ctx.destination);
    const len = this.ctx.sampleRate;
    this.noise = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = this.noise.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  }

  setVolume(v) {
    this.volume = v;
    if (this.master) this.master.gain.value = v;
  }

  // gain/pan for a sound at a world position relative to the listener
  spatial(listener, pos) {
    if (!listener || !pos) return { gain: 1, pan: 0 };
    const dx = pos.x - listener.x;
    const dz = pos.z - listener.z;
    const dist = Math.hypot(dx, pos.y - listener.y, dz);
    const angle = Math.atan2(-dx, -dz) - listener.yaw;
    return { gain: 1 / (1 + dist / 8), pan: Math.max(-1, Math.min(1, -Math.sin(angle))) };
  }

  out(gain, pan) {
    const g = this.ctx.createGain();
    g.gain.value = gain;
    if (this.ctx.createStereoPanner) {
      const p = this.ctx.createStereoPanner();
      p.pan.value = pan;
      g.connect(p).connect(this.master);
    } else {
      g.connect(this.master);
    }
    return g;
  }

  shot(weaponId, listener = null, pos = null) {
    if (!this.ctx) return;
    const s = SHOT[weaponId] ?? SHOT.rifle;
    const { gain, pan } = this.spatial(listener, pos);
    const t = this.ctx.currentTime;
    const out = this.out(gain * s.gain, pan);

    const src = this.ctx.createBufferSource();
    src.buffer = this.noise;
    src.playbackRate.value = 0.8 + Math.random() * 0.4;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(s.freq * 3, t);
    filter.frequency.exponentialRampToValueAtTime(s.freq * 0.3, t + s.len);
    filter.Q.value = s.q;
    const env = this.ctx.createGain();
    env.gain.setValueAtTime(1, t);
    env.gain.exponentialRampToValueAtTime(0.001, t + s.len);
    src.connect(filter).connect(env).connect(out);
    src.start(t, Math.random() * 0.5, s.len + 0.05);

    const osc = this.ctx.createOscillator();
    osc.frequency.setValueAtTime(s.thump, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + s.len * 0.8);
    const oenv = this.ctx.createGain();
    oenv.gain.setValueAtTime(0.8, t);
    oenv.gain.exponentialRampToValueAtTime(0.001, t + s.len * 0.8);
    osc.connect(oenv).connect(out);
    osc.start(t);
    osc.stop(t + s.len);
  }

  tone(freq, len, type = 'sine', gain = 0.3, slideTo = null, delay = 0) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + len);
    const env = this.ctx.createGain();
    env.gain.setValueAtTime(gain, t);
    env.gain.exponentialRampToValueAtTime(0.001, t + len);
    osc.connect(env).connect(this.master);
    osc.start(t);
    osc.stop(t + len + 0.02);
  }

  hit(head) {
    if (head) this.tone(1600, 0.12, 'triangle', 0.35);
    else this.tone(900, 0.06, 'square', 0.12);
  }

  kill() {
    this.tone(700, 0.1, 'triangle', 0.3);
    this.tone(1050, 0.18, 'triangle', 0.3, null, 0.08);
  }

  hurt() {
    this.tone(220, 0.15, 'sawtooth', 0.15, 110);
  }

  reload() {
    this.tone(500, 0.05, 'square', 0.08);
    this.tone(350, 0.06, 'square', 0.08, null, 0.12);
  }

  empty() {
    this.tone(1200, 0.03, 'square', 0.08);
  }

  swap() {
    this.tone(600, 0.04, 'triangle', 0.08, 400);
  }
}
