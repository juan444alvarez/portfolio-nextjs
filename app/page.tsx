import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { CASE_STUDY_TRANSITION, HomeShell } from "@/components/Shell";
import { DocumentMark, LinkedInMark } from "@/components/icons";
import { link, type } from "@/components/tokens";

/* No "use client" — nothing here uses hooks, and Link and ViewTransition both
   work from a server component, so this ships no component JavaScript. */

/* Both open in a new tab: LinkedIn because it leaves the site, the resume
   because losing the page to a PDF viewer is worse. */
const SOCIALS: { label: string; href: string; icon: ReactNode }[] = [
  {
    label: "LinkedIn",
    href: "www.linkedin.com/in/juan-alvarez-045705224",
    icon: <LinkedInMark />,
  },
  { label: "Resume", href: "/juan-alvarez-resume.pdf", icon: <DocumentMark /> },
];

/* slug must match a folder under app/work/. Nothing typechecks that — a wrong
   slug compiles, renders, and 404s only on click. */
const CASE_STUDIES = [
  {
    slug: "ebara",
    title: "Untangling information architecture through end-to-end UX research",
    outcome:
      "Cut average product findability time by ~50% with a mega menu design.",
  },
  {
    slug: "calpers",
    title: "Aligning content strategy with the software development lifecycle",
    outcome: "Supported project teams from discovery through release.",
  },
  {
    slug: "insightsearch",
    title: "Driving UX strategy for AI-powered document search",
    outcome:
      "Reconciled design goals with engineering constraints ahead of build.",
  },
];

export default function Page() {
  return (
    <HomeShell>
      {/* ---- Identity ------------------------------------------------- */}
      <header className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Image
            src="/avatar.jpeg"
            alt="Juan Alvarez"
            width={44}
            height={44}
            className="h-11 w-11 shrink-0 rounded-full bg-neutral-200 object-cover"
          />
          <div className="flex flex-col gap-px">
            <h1 className={type.name}>Juan Alvarez</h1>
            <p className={type.subtext}>juan444alvarez@gmail.com</p>
          </div>
        </div>

        <nav aria-label="Social links">
          <ul className="flex items-center gap-2">
            {SOCIALS.map((social) => (
              <li key={social.label}>
                {/* Icon-only, so the new-tab warning goes in the accessible
                    name — there's no visible text to hang an sr-only span off.
                    p-1 takes the 16px icon to a 24px target. */}
                <a
                  href={social.href}
                  aria-label={`${social.label} (opens in a new tab)`}
                  title={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center border-b border-transparent p-1 text-accent hover:border-current focus-visible:border-current"
                >
                  {social.icon}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* ---- About ---------------------------------------------------- */}
      <section className="mt-3.5 flex flex-col gap-3">
        <p className={type.body}>
          Four years of work experience and a Design B.A. from UC Davis have
          shaped my design thinking with:
        </p>

        <ul className="-mt-1 flex list-disc flex-col gap-0.5 pl-5 marker:text-neutral-700">
          <li className={type.body}>the tools to build ideas</li>
          <li className={type.body}>
            a habit of continuous discovery for business needs
          </li>
        </ul>
      </section>

      {/* ---- Featured work -------------------------------------------- */}
      <section className="mt-4" aria-labelledby="work">
        <h2 id="work" className={type.homeTitle}>
          Featured Work Experience
        </h2>

        <ul className="mt-4 divide-y divide-neutral-400">
          {CASE_STUDIES.map((study) => (
            <li
              key={study.slug}
              className="py-4.5 text-balance first:pt-0 last:pb-0"
            >
              <p className={type.body}>
                {/* transitionTypes tags THIS navigation. Without it both
                    wrappers fall to default:"none" and nothing animates. */}
                <Link
                  href={`/work/${study.slug}`}
                  transitionTypes={CASE_STUDY_TRANSITION}
                  className={`font-medium ${link}`}
                >
                  {study.title}
                </Link>
                <span aria-hidden className="px-1.5">
                  ·
                </span>
                {study.outcome}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </HomeShell>
  );
}
