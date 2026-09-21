/* ==========================================================================
   CASE STUDY INDEX   →   content/case-studies.ts

   The single source of truth for which case studies exist and what they're
   called. The homepage maps over this list; each case study page pulls its
   own entry out of it by slug. Neither one hardcodes a title.

   WHY THIS FILE EXISTS: the old setup kept the list on the homepage and the
   heading inside each page.tsx. A slug that didn't match a folder compiled,
   rendered, and 404'd only when someone clicked it — and a retitled project
   could disagree with its own page. Both failure modes are now compile
   errors, because `caseStudy()` only accepts a slug that appears below.

   TO ADD A CASE STUDY — two steps, in this order:
     1. Add an entry here.
     2. Create app/work/<slug>/page.tsx and call caseStudy("<slug>").
   The folder name IS the URL and must match the slug exactly.

   TO REMOVE ONE: delete the entry, and TypeScript will point at the orphaned
   page.tsx rather than letting it linger as a dead route.
   ========================================================================== */

/* `as const` is what makes the slugs a literal union instead of just string.
   Without it, caseStudy("clapers") would typecheck. */
export const CASE_STUDIES = [
  {
    slug: "ebara",
    client: "Ebara Technologies",
    title: "Untangling information architecture through end-to-end UX research",
    outcome:
      "Cut average product findability time by ~50% with a mega menu design.",
  },
  {
    slug: "calpers",
    client: "CalPERS",
    title: "Aligning content strategy with the software development lifecycle",
    outcome: "Supported project teams from discovery through release.",
  },
  {
    slug: "insightsearch",
    client: "Veeva Systems",
    title: "Driving UX strategy for AI-powered document search",
    outcome:
      "Reconciled design goals with engineering constraints ahead of build.",
  },
] as const;

/** "ebara" | "calpers" | "insightsearch" — derived, never typed by hand. */
export type Slug = (typeof CASE_STUDIES)[number]["slug"];

export type CaseStudy = (typeof CASE_STUDIES)[number];

/** Look up one entry. The Slug parameter type is the guardrail: a typo or a
    stale slug is a red squiggle in the page that uses it, not a 404 later. */
export function caseStudy(slug: Slug): CaseStudy {
  const found = CASE_STUDIES.find((study) => study.slug === slug);

  /* Unreachable given the type above, but the runtime check is what lets the
     return type be CaseStudy instead of CaseStudy | undefined — so call
     sites don't need a null check. */
  if (!found) throw new Error(`No case study with slug "${slug}".`);

  return found;
}

/** The public URL for an entry. One definition, so a route shape change is
    one edit. */
export function caseStudyHref(study: CaseStudy): string {
  return `/work/${study.slug}`;
}
