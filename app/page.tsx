"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

/* ==========================================================================
   TOKENS

   NOTE: arbitrary values like text-[#4338CA] must appear LITERALLY in the
   source. Tailwind scans files for complete class strings — it never runs
   your JS — so `text-[${SOME_CONST}]` generates nothing and the element
   silently falls back to inherited color.
   ========================================================================== */

/* Warm blue — indigo-leaning rather than cyan-leaning, so it sits with the
   warm grey background. Contrast on #ededed is 6.75:1, clearing AA (4.5:1)
   for normal text with room to spare. */
const link =
  "text-[#4338CA] hover:text-[#3730A3] transition-colors duration-200";

const type = {
  name: "text-[18px] font-semibold leading-tight text-neutral-800",
  subtext: "text-[13px] leading-none text-neutral-600",
  body: "text-[16px] leading-[1.6] text-neutral-700 text-pretty",
  section: "text-[16px] font-semibold text-neutral-700",
  cardBody: "text-[16px] leading-[1.4] text-neutral-700 text-pretty",
} as const;

/* Icons carry the link blue at rest, darkening on hover like any other link. */
const iconButton =
  "flex h-8 w-8 items-center justify-center text-[#4338CA] transition-colors duration-200 hover:text-[#3730A3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4338CA]";

const pill =
  "inline-flex items-center rounded-full bg-neutral-200 px-3 py-1 text-[13px] leading-none text-neutral-700";

/* ==========================================================================
   DATA

   One slug per project, used in three places: the card, the footnote that
   points at it, and the URL. Everything links to /work/<slug> — footnote
   and card go to exactly the same page.
   ========================================================================== */

type Social = { label: string; href: string; icon: ReactNode };

const SOCIALS: Social[] = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/juanalvarez",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-4 w-4">
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

type Footnote = {
  marker: string;
  text: string;
  /** Must match a CASE_STUDIES slug — pairs the two, and builds the URL. */
  slug: string;
  /** Screen-reader name for the marker link — "1" alone is useless. */
  label: string;
};

const FOOTNOTES: Footnote[] = [
  {
    marker: "1",
    text: "the agency to build ideas",
    slug: "ebara",
    label: "See this in the Ebara Website Redesign case study",
  },
  {
    marker: "2",
    text: "a habit of continuous discovery for business needs",
    slug: "calpers",
    label: "See this in the CalPERS case study",
  },
  {
    marker: "3",
    text: "a pragmatism about engineering constraints",
    slug: "veeva-systems",
    label: "See this in the AI Document Search case study",
  },
];

type CaseStudy = {
  slug: string;
  company: string;
  description: string;
  image: string;
  imageAlt: string;
  tags: string[];
  /** Optional. Set this and the project points at the live site instead of
      a /work/<slug> page. Leave it off for normal case studies. */
  externalUrl?: string;
};

const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "ebara",
    company: "Ebara Website Redesign",
    description:
      "Cut product findability time 50% via research-driven navigation redesign.",
    image: "/ebara-preview.png",
    imageAlt: "Ebara website navigation redesign",
    tags: ["End to end research", "Usability testing"],
    externalUrl: "https://www.ebaratech.com/",
  },
  {
    slug: "calpers",
    company: "CalPERS",
    description: "Supported projects across the software development lifecycle.",
    image: "/work/calpers-3.jpg",
    imageAlt: "CalPERS project work",
    tags: ["Content Strategy", "SDLC"],
  },
  {
    slug: "veeva-systems",
    company: "AI Document Search",
    description:
      "Drove UX strategy, aligning design goals with engineering constraints.",
    image: "/work/calpers-2.jpg",
    imageAlt: "AI document search interface",
    tags: ["Content Strategy", "SDLC"],
  },
];

/* ==========================================================================
   LINK TARGETS

   One function decides where a project points, so the footnote superscript
   and the card can never drift apart. A project with an externalUrl goes to
   the live site; everything else goes to its own /work/<slug> page.
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
   FOOTNOTE MARKER

   The small superscript number. Clickable, and padded out to a real tap
   target without changing how it looks.

   Hovering or focusing it reports its slug upward, which is how the
   matching case study card lights up further down the page.
   ========================================================================== */

function FootnoteMarker({
  note,
  onActivate,
  onDeactivate,
}: {
  note: Footnote;
  onActivate: () => void;
  onDeactivate: () => void;
}) {
  const href = hrefFor(note.slug);

  return (
    <Link
      href={href}
      {...linkTargetProps(href)}
      aria-label={note.label}
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
      onFocus={onActivate}
      onBlur={onDeactivate}
      className={`peer -mx-1 -my-0.5 shrink-0 self-start rounded-sm px-1 py-0.5 text-[11px] leading-[1.9] tabular-nums ${link} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4338CA]`}
    >
      <sup className="top-0 align-super">{note.marker}</sup>
    </Link>
  );
}

