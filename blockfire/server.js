// Blockfire game server: serves the client over HTTP and runs game rooms over
// WebSockets on the same port.

import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { WebSocketServer } from 'ws';
import { serveStatic } from './server/static.js';
import { Room, sanitizeName } from './server/room.js';

function roomName(raw) {
  const name = String(raw ?? '').toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 20);
  return name || 'main';
}

export function startServer({ port = 3000, host, minPlayers = 4 } = {}) {
  const rooms = new Map();
  const server = http.createServer(serveStatic);
  const wss = new WebSocketServer({ server, path: '/ws', maxPayload: 16 * 1024 });

  // the first player into a room picks its starting map
  const getRoom = (name, map) => {
    let room = rooms.get(name);
    if (!room) {
      room = new Room(name, { minPlayers, map, onEmpty: (r) => rooms.delete(r.name) });
      rooms.set(name, room);
    }
    return room;
  };

  wss.on('connection', (ws) => {
    let room = null;
    let player = null;
    ws.isAlive = true;
    ws.on('pong', () => { ws.isAlive = true; });

    ws.on('message', (data) => {
      let msg;
      try {
        msg = JSON.parse(data);
      } catch {
        return;
      }
      if (!msg || typeof msg !== 'object') return;
      if (!player) {
        if (msg.t !== 'join') return;
        room = getRoom(roomName(msg.room), typeof msg.map === 'string' ? msg.map : undefined);
        if (room.isFull()) {
          ws.send(JSON.stringify({ t: 'error', m: 'That room is full.' }));
          ws.close();
          return;
        }
        player = room.addPlayer(sanitizeName(msg.name), ws);
        return;
      }
      room.handleMessage(player, msg);
    });

    ws.on('close', () => {
      if (room && player) room.removePlayer(player.id);
    });
  });

  // drop connections that stopped answering
  const heartbeat = setInterval(() => {
    for (const ws of wss.clients) {
      if (!ws.isAlive) {
        ws.terminate();
        continue;
      }
      ws.isAlive = false;
      ws.ping();
    }
  }, 15000);

  return new Promise((resolve) => {
    server.listen(port, host, () => {
      resolve({
        port: server.address().port,
        rooms,
        close: () => new Promise((done) => {
          clearInterval(heartbeat);
          for (const room of rooms.values()) room.stop();
          for (const ws of wss.clients) ws.terminate();
          wss.close();
          server.close(done);
        }),
      });
    });
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT) || 3000;
  const minPlayers = process.env.BOTS === '0' ? 0 : Number(process.env.MIN_PLAYERS) || 4;
  startServer({ port, minPlayers }).then(({ port: p }) => {
    console.log(`Blockfire running at http://localhost:${p}`);
  });
}
