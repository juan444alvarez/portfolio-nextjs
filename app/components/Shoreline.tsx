'use client';

/**
 * Shoreline — homepage hero: an ASCII surf experiment.
 *
 * A bird's-eye surf experiment: ocean at the top of the viewport, sand at the
 * bottom. Every visit opens on a calm sea and one big swell rolling in from the
 * top. After that, heavy waves arrive in slow sets (mostly mid-sized, one or two
 * big ones placed at random). Each wave reaches further in a few places, with
 * thicker foam there, then drains away completely, leaving clean sand. The water
 * flows around the links instead of over them.
 *
 * Sound starts muted. The speaker icon next to the links turns it on.
 *
 * Everything is procedural: noise-driven foam on a <canvas> character grid, and
 * Web Audio surf synthesized from filtered noise (no assets, no dependencies).
 */

import Link from 'next/link';
import { useCallback, useEffect, useRef, useSyncExternalStore } from 'react';

/* ───────────────────────────── Look ───────────────────────────── */

const BG = '#08131D';
// index = cell class: 1 deep water · 2 lace · 3 foam · 4 spray
const CLASS_COLORS = ['', '#2E5672', '#7DB4CE', '#F2FBFF', '#A6D3E8'];
const RAMPS = ['', ' .-~~≈', ' .·:°o~oO', ' .·:oO0@@', ' .°o'];
const FOAM_GLOW = 'rgba(170, 225, 255, 0.45)';
const LINK_COLOR = '#8FAABA';
const HOVER_COLOR = '#F2FBFF';
const FONT_STACK = 'ui-monospace, "SF Mono", Menlo, Consolas, "DejaVu Sans Mono", "Liberation Mono", monospace';

const LINKS = [
  { label: 'about', href: '/about' },
  { label: 'work', href: '/work' },
  { label: 'lab', href: '/lab' },
];

const CELL_W = 7.2; // CSS px per character column (grid density)
const MAX_COLS = 240; // on very wide screens, characters grow instead of the grid
const CELL_ASPECT = 2; // row height ÷ column width
const FPS = 30; // stepped, slightly analog motion; also keeps CPU low

/* ──────────────────────────── Rhythm ──────────────────────────── */
// Slow sets of heavy waves. Every value is drawn uniformly from its [min, max]
// range, so the pattern never repeats but big waves stay evenly spread out.

const RHYTHM = {
  setLength: [4, 6], // waves per set
  bigPerSet: [1, 2], // big waves per set, placed at random (never first)
  smallSize: [0.3, 0.55], // 0 = tiny lap, 1 = biggest wave
  bigSize: [0.8, 1],
  gap: [6, 8.5], // seconds until the next wave (+ extra time after big ones)
  lullLaps: [1, 2], // softer waves between sets
  lullSize: [0.22, 0.35],
  lullGap: [7.5, 10],
} as const;

const REST = 0.17; // resting waterline, fraction of viewport height
const OPEN_REACH = 0.97; // furthest the swash may run where nothing is in the way

/* ─────────────────────────── Helpers ──────────────────────────── */

type Range = readonly [number, number];

const TAU = Math.PI * 2;
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const smooth = (e0: number, e1: number, x: number) => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOutCubic = (x: number) => 1 - (1 - x) ** 3;
const easeInOutSine = (x: number) => -(Math.cos(Math.PI * x) - 1) / 2;

/** Compress values approaching `cap` so the swash slows and bunches up instead of being cut flat. */
const softCap = (x: number, cap: number) => {
  const knee = 0.1;
  const s = cap - knee;
  return x <= s ? x : s + knee * Math.tanh((x - s) / knee);
};

