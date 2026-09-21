"use client";

import { type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { HomeTransition } from "@/components/PageTransition";
import { ExternalLink, DocumentMark, LinkedInMark } from "@/components/icons";
import {
  iconLink,
  iconLinkUnderline,
  link,
  linkText,
  type,
} from "@/components/tokens";

/* ==========================================================================
   DATA

   One slug per project, used in two places: the row and the URL.
   Everything links to /work/<slug>, so a slug here MUST match a folder
   under app/work/. Nothing typechecks that — a wrong slug compiles, renders,
   and 404s only on click.
   ========================================================================== */

type Social = { label: string; href: string; icon: ReactNode };

const SOCIALS: Social[] = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/juanalvarez",
    icon: <LinkedInMark />,
  },
  {
    label: "Resume",
    href: "/juan-alvarez-resume.pdf",
    icon: <DocumentMark />,
  },
];

/* `title` is the linked phrase — what the work was, as a gerund.
   `outcome` is the clause after the middot — what it produced. */
type CaseStudy = {
  slug: string;
  title: string;
  outcome: string;
  /** Optional. Set this and the project points at the live site instead of
      a /work/<slug> page. Leave it off for normal case studies. */
  externalUrl?: string;
};

const CASE_STUDIES: CaseStudy[] = [
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

/* A project with an externalUrl goes to the live site; everything else goes
   to its own /work/<slug> page. */
function hrefFor(study: CaseStudy) {
  return study.externalUrl ?? `/work/${study.slug}`;
}

/* External links open in a new tab and need rel="noopener noreferrer";
   internal ones must not have either. */
function linkTargetProps(href: string) {
  return href.startsWith("http")
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};
}

/* ==========================================================================
   CASE STUDY ROW

   One paragraph:  [ linked title ] · [ outcome ]

   No image, no frame, no fixed row height — the row is just prose, so it
   wraps and stacks like the bulleted list above it.

   Hover lives entirely on the <Link>, via the shared `link` token. Nothing
   outside the link responds, which is the point.
   ========================================================================== */

function CaseStudyRow({ study }: { study: CaseStudy }) {
  const href = hrefFor(study);
  const targetProps = linkTargetProps(href);
  const isExternal = Boolean(targetProps.target);

  return (
    <p className={type.body}>
      {/* transitionTypes tags THIS navigation as "case-study". That tag is
          what the ViewTransition wrappers key on — without it here, both
          wrappers fall to default:"none" and nothing animates anywhere.

          Internal links only: an external link leaves the app, so there's no
          incoming page of ours to animate in. */}
      <Link
        href={href}
        {...targetProps}
        {...(isExternal ? {} : { transitionTypes: ["case-study"] })}
        className={`font-medium ${link}`}
      >
        <span className={linkText}>{study.title}</span>
        {isExternal && (
          <>
            <span className="sr-only"> (opens in a new tab)</span>
            <ExternalLink className="ml-1" />
          </>
        )}
      </Link>

      <span aria-hidden className="px-1.5 text-neutral-900">
        ·
      </span>

      {study.outcome}
    </p>
  );
}

/* ==========================================================================
   PAGE

   HomeTransition wraps <main> so this page's whole snapshot is the thing
   that animates out. It must be here in page.tsx — a layout persists across
   navigation, so exit would never fire from there.

   bg-background on <main> is NOT optional. body is black (that's what gives
   the transition its depth), so any page whose main forgets this renders
   black.
   ========================================================================== */

export default function Page() {
  return (
    <HomeTransition>
      <main className="grid min-h-dvh place-items-center bg-background px-6 py-16 antialiased">
        {/* Squished column: w-full lets it shrink below the cap on phones;
            max-w caps it, and place-items-center on main keeps it centered
            however wide the viewport gets. */}
        <div className="w-full max-w-97.5">
          {/* ---- Section 1: identity ---------------------------------- */}
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
                {/* Plain text — not a link, no pointer. */}
                <p className={type.subtext}>juan444alvarez@gmail.com</p>
              </div>
            </div>

            {/* No negative margin — icons sit inside the column edge, so
                everything lines up within the same rectangle. */}
            <nav aria-label="Social links">
              <ul className="flex items-center gap-2">
                {SOCIALS.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      aria-label={social.label}
                      title={social.label}
                      target={
                        social.href.startsWith("http") ? "_blank" : undefined
                      }
                      rel={
                        social.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className={iconLink}
                    >
                      <span className={iconLinkUnderline}>{social.icon}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </header>

          {/* ---- Section 2: about ------------------------------------- */}
          <section className="mt-4 flex flex-col gap-3">
            <p className={type.body}>
              Four years of work experience and a Design B.A. from UC Davis have
              shaped my design thinking with:
            </p>

            {/* pl-5 clears the bullet; marker:text-neutral-400 keeps the dots
                quieter than the text so they read as structure, not content. */}
            <ul className="flex list-disc flex-col gap-0.5 pl-5 marker:text-neutral-700 -mt-1">
              <li className={type.body}>the agency to build ideas</li>
              <li className={type.body}>
                a habit of continuous discovery for business needs
              </li>
            </ul>
          </section>

          {/* ---- Section 3: featured work ----------------------------- */}
          <section className="mt-4" aria-labelledby="work">
            <h2 id="work" className={type.homeTitle}>
              Featured Work Experience
            </h2>

            <ul className="mt-4 divide-y divide-neutral-400">
              {CASE_STUDIES.map((study) => (
                <li key={study.slug} className="py-4.5 first:pt-0 last:pb-0 text-balance">
                  <CaseStudyRow study={study} />
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </HomeTransition>
  );
}