/* ==========================================================================
   CASE STUDY CARD

   Structure:  article  →  [ image link ]  [ content div ]

   `items-stretch` (flex default, stated here for clarity) makes both
   children the same height: the content div sets the row height from its
   own text, and the image frame stretches to match it. The image fills that
   frame with object-cover, so it crops rather than distorting.

   `group` on the article means hovering anywhere in the card — image
   included — drives the title color, the arrow, and the image shadow.

   `isActive` does the same three things from the outside, so hovering the
   matching footnote superscript produces an identical response.
   ========================================================================== */

function CaseStudyCard({
  study,
  isActive,
}: {
  study: CaseStudy;
  isActive: boolean;
}) {
  const href = hrefFor(study.slug);
  const targetProps = linkTargetProps(href);
  const isExternal = Boolean(targetProps.target);

  return (
    <article className="group flex items-stretch gap-5">
      {/* Image frame — fixed width, height inherited from the row.
          min-h-24 stops it collapsing if the content is ever very short.
          The shadow lifts one step on hover; the picture itself doesn't
          move or change tone. */}
      <Link
        href={href}
        {...targetProps}
        tabIndex={-1}
        aria-hidden
        className={`relative min-h-24 w-40 shrink-0 cursor-pointer overflow-hidden rounded-sm bg-neutral-200 transition-shadow duration-200 ease-out group-hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4338CA] ${
          isActive ? "shadow-sm" : "shadow-xs"
        }`}
      >
        <Image
          src={study.image}
          alt={study.imageAlt}
          fill
          sizes="160px"
          className="object-cover"
        />
      </Link>

      {/* Content — title, description, pills. Sets the row height. */}
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <h3>
          <Link
            href={href}
            {...targetProps}
            className={`inline-flex cursor-pointer items-center gap-1.5 text-[16px] font-medium text-balance ${link} group-hover:text-[#3730A3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4338CA] ${
              isActive ? "text-[#3730A3]" : ""
            }`}
          >
            {study.company}

            {/* Screen readers get a warning the tab is about to change;
                sighted users get the boxed icon below. */}
            {isExternal && <span className="sr-only">(opens in a new tab)</span>}

            {/* Two glyphs, same slot. External projects get the boxed
                arrow-out-of-a-window mark, which conventionally means "this
                leaves the site". Internal ones keep the plain diagonal.

                Both rest low and left, then slide up and out along their own
                45° axis. Always in the DOM so nothing reflows. */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
              className={`h-3.5 w-3.5 shrink-0 transition-all duration-200 ease-out group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 ${
                isActive
                  ? "translate-x-0 translate-y-0 opacity-100"
                  : "-translate-x-1 translate-y-1 opacity-0"
              }`}
            >
              {isExternal ? (
                <>
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <path d="M15 3h6v6M10 14 21 3" />
                </>
              ) : (
                <path d="M7 17 17 7M8 7h9v9" />
              )}
            </svg>
          </Link>
        </h3>

        <p className={type.cardBody}>{study.description}</p>

        {/* mt-auto pins the pills to the bottom of the content box, so the
            baseline is consistent across cards with different text lengths. */}
        <ul className="mt-auto flex flex-wrap items-center gap-2 pt-2">
          {study.tags.map((tag) => (
            <li key={tag} className={pill}>
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

/* ==========================================================================
   PAGE
   ========================================================================== */

export default function Page() {
  /* Which case study is currently being pointed at from the footnote list.
     null means none. */
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  return (
    <main className="grid min-h-dvh place-items-center px-6 py-16 antialiased">
      {/* Squished column: 480px holds the measure around 55-60 characters. */}
      <div className="w-full max-w-120">
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
                    target={social.href.startsWith("http") ? "_blank" : undefined}
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
            4 years of experience and a Design B.A. from UC Davis. My work
            experience and education have shaped my design thinking with:
          </p>

          <ul className="flex flex-col gap-1">
            {FOOTNOTES.map((note) => (
              <li key={note.marker} className={`${type.body} flex gap-2`}>
                <FootnoteMarker
                  note={note}
                  onActivate={() => setActiveSlug(note.slug)}
                  onDeactivate={() => setActiveSlug(null)}
                />
                <span>{note.text}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ---- Section 3: featured work ----------------------------- */}
        <section className="mt-5" aria-labelledby="work">
          <h2 id="work" className={type.section}>
            Featured Work Experience
          </h2>

          <ul className="mt-5 flex flex-col gap-7">
            {CASE_STUDIES.map((study) => (
              <li key={study.slug}>
                <CaseStudyCard
                  study={study}
                  isActive={activeSlug === study.slug}
                />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}