function mulberry32(seed: number) {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const uniform = (rand: () => number, [a, b]: Range) => a + (b - a) * rand();
const randInt = (rand: () => number, [a, b]: Range) => a + Math.floor(rand() * (b - a + 1));

/** Stateless integer hash → [0, 1). Used for stable per-cell randomness. */
function hash3(x: number, y: number, z: number) {
  let h = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul(z | 0, 1274126177);
  h = Math.imul(h ^ (h >>> 13), 1103515245);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

/** Classic 2D Perlin gradient noise, roughly in [-1, 1]. */
class Perlin {
  private p = new Uint8Array(512);
  private gx = new Float32Array(256);
  private gy = new Float32Array(256);

  constructor(rand: () => number) {
    const perm = Array.from({ length: 256 }, (_, i) => i);
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [perm[i], perm[j]] = [perm[j], perm[i]];
    }
    for (let i = 0; i < 512; i++) this.p[i] = perm[i & 255];
    for (let i = 0; i < 256; i++) {
      const a = rand() * TAU;
      this.gx[i] = Math.cos(a);
      this.gy[i] = Math.sin(a);
    }
  }

  noise(x: number, y: number) {
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const xf = x - x0;
    const yf = y - y0;
    const xi = x0 & 255;
    const yi = y0 & 255;
    const { p, gx, gy } = this;
    const u = xf * xf * xf * (xf * (xf * 6 - 15) + 10);
    const v = yf * yf * yf * (yf * (yf * 6 - 15) + 10);
    const a = p[xi] + yi;
    const b = p[xi + 1] + yi;
    const h00 = p[a];
    const h01 = p[a + 1];
    const h10 = p[b];
    const h11 = p[b + 1];
    const n00 = gx[h00] * xf + gy[h00] * yf;
    const n10 = gx[h10] * (xf - 1) + gy[h10] * yf;
    const n01 = gx[h01] * xf + gy[h01] * (yf - 1);
    const n11 = gx[h11] * (xf - 1) + gy[h11] * (yf - 1);
    const x1 = n00 + u * (n10 - n00);
    const x2 = n01 + u * (n11 - n01);
    return (x1 + v * (x2 - x1)) * 1.414;
  }
}

/**
 * Tileable cellular (Worley) noise with slowly drifting feature points.
 * F2 − F1 is small on cell borders → the lace web of seafoam.
 * F1 is small at cell centres → bubble holes inside dense foam.
 */
class Worley {
  f1 = 0;
  f2 = 0;
  private readonly n = 48;
  private bx: Float32Array;
  private by: Float32Array;
  private ph: Float32Array;
  private sp: Float32Array;
  private px: Float32Array;
  private py: Float32Array;

  constructor(private readonly scale: number, rand: () => number) {
    const size = this.n * this.n;
    this.bx = new Float32Array(size);
    this.by = new Float32Array(size);
    this.ph = new Float32Array(size);
    this.sp = new Float32Array(size);
    this.px = new Float32Array(size);
    this.py = new Float32Array(size);
    for (let i = 0; i < size; i++) {
      this.bx[i] = 0.2 + 0.6 * rand();
      this.by[i] = 0.2 + 0.6 * rand();
      this.ph[i] = rand() * TAU;
      this.sp[i] = 0.2 + 0.5 * rand();
    }
  }

  update(t: number) {
    for (let i = 0; i < this.px.length; i++) {
      const a = t * this.sp[i] + this.ph[i];
      this.px[i] = this.bx[i] + 0.2 * Math.sin(a);
      this.py[i] = this.by[i] + 0.2 * Math.cos(a * 0.8 + 1.3);
    }
  }

  eval(x: number, y: number) {
    const xs = x / this.scale;
    const ys = y / this.scale;
    const cx = Math.floor(xs);
    const cy = Math.floor(ys);
    const n = this.n;
    let d1 = 9;
    let d2 = 9;
    for (let oy = -1; oy <= 1; oy++) {
      const iy = cy + oy;
      const my = ((iy % n) + n) % n;
      for (let ox = -1; ox <= 1; ox++) {
        const ix = cx + ox;
        const k = my * n + (((ix % n) + n) % n);
        const dx = xs - (ix + this.px[k]);
        const dy = ys - (iy + this.py[k]);
        const d = dx * dx + dy * dy;
        if (d < d1) {
          d2 = d1;
          d1 = d;
        } else if (d < d2) {
          d2 = d;
        }
      }
    }
    this.f1 = Math.sqrt(d1);
    this.f2 = Math.sqrt(d2);
  }
}

/* ─────────────────────────── Rhythm ───────────────────────────── */

type Swell = { size: number; gap: number };

class SetRhythm {
  private queue: Swell[] = [];
  constructor(private readonly rand: () => number) {}

  next(): Swell {
    if (this.queue.length === 0) this.refill();
    return this.queue.shift() as Swell;
  }

  private refill() {
    const r = this.rand;
    const n = randInt(r, RHYTHM.setLength);
    const bigCount = Math.min(randInt(r, RHYTHM.bigPerSet), n - 1);
    const bigs = new Set<number>();
    while (bigs.size < bigCount) bigs.add(1 + Math.floor(r() * (n - 1)));
    for (let i = 0; i < n; i++) {
      const size = bigs.has(i) ? uniform(r, RHYTHM.bigSize) : uniform(r, RHYTHM.smallSize);
      this.queue.push({ size, gap: uniform(r, RHYTHM.gap) + size * 1.5 });
    }
    const lull = randInt(r, RHYTHM.lullLaps);
    for (let i = 0; i < lull; i++) {
      this.queue.push({ size: uniform(r, RHYTHM.lullSize), gap: uniform(r, RHYTHM.lullGap) });
    }
  }
}

/* ─────────────────────────── Simulation ───────────────────────── */

type Wave = {
  t0: number;
  size: number;
  start: number; // fraction of height where it breaks
  reach: number; // fraction of height it runs up to (before shape)
  up: number; // seconds: run-up
  hold: number; // seconds: slack at max reach
  down: number; // seconds: backwash
  shape: Float32Array; // per column: scalloped edge + tongues that run further
  thick: Float32Array; // per column: foam thickness multiplier (0.45 – 2)
  pan: number; // stereo position of the biggest tongue
  wobble: number;
  rollW: number; // rows of dense foam behind the front
  fizz: number;
  deposit: number;
  front: Float32Array; // current front row per column
  strength: number;
  rollScale: number;
};

type WaveEvent = { size: number; pan: number; up: number; hold: number; down: number };

class Surf {
  t = 0;
  readonly glyph: Uint8Array;
  onWave: ((e: WaveEvent) => void) | null = null;

  private waves: Wave[] = [];
  private F: Float32Array; // foam memory (advected with the water)
  private Fb: Float32Array;
  private E: Float32Array; // waterline row per column
  private prevE: Float32Array;
  private vE: Float32Array; // waterline speed (rows/s, + = running up the beach)
  private rest: Float32Array;
  private limit: Float32Array; // furthest reach per column (fraction of height)
  private sprayD: Float32Array;
  private thickCol: Float32Array; // foam thickness along the current waterline
  private rand: () => number;
  private noise: Perlin;
  private laceA: Worley;
  private laceB: Worley;
  private bubbles: Worley;
  private rhythm: SetRhythm;
  private nextSpawn = 0;
  private introAt = -1;
  private laceExt = 12; // rows of lace behind the waterline, follows recent wave size
  private rs: number; // row scale vs. a 62-row reference screen

  constructor(readonly cols: number, readonly rows: number, seed: number) {
    const n = cols * rows;
    this.glyph = new Uint8Array(n);
    this.F = new Float32Array(n);
    this.Fb = new Float32Array(n);
    this.E = new Float32Array(cols).fill(REST * rows);
    this.prevE = new Float32Array(cols).fill(REST * rows);
    this.vE = new Float32Array(cols);
    this.rest = new Float32Array(cols);
    this.limit = new Float32Array(cols).fill(OPEN_REACH);
    this.sprayD = new Float32Array(cols);
    this.thickCol = new Float32Array(cols).fill(1);
    this.rand = mulberry32(seed);
    this.noise = new Perlin(this.rand);
    this.laceA = new Worley(4.6, this.rand);
    this.laceB = new Worley(2.5, this.rand);
    this.bubbles = new Worley(1.8, this.rand);
    this.rhythm = new SetRhythm(this.rand);
    this.rs = rows / 62;
  }

  /** Per-column reach limit, as a fraction of the viewport height. */
  setLimit(limit: Float32Array) {
    this.limit.set(limit.subarray(0, this.cols));
  }

  /** Calm sea, then one big swell rolls in from the top: the first thing a visitor sees. */
  introSwell(delay: number) {
    this.nextSpawn = Infinity;
    this.introAt = this.t + delay;
  }

  /** Run the sea for a few seconds without drawing so the page opens mid-wave. */
  prewarm(seconds: number) {
    const dt = 1 / FPS;
    for (let s = 0; s < seconds; s += dt) this.step(dt);
    this.nextSpawn = Math.min(this.nextSpawn, this.t + 1.5);
  }

  private spawn(size: number, intro = false): Wave {
    const r = this.rand;
    const { cols } = this;
    // Scalloped edge: three gentle sine lobes
    const lobes = [1.0, 2.6, 5.2].map((f, k) => ({
      f: f * (0.8 + 0.5 * r()),
      a: [0.022, 0.02, 0.009][k] * (0.6 + 0.9 * size),
      p: r() * TAU,
    }));
    // Tongues: 1–3 places where the swash runs further down the beach
    const count = intro ? 2 : 1 + (r() < 0.55 ? 1 : 0) + (r() < 0.25 ? 1 : 0);
    const tongues = Array.from({ length: count }, () => ({
      x: 0.08 + 0.84 * r(),
      w: 0.05 + 0.1 * r(),
      a: (0.03 + 0.12 * r()) * (0.4 + 0.6 * size),
    }));
    // Foam thickness along the shore: broad, smooth bands (not noise), heavier on the tongues
    const f1 = 0.7 + 1.1 * r();
    const f2 = 2 + 1.5 * r();
    const p1 = r() * TAU;
    const p2 = r() * TAU;
    const shape = new Float32Array(cols);
    const thick = new Float32Array(cols);
    let panW = 0;
    let panX = 0;
    for (let c = 0; c < cols; c++) {
      const x = (c + 0.5) / cols;
      let edge = 0;
      for (const l of lobes) edge += l.a * Math.sin(TAU * l.f * x + l.p);
      let tg = 0;
      for (const t of tongues) {
        const dx = x - t.x;
        tg += t.a * Math.exp(-(dx * dx) / (2 * t.w * t.w));
      }
      shape[c] = edge + tg;
      const band = 0.65 * Math.sin(TAU * f1 * x + p1) + 0.35 * Math.sin(TAU * f2 * x + p2);
      thick[c] = Math.max(0.45, Math.min(2, 1 + 0.5 * band + 6 * tg));
      panW += tg;
      panX += tg * x;
    }
    const pan = panW > 0 ? Math.max(-0.8, Math.min(0.8, (panX / panW - 0.5) * 1.4)) : 0;
    const w: Wave = {
      t0: this.t,
      size,
      start: intro ? -0.06 : REST - 0.05 - 0.08 * size,
      reach: REST + 0.09 + 0.66 * size,
      up: intro ? 6.8 : 3.2 + 2.8 * size,
      hold: intro ? 1.1 : 0.5 + 0.6 * size,
      down: intro ? 7.6 : 4.2 + 3.2 * size,
      shape,
      thick,
      pan,
      wobble: r() * 100,
      rollW: (2.6 + 6.5 * size) * this.rs,
      fizz: 0.7 + 0.9 * size,
      deposit: 0.85 + 0.15 * size,
      front: new Float32Array(cols),
      strength: 1,
      rollScale: 1,
    };
    this.waves.push(w);
    return w;
  }

  private updateFront(w: Wave) {
    const { cols, rows, noise, t, limit } = this;
    const age = t - w.t0;
    const { up, hold, down } = w;
    let phase: 0 | 1 | 2;
    let e: number;
    if (age < up) {
      phase = 0;
      e = easeOutCubic(age / up);
      w.strength = smooth(0, 0.9, age);
      w.rollScale = 0.5 + 0.5 * smooth(0, 1.1, age);
    } else if (age < up + hold) {
      phase = 1;
      e = (age - up) / hold;
      w.strength = 1 - 0.25 * e;
      w.rollScale = 1 - 0.25 * e;
    } else {
      phase = 2;
      e = easeInOutSine(clamp01((age - up - hold) / down));
      w.strength = 0.75 * (1 - e) ** 1.5;
      w.rollScale = 0.45 + 0.3 * (1 - e);
    }
    for (let c = 0; c < cols; c++) {
      const shape = w.shape[c] + 0.035 * noise.noise(c * 0.021, w.wobble + age * 0.04);
      const reach = softCap(w.reach + shape, limit[c]);
      let pos: number;
      if (phase === 0) pos = lerp(Math.min(w.start + 0.4 * shape, reach), reach, e);
      else if (phase === 1) pos = reach;
      else pos = lerp(reach, this.rest[c] / rows - 0.05, e);
      w.front[c] = pos * rows;
    }
  }

  step(dt: number) {
    const { cols, rows, rs, noise, F, E, prevE, vE } = this;
    this.t += dt;
    const t = this.t;

    this.laceA.update(t);
    this.laceB.update(t);
    this.bubbles.update(t);

    let spawned: Wave | null = null;
    if (this.introAt >= 0 && t >= this.introAt) {
      this.introAt = -1;
      spawned = this.spawn(1, true);
      this.nextSpawn = t + spawned.up + spawned.hold + 1.5;
    } else if (t >= this.nextSpawn) {
      const s = this.rhythm.next();
      spawned = this.spawn(s.size);
      this.nextSpawn = t + s.gap;
    }
    if (spawned) {
      const { size, pan, up, hold, down } = spawned;
      this.onWave?.({ size, pan, up, hold, down });
    }

    for (let c = 0; c < cols; c++) {
      this.rest[c] = (REST + 0.015 * noise.noise(c * 0.02 + 50, t * 0.02)) * rows;
    }
    this.waves = this.waves.filter((w) => t - w.t0 < w.up + w.hold + w.down);
    let biggest = 0;
    for (const w of this.waves) {
      this.updateFront(w);
      if (w.size > biggest) biggest = w.size;
    }
    const targetExt = (12 + 20 * biggest) * rs;
    this.laceExt += (targetExt - this.laceExt) * (1 - Math.exp(-dt / 2.5));

    // Waterline = furthest reach of any wave (or the resting sea).
    const thickBlend = 1 - Math.exp(-dt / 1.5);
    for (let c = 0; c < cols; c++) {
      let e = this.rest[c];
      let edge: Wave | null = null;
      for (const w of this.waves) {
        if (w.front[c] > e) {
          e = w.front[c];
          edge = w;
        }
      }
      const thickTarget = edge ? lerp(1, edge.thick[c], clamp01(edge.strength * 1.5)) : 1;
      this.thickCol[c] += (thickTarget - this.thickCol[c]) * thickBlend;
      E[c] = e;
      vE[c] = (e - prevE[c]) / Math.max(dt, 1e-3);
      prevE[c] = e;
      const adv = clamp01(vE[c] / (5 * rs));
      this.sprayD[c] = adv > 0.02 ? (0.5 + 2.6 * adv) * rs : 0; // spray only while running up
    }

    // Foam rides the swash up and drains with the backwash. Anything left on the
    // sand dissolves within a fraction of a second, so the beach stays clean.
    const keepWater = Math.exp(-dt / 5.5);
    const keepSand = Math.exp(-dt / 0.3);
    const Fb = this.Fb;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        const d = E[c] - r;
        if (d > 0) {
          const v = vE[c] * Math.exp(-d / (8 * rs));
          let src = r - v * dt;
          if (src < 0) src = 0;
          else if (src > rows - 1.001) src = rows - 1.001;
          const r0 = src | 0;
          const fr = src - r0;
          const a = F[r0 * cols + c];
          const b = F[(r0 + 1) * cols + c];
          Fb[i] = (a + (b - a) * fr) * keepWater;
        } else {
          Fb[i] = F[i] * keepSand;
        }
      }
    }
    this.Fb = F;
    this.F = Fb;

    this.shade();
  }

  /** Decide one character per cell. */
  private shade() {
    const { cols, rows, rs, t, noise, E, sprayD, glyph, waves, laceA, laceB, bubbles, laceExt, thickCol } = this;
    const F = this.F;
    const deepTop = 0.12 * rows;

    for (let r = 0; r < rows; r++) {
      const Y = r * CELL_ASPECT;
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        const e = E[c];
        const d = e - r; // rows behind the waterline (> 0 = water)
        let dens = 0;
        let k = 0;

        if (d > 0) {
          // Lace: a thick web of foam behind the waterline, fed by what the rolls leave
          const tk = thickCol[c]; // thicker, deeper foam in some stretches of shore
          const ext = laceExt * (0.55 + 0.45 * tk);
          const band = smooth(0, ext * 0.2, d) * (1 - smooth(ext * 0.5, ext, d));
          const amount = Math.max(F[i] * 1.5, band * (0.55 + 0.25 * tk));
          if (amount > 0.12) {
            const Yl = Y - 0.7 * e * CELL_ASPECT; // texture slides with the swash
            laceA.eval(c, Yl);
            const e1 = laceA.f2 - laceA.f1;
            laceB.eval(c + 41, Yl + 3);
            const e2 = laceB.f2 - laceB.f1;
            // foam gathers in clumps: thicker web inside a patch, open water between
            const patch = smooth(-0.15, 0.35, noise.noise(c * 0.021 + 300, Yl * 0.034 + t * 0.02)); // drifts along the shore
            const web = 0.18 + 0.2 * patch * Math.min(1, amount) + 0.05 * (tk - 1);
            let lt = (1 - smooth(0.05, web, e1)) * 0.95 + (1 - smooth(0.04, 0.1 + 0.08 * patch, e2)) * 0.5;
            if (lt > 1) lt = 1;
            const v = Math.min(1, amount * (0.55 + 0.7 * patch)) * lt * (0.12 + 0.95 * patch);
            if (v >= 0.16 && v > dens) {
              dens = v;
              k = 2;
            }
          }

          // Deep water: swell lines travelling shoreward + faint twinkle
          const env = Math.max(smooth(3 * rs, 12 * rs, d), 1 - smooth(0, deepTop, r));
          if (env > 0.02) {
            const warp = noise.noise(c * 0.018 + 100, Y * 0.018 + t * 0.05) * 5;
            const sw = Math.sin(r * 0.62 + warp - t * 0.7);
            if (sw > 0.8) {
              const v = smooth(0.8, 1, sw) * env * (0.35 + 0.5 * noise.noise(c * 0.036 - t * 0.03 + 200, Y * 0.036));
              if (v > dens) {
                dens = v;
                k = 1;
              }
            }
          }
          const body = smooth(0.5, 12 * rs, d);
          const tick = Math.floor(t * 1.2 + hash3(c, r, 3) * 7);
          if (hash3(c, r, tick) < 0.015 + 0.045 * body) {
            const v = 0.1 + 0.12 * body * hash3(c, r, tick + 11);
            if (v > dens) {
              dens = v;
              k = 1;
            }
          }
        } else {
          // Spray / popping bubbles just ahead of an advancing edge
          const sd = sprayD[c];
          const ahead = -d;
          if (sd > 0 && ahead < sd) {
            const tick = Math.floor(t * 8 + hash3(c, r, 5) * 5);
            if (
              hash3(c, r, tick) < 0.18 * (1 - ahead / sd) &&
              noise.noise(c * 0.12 + 800, Y * 0.12 + t * 0.8) > -0.1
            ) {
              dens = 0.2 + 0.25 * hash3(c, r, tick + 3);
              k = 4;
            }
          }
        }

        // Breaking roll: heavy, bubbly foam right behind each wave front
        for (let wi = 0; wi < waves.length; wi++) {
          const w = waves[wi];
          if (w.strength < 0.01) continue;
          const dd = w.front[c] - r;
          const tk = w.thick[c];
          const rwMax = w.rollW * w.rollScale * tk * 1.7;
          if (dd < -1.2 || dd > rwMax) continue;
          const dde = dd + noise.noise(c * 0.21 + 400, Y * 0.21 + t * 0.5) * w.fizz;
          const clump = noise.noise(c * 0.054 + 500, Y * 0.054 + t * 0.08);
          const rw = w.rollW * w.rollScale * tk * (1 + 0.6 * clump);
          let roll = smooth(-0.6, 0.6, dde) * (1 - smooth(rw * 0.45, rw, dde));
          if (roll > 0.01) {
            bubbles.eval(c, Y - w.front[c] * CELL_ASPECT * 0.9);
            const holes = smooth(0.12, 0.42, bubbles.f1);
            roll *= (0.7 + 0.45 * noise.noise(c * 0.12 + 600, Y * 0.12 - t * 0.3)) * (0.5 + 0.6 * holes);
          }
          roll += 0.45 * smooth(-0.6, 0.3, dde) * (1 - smooth(0.4, 2, dde));
          roll *= w.strength;
          if (roll > 0.02 && d > 0) {
            const dep = roll * w.deposit * (0.75 + 0.25 * tk);
            if (dep > F[i]) F[i] = dep;
          }
          if (roll > dens) {
            dens = roll;
            k = 3;
          }
        }

        if (k === 0 || dens < 0.06) {
          glyph[i] = 0;
          continue;
        }
        if (k === 3 && dens < 0.3) k = 2; // faint foam reads as lace, not bright dots
        const len = RAMPS[k].length;
        const jit = (hash3(c, r, 7) - 0.5) * 0.08;
        let idx = 1 + Math.floor(clamp01(dens + jit) * 0.999 * (len - 1));
        if (idx > len - 1) idx = len - 1;
        glyph[i] = (k << 4) | idx;
      }
    }
  }
}

