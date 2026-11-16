"use client";

import { Fragment, useEffect, useRef, useState } from "react";

// Ruler, on cards: split-flap cards with white digits and a vertical seconds ruler to the right.
// Melt: when the visitor reaches the clock it melts, the time flips to 00:00, and it stays that way.

const DIGITS = "#ffffff";
const CARD_TOP = "linear-gradient(to bottom, #232323, #1c1c1c)"; // upper flap catches the light
const CARD_BOTTOM = "linear-gradient(to bottom, #171717, #1b1b1b)";
const ACCENT = "#e5482f"; // seconds pointer

const CARD_W = 66;
const CARD_H = 60;
const FONT_SIZE = 44;

// seconds ruler
const TICK = 4; // px per second
const FIRST = -15; // extra ticks above/below so the ruler never runs out
const LAST = 75;
const RULER_W = 34;
const FADE =
  "linear-gradient(to bottom, transparent, #000 14%, #000 86%, transparent)";
const ticks = Array.from({ length: LAST - FIRST + 1 }, (_, k) => FIRST + k);

// ---- melt ----

// "scroll": melts once enough of the clock has scrolled into view. "hover": melts when the pointer reaches it.
const TRIGGER = "scroll" as "scroll" | "hover";
const REVEAL = 0.25; // share of the clock that must be on screen for the melt to start (0.5 = half)
const MELT_DELAY = 300; // ms between reaching the clock and the melt starting
const MELT_MS = 2600; // how long the melt takes to reach full strength
const ZERO_AT = 900; // ms into the melt at which the time flips to 00:00
const ZERO_SECONDS = true; // also wind the seconds ruler round to 0 and stop it there
const WIND_MS = 1400; // how long the ruler takes to get there

// retro: the 70s stripes the drips and the digits' shadow are drawn in
const MUSTARD = "#ffc21f";
const ORANGE = "#ff6a1a";
const MAGENTA = "#ff2d87";
const TEAL = "#19c9b5";

// Displacement scales in px. A column drops by at most half its scale.
const BODY_DROP = 18; // the clock itself
const TRAILS = [
  // coloured stripes behind it, nearest first
  { color: MUSTARD, drop: 36 },
  { color: ORANGE, drop: 56 },
  { color: MAGENTA, drop: 78 },
  { color: TEAL, drop: 102 },
];
const SEED = 3; // which columns run; change it for a different drip pattern
const SPLIT = 1.6; // px the red and blue channels pull apart
const BLEED = 2.6; // px between the stripes of the digits' shadow
const TINT = 30; // % of its own colour each digit takes on

let meltCount = 0; // gives each clock on the page its own filter id

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const easeInOut = (x: number) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);

// feColorMatrix values that paint a shape one flat colour, keeping its alpha
function solid(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) =>
    (parseInt(hex.slice(i, i + 2), 16) / 255).toFixed(3)
  );
  return `0 0 0 0 ${r}  0 0 0 0 ${g}  0 0 0 0 ${b}  0 0 0 1 0`;
}
const ONLY_RED = "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0";
const ONLY_GREEN = "0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0";
const ONLY_BLUE = "0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0";

const css = `
.flip-top {
  transform-origin: bottom;
  backface-visibility: hidden;
  animation: flip-top 0.25s ease-in forwards;
}
.flip-bottom {
  transform-origin: top;
  backface-visibility: hidden;
  transform: rotateX(90deg);
  filter: brightness(0.55);
  animation: flip-bottom 0.25s ease-out 0.25s forwards;
}
@keyframes flip-top { to { transform: rotateX(-90deg); filter: brightness(0.55); } }
@keyframes flip-bottom { to { transform: rotateX(0deg); filter: brightness(1); } }
@media (prefers-reduced-motion: reduce) {
  .flip-top { display: none; }
  .flip-bottom { animation: none; transform: none; filter: none; }
}
/* trim the line box to the digits themselves, so they centre on the seam
   with equal space above and below whatever the font's metrics are */
.flip-digits {
  text-box: trim-both cap alphabetic;
  letter-spacing: -0.025em;
  margin-right: 0.025em; /* cancels the trailing letter-spacing so the pair stays centred */
}

/* ---- melt: only applies once [data-melting] is set; --m runs 0..1 ---- */

/* synesthesia: every digit has its own colour, and shows it as the melt takes hold */
[data-melting] [data-d] {
  color: hsl(var(--dh, 0) 100% calc(100% - var(--m, 0) * ${TINT}%));
}
[data-d="0"] { --dh: 44; }
[data-d="1"] { --dh: 20; }
[data-d="2"] { --dh: 332; }
[data-d="3"] { --dh: 172; }
[data-d="4"] { --dh: 262; }
[data-d="5"] { --dh: 4; }
[data-d="6"] { --dh: 88; }
[data-d="7"] { --dh: 200; }
[data-d="8"] { --dh: 300; }
[data-d="9"] { --dh: 150; }

/* retro: the digits grow a striped shadow that runs down the card */
[data-melting] .flip-digits {
  text-shadow:
    0 calc(var(--m, 0) * ${BLEED}px) 0 ${MUSTARD},
    0 calc(var(--m, 0) * ${BLEED}px * 2) 0 ${ORANGE},
    0 calc(var(--m, 0) * ${BLEED}px * 3) 0 ${MAGENTA},
    0 calc(var(--m, 0) * ${BLEED}px * 4) 0 ${TEAL};
}
`;

