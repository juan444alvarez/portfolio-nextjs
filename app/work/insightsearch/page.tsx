import Link from "next/link";
import { CaseStudyShell } from "@/components/Shell";
import { ReturnArrow } from "@/components/icons";
import { backButton, type } from "@/components/tokens";

/* Built from app/work/calpers/page.tsx, which carries the notes.

   ⚠️ Prose below is drafted from your own earlier write-up of this project —
   check it and expand. The structure is right, the words are a placeholder. */

export const metadata = { title: "Veeva Systems" };

export default function Page() {
  return (
    <CaseStudyShell>
      <Link href="/" aria-label="Home" className={backButton}>
        <ReturnArrow className="mr-0.5" />
      </Link>

      <h1 className={`mt-4 ${type.showcaseName}`}>
        Driving UX strategy for AI-powered document search
      </h1>

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
          annotated handoff that made intent legible to the people implementing
          it.
        </p>
      </section>
    </CaseStudyShell>
  );
}