/* ─────────────────────────── Rendering ────────────────────────── */

type Atlas = { canvas: HTMLCanvasElement; sw: number; sh: number; pad: number };

/** Pre-draw every (class, character) once; each frame is then just drawImage blits. */
function buildAtlas(cw: number, ch: number): Atlas {
  const pad = Math.ceil(cw * 0.9);
  const sw = cw + pad * 2;
  const sh = ch + pad * 2;
  const canvas = document.createElement('canvas');
  canvas.width = sw * 10;
  canvas.height = sh * RAMPS.length;
  const g = canvas.getContext('2d');
  if (!g) return { canvas, sw, sh, pad };
  g.font = `${Math.round(cw / 0.6)}px ${FONT_STACK}`;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  for (let k = 1; k < RAMPS.length; k++) {
    g.fillStyle = CLASS_COLORS[k];
    if (k === 3) {
      g.shadowColor = FOAM_GLOW;
      g.shadowBlur = cw * 0.85;
    } else {
      g.shadowColor = 'transparent';
      g.shadowBlur = 0;
    }
    for (let j = 1; j < RAMPS[k].length; j++) {
      g.fillText(RAMPS[k][j], j * sw + sw / 2, k * sh + sh / 2 + ch * 0.04);
    }
  }
  return { canvas, sw, sh, pad };
}

