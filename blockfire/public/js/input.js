// Keyboard, mouse and pointer lock.

export class Input {
  constructor(canvas) {
    this.canvas = canvas;
    this.keys = new Set();
    this.pressed = new Set(); // keys pressed since the last frame
    this.mouseDX = 0;
    this.mouseDY = 0;
    this.buttons = new Set();
    this.clicked = new Set();
    this.wheel = 0;
    this.locked = false;
    this.enabled = true; // false while typing in chat
    this.onLockChange = null;

    addEventListener('keydown', (e) => {
      if (!this.enabled) return;
      if (e.code === 'Tab' || e.code === 'Space') e.preventDefault();
      if (!e.repeat) this.pressed.add(e.code);
      this.keys.add(e.code);
    });
    addEventListener('keyup', (e) => this.keys.delete(e.code));
    addEventListener('blur', () => {
      this.keys.clear();
      this.buttons.clear();
    });
    document.addEventListener('mousemove', (e) => {
      if (!this.locked) return;
      this.mouseDX += e.movementX;
      this.mouseDY += e.movementY;
    });
    document.addEventListener('mousedown', (e) => {
      if (!this.locked) return;
      this.buttons.add(e.button);
      this.clicked.add(e.button);
    });
    document.addEventListener('mouseup', (e) => this.buttons.delete(e.button));
    document.addEventListener('contextmenu', (e) => e.preventDefault());
    document.addEventListener('wheel', (e) => {
      if (this.locked) this.wheel += Math.sign(e.deltaY);
    }, { passive: true });
    document.addEventListener('pointerlockchange', () => {
      this.locked = document.pointerLockElement === this.canvas;
      if (!this.locked) {
        this.buttons.clear();
        this.keys.clear();
      }
      this.onLockChange?.(this.locked);
    });
  }

  lock() {
    try {
      const req = this.canvas.requestPointerLock({ unadjustedMovement: true });
      // some browsers reject unadjustedMovement; fall back to a plain lock
      req?.catch?.(() => this.canvas.requestPointerLock()?.catch?.(() => {}));
    } catch {
      this.canvas.requestPointerLock();
    }
  }

  unlock() {
    if (this.locked) document.exitPointerLock();
  }

  down(code) {
    return this.enabled && this.keys.has(code);
  }

  wasPressed(code) {
    return this.enabled && this.pressed.has(code);
  }

  // Clears per-frame state; call at the end of every frame.
  endFrame() {
    this.pressed.clear();
    this.clicked.clear();
    this.mouseDX = 0;
    this.mouseDY = 0;
    this.wheel = 0;
  }
}
