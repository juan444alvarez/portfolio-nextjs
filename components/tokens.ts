/* ==========================================================================
   SHARED TOKENS

   One definition, imported by the home page and every showcase, so the two
   can't drift. Plain strings, no "use client" — these import into server
   and client components alike.

     name          home page h1, showcase section headings
     showcaseName  showcase h1
     homeTitle     home page h2
     body          bio, bullets, showcase rows, showcase prose
     subtext       small text under the name
     caption       under showcase images

   NOTE: Tailwind only generates classes it can find written out in full in
   the source, so never build these by joining fragments at runtime.
   ========================================================================== */

const heading = "font-semibold leading-tight tracking-tight text-neutral-700";

export const type = {
  body: "text-base leading-relaxed text-pretty text-neutral-900",
  subtext: "text-sm leading-normal text-neutral-900/80",
  homeTitle: "text-[17px] font-medium leading-tight text-neutral-800",
  name: `text-lg ${heading}`,
  showcaseName: `max-w-[28ch] text-xl ${heading}`,
  caption: "text-sm leading-normal text-neutral-900/80 text-center text-balance",
} as const;

/* Text links: accent blue, underline appears on hover or keyboard focus. */
export const link =
  "text-accent underline-offset-4 decoration-1 hover:underline focus-visible:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

/* The icon-only "back to home" link at the top of each showcase. 32px hit
   area; the negative margin lines the icon itself up with the text below. */
export const backButton =
  "-ml-2 inline-flex h-8 w-8 items-center justify-center rounded-sm text-accent transition-transform duration-200 hover:-translate-x-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
