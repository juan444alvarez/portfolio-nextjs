import Link from "next/link";
import { ShowcaseShell } from "@/components/Shell";
import { ReturnArrow } from "@/components/icons";
import { backButton, type } from "@/components/tokens";

/* Same shape as ebara/page.tsx, minus the external link and hero.
   ⚠️ Draft copy from your earlier write-up — check and expand. */

export const metadata = { title: "Veeva Systems" };

export default function Page() {
  return (
    <ShowcaseShell>
      <Link href="/" aria-label="Home" className={backButton}>
        <ReturnArrow className="mr-0.5 h-5 w-5" />
      </Link>

      <h1 className={`mt-4 ${type.showcaseName}`}>
        Driving UX strategy for AI-powered document search
      </h1>

      <section className="mt-6" aria-labelledby="problem">
        <h2 id="problem" className={type.name}>
          Problem
        </h2>
        <p className={`mt-3 ${type.body}`}>
          The project began heavily developer-led, with UX as a secondary
          consideration. I researched the AI backend and worked through
          trade-offs with our developers, so design goals and engineering
          constraints were reconciled before build.
        </p>
      </section>
    </ShowcaseShell>
  );
}
