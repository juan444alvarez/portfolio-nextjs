"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";

/* Before/after slider.

   "Before" sits underneath. "After" sits on top, clipped to the right of the
   divider, so dragging the handle right uncovers more of Before and dragging
   it left uncovers more of After. Swap the two props to flip the sides.
   Each label lives inside its own layer, so it wipes away with its image.

   Divider: vertical by default. Pass `diagonal` for a 45° line instead. The
   box has a fixed aspect ratio, so a 45° line always runs (50 / aspect)% of
   the width either side of mid-height, and the line, the clip and the handle
   are all derived from one number, `pos` (where the divider crosses
   mid-height, in % of the width).

   In diagonal mode the range runs far enough for the line to leave the box on
   either side, so each image can be shown in full. When only part of the line
   is inside the box, the handle rides the middle of that part.

   Images of different sizes: set `aspect` to the box you want (the page uses
   the After screenshot's own ratio so it shows in full). Any image with a
   different ratio is scaled to fill the box width and cropped by object-cover,
   anchored to `position` (top by default, so only the bottom is trimmed). */

type Side = {
  src: string;
  alt: string;
  /** CSS object-position for the crop, e.g. "top", "center", "left top" */
  position?: string;
};

const label =
  "absolute bottom-[2.5cqw] rounded-full border border-white/25 bg-black px-[2.6cqw] py-[1.3cqw] text-[length:max(9px,2.4cqw)] leading-none text-white";

export function BeforeAfterSlider({
  before,
  after,
  aspect = 2,
  sizes = "480px",
  initial = 50,
  diagonal = false,
  className = "",
}: {
  before: Side;
  after: Side;
  /** width / height of the box (default 2, i.e. 2:1) */
  aspect?: number;
  sizes?: string;
  /** starting position, 0 to 100 */
  initial?: number;
  /** 45° divider instead of a vertical one */
  diagonal?: boolean;
  className?: string;
}) {
  const lean = diagonal ? 50 / aspect : 0; // half the line's horizontal run, % of width
  const k = lean / 50; // % of width the line travels per % of height
  const min = -lean; // line fully off the left: all After
  const max = 100 + lean; // line fully off the right: all Before

  const [pos, setPos] = useState(initial);
  const box = useRef<HTMLDivElement>(null);
  const grab = useRef<number | null>(null);

  const clamp = (v: number) => Math.min(max, Math.max(min, v));

  // The divider passes through the pointer, so work back to where it crosses
  // mid-height. This keeps the handle under the finger in diagonal mode too.
  const posAt = (e: PointerEvent) => {
    const r = box.current!.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    return x - (50 - y) * k;
  };

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    grab.current = posAt(e) - pos; // no jump when grabbing off-centre
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (grab.current === null) return;
    setPos(clamp(posAt(e) - grab.current));
  };
  const onUp = () => {
    grab.current = null;
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 10 : 2;
    if (e.key === "ArrowLeft") setPos((p) => clamp(p - step));
    else if (e.key === "ArrowRight") setPos((p) => clamp(p + step));
    else if (e.key === "Home") setPos(min);
    else if (e.key === "End") setPos(max);
    else return;
    e.preventDefault();
  };

  // Where the divider meets the top and bottom edges, in % of width.
  const top = pos + lean;
  const bottom = pos - lean;

  // Handle: middle of the part of the line that is inside the box.
  const yLo = diagonal ? Math.max(0, 50 - (100 - pos) * aspect) : 0;
  const yHi = diagonal ? Math.min(100, 50 + pos * aspect) : 100;
  const handleY = (yLo + yHi) / 2;
  const handleX = pos + (50 - handleY) * k;

  return (
    <div
      ref={box}
      className={`border-overlay @container relative w-full select-none overflow-hidden rounded-sm bg-neutral-200 ${className}`}
      style={{ aspectRatio: aspect }}
    >
      <Image
        src={before.src}
        alt={before.alt}
        fill
        sizes={sizes}
        draggable={false}
        className="object-cover"
        style={{ objectPosition: before.position ?? "top" }}
        priority
      />
      <span aria-hidden="true" className={`${label} left-[2.5cqw]`}>
        Before
      </span>

      <div
        className="absolute inset-0 bg-white"
        style={{
          clipPath: `polygon(${top}% 0, 100% 0, 100% 100%, ${bottom}% 100%)`,
        }}
      >
        <Image
          src={after.src}
          alt={after.alt}
          fill
          sizes={sizes}
          draggable={false}
          className="object-cover"
          style={{ objectPosition: after.position ?? "top" }}
          priority
        />
        <span aria-hidden="true" className={`${label} right-[2.5cqw]`}>
          After
        </span>
      </div>

      {/* viewBox is 1 unit = 1% of height, so a 100 x 100 run is exactly 45° */}
      <svg
        viewBox={`0 0 ${aspect * 100} 100`}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full"
        style={{ filter: "drop-shadow(0 0 1px rgb(0 0 0 / 0.3))" }}
      >
        <line
          x1={top * aspect}
          y1="0"
          x2={bottom * aspect}
          y2="100"
          stroke="#fff"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div
        role="slider"
        tabIndex={0}
        aria-label="Compare before and after"
        aria-orientation="horizontal"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(((pos - min) / (max - min)) * 100)}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onKeyDown={onKey}
        className="absolute z-10 grid h-10 w-8 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize touch-none place-items-center rounded-lg bg-white text-black shadow-[0_1px_4px_rgb(0_0_0/0.3)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        style={{
          // keep the whole handle inside the box when the line is at an edge
          left: `clamp(18px, ${handleX}%, calc(100% - 18px))`,
          top: `clamp(22px, ${handleY}%, calc(100% - 22px))`,
        }}
      >
        <svg
          viewBox="0 0 20 12"
          aria-hidden="true"
          className="h-3 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 1.5 1.5 6 6 10.5" />
          <path d="M14 1.5 18.5 6 14 10.5" />
        </svg>
      </div>
    </div>
  );
}