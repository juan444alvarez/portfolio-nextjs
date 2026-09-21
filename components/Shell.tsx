import { ViewTransition } from "react";
import type { ReactNode } from "react";

/* ==========================================================================
   SHELL   →   components/Shell.tsx

   Every page renders one of these instead of its own <main>. It owns three
   things that used to be copy-pasted per page and drifted:

     1. bg-background + min-h-dvh. body is black (that's what gives the
        transition depth), so a page that forgets these renders black. The
        old CalPERS page forgot. Now no page writes them at all.

     2. The column width. TWO deliberate widths now, not one:

          home        390px — a compact card. Short lines, read at a glance.
          case study  480px — prose that has to carry an argument, plus room
                              for images to breathe.

        This is the one thing in the project where two numbers are correct.
        It only became safe to have two once each was defined exactly once,
        here. (The original case study drifted to 480px while CARRYING a
        comment claiming it matched a 390px homepage — the width wasn't the
        bug, the second copy of it was.)

        A case study is a canvas, so anything that needs more than 480px
        wraps in <Breakout> rather than changing this number.

     3. The <ViewTransition> wrapper. It has to be inside page.tsx and not in
        layout.tsx — a layout persists across navigation, so its children
        never mount or unmount and enter/exit never fire there. Putting it in
        a layout is a silent no-op. Putting it here keeps it per-page while
        still being written once.

   HOW THE SCOPING WORKS

   The <Link> that starts the navigation carries
   transitionTypes={CASE_STUDY_TRANSITION}. That type is what the objects
   below are keyed on:

     - forward (home → case study): the type is present, so home's snapshot
       gets the class "page-exit" and the case study's gets "page-enter".
       globals.css styles those two classes.

     - anything else (browser back, swipe back, refresh, a Suspense reveal):
       no type, so both fall through to `default: "none"`, no class is
       assigned, no rule matches, and the swap is instant.

   The bare `default="none"` prop on top of the keyed objects stops these
   wrappers animating during unrelated transitions elsewhere on the page.
   ========================================================================== */

/* The tag that links the three pieces together: this constant, the keys
   below, and the selectors in globals.css. Imported by the homepage so the
   string is never typed twice — a typo here would fail silently, animating
   nothing with no error.

   Typed as string[] rather than `as const` because that's what next/link's
   transitionTypes prop takes; a readonly tuple isn't assignable to it. */
export const CASE_STUDY_TRANSITION: string[] = ["case-study"];

/* grid + place-items-center centres the column horizontally and vertically;
   w-full lets it shrink below the cap on phones, and the max-w caps it.

   ⚠️ px-6 IS COUPLED TO Breakout.tsx. That component subtracts 3rem — this
   1.5rem gutter, doubled — to clamp a wide element to the viewport. Change
   the padding here and you must change the 3rem there, or wide elements
   overhang and the page scrolls sideways on phones. */
const MAIN = "grid min-h-dvh place-items-center bg-background px-6 py-16";
const HOME_COLUMN = "w-full max-w-97.5"; /* 390px */
const CASE_COLUMN = "w-full max-w-120"; /* 480px */

/** Wraps the home page. Animates out when a case-study link is used. */
export function HomeShell({ children }: { children: ReactNode }) {
  return (
    <ViewTransition
      exit={{ "case-study": "page-exit", default: "none" }}
      default="none"
    >
      <main className={MAIN}>
        <div className={HOME_COLUMN}>{children}</div>
      </main>
    </ViewTransition>
  );
}

/** Wraps a case study page. Animates in when arriving from home.

    place-items-center on MAIN centres this vertically, which is right for a
    short page and harmless for a long one — once the content is taller than
    the viewport the centring has nothing left to do and it simply scrolls. */
export function CaseStudyShell({ children }: { children: ReactNode }) {
  return (
    <ViewTransition
      enter={{ "case-study": "page-enter", default: "none" }}
      default="none"
    >
      <main className={MAIN}>
        <div className={CASE_COLUMN}>{children}</div>
      </main>
    </ViewTransition>
  );
}