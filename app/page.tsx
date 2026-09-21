import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { CASE_STUDY_TRANSITION, HomeShell } from "@/components/Shell";
import { DocumentMark, LinkedInMark } from "@/components/icons";
import { iconLink, link, type } from "@/components/tokens";
import {
  CASE_STUDIES,
  caseStudyHref,
  type CaseStudy,
} from "@/content/case-studies";

/* ==========================================================================
   HOME   →   app/page.tsx   →   /

   No "use client". It came off with the hover state this page used to track;
   Link and ViewTransition both work from a server component, so this now
   renders on the server and ships no component JavaScript of its own.

   The case study list lives in content/case-studies.ts, not here.
   ========================================================================== */

/* Both of these open a new tab — LinkedIn because it leaves the site, the
   resume because losing the page to a PDF viewer is worse than a new tab. So
   there's no conditional: target and rel are the same for every entry, and
   the old hrefFor / linkTargetProps / isExternal machinery is gone with the
   external case study links it existed for. */
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

/* ==========================================================================
   CASE STUDY ROW

   One paragraph:  [ linked title ] · [ outcome ]

   No image, no frame, no fixed row height — the row is just prose, so it
   wraps and stacks like the bulleted list above it.

   Hover lives entirely on the <Link> via the shared `link` token: the
   underline appears, and nothing else on the row responds. Because it's a
   real text-decoration underline now rather than a border on a wrapper span,
   a title that wraps to two lines is underlined on both lines with no
   box-decoration-clone needed.
   ========================================================================== */

function CaseStudyRow({ study }: { study: CaseStudy }) {
  return (
    <p className={type.body}>
      {/* transitionTypes tags THIS navigation as "case-study". That tag is
          what the ViewTransition wrappers in Shell key on — without it here,
          both wrappers fall to default:"none" and nothing animates. */}
      <Link
        href={caseStudyHref(study)}
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
  );
}

/* ========================================================================== */

export default function Page() {
  return (
    <HomeShell>
      {/* ---- Section 1: identity -------------------------------------- */}
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
                  /* The new-tab warning belongs in the accessible name, since
                     there's no visible text to hang an sr-only span off. */
                  aria-label={`${social.label} (opens in a new tab)`}
                  title={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={iconLink}
                >
                  {social.icon}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* ---- Section 2: about ----------------------------------------- */}
      <section className="mt-3.5 flex flex-col gap-3">
        <p className={type.body}>
          Four years of work experience and a Design B.A. from UC Davis have
          shaped my design thinking with:
        </p>

        {/* pl-5 clears the bullet. The marker is set one step lighter than
            the text so the dots read as structure, not content. */}
        <ul className="-mt-1 flex list-disc flex-col gap-0.5 pl-5 marker:text-neutral-700">
          <li className={type.body}>the agency to build ideas</li>
          <li className={type.body}>
            a habit of continuous discovery for business needs
          </li>
        </ul>
      </section>

      {/* ---- Section 3: featured work --------------------------------- */}
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
              <CaseStudyRow study={study} />
            </li>
          ))}
        </ul>
      </section>
    </HomeShell>
  );
}