function Half({
  value,
  half,
  className = "",
}: {
  value: string;
  half: "top" | "bottom";
  className?: string;
}) {
  const isTop = half === "top";
  return (
    <div
      className={`absolute inset-x-0 overflow-hidden ${
        isTop ? "top-0 rounded-t-lg" : "bottom-0 rounded-b-lg"
      } ${className}`}
      style={{
        height: CARD_H / 2,
        background: isTop ? CARD_TOP : CARD_BOTTOM,
      }}
    >
      <span
        className="absolute inset-x-0 flex items-center justify-center"
        style={{ height: CARD_H, top: isTop ? 0 : -CARD_H / 2 }}
      >
        {/* one span per digit, so each can take its own colour in the melt */}
        <span className="flip-digits">
          {value.split("").map((ch, i) => (
            <span key={i} data-d={ch}>
              {ch}
            </span>
          ))}
        </span>
      </span>
    </div>
  );
}

function FlipCard({ value }: { value: string }) {
  const [shown, setShown] = useState(value);
  const [prev, setPrev] = useState(value);

  if (value !== shown) {
    setPrev(shown);
    setShown(value);
  }

  const flipped = prev !== shown;

  return (
    <div
      className="relative font-semibold leading-none tabular-nums"
      style={{
        width: CARD_W,
        height: CARD_H,
        fontSize: FONT_SIZE,
        color: DIGITS,
        perspective: 300,
      }}
    >
      <Half value={shown} half="top" />
      <Half value={flipped ? prev : shown} half="bottom" />
      {flipped && (
        <Fragment key={shown}>
          <Half value={prev} half="top" className="flip-top z-10" />
          <Half value={shown} half="bottom" className="flip-bottom z-10" />
        </Fragment>
      )}

      {/* lit top edge and a faint outline */}
      <div className="pointer-events-none absolute inset-0 z-20 rounded-lg shadow-[inset_0_1px_0_rgba(255,255,255,0.1),inset_0_0_0_1px_rgba(255,255,255,0.04)]" />

      {/* seam, with a hinge notch at each end */}
      <div className="absolute inset-x-0 top-1/2 z-20 h-px bg-black" />
      <div className="absolute left-0 top-1/2 z-20 h-[7px] w-[2px] -translate-y-[3px] bg-black" />
      <div className="absolute right-0 top-1/2 z-20 h-[7px] w-[2px] -translate-y-[3px] bg-black" />
    </div>
  );
}

