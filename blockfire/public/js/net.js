// WebSocket connection plus an estimate of the server clock, which drives
// remote-player interpolation and lag compensation.

import { INTERP_DELAY } from '/shared/constants.js';

export class Net {
  constructor() {
    this.ws = null;
    this.handlers = new Map();
    this.offset = 0;
    this.rtt = 0;
    this.samples = [];
    this.synced = false;
    this.pingTimer = null;
  }

  on(type, fn) {
    this.handlers.set(type, fn);
  }

  connect(name, room) {
    const proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${proto}//${location.host}/ws`);
    this.ws = ws;
    ws.onopen = () => {
      this.send({ t: 'join', name, room });
      this.ping();
      this.pingTimer = setInterval(() => this.ping(), 2000);
    };
    ws.onmessage = (ev) => {
      let msg;
      try {
        msg = JSON.parse(ev.data);
      } catch {
        return;
      }
      if (msg.t === 'pong') this.onPong(msg);
      else if (msg.t === 'welcome' && !this.synced) this.offset = msg.now - performance.now();
      this.handlers.get(msg.t)?.(msg);
    };
    ws.onclose = () => {
      clearInterval(this.pingTimer);
      this.handlers.get('close')?.();
    };
  }

  get open() {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  send(msg) {
    if (this.open) this.ws.send(JSON.stringify(msg));
  }

  ping() {
    this.send({ t: 'ping', c: performance.now() });
  }

  onPong(msg) {
    const t = performance.now();
    const rtt = t - msg.c;
    this.samples.push({ rtt, offset: msg.s + rtt / 2 - t });
    if (this.samples.length > 8) this.samples.shift();
    // the lowest-latency sample has the least queueing error
    const best = this.samples.reduce((a, b) => (b.rtt < a.rtt ? b : a));
    if (!this.synced) {
      this.offset = best.offset;
      this.synced = true;
    } else {
      this.offset += (best.offset - this.offset) * 0.2;
    }
    this.rtt = this.rtt ? this.rtt * 0.7 + rtt * 0.3 : rtt;
  }

  serverNow() {
    return performance.now() + this.offset;
  }

  // The server time remote players are currently drawn at.
  renderTime() {
    return this.serverNow() - INTERP_DELAY;
  }
}
