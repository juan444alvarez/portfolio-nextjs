"use client";

import { type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { HomeTransition } from "@/components/PageTransition";
import { link, type } from "@/components/tokens";

/* ==========================================================================
   LOCAL TOKENS

   The type scale and link color live in @/components/tokens so the case
   study pages share them. Only the two below are homepage-specific.
   ========================================================================== */

/* Icons carry the link blue at rest, darkening on hover like any other link. */
const iconButton =
  "flex h-8 w-8 items-center justify-center text-[#4338CA] transition-colors duration-200 hover:text-[#3730A3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4338CA]";

/* The title's hover tell. The underline is always drawn but transparent, so
   nothing reflows when it appears — only its color animates.
   transition-colors covers text-decoration-color in Tailwind v4. */
const rowLink = `font-medium underline decoration-1 decoration-transparent underline-offset-[3px] hover:decoration-[#3730A3] focus-visible:decoration-[#3730A3] ${link} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4338CA]`;

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
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
        className="h-4 w-4"
      >
        <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.64h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.76V21h-4v-5.68c0-1.35-.03-3.1-1.94-3.1-1.94 0-2.24 1.48-2.24 3v5.78h-4V9Z" />
      </svg>
    ),
  },
  {
    label: "Resume",
    href: "/juan-alvarez-resume.pdf",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className="h-4 w-4"
      >
        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
        <path d="M14 3v5h5M9 13h6M9 17h4" />
      </svg>
    ),
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
      "Cut average product findability time by ~50% with a mega menu design",
  },
  {
    slug: "calpers",
    title: "Aligning content strategy with the software development lifecycle",
    outcome: "Supported project teams from discovery through release",
  },
  {
    slug: "insightsearch",
    title: "Driving UX strategy for AI-powered document search",
    outcome:
      "Reconciled design goals with engineering constraints ahead of build",
  },
];

/* ==========================================================================
   LINK TARGETS

   A project with an externalUrl goes to the live site; everything else goes
   to its own /work/<slug> page.
   ========================================================================== */

function hrefFor(slug: string) {
  const study = CASE_STUDIES.find((s) => s.slug === slug);
  return study?.externalUrl ?? `/work/${slug}`;
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

   Hover lives entirely on the <Link>: the underline colors in, the text
   darkens. Nothing outside the link responds, which is the point.
   ========================================================================== */

function CaseStudyRow({ study }: { study: CaseStudy }) {
  const href = hrefFor(study.slug);
  const targetProps = linkTargetProps(href);
  const isExternal = Boolean(targetProps.target);

  return (
    <p className={type.row}>
      {/* transitionTypes tags THIS navigation as "case-study". That tag is
          what the ViewTransition wrappers key on — without it here, both
          wrappers fall to default:"none" and nothing animates anywhere.

          Internal links only: an external link leaves the app, so there's no
          incoming page of ours to animate in. */}
      <Link
        href={href}
        {...targetProps}
        {...(isExternal ? {} : { transitionTypes: ["case-study"] })}
        className={rowLink}
      >
        {study.title}
      </Link>

      {/* Sighted users get the boxed mark; screen readers get the warning.
          Both sit outside the link text so the underline stays on the
          phrase itself. */}
      {isExternal && (
        <>
          <span className="sr-only">(opens in a new tab)</span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            className="ml-1 inline-block h-3 w-3 shrink-0 align-[-0.05em] text-[#4338CA]"
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <path d="M15 3h6v6M10 14 21 3" />
          </svg>
        </>
      )}

      <span aria-hidden className="px-1.5 text-neutral-400">
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
              <div className="flex flex-col gap-1.5">
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
                      className={iconButton}
                    >
                      {social.icon}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </header>

          {/* ---- Section 2: about ------------------------------------- */}
          <section className="mt-4 flex flex-col gap-3">
            <p className={type.body}>
              4 years of work experience and a Design B.A. from UC Davis have
              shaped my design thinking with:
            </p>

            {/* pl-5 clears the bullet; marker:text-neutral-400 keeps the dots
                quieter than the text so they read as structure, not content. */}
            <ul className="flex list-disc flex-col gap-1 pl-5 marker:text-neutral-400">
              <li className={type.body}>the agency to build ideas</li>
              <li className={type.body}>
                a habit of continuous discovery for business needs
              </li>
              <li className={type.body}>collaboration with developers</li>
            </ul>
          </section>

          {/* ---- Section 3: featured work ----------------------------- */}
          <section className="mt-5" aria-labelledby="work">
            <h2 id="work" className={type.section}>
              Featured Work Experience
            </h2>

            {/* gap-4, not gap-7: the rows are prose now, and the old spacing
                was sized for 96px image frames. */}
            <ul className="mt-3 flex flex-col gap-4">
              {CASE_STUDIES.map((study) => (
                <li key={study.slug}>
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