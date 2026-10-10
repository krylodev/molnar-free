# Blockfire

A fast, blocky, multiplayer first-person shooter that runs in the browser. You get bunny hopping, slide hopping, quickscoping and short time-to-kill, in a free-for-all arena.

## Play locally

Requires Node.js 20+.

```
cd blockfire
npm install
npm start
```

Open http://localhost:3000, type a name and press **Play**. Click into the game to capture the mouse.

Other people on your network can join with `http://<your-ip>:3000`. Players who type the same **Room** name play together; the **Copy invite link** button in the pause menu copies a link straight into your room.

If a room has fewer than 4 humans, bots fill the empty slots, so you can play alone. Bots leave as people join.

## Maps

| Map | Style |
| --- | --- |
| Courtyard | Medium arena with a raised plaza, two houses and two sniper towers |
| Warehouse | Small and close-range: shipping containers, catwalks, an office in the middle |
| Dunes | Large desert with long sightlines, sniper ridges and a roofed temple |
| Frostbite | Snowy valley around a frozen lake, with cabins and watchtowers |

Maps rotate after every match. Whoever opens a room can choose its first map in the **Map** menu.

## Low-end PCs

Open the pause menu (Esc) → **Settings** → **Graphics**:

- **Auto** (default) starts on Medium. If the frame rate drops, it lowers the resolution, and then turns shadows off.
- **Low** turns shadows off and renders at 70% resolution. This is the fastest preset.
- **Medium** draws shadows once per map instead of every frame.
- **High** draws real-time shadows and enables anti-aliasing (anti-aliasing changes need a page reload).
- **Resolution** scales the render size from 50% to 100% for the Low/Medium/High presets.

Other optimizations that are always on:
- Each map draws in about 10 draw calls, because walls, floors and props that share a material are merged into one mesh.
- Models use vertex colors instead of textures. A character is about 600 triangles.
- Bullet effects are pooled, so shooting creates no new objects.
- Lights are never added or removed, so switching maps doesn't recompile shaders.
- The HUD text updates a few times a second instead of every frame.

## 3D models (Blender)

The character, weapons and props are modeled in Blender by a Python script, `blender/build_models.py`, and exported to `public/models/*.glb`. To change them, edit the script and rebuild:

```
blender --background --python blender/build_models.py
```

You can also use the Blender Python module, without the Blender app: `pip install bpy` (needs Python 3.13), then `python blender/build_models.py`. Parts on the `Accent` material are tinted with each player's color in game. If you change a prop's size, also update its collider in `shared/props.js`.

## Controls

| Key | Action |
| --- | --- |
| WASD | Move |
| Space | Jump (hold to bunny hop) |
| Shift / C | Crouch; while running, slide |
| Left mouse | Shoot |
| Right mouse | Aim down sights / scope |
| R | Reload |
| 1 2 3 / wheel | Rifle, sniper, shotgun |
| Q | Last weapon |
| Tab | Scoreboard |
| Enter / T | Chat |
| Esc | Pause menu (sensitivity, FOV, volume) |

Movement tips: strafe in the air while turning the mouse the same way to gain speed (air strafing). Crouch while sprinting to slide, then jump out of the slide to keep the boost.

## Rules

- Free for all. First to 25 kills or the most kills after 5 minutes wins, then a new match starts after 8 seconds.
- 100 HP. Health regenerates 5 seconds after you last took damage.
- Headshots do extra damage. The sniper kills with one headshot if you are fully scoped in.
- 1.5 seconds of spawn protection, which ends early if you shoot.

## Hosting online

The server is a single Node process serving the page and the WebSocket on the same port (`PORT`, default 3000), so it runs on any host that supports Node and WebSockets (Render, Railway, Fly.io, a VPS, …):

- Build command: `npm install`
- Start command: `npm start`
- Root directory: `blockfire`

The client connects with `wss://` automatically when the page is served over HTTPS.

Environment variables:

| Variable | Default | Meaning |
| --- | --- | --- |
| `PORT` | 3000 | Port to listen on |
| `MIN_PLAYERS` | 4 | Bots fill rooms up to this many players |
| `BOTS` | — | Set to `0` to disable bots |

## How it works

| Path | Contents |
| --- | --- |
| `server.js` | HTTP + WebSocket server, room routing |
| `server/room.js` | Match flow, hit detection, lag compensation, movement checks |
| `server/bot.js` | Bot AI |
| `shared/` | Code shared by the client and server: movement physics, weapons, constants |
| `shared/maps/` | The maps and the builder they are made with |
| `public/` | The browser client (three.js) |
| `public/models/` | Exported Blender models |
| `blender/` | The Blender script that builds the models |
| `test/` | `npm test` |

Netcode:

- **Client-side prediction.** Your own movement is simulated in the browser at 120 Hz using the same physics module as the server, so controls never wait on the network. The client sends its position 30 times a second.
- **Server checks.** The server checks each position update against a speed budget and the map geometry. If an update is impossible (speed hacks, going through walls), the server snaps the player back.
- **Server-authoritative combat.** Ammo, fire rate, reloads, hit detection and damage are decided by the server.
- **Lag compensation.** Remote players are drawn 100 ms in the past, interpolated between server snapshots. When you fire, the server rewinds the other players to where you saw them (up to 400 ms), so hits that land on your screen count.

Textures are drawn on canvases and sounds are synthesized with Web Audio. The only asset files are the three Blender model files.
