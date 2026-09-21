import Link from "next/link";
import { CaseStudyShell } from "@/components/Shell";
import { ArrowLeft } from "@/components/icons";
import { backLink, type } from "@/components/tokens";
import { caseStudy } from "@/content/case-studies";

/* Images live in this folder, beside this file. Uncomment alongside the
   <Figure> block further down. Also uncomment the Figure import itself. */
// import { Figure } from "@/components/Figure";
// import { LiveSitePill } from "@/components/LiveSitePill";
// import contentAudit from "./content-audit.png";
// import releaseFlow from "./release-flow.png";

/* ==========================================================================
   CASE STUDY — CalPERS   →   app/work/calpers/page.tsx   →   /work/calpers

   THIS FILE IS THE TEMPLATE. Copy it for a new case study and change two
   things: the slug passed to caseStudy(), and the prose in <section>.

   The folder name IS the URL, and it must match the slug in
   content/case-studies.ts. caseStudy() only accepts a slug that exists in
   that file, so a mismatch is now a type error here rather than a 404 on
   click.

   Nothing about the page frame lives in this file — no <main>, no
   background, no column width, no transition wrapper. <CaseStudyShell> owns
   all four. That's deliberate: the previous version of this page carried its
   own <main>, forgot bg-background (so it rendered on the black body), was
   never wrapped for the transition (so the slide-in never fired), and had
   drifted to a 480px column while the homepage moved to 390px. None of those
   are reachable from here any more.

   No "use client" — this is static text, so it renders on the server.
   ========================================================================== */

const study = caseStudy("calpers");

/* Short tab title. The layout's template turns this into
   "CalPERS — Juan Alvarez" — the full project title would be unreadable in
   a tab, a bookmark, or a link preview. */
export const metadata = { title: study.client };

export default function Page() {
  return (
    <CaseStudyShell>
      {/* ---- Back link ---------------------------------------------- */}
      {/* backLink, not link. The two exist because text-decoration is never
          painted across an <svg>, so a link with an icon in it needs a
          border-bottom to get one continuous line under arrow and word.
          tokens.ts has the full reasoning; nothing here needs to know it. */}
      <Link href="/" className={`text-sm ${backLink}`}>
        <ArrowLeft />
        Back
      </Link>

      {/* ---- Title ------------------------------------------------- */}
      {/* Client above, project below. The h1 is the work itself, and it's the
          same string the homepage links with — both read it from
          content/case-studies.ts, so they can't disagree. */}
      <header className="mt-8">
        <p className={type.subtext}>{study.client}</p>
        <h1 className={`mt-1 ${type.showcaseName}`}>{study.title}</h1>
      </header>

      {/* ---- Body -------------------------------------------------- */}
      {/* Add paragraphs here. gap-3 spaces them, so no margins per <p>. */}
      <section className="mt-4 flex flex-col gap-3">
        <p className={`${type.body} text-pretty`}>
          Supported projects across the software development lifecycle, working
          alongside engineering to keep design decisions grounded in what could
          actually ship.
        </p>

        {/* ---- The live site link, and images ----------------------
            Drop image files in THIS folder, next to page.tsx, then
            uncomment both the imports at the top and the block below. No
            width or height — the import carries the real dimensions. Add
            `wide` to break past the 480px column, up to 760px.

            The imports must be uncommented too, or the build fails on an
            undefined name. A missing FILE fails the same way, naming the
            path it couldn't find — so the error always tells you which half
            you forgot.

            THE PILL GOES ABOVE THE FIGURE, not on it. It states a fact
            about the project before you show the work; laid over the
            screenshot it would have to fight whatever pixels are behind it.

        <LiveSitePill href="https://www.calpers.ca.gov" />

        <Figure
          priority
          src={contentAudit}
          alt="The content audit spreadsheet, with 400 pages scored against four criteria"
          caption="Every page scored before a single one was rewritten."
        />

        <Figure
          wide
          src={releaseFlow}
          alt="The release flow, from discovery through to QA sign-off"
          caption="Where design decisions entered the development cycle."
        />

            For anything else that needs more room than the column — a
            table, a side-by-side, a full-bleed hero — wrap it yourself:

        <Breakout size="full">…</Breakout>
        ------------------------------------------------------------- */}
      </section>
    </CaseStudyShell>
  );
}