function draw(ctx: CanvasRenderingContext2D, surf: Surf, atlas: Atlas, cw: number, ch: number) {
  const { cols, glyph } = surf;
  const { canvas, sw, sh, pad } = atlas;
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  for (let i = 0; i < glyph.length; i++) {
    const g = glyph[i];
    if (g === 0) continue;
    const r = (i / cols) | 0;
    const c = i - r * cols;
    ctx.drawImage(canvas, (g & 15) * sw, (g >> 4) * sh, sw, sh, c * cw - pad, r * ch - pad, sw, sh);
  }
}

/** Reach limit per column: the swash stops short of the links and flows around them. */
function reachLimit(box: DOMRect | undefined, cols: number, rows: number, cw: number, ch: number, dpr: number) {
  const limit = new Float32Array(cols).fill(OPEN_REACH);
  if (!box || box.width === 0) return limit;
  const margin = 3.5 * (rows / 62); // rows of clear sand above the links (spray included)
  const top = Math.max(REST + 0.2, ((box.top * dpr) / ch - margin) / rows);
  const left = (box.left * dpr) / cw - 4;
  const right = (box.right * dpr) / cw + 4;
  const feather = 14;
  for (let c = 0; c < cols; c++) {
    const inside = smooth(left - feather, left, c) * (1 - smooth(right, right + feather, c));
    limit[c] = lerp(OPEN_REACH, Math.min(OPEN_REACH, top), inside);
  }
  return limit;
}

