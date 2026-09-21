import Image from "next/image";
import Link from "next/link";
import { CaseStudyShell } from "@/components/Shell";
import { ArrowLeft, ExternalLink } from "@/components/icons";
import { link, type } from "@/components/tokens";
import { caseStudy } from "@/content/case-studies";

/* ==========================================================================
   CASE STUDY — Ebara   →   app/work/ebara/page.tsx   →   /work/ebara

   Built to the layout you'd already landed on. Margins rather than a flex
   column with gap, because the rhythm here isn't uniform: mt-2 under the
   back link, mt-3 under the title, mt-4 before the hero, mt-6 before a new
   section. A single gap value can't say that.

   Nothing in this file sets a background, a width, a vertical alignment or a
   transition — CaseStudyShell owns all four, and it top-aligns the column
   rather than centring it, because a case study is a document you read down.

   No "use client" — this is static, so it renders on the server.
   ========================================================================== */

const study = caseStudy("ebara");

/* Short tab title. The layout's template makes it
   "Ebara Technologies — Juan Alvarez" — the full project title would be
   unreadable in a tab, a bookmark, or a link preview. The client name is
   still worth keeping in content/case-studies.ts for exactly this, even
   though it no longer appears on the page. */
export const metadata = { title: study.client };

export default function Page() {
  return (
    <CaseStudyShell>
      {/* ---- Back link ---------------------------------------------- */}
      {/* Deliberately untagged — no transitionTypes — so the return trip is
          instant, matching the browser's own back button.

          The arrow is always present and never moves. Hover changes exactly
          one thing: the underline appears, running under the arrow as well
          as the word, because `link` draws it as a border on the anchor
          rather than as a text-decoration that would stop at the glyph. */}
      <Link href="/" className={`${link} text-sm font-medium`}>
        <ArrowLeft className="mr-1" />
        Back
      </Link>

      {/* ---- Title --------------------------------------------------- */}
      <h1 className={`mt-2 ${type.showcaseName}`}>{study.title}</h1>

      {/* ---- Live site ----------------------------------------------- */}
      <p className={`mt-3 ${type.body}`}>
        Check out my flow at{" "}
        <a
          href="https://ebaratechnologies.com"
          target="_blank"
          rel="noopener noreferrer"
          className={link}
        >
          {/* whitespace-nowrap ties the mark to the domain, so the icon can
              never wrap onto a line by itself. */}
          <span className="whitespace-nowrap">
            ebaratechnologies.com
            {/* Not an aria-label on the <a>: that would REPLACE the visible
                text, so the accessible name would stop matching the words on
                screen. Appending sr-only text keeps them in sync. */}
            <span className="sr-only"> (opens in a new tab)</span>
            <ExternalLink className="ml-1" />
          </span>
        </a>
      </p>

      {/* ---- Hero ---------------------------------------------------- */}
      {/* Fixed aspect + object-cover so a differently-proportioned file
          crops instead of pushing the text around, and bg-neutral-200 holds
          the space while it loads.

          This is the one image that doesn't go through <Figure>. Figure
          exists to read a file's real dimensions and keep its natural aspect
          ratio; a hero wants the opposite — a ratio the layout dictates,
          whatever the file happens to be. Captioned figures further down the
          page should still use Figure.

          priority stays: for anyone landing here directly this is the
          largest-contentful-paint element, and lazy-loading it would make
          the page measurably slower to feel ready. */}
      <div className="relative mt-4 aspect-2/1 w-full overflow-hidden rounded-sm bg-neutral-200">
        <Image
          src="/ebara-preview.png"
          alt="The redesigned Ebara product navigation, with the mega menu open across category, family and model"
          fill
          sizes="480px"
          className="object-cover"
          priority
        />
      </div>

      {/* ---- Problem ------------------------------------------------- */}
      {/* type.name, the same token as the homepage h1 — one step under this
          page's own title, which is what a section heading is. aria-labelledby
          ties the section to its heading for anyone navigating by landmark. */}
      <section className="mt-6" aria-labelledby="problem">
        <h2 id="problem" className={type.name}>
          Problem
        </h2>
        <p className={`mt-3 ${type.body}`}>
          Diving into the site&apos;s information architecture surfaced that
          navigation was page-dependent (going one level deeper meant a full
          page load) so the search for a product was a series of waits.
        </p>
      </section>
    </CaseStudyShell>
  );
}