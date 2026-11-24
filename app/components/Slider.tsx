"use client";

// Drag (or use arrow keys) to compare two same-sized screenshots.
// The "after" image sits underneath; the "before" image is clipped on top.

import Image, { type StaticImageData } from "next/image";
import { useState } from "react";

type Props = {
  before: StaticImageData;
  after: StaticImageData;
  beforeAlt: string;
  afterAlt: string;
};

const sizes = "(min-width: 540px) 540px, 100vw";

const glassLabel =
  "pointer-events-none absolute bottom-3 z-20 rounded-full border border-[#fafafa]/20 bg-[#08131D]/55 px-2.5 py-1 text-xs text-white/90 shadow-[0_2px_8px_rgb(0_0_0/0.2)] backdrop-blur-md";

export default function Slider({ before, after, beforeAlt, afterAlt }: Props) {
  const [pos, setPos] = useState(50);

  return (
    <div>
      <div
        className="relative w-full select-none overflow-hidden rounded-md border border-current/15"
        style={{ aspectRatio: `${after.width} / ${after.height}` }}
      >
        <Image src={after} alt={afterAlt} fill sizes={sizes} placeholder="blur" className="object-cover" />

        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Image src={before} alt={beforeAlt} fill sizes={sizes} placeholder="blur" className="object-cover" />
        </div>

        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label="Compare before and after"
          className="peer absolute inset-0 z-10 m-0 size-full cursor-ew-resize appearance-none opacity-0"
        />

        {/* Divider */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 z-20 w-[1.5px] -translate-x-1/2 bg-[#08131D] shadow-[0_0_10px_rgb(0_0_0/0.3)]"
          style={{ left: `${pos}%` }}
        />

        {/* Handle: soft pill with a grip */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 z-20 flex h-10 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-[3px] rounded-full border border-[#fafafa] bg-gradient-to-b from-[#13212d] to-[#08131D] shadow-[inset_0_1px_0_rgb(255_255_255/0.15),0_1px_2px_rgb(0_0_0/0.25),0_6px_18px_rgb(0_0_0/0.3)] peer-focus-visible:ring-2 peer-focus-visible:ring-white/70 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-black/40"
          style={{ left: `${pos}%` }}
        >
          <span className="h-3.5 w-px rounded-full bg-[#fafafa]" />
          <span className="h-3.5 w-px rounded-full bg-[#fafafa]" />
        </div>

        <span className={`${glassLabel} left-3`}>Before</span>
        <span className={`${glassLabel} right-3`}>After</span>
      </div>
    </div>
  );
}