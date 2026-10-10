// Graphics quality presets and automatic resolution scaling for slow PCs.

export const PRESETS = {
  low: { maxPixelRatio: 1, scale: 0.7, shadows: 'off', shadowSize: 512, anisotropy: 1 },
  medium: { maxPixelRatio: 1, scale: 1, shadows: 'static', shadowSize: 1024, anisotropy: 2 },
  high: { maxPixelRatio: 2, scale: 1, shadows: 'dynamic', shadowSize: 2048, anisotropy: 8 },
};

const MIN_SCALE = 0.5;
const TARGET_FPS = 55;

export class Graphics {
  constructor(renderer, world, onShadowsChange) {
    this.renderer = renderer;
    this.world = world;
    this.onShadowsChange = onShadowsChange;
    this.quality = 'auto';
    this.scale = 1;
    this.manualScale = 1;
    this.preset = PRESETS.medium;
    this.frames = 0;
    this.elapsed = 0;
    this.slowSeconds = 0;
  }

  // quality: 'auto' | 'low' | 'medium' | 'high'; scale: 0.5-1 for manual presets
  apply(quality, manualScale = 1) {
    this.quality = quality;
    this.manualScale = manualScale;
    this.preset = PRESETS[quality] ?? PRESETS.medium;
    this.scale = quality === 'auto' ? Math.min(this.scale, 1) : this.preset.scale * manualScale;
    this.world.setShadows(this.preset.shadows, this.preset.shadowSize);
    this.world.setAnisotropy(Math.min(this.preset.anisotropy, this.renderer.capabilities.getMaxAnisotropy()));
    this.onShadowsChange?.(this.preset.shadows === 'dynamic');
    this.updatePixelRatio();
  }

  updatePixelRatio() {
    const ratio = Math.min(devicePixelRatio, this.preset.maxPixelRatio) * this.scale;
    if (Math.abs(this.renderer.getPixelRatio() - ratio) > 0.01) {
      this.renderer.setPixelRatio(ratio);
      this.renderer.setSize(innerWidth, innerHeight);
    }
  }

  // Called once per frame. In auto mode, trades resolution and then shadows
  // for frame rate, and wins resolution back when there is headroom.
  tick(dt) {
    if (this.quality !== 'auto') return;
    this.frames++;
    this.elapsed += dt;
    if (this.elapsed < 1) return;
    const fps = this.frames / this.elapsed;
    this.frames = 0;
    this.elapsed = 0;
    if (document.hidden) return;

    if (fps < TARGET_FPS - 10) {
      if (this.scale > MIN_SCALE + 0.01) {
        this.scale = Math.max(MIN_SCALE, this.scale - 0.1);
        this.updatePixelRatio();
      } else if (this.preset.shadows !== 'off' && ++this.slowSeconds >= 3) {
        this.preset = { ...this.preset, shadows: 'off' };
        this.world.setShadows('off', this.preset.shadowSize);
      }
    } else {
      this.slowSeconds = 0;
      if (fps > TARGET_FPS + 15 && this.scale < 1) {
        this.scale = Math.min(1, this.scale + 0.05);
        this.updatePixelRatio();
      }
    }
  }
}
