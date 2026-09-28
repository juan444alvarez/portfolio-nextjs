"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/* ==========================================================================
   HOVER LINES

   Hover (or keyboard-focus) any element marked `data-hover-lines` and a fresh
   random set of blue lines draws across the screen, steering around the
   element marked `data-hover-lines-avoid`. Leave it and they retract.

   Each set stays random but leans one way: most lines gather on one or two
   sides and sweep diagonally, leaving open space elsewhere, and any set that
   would frame the content (lines wrapping all the way around it) is redrawn.

   Everything lives in this file: no CSS in globals.css. The lines sit in a
   layer attached straight to <body>, so nothing inside <main> (the grid, the
   ViewTransition wrapper, the column) can clip or shift them.

   Setup
     1. HomeShell renders <HoverLines /> once and puts data-hover-lines-avoid
        on the content column.
     2. Put data-hover-lines on any link that should trigger it.
   ========================================================================== */

type Config = {
  style: "chaos" | "corners" | "echoes";
  cornerMode: "all" | "one";
  lines: number;
  strokeWidth: number;
  colors: string[];
  wobble: number;
  variety: number;
  crossers: number;
  pad: number;
  drawDuration: number;
  stagger: number;
  easing: string;
  startFrom: "start" | "end";
  exit: "retract" | "fade" | "instant";
  exitDuration: number;
  layer: "over" | "behind";
  lean: number;
  diagonal: number;
  frameGuard: number;
};

const CONFIG: Config = {
  style: "chaos", // "chaos" edge to edge | "corners" | "echoes" of the original squiggle
  cornerMode: "all", // corners only: "all" four corners, or "one" per hover
  lines: 10,
  strokeWidth: 7.5, // px
  colors: ["#1D35E0", "#2F4BFF", "#3D7BFF", "#5B9BFF", "#2563C9", "#7FB2FF", "#4450D9"],
  wobble: 0.25, // 0 = straight, 1 = very loopy
  variety: 0.6, // spread of width and speed between lines
  crossers: 0, // share of lines allowed through the content
  pad: 0, // px kept clear around the content
  drawDuration: 1300, // ms
  stagger: 60, // ms between each line starting
  easing: "cubic-bezier(0.22, 1, 0.36, 1)",
  startFrom: "start", // each line draws from its "start" or its "end"
  exit: "retract", // "retract" | "fade" | "instant"
  exitDuration: 500, // ms
  layer: "over", // "over" or "behind" the content
  lean: 0.7, // share of lines that gather on one or two sides; 0 = spread evenly
  diagonal: 0.75, // share of lines that sweep diagonally
  frameGuard: 0.7, // most of the space around the content lines may wrap past; 1 = off
};

type Pt = [number, number];
type Seg = [Pt, Pt, Pt, Pt];
type Box = { x0: number; y0: number; x1: number; y1: number };

const R = Math.random;
const r1 = (n: number) => Math.round(n * 10) / 10;
const pick = <T,>(xs: T[]) => xs[Math.floor(R() * xs.length)];
const inside = (x: number, y: number, z: Box) =>
  x > z.x0 && x < z.x1 && y > z.y0 && y < z.y1;

/* ---- the block to avoid: a tight box around what's actually drawn ---- */
function contentBlock(el: Element): Box | null {
  const range = document.createRange();
  let box: Box | null = null;
  const add = (r: DOMRect) => {
    if (r.width === 0 || r.height === 0) return;
    box = box
      ? { x0: Math.min(box.x0, r.left), y0: Math.min(box.y0, r.top), x1: Math.max(box.x1, r.right), y1: Math.max(box.y1, r.bottom) }
      : { x0: r.left, y0: r.top, x1: r.right, y1: r.bottom };
  };
  for (const child of Array.from(el.children)) {
    range.selectNodeContents(child);
    add(range.getBoundingClientRect());
  }
  if (!box) add(el.getBoundingClientRect());
  const b = box as Box | null;
  const p = CONFIG.pad;
  return b && { x0: b.x0 - p, y0: b.y0 - p, x1: b.x1 + p, y1: b.y1 + p };
}

/* ---- curve helpers ---- */
// Catmull-Rom through the points, as cubic Bézier segments
function segments(pts: Pt[]): Seg[] {
  const segs: Seg[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] ?? p2;
    segs.push([
      p1,
      [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6],
      [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6],
      p2,
    ]);
  }
  return segs;
}