export default function FlipClockRulerCards() {
  const [time, setTime] = useState<{ h: number; m: number } | null>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const [zeroed, setZeroed] = useState(false); // true once the melt has taken the time away
  const rootRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<SVGFilterElement>(null);

  useEffect(() => {
    let frame: number;
    let lastMinute = "";

    // ---- melt ----
    const root = rootRef.current;
    const filter = filterRef.current;
    if (filter && !filter.id) filter.id = `flip-clock-melt-${++meltCount}`;
    const find = (name: string) =>
      filter ? filter.querySelector(`[data-melt="${name}"]`) : null;
    const clockNode = find("body");
    const redNode = find("red");
    const blueNode = find("blue");
    const trailNodes = filter
      ? Array.from(filter.querySelectorAll('[data-melt="trail"]'))
      : [];

    // when the melt began; it happens once and is never undone
    let startAt: number | null = null;
    // if this effect re-runs on a clock that has already melted (dev refresh), carry on from fully melted
    if (root && root.hasAttribute("data-melting")) {
      startAt = performance.now() - MELT_MS;
    }
    let onScreen = true;
    let wind: { from: number; at: number } | null = null; // the ruler's run round to 0

    const startMelt = () => {
      if (startAt !== null) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      startAt = performance.now() + MELT_DELAY;
    };

    const paintMelt = (elapsed: number) => {
      if (!root || !filter) return;
      if (!root.hasAttribute("data-melting")) {
        root.setAttribute("data-melting", "");
        root.style.filter = `url(#${filter.id})`;
      }
      const m = easeInOut(clamp01(elapsed / MELT_MS));
      const breathe = 1 + 0.05 * Math.sin(elapsed / 380); // the drips never sit quite still
      if (clockNode) clockNode.setAttribute("scale", (BODY_DROP * m).toFixed(2));
      trailNodes.forEach((node, i) => {
        const trail = TRAILS[i];
        if (trail) node.setAttribute("scale", (trail.drop * m * breathe).toFixed(2));
      });
      const dx = SPLIT * m * (1 + 0.3 * Math.sin(elapsed / 70));
      if (redNode) redNode.setAttribute("dx", dx.toFixed(2));
      if (blueNode) blueNode.setAttribute("dx", (-dx).toFixed(2));
      root.style.setProperty("--m", m.toFixed(3));
    };

    const loop = () => {
      const now = new Date();
      const clock = performance.now();

      // advance the melt; once it is at full strength it only needs repainting while on screen
      const elapsed = startAt === null ? -1 : clock - startAt;
      if (elapsed >= 0 && (onScreen || elapsed < MELT_MS + 100)) paintMelt(elapsed);

      let sec = now.getSeconds() + now.getMilliseconds() / 1000;

      // part-way into the melt the time goes: the cards flip to 00:00...
      if (elapsed >= ZERO_AT && !wind) {
        wind = { from: sec, at: clock };
        setZeroed(true);
      }
      // ...and the ruler winds forward to 0 (drawn as 60) and stops
      if (wind && ZERO_SECONDS) {
        const t = easeOut(clamp01((clock - wind.at) / WIND_MS));
        sec = wind.from + (60 - wind.from) * t;
      }

      // slide the seconds ruler smoothly
      if (stripRef.current) {
        stripRef.current.style.transform = `translateY(${
          -(LAST - sec) * TICK
        }px)`;
      }

      // flip the cards only when the minute changes (visitor's local time)
      const h = now.getHours();
      const m = now.getMinutes();
      const key = `${h}:${m}`;
      if (key !== lastMinute) {
        lastMinute = key;
        setTime({ h, m });
      }

      frame = requestAnimationFrame(loop);
    };

    frame = requestAnimationFrame(loop);

    // start the melt the first time the visitor reaches the clock
    let reach: IntersectionObserver | null = null;
    let seen: IntersectionObserver | null = null;
    if (root && typeof IntersectionObserver !== "undefined") {
      seen = new IntersectionObserver((entries) => {
        const entry = entries[entries.length - 1];
        if (entry) onScreen = entry.isIntersecting;
      });
      seen.observe(root);
      if (TRIGGER === "scroll") {
        reach = new IntersectionObserver(
          (entries) => {
            if (entries.some((entry) => entry.intersectionRatio >= REVEAL)) startMelt();
          },
          { threshold: REVEAL }
        );
        reach.observe(root);
      }
    }
    if (root && TRIGGER === "hover") root.addEventListener("pointerenter", startMelt);

    return () => {
      cancelAnimationFrame(frame);
      if (reach) reach.disconnect();
      if (seen) seen.disconnect();
      if (root) root.removeEventListener("pointerenter", startMelt);
    };
  }, []);

  const hours = zeroed ? "00" : time ? String(time.h % 12 || 12).padStart(2, "0") : "";
  const minutes = zeroed ? "00" : time ? String(time.m).padStart(2, "0") : "";

  return (
    <div ref={rootRef} className="inline-flex items-stretch gap-1.5">
      <style>{css}</style>

      {/* The melt filter. It is applied to the clock when the melt starts, and its
          scale / dx values (0 here) are driven from the loop above. */}
      <svg aria-hidden="true" width={0} height={0} style={{ position: "absolute" }}>
        <filter
          ref={filterRef}
          x={-0.15}
          y={-0.4}
          width={1.3}
          height={2.6}
          colorInterpolationFilters="sRGB"
        >
          {/* tall, narrow noise: each column of the clock gets its own drip length */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.07 0.004"
            numOctaves={2}
            seed={SEED}
            result="noise"
          />
          {/* R: how far a column runs (only some do). G: a little sideways sway. 0.5 = no movement. */}
          <feComponentTransfer in="noise" result="map">
            <feFuncR
              type="table"
              tableValues="0.5 0.5 0.5 0.5 0.5 0.47 0.3 0.08 0 0 0"
            />
            <feFuncG type="linear" slope={0.1} intercept={0.45} />
            <feFuncA type="linear" slope={0} intercept={1} />
          </feComponentTransfer>

          {/* the stripes: the clock's silhouette, pulled further down and painted flat */}
          {TRAILS.map((trail, i) => (
            <Fragment key={i}>
              <feDisplacementMap
                in="SourceAlpha"
                in2="map"
                scale={0}
                xChannelSelector="G"
                yChannelSelector="R"
                result={`a${i}`}
                data-melt="trail"
              />
              <feColorMatrix
                in={`a${i}`}
                type="matrix"
                values={solid(trail.color)}
                result={`t${i}`}
              />
            </Fragment>
          ))}

          <feDisplacementMap
            in="SourceGraphic"
            in2="map"
            scale={0}
            xChannelSelector="G"
            yChannelSelector="R"
            result="body"
            data-melt="body"
          />
          <feMerge result="melted">
            {TRAILS.map((_, i) => (
              <feMergeNode key={i} in={`t${TRAILS.length - 1 - i}`} />
            ))}
            <feMergeNode in="body" />
          </feMerge>

          {/* pull the red and blue channels apart */}
          <feColorMatrix in="melted" type="matrix" values={ONLY_RED} result="red" />
          <feOffset in="red" dx={0} result="redShift" data-melt="red" />
          <feColorMatrix in="melted" type="matrix" values={ONLY_GREEN} result="green" />
          <feColorMatrix in="melted" type="matrix" values={ONLY_BLUE} result="blue" />
          <feOffset in="blue" dx={0} result="blueShift" data-melt="blue" />
          <feBlend in="redShift" in2="green" mode="screen" result="rg" />
          <feBlend in="rg" in2="blueShift" mode="screen" />
        </filter>
      </svg>

      <FlipCard value={hours} />
      <FlipCard value={minutes} />

      {/* seconds ruler */}
      <div
        className="relative ml-1.5 overflow-hidden border-l border-white/[0.08]"
        style={{ width: RULER_W, height: CARD_H }}
      >
        {/* the mask fades the ruler out at both ends, on any background */}
        <div
          className="absolute inset-0"
          style={{ maskImage: FADE, WebkitMaskImage: FADE }}
        >
          <div ref={stripRef} className="absolute inset-x-0 top-1/2 h-0">
            {ticks.map((i) => {
              const s = ((i % 60) + 60) % 60;
              const y = (LAST - i) * TICK;
              const major = s % 10 === 0;
              const mid = s % 5 === 0;
              return (
                <Fragment key={i}>
                  <div
                    className={`absolute left-0 h-px ${
                      major
                        ? "bg-[#8f8f8f]"
                        : mid
                        ? "bg-[#5c5c5c]"
                        : "bg-[#3d3d3d]"
                    }`}
                    style={{ top: y, width: major ? 10 : mid ? 7 : 4 }}
                  />
                  {major && (
                    <span
                      className="absolute left-4 text-[10px] font-medium leading-none tabular-nums text-white"
                      style={{ top: y - 5 }}
                      data-d={s / 10}
                    >
                      {s}
                    </span>
                  )}
                </Fragment>
              );
            })}
          </div>
        </div>

        {/* pointer */}
        <div
          className="absolute left-0 top-1/2 h-px w-3.5"
          style={{ background: ACCENT }}
        />
      </div>
    </div>
  );
}