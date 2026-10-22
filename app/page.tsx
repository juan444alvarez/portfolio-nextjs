import Image from "next/image";
import Link from "next/link";
import { HomeShell, SHOWCASE_TRANSITION } from "@/components/Shell";
import { link, type } from "@/components/tokens";
import { NdaTooltip } from "@/components/NdaTooltip";

/* No "use client" — nothing here uses hooks, and Link and ViewTransition both
   work from a server component. The hover lines are mounted by HomeShell. */

const LINKEDIN_URL = "https://www.linkedin.com/in/juan-alvarez-045705224";

/* slug must match a folder under app/showcase/. Nothing typechecks that — a
   wrong slug compiles, renders, and 404s only on click.
   hoverLines: true makes the title draw the hover lines (see HoverLines.tsx). */
const SHOWCASES = [
  {
    slug: "ebara",
    title: "Untangling information architecture through end-to-end UX research",
    outcome: "Cut average product findability time by ~40% with a mega menu design.",
    hoverLines: true,
  },
  {
    slug: "calpers",
    title: "Collaborating across teams through analysis, design, and release",
    outcome: "Ran research, supported design, and validated builds with engineers and analysts.",
    nda: true,
  },

];

export default function Page() {
  return (
    <HomeShell>
      {/* ---- Identity ------------------------------------------------- */}
      <header className="flex items-center gap-3">
        <Image
          src="/avatar.jpeg"
          alt="Juan Alvarez"
          width={44}
          height={44}
          className="h-12 w-12 shrink-0 rounded-full object-cover outline-gray-300 outline-1"
        />
        <div className="flex flex-col">
          <h1 className={type.name}>Juan Alvarez</h1>
          <p className={`${type.subtext} -mt-0.5`}>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className={link}>
              View my LinkedIn
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </p>
        </div>
      </header>

      {/* ---- About ---------------------------------------------------- */}
      <section className="mt-3.5 flex flex-col gap-3">
        <p className={type.body}>
          Three years of work experience and a Design B.A. from UC Davis shape
          my design thinking with:
        </p>
        <ul className="-mt-1 flex list-disc flex-col gap-0.5 pl-5 marker:text-neutral-700">
          <li className={type.body}>the agency to build ideas</li>
          <li className={type.body}>a habit of uncovering business needs</li>
        </ul>
      </section>

      {/* ---- Featured work -------------------------------------------- */}
      <section className="mt-4" aria-labelledby="work">
        <h2 id="work" className={type.homeTitle}>
          Featured Work Experience
        </h2>

        <ul className="mt-4 divide-y divide-neutral-400">
          {SHOWCASES.map((showcase) => (
            <li key={showcase.slug} className="py-4.5 first:pt-0 last:pb-0">
              <p className={type.body}>
  {"nda" in showcase ? (
    <NdaTooltip className={`cursor-default font-semibold tracking-normal ${link}`}>
      {showcase.title}
    </NdaTooltip>
  ) : (
    <Link
      href={`/showcase/${showcase.slug}`}
      transitionTypes={SHOWCASE_TRANSITION}
      className={`font-semibold tracking-normal ${link}`}
      data-hover-lines={"hoverLines" in showcase ? true : undefined}
    >
      {showcase.title}
    </Link>
  )}
  <span aria-hidden className="px-1.5">
    ·
  </span>
  {showcase.outcome}
</p>
              
            </li>
          ))}
        </ul>
      </section>
    </HomeShell>
  );
}
