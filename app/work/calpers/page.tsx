import Link from "next/link";
import { CaseStudyShell } from "@/components/Shell";
import { ArrowLeft } from "@/components/icons";
import { link, type } from "@/components/tokens";
import { caseStudy } from "@/content/case-studies";

/* Captioned images live in this folder, beside this file. Uncomment these
   alongside the <Figure> block further down. */
// import { Figure } from "@/components/Figure";
// import contentAudit from "./content-audit.png";

/* ==========================================================================
   CASE STUDY — CalPERS   →   app/work/calpers/page.tsx   →   /work/calpers

   THIS FILE IS THE TEMPLATE. Copy it for a new case study and change two
   things: the slug passed to caseStudy(), and the prose.

   The folder name IS the URL, and it must match the slug in
   content/case-studies.ts. caseStudy() only accepts a slug that exists in
   that file, so a mismatch is a type error here rather than a 404 on click.

   Nothing about the page frame lives in this file — no <main>, no
   background, no column width, no vertical alignment, no transition wrapper.
   <CaseStudyShell> owns all five. That's deliberate: the previous version of
   this page carried its own <main>, forgot bg-background (so it rendered on
   the black body), was never wrapped for the transition (so the slide-in
   never fired), and had drifted to a 480px column while the homepage moved
   to 390px. None of those are reachable from here any more.

   SPACING IS MARGINS, NOT A FLEX GAP. The rhythm isn't uniform — mt-2 under
   the back link, mt-3 under the title, mt-6 before a new section — and one
   gap value can't express that. See app/work/ebara/page.tsx for the fuller
   version of this layout, with a hero and an external link.

   No "use client" — this is static text, so it renders on the server.
   ========================================================================== */

const study = caseStudy("calpers");

/* Short tab title; the layout's template appends the name. */
export const metadata = { title: study.client };

export default function Page() {
  return (
    <CaseStudyShell>
      {/* ---- Back link ---------------------------------------------- */}
      {/* Untagged on purpose — no transitionTypes — so the return trip is
          instant, matching the browser's own back button. The underline runs
          under the arrow because `link` draws it as a border on the anchor,
          not as a text-decoration that would stop at the glyph. */}
      <Link href="/" className={`${link} text-sm font-medium`}>
        <ArrowLeft className="mr-1" />
        Back
      </Link>

      {/* ---- Title --------------------------------------------------- */}
      <h1 className={`mt-2 ${type.showcaseName}`}>{study.title}</h1>

      {/* ---- Body ---------------------------------------------------- */}
      <p className={`mt-3 ${type.body}`}>
        Supported projects across the software development lifecycle, working
        alongside engineering to keep design decisions grounded in what could
        actually ship.
      </p>

      {/* ---- A section ----------------------------------------------- */}
      {/* type.name is the section-heading token: one step under this page's
          own title. Copy this block per section. */}
      <section className="mt-6" aria-labelledby="problem">
        <h2 id="problem" className={type.name}>
          Problem
        </h2>
        <p className={`mt-3 ${type.body}`}>
          Replace this with the real copy.
        </p>
      </section>

      {/* ---- Adding a captioned image --------------------------------
          Drop the file in THIS folder, next to page.tsx, then uncomment the
          two imports at the top and the block below. No width or height —
          the static import carries the real dimensions. Add `wide` to break
          past the 480px column, up to 760px.

          Both imports must be uncommented, or the build fails on an
          undefined name; a missing FILE fails the same way, naming the path
          it couldn't find. So the error always tells you which half you
          forgot.

          For a HERO, don't use Figure — see the fixed-aspect block in
          app/work/ebara/page.tsx and the note explaining why.

      <Figure
        src={contentAudit}
        alt="The content audit spreadsheet, with 400 pages scored against four criteria"
        caption="Every page scored before a single one was rewritten."
      />

          For anything else needing more room than the column — a table, a
          side-by-side — wrap it yourself:

      <Breakout size="full">…</Breakout>
          ------------------------------------------------------------- */}
    </CaseStudyShell>
  );
}