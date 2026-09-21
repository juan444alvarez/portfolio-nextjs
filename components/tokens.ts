/* ==========================================================================
   SHARED TOKENS

   Plain strings, no "use client" — these import fine into both server and
   client components.

   Colours come from the `accent` utility, which globals.css generates from
   --accent. Never write a hex in this file. An arbitrary value — text-,
   then a bracketed hex — only exists as a class if that exact string appears
   somewhere in your source, because Tailwind scans text and never runs your
   JS. So interpolating a constant into one silently produces nothing, and
   the element falls back to inherited colour with no error. Utilities
   generated from a CSS variable have no such trap.

   (This comment deliberately doesn't spell that class out: the scanner reads
   comments too, and would happily generate a utility from one.)

   THREE EXPORTS: `link`, `backLink`, `iconLink`, plus the `type` scale.
   ========================================================================== */

/* ---- Why there are two link tokens --------------------------------------

   Not a style preference — a CSS rule. text-decoration is never painted
   across an ATOMIC INLINE, and an <svg> is one. No decoration-* utility can
   reach it; there is no Tailwind-side fix, because there is no CSS-side fix.

   So:
     link      text only (project titles). Real text-decoration underline.
     backLink  text + an icon. The line is a border-bottom instead, which is
               painted by the box and therefore spans everything inside it —
               arrow, gap and word as one continuous line.

   NO `group` IN EITHER ONE. A group exists so a CHILD can react to its
   parent being hovered; that's what the old `linkText` span needed. Here the
   border lives on the anchor itself, which is also the thing being hovered,
   so hover: applies directly. The wrapper span and the group both go away.

   Behaviour is identical across both: blue at rest, line appears on hover
   and on keyboard focus, colour never changes. One signal, one state.

   No focus-visible:outline on purpose. Dropping the custom ring hands
   keyboard users the browser's native focus indicator, which is better than
   anything worth hand-rolling and updates itself with the platform. */

/* Text-only links: project titles, inline URLs, anything mid-sentence. */
export const link =
  "text-accent decoration-1 underline-offset-[3px] hover:underline focus-visible:underline";

/* The back link — text with a leading arrow.

   WHY THE LINE LANDS IN THE SAME PLACE AS `link`'s UNDERLINE — this is
   measured against Geist's real metrics (ascent 1.005em, descent 0.295em,
   so a content area of 1.30em), not eyeballed:

     leading-none  makes the line box exactly the font size, 14px at
                   text-sm. The 18.2px content area overflows it and centres,
                   which puts the baseline 11.97px down and the bottom of the
                   box 2.03px BELOW the baseline.
     pb-px         adds the missing 0.97px, landing the border at baseline
                   +3.03px. `link` puts the titles' underline at baseline
                   +3.00px. border-b is 1px, matching decoration-1.

   A 0.03px difference — the same line, to well under a device pixel.

   If you change the back link's font size, that arithmetic moves: at
   text-base the box bottom is 2.32px below the baseline, so the matching
   padding is 0.68px and pb-px would overshoot by a third of a pixel. Either
   way it's a 1px knob — pb-0 / pb-px / pb-0.5 — and nothing else in the
   layout moves when you turn it.

   border-transparent → hover:border-current means the border is ALWAYS
   drawn, just invisible, so only its colour changes and nothing reflows.
   border-current ties it to whatever colour the link is, so the line and the
   words can never disagree.

   pt-2 with -mt-2 cancelling it: the padding grows the hit area upward to
   ~23px without moving a single pixel of what you see, since the negative
   margin pulls the box up by exactly what the padding pushed the content
   down. A 15px-tall standalone link is a small target otherwise.

   No transition — the underline on `link` snaps, so this snaps too. */
export const backLink =
  "inline-flex items-center gap-1.5 border-b border-transparent pt-2 -mt-2 pb-px leading-none text-accent hover:border-current focus-visible:border-current";

/* Icon-only links (the social nav). Same border mechanism as backLink, for
   the same reason — there's no text here at all for a decoration to attach
   to.

   p-1 is load-bearing: the icon is 16px, and the padding takes the whole
   target to 24×24, the WCAG 2.2 minimum for a pointer target. It also puts
   the border 4px below the glyph, close to the 3px the text links use. */
export const iconLink =
  "inline-flex border-b border-transparent p-1 text-accent hover:border-current focus-visible:border-current";

/* FIVE TYPE TOKENS, and how the pages map onto them:

     name          homepage h1 (Juan Alvarez)
     subtext       email; case study client eyebrow
     homeTitle     homepage h2 (Featured Work Experience)
     showcaseName  case study h1
     body          bio, bullets, project rows, case study prose

   Named sizes rather than arbitrary values, so they track Tailwind's scale:
   text-sm 14 · text-base 16 · text-lg 18 · text-xl 20. */
export const type = {
  body: "text-base leading-relaxed text-neutral-900",
  homeTitle: "text-[17px] font-medium leading-tight text-neutral-800",
  name: "text-lg font-semibold leading-tight tracking-tight text-neutral-700",
  showcaseName:
    "max-w-[28ch] text-xl font-semibold leading-tight tracking-tight text-neutral-700",
  subtext: "text-sm leading-normal text-neutral-900/80",
} as const;