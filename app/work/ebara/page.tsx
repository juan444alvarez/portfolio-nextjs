import Image from "next/image";
import Link from "next/link";
import { CaseStudyTransition } from "@/components/PageTransition";
import { link, type } from "@/components/tokens";

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

   bg-background on <main> is NOT optional. body is black now (that's what
   gives the transition its depth), so any page whose main forgets this
   renders black.
   ========================================================================== */

export default function Page() {
  return (
    <CaseStudyTransition>
      <main className="min-h-dvh bg-background px-6 py-16 antialiased">
        <div className="mx-auto w-full max-w-120">
          {/* Not in your mock — browser back already works, and it's
              deliberately untagged so the return stays instant. Delete this
              block if you want the mock exactly. */}
          <Link
            href="/"
            className={`group inline-flex items-center gap-1.5 text-[13px] leading-none ${link} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4338CA]`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
              className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 ease-out group-hover:-translate-x-0.5"
            >
              <path d="M19 12H5M11 18l-6-6 6-6" />
            </svg>
            Back
          </Link>

          {/* ---- Title ------------------------------------------------ */}
          {/* Same token as the name on home, so the two pages open at the
              same typographic weight. text-balance keeps the two lines
              even rather than leaving one orphan word. */}
          <h1 className={`mt-8 text-balance ${type.name}`}>
            Untangling information architecture through end-to-end UX research
          </h1>

          {/* ---- Hero ------------------------------------------------- */}
          {/* Fixed aspect + object-cover so a differently-proportioned file
              crops instead of pushing the text around. bg-neutral-200 holds
              the space while it loads. */}
          <div className="relative mt-6 aspect-2/1 w-full overflow-hidden rounded-sm bg-neutral-200">
            <Image
              src="/ebara-preview.png"
              alt="Grid of Ebara product pages showing the redesigned navigation"
              fill
              sizes="480px"
              className="object-cover"
              priority
            />
          </div>

          {/* ---- Note ------------------------------------------------- */}
          <p className={`mt-5 ${type.note}`}>
            *I left before the budget was approved for a website redesign,
            however many of my designs were implemented after. Check out my
            product navigation flow at:{" "}
            <a
              href="https://ebaratechnologies.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`${link} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4338CA]`}
            >
              ebaratechnologies.com
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </p>

          {/* ---- Problem ---------------------------------------------- */}
          <section className="mt-8" aria-labelledby="problem">
            <h2 id="problem" className={type.section}>
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