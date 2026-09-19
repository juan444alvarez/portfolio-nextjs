import Link from "next/link";

/* ==========================================================================
   CASE STUDY TEMPLATE — AI Document Search

   Lives at: app/work/veeva-systems/page.tsx  →  /work/veeva-systems

   The folder name IS the URL. That folder name must match the slug in
   CASE_STUDIES on the homepage, or the link 404s. Note the slug is
   "veeva-systems" even though the project is titled "AI Document Search" —
   the folder follows the slug, not the title.

   No "use client" here. That directive is only needed on the homepage
   because it tracks hover state; this page is static text, so it renders
   on the server and ships less JavaScript.

   Classes are written out rather than imported from the homepage, so this
   file stands alone and you can restyle one page without touching others.
   ========================================================================== */

export default function Page() {
  return (
    <main className="grid min-h-dvh place-items-center px-6 py-16 antialiased">
      {/* Same 480px column as the homepage, so the two line up. */}
      <div className="w-full max-w-120">
        {/* ---- Back link -------------------------------------------- */}
        <Link
          href="/"
          className="group inline-flex items-center gap-1.5 text-[13px] leading-none text-[#4338CA] transition-colors duration-200 hover:text-[#3730A3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4338CA]"
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

        {/* ---- Title ------------------------------------------------- */}
        <h1 className="mt-8 text-[18px] font-semibold leading-tight text-neutral-800">
          AI Document Search
        </h1>

        {/* ---- Body -------------------------------------------------- */}
        <section className="mt-4 flex flex-col gap-3">
          <p className="text-[16px] leading-[1.6] text-neutral-700 text-pretty">
            Drove UX strategy for an AI-powered document search tool, aligning
            design goals with the constraints of what the retrieval system
            could reliably return.
          </p>
        </section>
      </div>
    </main>
  );
}
