import Link from "next/link";
import { CaseStudyShell } from "@/components/Shell";
import { ReturnArrow } from "@/components/icons";
import { backButton, type } from "@/components/tokens";

/* TEMPLATE. Copy this folder for a new case study, rename it to match the
   slug in app/page.tsx, and rewrite the title and prose. The folder name IS
   the URL, so a mismatch 404s.

   Nothing here sets a background, width, alignment or transition — Shell owns
   all four. Spacing is margins rather than a flex gap because the rhythm
   isn't uniform: mt-4 under the control, mt-3 under the title, mt-6 before a
   section. */

export const metadata = { title: "CalPERS" };

export default function Page() {
  return (
    <CaseStudyShell>
      {/* Untagged — no transitionTypes — so the return trip is instant, like
          the browser's own back button. Icon-only, so aria-label carries the
          accessible name. */}
      <Link href="/" aria-label="Home" className={backButton}>
        <ReturnArrow className="mr-0.5" />
      </Link>

      <h1 className={`mt-4 ${type.showcaseName}`}>
        Aligning content strategy with the software development lifecycle
      </h1>

      <p className={`mt-3 ${type.body}`}>
        Supported projects across the software development lifecycle, working
        alongside engineering to keep design decisions grounded in what could
        actually ship.
      </p>

      {/* Copy this block per section. type.name is the section heading. */}
      <section className="mt-6" aria-labelledby="problem">
        <h2 id="problem" className={type.name}>
          Problem
        </h2>
        <p className={`mt-3 ${type.body}`}>Replace this with the real copy.</p>
      </section>

      {/* ---- Adding an image ----------------------------------------
          Drop the file in this folder, then uncomment the import at the top
          and a block like this. The static import carries the real
          dimensions, so there's no width or height to type.

      import shot from "./content-audit.png";

      <figure className="mt-4">
        <Image
          src={shot}
          alt="What the image shows"
          className="border-overlay w-full rounded-md"
        />
        <figcaption className={`mt-2 ${type.subtext}`}>
          Optional caption.
        </figcaption>
      </figure>
          -------------------------------------------------------------- */}
    </CaseStudyShell>
  );
}
