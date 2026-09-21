import type { ReactNode } from "react";

/* ==========================================================================
   ICONS

   Three inline SVGs, no dependency. Lucide or Heroicons would be the library
   answer, but neither ships a LinkedIn mark (brand logos are deliberately
   out of scope for both), so one icon would stay local regardless — and a
   package is a lot of surface for nine lines of <path>.

   ExternalLink left when the homepage lost its external project links, and
   came back for the live-site pill. That isn't churn — the two cases are
   different: the homepage links only to its own case studies, while a case
   study legitimately points at the live site it produced.

   NONE OF THESE SIT IN A LINE OF TEXT ANY MORE. Every one is a flex child —
   ArrowLeft inside the back link, the two marks inside the social nav — so
   the container's items-center does the vertical alignment. That's why there
   is no vertical-align anywhere below: a flex item is blockified, and
   vertical-align simply doesn't apply to it. (The long align-[-0.05em]
   nudge this file used to carry existed for the old inline arrow, and left
   with it.)

   Sizes are baked in so no call site has to remember them — and so no call
   site can set a conflicting h-/w- utility, where the winner would come
   down to Tailwind's class order rather than intent.

   Colour comes from currentColor, so these inherit the accent blue for free.
   Never set a fill or stroke colour here.
   ========================================================================== */

type IconProps = { className?: string };

/* ---- Back link arrow --------------------------------------------------- */

/** Leads the back link, as the first flex child. No margin needed — the
    link's gap-1.5 sets the spacing.

    14px to match the 14px text beside it: an arrow is centered in its 24x24
    viewBox, so the whole box reads as the glyph. shrink-0 stops flex from
    squeezing it if the link ever lands in a tight column.

    NO VERTICAL NUDGE, AND THAT'S A MEASURED RESULT rather than a shrug.

    There are two defensible references for centring an icon against text.
    Against all-lowercase text you align to the x-height centre; against
    mixed-case text — "Back", with an ascending B — you align to the
    cap-height centre, halfway between baseline and cap height.

    Geist happens to make the second one free. Its ascender is 1.005em and
    its cap height plus descender is 0.710 + 0.295 = 1.005em: identical. Work
    through the line-box arithmetic and those two facts cancel, so with
    leading-none the middle of the line box lands EXACTLY on the cap-height
    centre. At text-sm both come out at 7.00px from the top. items-center is
    already correct, to zero error.

    (An earlier version of this file nudged the arrow down 1px, computed
    against the x-height centre at 8.26px. That's the right reference for
    lowercase-only text and the wrong one here. If your eye prefers the lower
    position anyway, add translate-y-px — and use a transform rather than
    mt-px, because margin on a flex item counts toward the line height and
    would drag the hover border down with it.) */
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
      className={`h-3.5 w-3.5 shrink-0 ${className}`}
    >
      <path d="M19 12H5M11 18l-6-6 6-6" />
    </svg>
  );
}

/** Trails the live-site pill's label. Sized 12px against the pill's 13px
    text, so it reads as a hint rather than competing with the words.

    Same zero-nudge result as ArrowLeft, for the same reason: the pill's
    label is mixed case, its line-height is 1, and Geist's metrics put the
    cap-height centre exactly at the middle of the line box. The pill's CSS
    fades it to 55% opacity — don't set a colour here. */
export function ExternalLink({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={`h-3 w-3 shrink-0 ${className}`}
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <path d="M15 3h6v6M10 14 21 3" />
    </svg>
  );
}

/* ---- Social nav marks -------------------------------------------------- */

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

/** Resume. Lighter stroke than the arrow — it has more internal detail, so
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