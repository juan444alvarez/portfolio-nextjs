import Image from "next/image";
import Link from "next/link";
import { CaseStudyTransition } from "@/components/PageTransition";
import { ArrowLeft, ExternalLink } from "@/components/icons";
import { link, linkText, type } from "@/components/tokens";

/* ==========================================================================
   CASE STUDY — Ebara

   Layout differs from home in exactly two ways, both deliberate:

     - Top-aligned, not vertically centered. A case study is a document you
       read down; home is a card you land on. Same py-16 top padding either
       way, so the first line starts at the same height on a tall screen.

     - Wider column (480px vs the homepage's 390px). More measure for
       reading. Nothing in the transition depends on them matching — the
       wipe is a full-page slide, not a shared element, so there's no edge
       the eye tracks across the cut.

   bg-background on <main> is NOT optional. body is black (that's what gives
   the transition its depth), so any page whose main forgets this renders
   black.
   ========================================================================== */

export default function Page() {
  return (
    <CaseStudyTransition>
      <main className="min-h-dvh bg-background px-6 py-16 antialiased">
        <div className="mx-auto w-full max-w-120">
          {/* Back link. Deliberately untagged — no transitionTypes — so the
              return trip stays instant, same as the browser back button.

              The arrow is always present and never moves; hover is the
              underline and the shade, nothing else. Laid out as inline text
              rather than inline-flex so the underline runs under the arrow
              too — on a flex box the line would draw at the bottom of the
              box instead of along the text baseline. */}
          <Link href="/" className={`${link} text-sm font-medium`}>
            <ArrowLeft className="mr-1" />
            <span className={linkText}>Back</span>
          </Link>

          {/* ---- Title ------------------------------------------------ */}
          {/* showcaseTitle shares everything with the homepage's h1 except
              its size — same weight, leading, color and balance, two points
              larger because it's carrying the whole page. */}
          <h1 className={`mt-2 ${type.showcaseName}`}>
            Untangling information architecture through end-to-end UX research
          </h1>

          {/* ---- Note ------------------------------------------------- */}
          <p className={`mt-3 ${type.body}`}>
            Live product navigation flow at:{" "}
            {/* External mark always present, inside the <a> so the underline
                runs under it on hover like any other link text. */}
            <a
              href="https://ebaratechnologies.com"
              target="_blank"
              rel="noopener noreferrer"
              className={link}
            >
              <span className={linkText}>ebaratechnologies.com</span>
              <span className="sr-only"> (opens in a new tab)</span>
              <ExternalLink className="ml-1" />
            </a>
          </p>

          {/* ---- Hero ------------------------------------------------- */}
          {/* Fixed aspect + object-cover so a differently-proportioned file
              crops instead of pushing the text around. bg-neutral-200 holds
              the space while it loads. priority stays: this is the LCP
              element for anyone landing here directly. */}
          <div className="relative mt-4 aspect-2/1 w-full overflow-hidden rounded-sm bg-neutral-200">
            <Image
              src="/ebara-preview.png"
              alt="Grid of Ebara product pages showing the redesigned navigation"
              fill
              sizes="480px"
              className="object-cover"
              priority
            />
          </div>

          {/* ---- Problem ---------------------------------------------- */}
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
        </div>
      </main>
    </CaseStudyTransition>
  );
}