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

/** Home: 388px, vertically centred. A card you land on.
    The column is what the hover lines steer around (data-hover-lines-avoid).
    relative z-10 keeps it above the lines if HoverLines' layer is "behind". */
export function HomeShell({ children }: { children: ReactNode }) {
  return (
    <ViewTransition
      exit={{ showcase: "home-exit", default: "none" }}
      default="none"
    >
      <main className={`grid place-items-center ${MAIN}`}>
        <div data-hover-lines-avoid className="relative z-10 w-full max-w-97">
          {children}
        </div>
        <HoverLines />
      </main>
    </ViewTransition>
  );
}

/** Showcase: 480px, top-aligned. A document you read down. */
export function ShowcaseShell({ children }: { children: ReactNode }) {
  return (
    <ViewTransition
      enter={{ showcase: "showcase-enter", default: "none" }}
      default="none"
    >
      <main className={MAIN}>
        <div className="mx-auto w-full max-w-120">{children}</div>
      </main>
    </ViewTransition>
  );
}