/* ───────────────────────────── Sound ──────────────────────────── */

/**
 * Surf synthesized from noise. Each wave = a low, weighty body plus a filtered
 * break whose loudness and brightness scale with wave size, then a fizzing,
 * crackling backwash. A quiet rumble bed sits underneath. Panned to where the
 * wave reaches furthest.
 */
class SurfAudio {
  private master: GainNode;
  private white: AudioBuffer;
  private brown: AudioBuffer;
  private crackle: AudioBuffer;
  private bedStarted = false;

  static create(): SurfAudio | null {
    const AC =
      typeof window === 'undefined'
        ? undefined
        : window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    try {
      return new SurfAudio(new AC());
    } catch {
      return null;
    }
  }

  constructor(readonly ctx: BaseAudioContext) {
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -16;
    comp.knee.value = 12;
    comp.ratio.value = 3;
    comp.attack.value = 0.01;
    comp.release.value = 0.4;
    this.master = ctx.createGain();
    this.master.gain.value = 0;
    this.master.connect(comp);
    comp.connect(ctx.destination);

    const sr = ctx.sampleRate;
    this.white = this.buffer(4, () => Math.random() * 2 - 1);
    let last = 0;
    this.brown = this.buffer(8, () => {
      last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
      return last * 3.5;
    });
    // Sparse clicks with tiny decays: foam bubbles popping.
    const crackle = ctx.createBuffer(1, Math.floor(sr * 3), sr);
    const data = crackle.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      if (Math.random() < 0.0025) {
        const amp = (Math.random() * 2 - 1) * (0.3 + 0.7 * Math.random());
        const len = 20 + Math.floor(Math.random() * 120);
        for (let j = 0; j < len && i + j < data.length; j++) data[i + j] += amp * Math.exp(-j / (len * 0.25));
      }
    }
    this.crackle = crackle;
  }

  get running() {
    return this.ctx.state === 'running';
  }

  /** Fade master in/out. Suspends the context when muted to save CPU. */
  enable(on: boolean) {
    const ac = this.ctx as AudioContext;
    const now = ac.currentTime;
    const g = this.master.gain;
    g.cancelScheduledValues(now);
    g.setValueAtTime(g.value, now);
    if (on) {
      this.startBed();
      // A silent sample started inside the gesture unlocks audio on older iOS.
      const blip = ac.createBufferSource();
      blip.buffer = ac.createBuffer(1, 1, ac.sampleRate);
      blip.connect(ac.destination);
      blip.start();
      void ac.resume?.().catch(() => undefined);
      g.linearRampToValueAtTime(0.9, now + 1.5);
    } else {
      g.linearRampToValueAtTime(0, now + 0.35);
      window.setTimeout(() => {
        if (this.master.gain.value < 0.01) void ac.suspend?.().catch(() => undefined);
      }, 450);
    }
  }

  suspend() {
    void (this.ctx as AudioContext).suspend?.().catch(() => undefined);
  }

  close() {
    void (this.ctx as AudioContext).close?.().catch(() => undefined);
  }

  wave({ size, pan, up, hold, down }: WaveEvent) {
    if (!this.running) return;
    const ctx = this.ctx;
    const t = ctx.currentTime + 0.03;
    let out: AudioNode;
    if ('createStereoPanner' in ctx) {
      const p = ctx.createStereoPanner();
      p.pan.value = pan;
      out = p;
    } else {
      out = (ctx as BaseAudioContext).createGain();
    }
    out.connect(this.master);
    const end = t + up + hold + down + 1;
    const att = 0.45 + 0.5 * (1 - size); // gentle swell into the break

    // 1 · Weight: low body of the wave rolling in
    const body = ctx.createBiquadFilter();
    body.type = 'lowpass';
    body.frequency.value = 240;
    body.Q.value = 0.5;
    const bodyAmp = 0.1 + 0.32 * size ** 1.5;
    this.voice(this.brown, t, t + up + hold + 1.5, [body], out, (g) => {
      g.setValueAtTime(0.0001, t);
      g.linearRampToValueAtTime(bodyAmp, t + att * 0.9);
      g.exponentialRampToValueAtTime(bodyAmp * 0.3, t + att + up * 0.5);
      g.exponentialRampToValueAtTime(0.0001, t + up + hold + 1);
    });

    // 2 · The break and the rush up the sand
    const peak = 0.08 + 0.26 * size ** 1.2;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.Q.value = 0.6;
    lp.frequency.setValueAtTime(260, t);
    lp.frequency.linearRampToValueAtTime(600 + 2000 * size, t + att);
    lp.frequency.exponentialRampToValueAtTime(300, t + up + hold);
    this.voice(this.white, t, t + up + hold + 1, [lp], out, (g) => {
      g.setValueAtTime(0.0001, t);
      g.linearRampToValueAtTime(peak, t + att);
      g.exponentialRampToValueAtTime(peak * 0.35, t + att + up * 0.45);
      g.exponentialRampToValueAtTime(0.0001, t + up + hold + 0.8);
    });

    // 3 · Backwash: fizzing hiss + popping bubbles as the water drains
    const tb = t + up + hold * 0.5;
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 2600;
    const hiss = 0.008 + 0.025 * size;
    this.voice(this.white, t + att, end, [hp], out, (g) => {
      g.setValueAtTime(0.0001, t + att);
      g.linearRampToValueAtTime(hiss * 0.5, t + up * 0.7);
      g.linearRampToValueAtTime(hiss, tb + 0.6);
      g.exponentialRampToValueAtTime(0.0001, tb + down * 0.9);
    });
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 3400;
    bp.Q.value = 0.8;
    const pop = 0.05 + 0.12 * size;
    this.voice(this.crackle, t + att, end, [bp], out, (g) => {
      g.setValueAtTime(0.0001, t + att);
      g.linearRampToValueAtTime(pop * 0.4, t + up * 0.8);
      g.linearRampToValueAtTime(pop, tb + 0.5);
      g.exponentialRampToValueAtTime(0.0001, tb + down);
    });

    window.setTimeout(() => out.disconnect(), (end - ctx.currentTime + 0.5) * 1000);
  }

  private buffer(seconds: number, fill: () => number) {
    const sr = this.ctx.sampleRate;
    const b = this.ctx.createBuffer(1, Math.floor(sr * seconds), sr);
    const d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = fill();
    return b;
  }

  private voice(
    buf: AudioBuffer,
    start: number,
    stop: number,
    chain: AudioNode[],
    out: AudioNode,
    envelope: (g: AudioParam) => void,
  ) {
    const ctx = this.ctx;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const gain = ctx.createGain();
    envelope(gain.gain);
    let node: AudioNode = src;
    for (const n of chain) {
      node.connect(n);
      node = n;
    }
    node.connect(gain);
    gain.connect(out);
    src.start(start, Math.random() * buf.duration);
    src.stop(stop);
    src.onended = () => {
      src.disconnect();
      chain.forEach((n) => n.disconnect());
      gain.disconnect();
    };
  }

  /** Started lazily, after the browser allows audio. */
  private startBed() {
    if (this.bedStarted) return;
    this.bedStarted = true;
    const ctx = this.ctx;
    // Distant surf rumble, breathing slowly
    const rumble = ctx.createBufferSource();
    rumble.buffer = this.brown;
    rumble.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 380;
    lp.Q.value = 0.5;
    const g = ctx.createGain();
    g.gain.value = 0.035;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.05;
    const depth = ctx.createGain();
    depth.gain.value = 0.015;
    lfo.connect(depth);
    depth.connect(g.gain);
    rumble.connect(lp);
    lp.connect(g);
    g.connect(this.master);
    // Faint airy wash
    const air = ctx.createBufferSource();
    air.buffer = this.white;
    air.loop = true;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 900;
    bp.Q.value = 0.4;
    const g2 = ctx.createGain();
    g2.gain.value = 0.012;
    air.connect(bp);
    bp.connect(g2);
    g2.connect(this.master);
    rumble.start();
    air.start();
    lfo.start();
  }
}

