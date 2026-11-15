"use client";

import { Fragment, useEffect, useRef, useState } from "react";

// Ruler, on cards: split-flap cards with white digits and a vertical seconds ruler to the right.

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
        <span className="flip-digits">{value}</span>
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

  useEffect(() => {
    let frame: number;
    let lastMinute = "";

    const loop = () => {
      const now = new Date();

      // slide the seconds ruler smoothly
      const sec = now.getSeconds() + now.getMilliseconds() / 1000;
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
    return () => cancelAnimationFrame(frame);
  }, []);

  const hours = time ? String(time.h % 12 || 12).padStart(2, "0") : "";
  const minutes = time ? String(time.m).padStart(2, "0") : "";

  return (
    <div className="inline-flex items-stretch gap-1.5">
      <style>{css}</style>

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