// how many sampled points of the curve land inside the block
function hits(segs: Seg[], z: Box) {
  let n = 0;
  for (const [a, b, c, d] of segs) {
    for (let k = 0; k <= 32; k++) {
      const t = k / 32, u = 1 - t;
      const x = u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0];
      const y = u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1];
      if (inside(x, y, z)) n++;
    }
  }
  return n;
}

function toD(segs: Seg[]) {
  let d = `M${r1(segs[0][0][0])} ${r1(segs[0][0][1])}`;
  for (const [, b, c, e] of segs)
    d += `C${r1(b[0])} ${r1(b[1])} ${r1(c[0])} ${r1(c[1])} ${r1(e[0])} ${r1(e[1])}`;
  return d;
}

// a point just past one screen edge (0 left, 1 top, 2 right, 3 bottom)
function edgePoint(edge: number, W: number, H: number): Pt {
  if (edge === 0) return [-40, R() * H];
  if (edge === 1) return [R() * W, -40];
  if (edge === 2) return [W + 40, R() * H];
  return [R() * W, H + 40];
}

/* Wavy points from a to b. `spread` shapes how far each point may swing off
   the straight line, by how far along it is (0 to 1). */
function wavy(a: Pt, b: Pt, W: number, H: number, spread: (t: number) => number): Pt[] {
  const n = 4 + Math.floor(R() * 3);
  const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1;
  const amp = CONFIG.wobble * Math.min(W, H) * 0.35;
  const pts: Pt[] = [a];
  for (let k = 1; k < n; k++) {
    const t = k / n, off = (R() * 2 - 1) * amp * spread(t);
    pts.push([a[0] + dx * t - (dy / len) * off, a[1] + dy * t + (dx / len) * off]);
  }
  pts.push(b);
  return pts;
}

/* ---- composition: where this set of lines gathers ---- */
/* Each hover picks one or two headings (directions from the content). Lines
   that "lean" gather along those headings; the rest go anywhere. */

type Plan = { C: Pt; heads: number[]; weights: number[] };

const gauss = () => (R() + R() + R() - 1.5) * 2; // about -3..3, mostly -1..1

function plan(W: number, H: number, z: Box | null): Plan {
  const C: Pt = z ? [(z.x0 + z.x1) / 2, (z.y0 + z.y1) / 2] : [W / 2, H / 2];
  const h = R() * Math.PI * 2;
  if (R() < 0.55) {
    // a second, smaller cluster somewhere off to the side or opposite
    const h2 = h + (R() < 0.5 ? 1 : -1) * (Math.PI / 2 + R() * Math.PI / 2);
    return { C, heads: [h, h2], weights: [0.65, 0.35] };
  }
  return { C, heads: [h], weights: [1] };
}

// a heading for one line: near one of the plan's headings, or anywhere
function heading(p: Plan): number {
  if (R() >= CONFIG.lean) return R() * Math.PI * 2;
  const i = R() < p.weights[0] ? 0 : p.heads.length - 1;
  return p.heads[i] + gauss() * 0.35; // about ±40°
}

// how far a ray from (x, y) at `ang` travels before leaving the rectangle
function exitDist(x: number, y: number, ang: number, x0: number, y0: number, x1: number, y1: number) {
  const dx = Math.cos(ang), dy = Math.sin(ang);
  const tx = dx > 1e-9 ? (x1 - x) / dx : dx < -1e-9 ? (x0 - x) / dx : Infinity;
  const ty = dy > 1e-9 ? (y1 - y) / dy : dy < -1e-9 ? (y0 - y) / dy : Infinity;
  return Math.max(0, Math.min(tx, ty));
}

// a direction for one line: usually a diagonal, sometimes anything
function direction(): number {
  if (R() < CONFIG.diagonal) return Math.PI / 4 + Math.floor(R() * 4) * (Math.PI / 2) + gauss() * 0.25;
  return R() * Math.PI * 2;
}

// wavy points from a, through m, to b (so the line can bend at m)
function wavyVia(a: Pt, m: Pt, b: Pt, W: number, H: number): Pt[] {
  const short = (p: Pt, q: Pt) => Math.hypot(q[0] - p[0], q[1] - p[1]) < 140;
  if (short(a, m) || short(m, b)) return wavy(a, b, W, H, () => 1);
  const amp = CONFIG.wobble * Math.min(W, H) * 0.35;
  const half = (p: Pt, q: Pt, n: number) => {
    const dx = q[0] - p[0], dy = q[1] - p[1], len = Math.hypot(dx, dy) || 1;
    const pts: Pt[] = [];
    for (let k = 1; k < n; k++) {
      const t = k / n, off = (R() * 2 - 1) * amp * Math.min(1, len / 600);
      pts.push([p[0] + dx * t - (dy / len) * off, p[1] + dy * t + (dx / len) * off]);
    }
    return pts;
  };
  // one bend about every 300px, so the curve never overshoots into a hook
  const count = (p: Pt, q: Pt) => Math.max(1, Math.round(Math.hypot(q[0] - p[0], q[1] - p[1]) / (260 + R() * 120)));
  return [a, ...half(a, m, count(a, m)), m, ...half(m, b, count(m, b)), b];
}

