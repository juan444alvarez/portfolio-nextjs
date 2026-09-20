/* ==========================================================================
   SHARED TYPE TOKENS

   One definition, imported by the homepage and every case study, so the two
   can't drift. (They already did once: the case study carried a "same 480px
   column as the homepage" comment after the homepage had moved to 390px.)

   Plain strings, no "use client" — these import fine into both server and
   client components.

   NOTE: arbitrary values like text-[#4338CA] must appear LITERALLY in the
   source. Tailwind scans files for complete class strings — it never runs
   your JS — so `text-[${SOME_CONST}]` generates nothing and the element
   silently falls back to inherited color. Whole strings like these are fine;
   interpolating INTO one is not.
   ========================================================================== */

/* Warm blue — indigo-leaning rather than cyan-leaning, so it sits with the
   warm grey background. Contrast on #ededed is 6.75:1, clearing AA (4.5:1)
   for normal text with room to spare. */
export const link =
  "text-[#4338CA] hover:text-[#3730A3] transition-colors duration-200";

export const type = {
  /* Person's name on home; case study title. */
  name: "text-[18px] font-semibold leading-tight text-neutral-800",
  subtext: "text-[13px] leading-none text-neutral-600",
  body: "text-[16px] leading-[1.6] text-neutral-700 text-pretty",
  section: "text-[16px] font-semibold text-neutral-700",
  /* Work rows are running prose, not card text — 1.6 leading so the wrapped
     lines breathe the way the about paragraph does. */
  row: "text-[15px] leading-[1.6] text-neutral-700 text-pretty",
  /* Asides and footnotes — same measure as body, one step quieter. */
  note: "text-[16px] leading-[1.6] text-neutral-600 text-pretty",
} as const;