/* ─────────────────────── Sound preference ─────────────────────── */
// Muted at the start of every visit; the visitor turns it on with the speaker icon.
// Kept outside React and read with useSyncExternalStore, so nothing has to copy
// it into state from an effect.

let soundPref = false;
const soundPrefListeners = new Set<() => void>();

const getSoundPref = () => soundPref;
const getSoundPrefOnServer = () => false;

function setSoundPref(on: boolean) {
  soundPref = on;
  soundPrefListeners.forEach((listener) => listener());
}

function subscribeSoundPref(listener: () => void) {
  soundPrefListeners.add(listener);
  return () => {
    soundPrefListeners.delete(listener);
  };
}

/* ───────────────────────────── Page ───────────────────────────── */

export default function Shoreline() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const idRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<SurfAudio | null>(null);
  const soundOn = useSyncExternalStore(subscribeSoundPref, getSoundPref, getSoundPrefOnServer);

  // Sea + render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { alpha: false });
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timeScale = reduceMotion ? 0.45 : 1;
    let surf: Surf | null = null;
    let atlas: Atlas | null = null;
    let firstSetup = true;
    let cw = 0;
    let ch = 0;

    const setup = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      cw = Math.max(Math.round(CELL_W * dpr), Math.ceil(canvas.width / MAX_COLS));
      ch = Math.round(cw * CELL_ASPECT);
      const cols = Math.ceil(canvas.width / cw);
      const rows = Math.ceil(canvas.height / ch);
      surf = new Surf(cols, rows, (Math.random() * 2 ** 31) | 0);
      surf.setLimit(reachLimit(idRef.current?.getBoundingClientRect(), cols, rows, cw, ch, dpr));
      // First load: a calm sea, then a big swell. After a resize: resume mid-rhythm.
      if (firstSetup) surf.introSwell(0.6);
      else surf.prewarm(6);
      firstSetup = false;
      surf.onWave = (e) => {
        const audio = audioRef.current;
        if (audio && getSoundPref()) audio.wave(e);
      };
      atlas = buildAtlas(cw, ch);
      draw(ctx, surf, atlas, cw, ch);
    };
    setup();

    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const elapsed = now - last;
      if (elapsed < 1000 / FPS - 2) return;
      last = now;
      if (!surf || !atlas) return;
      surf.step(Math.min(elapsed / 1000, 0.1) * timeScale);
      draw(ctx, surf, atlas, cw, ch);
    };
    raf = requestAnimationFrame(frame);

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(setup, 150);
    };
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  // Sound: muted until the visitor clicks the speaker icon. That click is also the
  // user gesture browsers require before a page may play audio.
  useEffect(() => {
    const audio = SurfAudio.create();
    if (!audio) return;
    audioRef.current = audio;
    const ac = audio.ctx as AudioContext;

    // Some browsers start audio on their own; keep it quiet unless sound is on.
    const onState = () => {
      if (ac.state === 'running' && !getSoundPref()) audio.suspend();
    };
    const onVisibility = () => {
      if (document.hidden) audio.suspend();
      else if (getSoundPref()) audio.enable(true);
    };
    ac.addEventListener('statechange', onState);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      ac.removeEventListener('statechange', onState);
      audio.close();
      audioRef.current = null;
    };
  }, []);

  const toggleSound = useCallback(() => {
    const next = !soundOn;
    setSoundPref(next);
    audioRef.current?.enable(next);
  }, [soundOn]);

  const label = soundOn ? 'Mute wave sounds' : 'Play wave sounds';

  return (
    <main style={{ position: 'fixed', inset: 0, background: BG, overflow: 'hidden', fontFamily: FONT_STACK }}>
      <style>{`
        .surf-link, .surf-sound { transition: color 160ms ease, opacity 160ms ease; }
        .surf-link { color: ${LINK_COLOR}; }
        .surf-sound { color: ${LINK_COLOR}; }
        .surf-link:hover, .surf-sound:hover { color: ${HOVER_COLOR}; }
        .surf-link:focus-visible, .surf-sound:focus-visible { outline: 1px solid ${HOVER_COLOR}; outline-offset: 2px; }
      `}</style>

      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Animated ASCII ocean waves washing in and out over a beach, seen from above"
        style={{ display: 'block', width: '100%', height: '100%' }}
      />

      <div
        ref={idRef}
        style={{
          position: 'fixed',
          left: 'clamp(20px, 4vw, 56px)',
          bottom: 'clamp(20px, 5vh, 48px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: -10 }}>
          <nav aria-label="Primary" style={{ display: 'flex', gap: 4 }}>
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="surf-link"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  minHeight: 44,
                  padding: '0 10px',
                  fontSize: 14,
                  textDecoration: 'none',
                }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            className="surf-sound"
            data-state={soundOn ? 'on' : 'off'}
            aria-label={label}
            aria-pressed={soundOn}
            title={label}
            onClick={toggleSound}
            style={{
              width: 44,
              height: 44,
              display: 'grid',
              placeItems: 'center',
              padding: 0,
              border: 0,
              borderRadius: 8,
              background: 'transparent',
              cursor: 'pointer',
            }}
          >
            <SoundIcon muted={!soundOn} />
          </button>
        </div>
      </div>
    </main>
  );
}

function SoundIcon({ muted }: { muted: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
      {muted ? (
        <path d="M16 9.5l5 5M21 9.5l-5 5" />
      ) : (
        <>
          <path d="M15.5 9a4.2 4.2 0 0 1 0 6" />
          <path d="M18.2 6.5a8 8 0 0 1 0 11" />
        </>
      )}
    </svg>
  );
}