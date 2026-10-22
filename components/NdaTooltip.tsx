"use client";

import { useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

const OFFSET = 14; // px between cursor and tooltip

type Tip = { x: number; y: number; flipX: boolean; flipY: boolean };

export function NdaTooltip({
  children,
  className,
  message = "NDA - please reach out for more info",
}: {
  children: ReactNode;
  className?: string;
  message?: string;
}) {
  const [tip, setTip] = useState<Tip | null>(null);

  /* Flip the tooltip to the other side of the cursor near the right/bottom
     viewport edges so it never gets clipped. 240 / 64 are rough tooltip sizes. */
  const placeAt = (x: number, y: number) =>
    setTip({
      x,
      y,
      flipX: x > window.innerWidth - 240,
      flipY: y > window.innerHeight - 64,
    });

  return (
    <>
      <span
        tabIndex={0}
        className={className}
        onMouseEnter={(e) => placeAt(e.clientX, e.clientY)}
        onMouseMove={(e) => placeAt(e.clientX, e.clientY)}
        onMouseLeave={() => setTip(null)}
        onFocus={(e) => {
          // Keyboard users get the tooltip too, anchored under the text.
          // :focus-visible skips mouse clicks so it doesn't jump away from the cursor.
          if (!e.currentTarget.matches(":focus-visible")) return;
          const r = e.currentTarget.getBoundingClientRect();
          placeAt(r.left, r.bottom - OFFSET);
        }}
        onBlur={() => setTip(null)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setTip(null);
        }}
      >
        {children}
        {/* The visual tooltip is aria-hidden, so screen readers get the message here. */}
        <span className="sr-only"> ({message})</span>
      </span>

      {/* Portaled to <body> so no parent overflow/transform (e.g. view
          transitions) can clip or offset the fixed positioning. */}
      {tip &&
        createPortal(
          <div
            aria-hidden
            className="pointer-events-none fixed z-50 whitespace-nowrap rounded-md bg-neutral-900 px-2.5 py-1.5 text-xs font-medium text-white shadow-lg"
            style={{
              left: tip.x,
              top: tip.y,
              transform: `translate(${
                tip.flipX ? `calc(-100% - ${OFFSET}px)` : `${OFFSET}px`
              }, ${tip.flipY ? `calc(-100% - ${OFFSET}px)` : `${OFFSET}px`})`,
            }}
          >
            {message}
          </div>,
          document.body,
        )}
    </>
  );
}