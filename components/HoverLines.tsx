"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/* ==========================================================================
   HOVER LINES

   Hover (or keyboard-focus) any element marked `data-hover-lines` and a fresh
   random set of blue lines draws across the screen, steering around the
   element marked `data-hover-lines-avoid`. Leave it and they retract.

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
    for (let k = 1; k <= 10; k++) {
      const t = k / 10, u = 1 - t;
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

// nudge a point that landed in the block out through its nearest side
function pushOut([x, y]: Pt, z: Box): Pt {
  const dl = x - z.x0, dr = z.x1 - x, dt = y - z.y0, db = z.y1 - y;
  const m = Math.min(dl, dr, dt, db), j = 20 + R() * 60;
  if (m === dl) return [z.x0 - j, y];
  if (m === dr) return [z.x1 + j, y];
  if (m === dt) return [x, z.y0 - j];
  return [x, z.y1 + j];
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
function wavy(a: Pt, b: Pt, z: Box | null, avoid: boolean, W: number, H: number, spread: (t: number) => number): Pt[] {
  const n = 4 + Math.floor(R() * 3);
  const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1;
  const amp = CONFIG.wobble * Math.min(W, H) * 0.35;
  const pts: Pt[] = [a];
  for (let k = 1; k < n; k++) {
    const t = k / n, off = (R() * 2 - 1) * amp * spread(t);
    let p: Pt = [a[0] + dx * t - (dy / len) * off, a[1] + dy * t + (dx / len) * off];
    if (avoid && z && inside(p[0], p[1], z)) p = pushOut(p, z);
    pts.push(p);
  }
  pts.push(b);
  return pts;
}

/* ---- the three styles ---- */
function chaosLine(W: number, H: number, z: Box | null, avoid: boolean): Seg[] {
  const e1 = Math.floor(R() * 4), e2 = (e1 + 1 + Math.floor(R() * 3)) % 4;
  return segments(wavy(edgePoint(e1, W, H), edgePoint(e2, W, H), z, avoid, W, H, () => 1));
}

function cornerLine(W: number, H: number, z: Box | null, avoid: boolean, corner: number): Seg[] {
  const cx = corner === 0 || corner === 3 ? -40 : W + 40; // 0 TL, 1 TR, 2 BR, 3 BL
  const cy = corner === 0 || corner === 1 ? -40 : H + 40;
  const a: Pt = [cx + (cx < 0 ? -1 : 1) * R() * 30, cy + (cy < 0 ? -1 : 1) * R() * 30];
  const farX = cx < 0 ? W + 40 : -40, farY = cy < 0 ? H + 40 : -40;
  const b: Pt = R() < 0.5 ? [farX, R() * H] : [R() * W, farY];
  return segments(wavy(a, b, z, avoid, W, H, (t) => 0.3 + t * 1.2));
}

const ORIGINAL = "M-18 565.254C109.694 520.672 202.93 542.963 286.032 650.366C363.054 749.663 389.403 895.568 472.505 956.362C555.608 1019.18 652.898 954.336 683.301 846.933C715.731 733.451 695.462 601.73 663.032 472.036C630.602 338.289 636.683 212.648 707.624 139.695C784.645 60.6632 896.124 64.7161 983.28 131.59C1072.46 198.463 1175.83 224.807 1281.23 184.278C1374.47 147.801 1443.38 84.9808 1490 10.0015";
const ORIGINAL_NUMS = (ORIGINAL.match(/-?\d*\.?\d+/g) ?? []).map(Number);

function echoLine(W: number, H: number): Seg[] {
  const s = Math.max(W / 1440, H / 991) * (0.8 + R() * 0.5);
  const flipX = R() < 0.5 ? -1 : 1, flipY = R() < 0.5 ? -1 : 1;
  const turn = (R() * 2 - 1) * 0.45, cos = Math.cos(turn), sin = Math.sin(turn);
  const ox = W / 2 + (R() * 2 - 1) * W * 0.2, oy = H / 2 + (R() * 2 - 1) * H * 0.2;
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

function buildLines(W: number, H: number, z: Box | null) {
  const oneCorner = Math.floor(R() * 4);
  const out: { d: string; w: number; t: number; color: string }[] = [];
  for (let i = 0; i < CONFIG.lines; i++) {
    const avoid = !!z && R() >= CONFIG.crossers;
    const corner = CONFIG.cornerMode === "one" ? oneCorner : Math.floor(R() * 4);
    let best: Seg[] = [], bestHits = Infinity;
    for (let tries = 0; tries < (avoid ? 40 : 1); tries++) {
      const segs =
        CONFIG.style === "echoes" ? echoLine(W, H)
        : CONFIG.style === "corners" ? cornerLine(W, H, z, avoid, corner)
        : chaosLine(W, H, z, avoid);
      const h = avoid && z ? hits(segs, z) : 0;
      if (h < bestHits) { best = segs; bestHits = h; }
      if (h === 0) break;
    }
    out.push({
      d: toD(best),
      w: 1 + (R() * 2 - 1) * 0.7 * CONFIG.variety,
      t: 1 + (R() * 2 - 1) * 0.45 * CONFIG.variety,
      color: pick(CONFIG.colors),
    });
  }
  return out;
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
