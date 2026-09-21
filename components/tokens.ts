/* ==========================================================================
   SHARED TYPE TOKENS

   One definition, imported by the homepage and every case study, so the two
   can't drift. (They already did once: the case study carried a "same 480px
   column as the homepage" comment after the homepage had moved to 390px.)

   Plain strings, no "use client" — these import fine into both server and
   client components.

   FIVE TOKENS, and how the pages map onto them:

     showcaseName  case study h1
     name          homepage h1
     homeTitle     homepage h2
     body          bio, bullets, project rows, case study prose, the aside
     subtext       email

   Named sizes rather than arbitrary values, so they track Tailwind's scale:
   text-sm 14 · text-base 16 · text-lg 18 · text-xl 20.

   NOTE: arbitrary values like text-[#4338CA] must appear LITERALLY in the
   source. Tailwind scans files for complete class strings — it never runs
   your JS — so `text-[${SOME_CONST}]` generates nothing and the element
   silently falls back to inherited color. Whole strings like these are fine;
   interpolating INTO one is not.
   ========================================================================== */

/* ONE link behavior, everywhere: project titles, the back link, inline URLs,
   the social icons. At rest it's blue with no underline; on hover and on
   keyboard focus it goes one shade darker and the underline appears.

   TWO TOKENS, because the underline must NOT run under the icons.
   text-decoration is drawn by the element that declares it, and the line
   crosses inline-block children — setting anything on the icon won't lift
   it. So the <a> carries colour and hover, and a span around just the words
   carries the underline. Icons sit outside that span and stay clean.

     <a className={link}>
       <span className={linkText}>Back</span>
       <ArrowLeft />
     </a>

   `group` on the <a> is what lets the span react to hovering anywhere in the
   link, including over the icon.

   The line is a border-bottom, not text-decoration — the same mechanism
   iconLinkUnderline already uses for the social icons. A border only ever
   paints on the box it's set on, so it physically cannot reach the icon,
   whereas text-decoration is painted by the ancestor and crosses whatever
   sits in the line. It's also always drawn, just transparent, so only its
   colour animates and nothing reflows on hover.

   border-current means the line is always exactly the colour the link is at
   that moment, so the words and their underline can never disagree. */
export const link =
  "group text-[#4338CA] transition-colors duration-200 hover:text-[#3730A3] focus-visible:text-[#3730A3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4338CA]";

export const linkText =
  "border-b border-transparent transition-colors duration-200 group-hover:border-current group-focus-visible:border-current";

/* Icon-only links can't use `link`: text-decoration on a 32px flex box draws
   the line at the bottom of the box, nowhere near the 16px icon. So the
   underline is a border on an inner span sized to the icon itself.

   border-current picks up whatever color the anchor is at that moment, so
   the icon and its underline darken together and can never disagree. */
export const iconLink =
  "group flex h-8 w-8 items-center justify-center text-[#4338CA] transition-colors duration-200 hover:text-[#3730A3] focus-visible:text-[#3730A3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4338CA]";

export const iconLinkUnderline =
  "inline-flex border-b border-transparent pb-px transition-colors duration-200 group-hover:border-current group-focus-visible:border-current";

export const type = {
  body: "text-base leading-relaxed text-neutral-900",
  homeTitle: "text-[17px] font-medium leading-tight text-neutral-800",
  name: "text-lg font-semibold leading-tight text-neutral-700 tracking-tight",
  showcaseName:
    "text-xl font-semibold leading-tight text-neutral-700 tracking-tight max-w-[28ch]",
  subtext: "text-sm leading-normal text-neutral-900/70",
} as const;