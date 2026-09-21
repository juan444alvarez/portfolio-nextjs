import Link from "next/link";
import { CaseStudyShell } from "@/components/Shell";
import { ArrowLeft } from "@/components/icons";
import { backLink, type } from "@/components/tokens";
import { caseStudy } from "@/content/case-studies";

/* ==========================================================================
   CASE STUDY — InsightSearch
   →   app/work/insightsearch/page.tsx   →   /work/insightsearch

   Built from app/work/calpers/page.tsx, which carries the full notes on how
   this template works.

   ⚠️ PROSE NEEDS YOUR REVIEW. I didn't have your InsightSearch page, so the
   paragraphs below are drafted from your own earlier write-up of this
   project (learning the technology, working with engineering as a peer,
   aligning to Veeva's UX, the annotated handoff). Check the details and
   expand — the structure is right, the words are a placeholder.
   ========================================================================== */

const study = caseStudy("insightsearch");

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
          UX wasn&rsquo;t at the table when this project started, so I earned a
          seat by learning the underlying technology well enough to collaborate
          with engineering as a peer rather than hand work over the wall.
        </p>
        <p className={`${type.body} text-pretty`}>
          That grounding let me reconcile design goals with real engineering
          constraints before build: aligning the interface to Veeva&rsquo;s
          existing UX patterns and component library, and delivering an
          annotated handoff that made intent legible to the people
          implementing it.
        </p>
      </section>
    </CaseStudyShell>
  );
}