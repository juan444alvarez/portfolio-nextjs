/* Shared class strings. Plain strings, no "use client" — these import into
   server and client components alike.

   Colours come from the `accent` utility that globals.css generates. Don't
   write a hex here: an arbitrary value only becomes a class if that exact
   string appears in source, so interpolating a constant produces nothing. */

/* Every link with words in it. A plain text-decoration underline on hover —
   which means it stops before a trailing external icon, and that's the
   conventional look. */
export const link =
  "text-accent decoration-1 underline-offset-[3px] hover:underline focus-visible:underline";

/* The back control: a round icon-only button, so there are no words for an
   underline to sit under. 36px clears the 24px WCAG minimum for a pointer
   target. The tint is over --background, so it follows if that changes. */
export const backButton =
  "flex size-9 shrink-0 items-center justify-center rounded-full bg-black/[0.04] text-accent transition duration-150 hover:bg-black/[0.08] active:scale-[0.96]";

/* body          bio, bullets, project rows, case study prose
   name          homepage h1, and case study section headings
   homeTitle     homepage h2
   showcaseName  case study h1
   subtext       email, captions */
export const type = {
  body: "text-base leading-[1.5625] text-neutral-900",
  homeTitle: "text-[17px] font-medium leading-snug text-neutral-800",
  name: "text-lg font-semibold leading-snug tracking-tight text-neutral-700",
  showcaseName:
    "max-w-[28ch] text-xl font-semibold leading-snug tracking-tight text-neutral-700",
  subtext: "text-sm text-neutral-900/80",
} as const;
