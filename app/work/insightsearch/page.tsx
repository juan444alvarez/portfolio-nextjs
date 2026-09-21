import Link from "next/link";
import { CaseStudyShell } from "@/components/Shell";
import { ArrowLeft } from "@/components/icons";
import { link, type } from "@/components/tokens";
import { caseStudy } from "@/content/case-studies";

/* ==========================================================================
   CASE STUDY — InsightSearch
   →   app/work/insightsearch/page.tsx   →   /work/insightsearch

   Built from app/work/calpers/page.tsx, which carries the full notes on how
   this template works.

   No live-site link here, unlike Ebara: this shipped inside Veeva, so
   there's nothing public to point at.

   ⚠️ PROSE NEEDS YOUR REVIEW. I didn't have your InsightSearch page, so the
   copy below is drafted from your own earlier write-up of this project
   (learning the technology, working with engineering as a peer, aligning to
   Veeva's UX, the annotated handoff). Check it and expand — the structure is
   right, the words are a placeholder.
   ========================================================================== */

const study = caseStudy("insightsearch");

export const metadata = { title: study.client };

export default function Page() {
  return (
    <CaseStudyShell>
      <Link href="/" className={`${link} text-sm font-medium`}>
        <ArrowLeft className="mr-1" />
        Back
      </Link>

      <h1 className={`mt-2 ${type.showcaseName}`}>{study.title}</h1>

      <p className={`mt-3 ${type.body}`}>
        UX wasn&apos;t at the table when this project started, so I earned a
        seat by learning the underlying technology well enough to collaborate
        with engineering as a peer rather than hand work over the wall.
      </p>

      <section className="mt-6" aria-labelledby="constraints">
        <h2 id="constraints" className={type.name}>
          Constraints
        </h2>
        <p className={`mt-3 ${type.body}`}>
          That grounding let me reconcile design goals with real engineering
          constraints before build: aligning the interface to Veeva&apos;s
          existing UX patterns and component library, and delivering an
          annotated handoff that made intent legible to the people
          implementing it.
        </p>
      </section>
    </CaseStudyShell>
  );
}