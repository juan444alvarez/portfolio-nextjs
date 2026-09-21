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

   TWO EXPORTS: `link` and `iconLink`, plus the `type` scale.
   ========================================================================== */

/* ---- ONE link token, for every link with words in it --------------------

   It was briefly two — a text-decoration version for plain text and a
   border version for links containing an icon. This is the better answer,
   and it's the one your earlier layout already used.

   WHY A BORDER AND NOT text-decoration: text-decoration is never painted
   across an atomic inline, and an <svg> is one. So an underline would stop
   dead at a leading arrow or a trailing external mark. A border belongs to
   the anchor's own box, and an inline box's border runs the full length of
   its content — words and icons alike. That's what puts the line under the
   icon at both ends.

   INLINE, NOT inline-flex. Two things depend on it:

     - The border's height comes from the FONT, not from the tallest child.
       An inline non-replaced box sizes its content area from its own font
       metrics, so a 12px icon sitting in the line can't drag the underline
       down with it. (inline-flex would draw the line at the bottom of the
       flex box instead, which is the bug your old comment describes.)
     - The link wraps mid-sentence like any other text. An inline-flex link
       is one atomic block that can only move to the next line whole.

   WRAPPING NEEDS NOTHING EXTRA. There is no box-decoration-clone here, and
   an earlier version of this comment was wrong to claim it was required. A
   BOTTOM border is drawn on every fragment of a wrapped inline box under
   both `slice` and `clone` — rendered side by side, the two are identical.
   What `slice` actually suppresses is the border at the break points, which
   only affects left and right borders, plus how a background image or
   border-radius continues across lines. This token sets none of those, so
   the class was doing nothing and is gone.

   (Worth knowing if you ever switch to a gradient underline instead: THAT
   is a background, and it does need `clone` to restart per line.)

   The border is always present, just transparent, so only its colour changes
   on hover and nothing reflows. border-current ties it to whatever colour
   the link is, so the words and their line can never disagree.

   No focus-visible:outline on purpose. Dropping the custom ring hands
   keyboard users the browser's native focus indicator, which is better than
   anything worth hand-rolling and updates itself with the platform — and
   focus-visible:border-current means they still get the underline. */
export const link =
  "text-accent border-b border-transparent hover:border-current focus-visible:border-current";

/* Icon-only links — the social nav. Same border mechanism, for a starker
   version of the same reason: there's no text here at all for a
   text-decoration to attach to.

   p-1 is load-bearing: the icon is 16px, and the padding takes the whole
   target to 24×24, the WCAG 2.2 minimum for a pointer target. */
export const iconLink =
  "inline-flex items-center border-b border-transparent p-1 text-accent hover:border-current focus-visible:border-current";

/* FIVE TYPE TOKENS, and how the pages map onto them:

     name          homepage h1 (Juan Alvarez), and case study section
                   headings (Problem, Approach, Outcome) — same role in the
                   hierarchy, one step under the page's own title
     subtext       email, figure captions
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