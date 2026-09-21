import type { ReactNode } from "react";

/* ==========================================================================
   ICONS

   Four inline SVGs, no dependency. Lucide or Heroicons would be the library
   answer, but neither ships a LinkedIn mark (brand logos are deliberately
   out of scope for both), so one icon would stay local regardless — and a
   package is a lot of surface for twelve lines of <path>.

   ALIGNMENT, baked in so no call site has to remember it:

     h-3 w-3        12px. Smaller than it looks like it should be. An arrow
                    is centered in its 24x24 viewBox, so the whole box reads
                    as the glyph; at 14px it would tower over the text.

     align-[-0.05em]  Nudges it down ~0.7px. Without any align, an inline
                    SVG's baseline is its BOTTOM edge, which parks the glyph
                    a pixel or two above the text's optical centre and reads
                    as floating. This is the "wonky" you were seeing.

   Why not centre it properly with align-middle: that puts the icon's midpoint
   at half the x-height, which pushes its bottom ~2.4px below the baseline —
   straight into the underline, which sits at a fixed 3px and does not move
   for tall children. Slightly high beats sliced through.

   Colour comes from currentColor, so these inherit the link token's blue and
   its hover shade for free. Never set a fill or stroke colour here.
   ========================================================================== */

type IconProps = { className?: string };

/* ---- Inline icons: sit inside a line of text ---------------------------- */

/** Leads the back link. Pass mr-1 for the gap. */
export function ArrowLeft({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={`inline-block h-3 w-3 align-[-0.05em] ${className}`}
    >
      <path d="M19 12H5M11 18l-6-6 6-6" />
    </svg>
  );
}

/** Trails any link leaving the site. Pass ml-1 for the gap. */
export function ExternalLink({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={`inline-block h-3 w-3 align-[-0.05em] ${className}`}
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <path d="M15 3h6v6M10 14 21 3" />
    </svg>
  );
}

/* ---- Standalone marks: sit in the social nav, not in text --------------- */

/** Brand mark — filled, not stroked, so it can't take strokeWidth. */
export function LinkedInMark(): ReactNode {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className="h-4 w-4"
    >
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.64h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.76V21h-4v-5.68c0-1.35-.03-3.1-1.94-3.1-1.94 0-2.24 1.48-2.24 3v5.78h-4V9Z" />
    </svg>
  );
}

/** Resume. Lighter stroke than the arrows — it has more internal detail, so
    a 2px stroke at 16px turns the lines into a blob. */
export function DocumentMark(): ReactNode {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="h-4 w-4"
    >
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
    </svg>
  );
}