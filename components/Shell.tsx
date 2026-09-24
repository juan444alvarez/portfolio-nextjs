import { ViewTransition } from "react";
import type { ReactNode } from "react";

/* Every page renders one of these instead of its own <main>, so three things
   can't be forgotten: bg-background (body is black), min-h-dvh, and the
   ViewTransition wrapper.

   The wrapper has to be per-page rather than in layout.tsx — a layout
   persists across navigation, so its children never mount or unmount and
   enter/exit never fire there.

   The keyed objects below map the "case-study" transition type to the classes
   globals.css styles. Any navigation without that type falls to default:"none"
   and swaps instantly. */

/* Tagged onto the homepage's project links. One definition, so the string is
   never typed twice — a typo would animate nothing, with no error. */
export const CASE_STUDY_TRANSITION: string[] = ["case-study"];

const MAIN = "min-h-dvh bg-background px-6 py-16";

/** Home: 390px, vertically centred. A card you land on. */
export function HomeShell({ children }: { children: ReactNode }) {
  return (
    <ViewTransition
      exit={{ "case-study": "page-exit", default: "none" }}
      default="none"
    >
      <main className={`grid place-items-center ${MAIN}`}>
        <div className="w-full max-w-97.5">{children}</div>
      </main>
    </ViewTransition>
  );
}

/** Case study: 480px, top-aligned. A document you read down. */
export function CaseStudyShell({ children }: { children: ReactNode }) {
  return (
    <ViewTransition
      enter={{ "case-study": "page-enter", default: "none" }}
      default="none"
    >
      <main className={MAIN}>
        <div className="mx-auto w-full max-w-120">{children}</div>
      </main>
    </ViewTransition>
  );
}