/* ---- the three styles ---- */
// chaos: a sweep across the whole screen through a point on this line's heading
function chaosLine(W: number, H: number, z: Box | null, p: Plan): Seg[] {
  const ang = heading(p);
  const [cx, cy] = p.C;
  const toScreen = exitDist(cx, cy, ang, 0, 0, W, H);
  const toBlock = z ? exitDist(cx, cy, ang, z.x0, z.y0, z.x1, z.y1) : 0;
  const room = Math.max(0, toScreen - toBlock - 20);
  const d = toBlock + 20 + R() * room;
  const A: Pt = [cx + Math.cos(ang) * d, cy + Math.sin(ang) * d];
  const out = direction();
  const back = out + Math.PI + gauss() * 0.4; // most lines bend a little, some a lot
  const fwd = exitDist(A[0], A[1], out, -40, -40, W + 40, H + 40);
  const bwd = exitDist(A[0], A[1], back, -40, -40, W + 40, H + 40);
  const a: Pt = [A[0] + Math.cos(back) * bwd, A[1] + Math.sin(back) * bwd];
  const b: Pt = [A[0] + Math.cos(out) * fwd, A[1] + Math.sin(out) * fwd];
  return segments(R() < 0.5 ? wavyVia(a, A, b, W, H) : wavyVia(b, A, a, W, H));
}

// the screen corner (0 TL, 1 TR, 2 BR, 3 BL) most in the direction `ang`
function nearestCorner(W: number, H: number, ang: number) {
  const corners = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
  let best = 0, bestDot = -Infinity;
  corners.forEach(([sx, sy], i) => {
    const dot = sx * W * Math.cos(ang) + sy * H * Math.sin(ang);
    if (dot > bestDot) { bestDot = dot; best = i; }
  });
  return best;
}

// corners: out of the corner nearest this line's heading, to a far edge
function cornerLine(W: number, H: number, p: Plan, fixed: number | null): Seg[] {
  const corner = fixed ?? nearestCorner(W, H, heading(p));
  const cx = corner === 0 || corner === 3 ? -40 : W + 40; // 0 TL, 1 TR, 2 BR, 3 BL
  const cy = corner === 0 || corner === 1 ? -40 : H + 40;
  const a: Pt = [cx + (cx < 0 ? -1 : 1) * R() * 30, cy + (cy < 0 ? -1 : 1) * R() * 30];
  const farX = cx < 0 ? W + 40 : -40, farY = cy < 0 ? H + 40 : -40;
  const b: Pt = R() < 0.5 ? [farX, R() * H] : [R() * W, farY];
  return segments(wavy(a, b, W, H, (t) => 0.3 + t * 1.2));
}

const ORIGINAL = "M-18 565.254C109.694 520.672 202.93 542.963 286.032 650.366C363.054 749.663 389.403 895.568 472.505 956.362C555.608 1019.18 652.898 954.336 683.301 846.933C715.731 733.451 695.462 601.73 663.032 472.036C630.602 338.289 636.683 212.648 707.624 139.695C784.645 60.6632 896.124 64.7161 983.28 131.59C1072.46 198.463 1175.83 224.807 1281.23 184.278C1374.47 147.801 1443.38 84.9808 1490 10.0015";
const ORIGINAL_NUMS = (ORIGINAL.match(/-?\d*\.?\d+/g) ?? []).map(Number);

