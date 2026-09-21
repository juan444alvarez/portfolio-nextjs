import Link from "next/link";
import { CaseStudyShell } from "@/components/Shell";
import { ArrowLeft } from "@/components/icons";
import { backLink, type } from "@/components/tokens";
import { caseStudy } from "@/content/case-studies";

/* ==========================================================================
   CASE STUDY — Ebara   →   app/work/ebara/page.tsx   →   /work/ebara

   Built from app/work/calpers/page.tsx, which carries the full notes on how
   this template works.

   ⚠️ PROSE NEEDS YOUR REVIEW. I didn't have your Ebara page, so the
   paragraphs below are drafted from your own earlier write-up of this
   project (persona-matched cohorts, two rounds of testing, the mega menu).
   Check the details and expand — the structure is right, the words are a
   placeholder.
   ========================================================================== */

const study = caseStudy("ebara");

export const metadata = { title: study.client };

export default function Page() {
  return (
    <CaseStudyShell>
      <Link href="/" className={`text-sm ${backLink}`}>
        <ArrowLeft />
        Back
      </Link>

      <header className="mt-8">
        <p className={type.subtext}>{study.client}</p>
        <h1 className={`mt-1 ${type.showcaseName}`}>{study.title}</h1>
      </header>

      <section className="mt-4 flex flex-col gap-3">
        <p className={`${type.body} text-pretty`}>
          Recruited participants into persona-matched cohorts through email
          outreach paired with a screening survey, using the low end of product
          familiarity as a proxy for first-time visitors and the high end for
          informed buyers.
        </p>
        <p className={`${type.body} text-pretty`}>
          Testing ran in two rounds: paper prototypes of a proposed navigation
          against the legacy structure, to isolate the logic from visual bias,
          then a high-fidelity prototype A/B tested against the live site.
        </p>
        <p className={`${type.body} text-pretty`}>
          The legacy navigation forced users through multiple page loads to
          reach a specific product. The mega menu I designed surfaced the full
          information architecture in the navigation bar itself, letting users
          skip intermediate pages entirely and cutting product findability time
          by roughly half.
        </p>
      </section>
    </CaseStudyShell>
  );
}