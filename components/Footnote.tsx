import Link from "next/link";

type Footnote = {
  marker: string;
  text: string;
  href: string;
  /** Screen-reader name for the marker link — "¹" alone is useless. */
  label: string;
};

const FOOTNOTES: Footnote[] = [
  {
    marker: "1",
    text: "the agency to build ideas",
    href: "/work/ebara#approach",
    label: "See this in the Ebara Website Redesign case study",
  },
  {
    marker: "2",
    text: "a habit of continuous discovery for business needs",
    href: "/work/calpers#discovery",
    label: "See this in the CalPERS case study",
  },
  {
    marker: "3",
    text: "a pragmatism about engineering constraints",
    href: "/work/veeva-systems#constraints",
    label: "See this in the AI Document Search case study",
  },
];

function FootnoteMarker({ note }: { note: Footnote }) {
  return (
    <Link
      href={note.href}
      aria-label={note.label}
      className={`-mx-1 -my-0.5 shrink-0 self-start rounded-sm px-1 py-0.5 text-[11px] leading-[1.9] tabular-nums ${link} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4338CA]`}
    >
      <sup className="top-0 align-super">{note.marker}</sup>
    </Link>
  );
}