// echoes: the original squiggle, turned and flipped, centred along this line's heading
function echoLine(W: number, H: number, p: Plan): Seg[] {
  const s = Math.max(W / 1440, H / 991) * (0.8 + R() * 0.5);
  const flipX = R() < 0.5 ? -1 : 1, flipY = R() < 0.5 ? -1 : 1;
  const turn = (R() * 2 - 1) * 0.45, cos = Math.cos(turn), sin = Math.sin(turn);
  const ang = heading(p), shift = 0.1 + R() * 0.25;
  const ox = W / 2 + Math.cos(ang) * W * shift, oy = H / 2 + Math.sin(ang) * H * shift;
  const jit = CONFIG.wobble * 90;
  const P = (i: number): Pt => {
    const x = (ORIGINAL_NUMS[i] - 720) * s * flipX, y = (ORIGINAL_NUMS[i + 1] - 495) * s * flipY;
    return [ox + x * cos - y * sin + (R() * 2 - 1) * jit, oy + x * sin + y * cos + (R() * 2 - 1) * jit];
  };
  const segs: Seg[] = [];
  let prev = P(0);
  for (let i = 2; i + 5 < ORIGINAL_NUMS.length; i += 6) {
    const end = P(i + 4);
    segs.push([prev, P(i), P(i + 2), end]);
    prev = end;
  }
  return segs;
}

/* ---- the framing check ---- */
/* Looks at the space around the content, out to 40% of the screen height,
   split into 16 directions. A direction counts as "wrapped" when some line
   there runs across it (around the content) rather than toward it. Returns
   the share of directions wrapped, and the widest empty gap in degrees.
   Measured on your screenshots: the framed sets wrapped 81–100% with gaps
   of 0–50°, the ones you liked wrapped 56–69% with gaps of 60–165°. */
function enclosure(lines: Seg[][], H: number, z: Box | null) {
  if (!z) return { wrap: 0, gap: 360 };
  const cx = (z.x0 + z.x1) / 2, cy = (z.y0 + z.y1) / 2, band = 0.4 * H;
  const wrapped = new Array(16).fill(0), inked = new Array(72).fill(0);
  for (const segs of lines) {
    for (const [a, b, c, d] of segs) {
      let px = a[0], py = a[1];
      for (let k = 1; k <= 24; k++) {
        const t = k / 24, u = 1 - t;
        const x = u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0];
        const y = u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1];
        const sx = x - px, sy = y - py, step = Math.hypot(sx, sy);
        px = x; py = y;
        const ex = Math.max(z.x0 - x, 0, x - z.x1), ey = Math.max(z.y0 - y, 0, y - z.y1);
        if (step === 0 || Math.hypot(ex, ey) > band) continue;
        const rx = x - cx, ry = y - cy, rl = Math.hypot(rx, ry) || 1;
        const ang = Math.atan2(ry, rx) + Math.PI;
        inked[Math.floor((ang / (Math.PI * 2)) * 72) % 72] += step;
        if (Math.abs((rx * sx + ry * sy) / (rl * step)) < 0.5)
          wrapped[Math.floor((ang / (Math.PI * 2)) * 16) % 16] += step;
      }
    }
  }
  const wrap = wrapped.filter((v) => v >= 12).length / 16;
  let gap = 0, run = 0;
  for (let i = 0; i < 144; i++) {
    run = inked[i % 72] >= 4 ? 0 : run + 1;
    gap = Math.max(gap, Math.min(run, 72));
  }
  return { wrap, gap: gap * 5 };
}

/* ---- one full set of lines ---- */
function composeOnce(W: number, H: number, z: Box | null): { lines: Seg[][]; stray: number } {
  const p = plan(W, H, z);
  // corners, one per hover: the corner nearest the main heading
  const oneCorner = CONFIG.style === "corners" && CONFIG.cornerMode === "one" ? nearestCorner(W, H, p.heads[0]) : null;
  const lines: Seg[][] = [];
  let stray = 0; // lines that should have missed the content but didn't
  for (let i = 0; i < CONFIG.lines; i++) {
    const avoid = !!z && R() >= CONFIG.crossers;
    let best: Seg[] = [], bestHits = Infinity;
    for (let tries = 0; tries < (avoid ? 40 : 1); tries++) {
      const segs =
        CONFIG.style === "echoes" ? echoLine(W, H, p)
        : CONFIG.style === "corners" ? cornerLine(W, H, p, oneCorner)
        : chaosLine(W, H, z, p);
      const h = avoid && z ? hits(segs, z) : 0;
      if (h < bestHits) { best = segs; bestHits = h; }
      if (h === 0) break;
    }
    if (bestHits > 0 && avoid) stray++;
    lines.push(best);
  }
  return { lines, stray };
}

// draw sets until one passes the framing check with no line through the
// content by mistake (otherwise keep the best of the tries)
function compose(W: number, H: number, z: Box | null): Seg[][] {
  let best: Seg[][] = [], bestScore = Infinity;
  for (let attempt = 0; attempt < 24; attempt++) {
    const { lines, stray } = composeOnce(W, H, z);
    if (!z) return lines;
    const { wrap, gap } = CONFIG.frameGuard >= 1 ? { wrap: 0, gap: 360 } : enclosure(lines, H, z);
    const framed = CONFIG.frameGuard < 1 && (wrap > CONFIG.frameGuard || gap < 55);
    if (!framed && stray === 0) return lines;
    const score = stray * 10 + (framed ? wrap - gap / 1000 : 0);
    if (score < bestScore) { best = lines; bestScore = score; }
  }
  return best;
}

