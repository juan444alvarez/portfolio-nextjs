import { ViewTransition } from "react";
import type { ReactNode } from "react";
import { HoverLines } from "@/components/HoverLines";

/* Every page renders one of these instead of its own <main>, so three things
   can't be forgotten: bg-background (body is black), min-h-dvh, and the
   ViewTransition wrapper.

   The wrapper has to be per-page rather than in layout.tsx — a layout
   persists across navigation, so its children never mount or unmount and
   enter/exit never fire there.

   The keyed objects below map the "showcase" transition type to the classes
   globals.css styles. Any navigation without that type falls to
   default:"none" and swaps instantly. */

/* Put on the home page's showcase links. One definition, so the string is
   never typed twice — a typo would animate nothing, with no error. */
export const SHOWCASE_TRANSITION: string[] = ["showcase"];

const MAIN = "min-h-dvh bg-background px-6 py-16";

/* Showcase grid: a reading column (`content`) with empty tracks either side,
   so a block can widen into `wide` without leaving MAIN's px-6 gutter.
   The reading column is 492px (the old max-w-123) unless a page passes
   contentWidth to ShowcaseShell. Past ~680px lines get long to read. */
const CONTENT_WIDTH = 492;
const showcaseColumns = (contentWidth: number) =>
  `[wide-start] minmax(0, 1fr) [content-start] min(100%, ${contentWidth}px) [content-end] minmax(0, 1fr) [wide-end]`;

/* How wide a <Breakout> can get, in px. Change this one number to make the
   slider (or anything else in a Breakout) bigger or smaller: 768, 896, 1024 …
   Keep it bigger than the page's reading column, or the Breakout is no
   wider than the text. */
const BREAKOUT_MAX = 668;

/* `sizes` for any next/image inside <Breakout>, worked out from BREAKOUT_MAX
   and MAIN's px-6 (24px a side, so 48px total): once the window is wide
   enough the image is BREAKOUT_MAX wide; below that it fills the gutter. */
export const BREAKOUT_SIZES = `(min-width: ${BREAKOUT_MAX + 48}px) ${BREAKOUT_MAX}px, calc(100vw - 48px)`;

/** Home: 400px, vertically centred. A card you land on.
    The column is what the hover lines steer around (data-hover-lines-avoid).
    relative z-10 keeps it above the lines if HoverLines' layer is "behind". */
export function HomeShell({ children }: { children: ReactNode }) {
  return (
    <ViewTransition
      exit={{ showcase: "home-exit", default: "none" }}
      default="none"
    >
      <main className={`grid place-items-center ${MAIN}`}>
        <div data-hover-lines-avoid className="relative z-10 w-full max-w-100">
          {children}
        </div>
        <HoverLines />
      </main>
    </ViewTransition>
  );
}

/** Showcase: a reading column, top-aligned. A document you read down.
    Every direct child sits in the `content` column (*:col-[content]);
    wrap one in <Breakout> to let it span the wider `wide` column.
    contentWidth (px) widens the reading column for one page, e.g. 600. */
export function ShowcaseShell({
  children,
  contentWidth = CONTENT_WIDTH,
}: {
  children: ReactNode;
  contentWidth?: number;
}) {
  return (
    <ViewTransition
      enter={{ showcase: "showcase-enter", default: "none" }}
      default="none"
    >
      <main className={MAIN}>
        <div
          className="grid *:col-[content]"
          style={{ gridTemplateColumns: showcaseColumns(contentWidth) }}
        >
          {children}
        </div>
      </main>
    </ViewTransition>
  );
}

/** Lets one block of a showcase grow past the reading column: up to
    BREAKOUT_MAX, centred, never into the page gutter. It must be a DIRECT
    child of ShowcaseShell — the grid can't reach anything nested inside a
    <section>. gridColumn is an inline style so it beats the parent's
    *:col-[content]. Pair any image inside it with sizes={BREAKOUT_SIZES}. */
export function Breakout({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`w-full justify-self-center ${className}`}
      style={{ gridColumn: "wide", maxWidth: BREAKOUT_MAX }}
    >
      {children}
    </div>
  );
}