function buildLines(W: number, H: number, z: Box | null) {
  return compose(W, H, z).map((segs) => ({
    d: toD(segs),
    w: 1 + (R() * 2 - 1) * 0.7 * CONFIG.variety,
    t: 1 + (R() * 2 - 1) * 0.45 * CONFIG.variety,
    color: pick(CONFIG.colors),
  }));
}

/* ---- drawing, with the Web Animations API (no CSS needed) ---- */
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hiddenOffset = () => (CONFIG.startFrom === "end" ? -1 : 1);

function drawIn(svg: SVGSVGElement) {
  const W = window.innerWidth, H = window.innerHeight;
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  const avoidEl = document.querySelector("[data-hover-lines-avoid]");
  const z = avoidEl ? contentBlock(avoidEl) : null;
  const reduce = reducedMotion();

  svg.replaceChildren();
  buildLines(W, H, z).forEach((line, i) => {
    const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p.setAttribute("d", line.d);
    p.setAttribute("pathLength", "1");
    Object.assign(p.style, {
      fill: "none",
      stroke: line.color,
      strokeWidth: `${(CONFIG.strokeWidth * line.w).toFixed(2)}px`,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeDasharray: "1",
      strokeDashoffset: reduce ? "0" : String(hiddenOffset()),
    });
    svg.appendChild(p);
    if (reduce) {
      p.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, fill: "both" });
    } else {
      p.animate(
        [{ strokeDashoffset: hiddenOffset() }, { strokeDashoffset: 0 }],
        { duration: CONFIG.drawDuration * line.t, delay: i * CONFIG.stagger, easing: CONFIG.easing, fill: "both" },
      );
    }
  });
}

function drawOut(svg: SVGSVGElement) {
  const paths = Array.from(svg.querySelectorAll("path"));
  if (CONFIG.exit === "instant") { svg.replaceChildren(); return; }
  const fade = CONFIG.exit === "fade" || reducedMotion();
  for (const p of paths) {
    // freeze each line where it is right now, then animate out from there
    const now = getComputedStyle(p).strokeDashoffset;
    p.getAnimations().forEach((a) => a.cancel());
    p.style.strokeDashoffset = now;
    if (fade) {
      p.animate([{ opacity: 1 }, { opacity: 0 }], { duration: CONFIG.exitDuration, easing: "ease", fill: "forwards" });
    } else {
      p.animate(
        [{ strokeDashoffset: now }, { strokeDashoffset: hiddenOffset() }],
        { duration: CONFIG.exitDuration, easing: CONFIG.easing, fill: "forwards" },
      );
    }
  }
}

/* ---- the component: mount once, in HomeShell ---- */
export function HoverLines() {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const [svg, setSvg] = useState<SVGSVGElement | null>(null);

  // the layer goes on <body>, which only exists in the browser
  useEffect(() => setHost(document.body), []);

  useEffect(() => {
    if (!svg) return;
    let active: Element | null = null;

    const triggerOf = (e: Event) =>
      (e.target as Element | null)?.closest?.("[data-hover-lines]") ?? null;

    const enter = (e: Event) => {
      const t = triggerOf(e);
      if (!t || t === active) return;
      active = t;
      drawIn(svg);
    };
    const leave = (e: Event) => {
      const t = triggerOf(e);
      if (!t || t !== active) return;
      const to = (e as MouseEvent | FocusEvent).relatedTarget as Node | null;
      if (to && t.contains(to)) return; // still inside the link
      active = null;
      drawOut(svg);
    };

    document.addEventListener("mouseover", enter);
    document.addEventListener("focusin", enter);
    document.addEventListener("mouseout", leave);
    document.addEventListener("focusout", leave);
    return () => {
      document.removeEventListener("mouseover", enter);
      document.removeEventListener("focusin", enter);
      document.removeEventListener("mouseout", leave);
      document.removeEventListener("focusout", leave);
    };
  }, [svg]);

  if (!host) return null;
  return createPortal(
    <svg
      ref={setSvg}
      aria-hidden
      fill="none"
      preserveAspectRatio="none"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: CONFIG.layer === "behind" ? 0 : 50,
      }}
    />,
    host,
  );
}