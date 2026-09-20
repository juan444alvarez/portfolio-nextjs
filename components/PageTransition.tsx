import { ViewTransition } from "react";
import type { ReactNode } from "react";

/* ==========================================================================
   PAGE TRANSITION WRAPPERS   →   components/PageTransition.tsx

   These must go inside each page.tsx, NOT in layout.tsx. A layout persists
   across navigation, so its children never mount or unmount and enter/exit
   never fire there. Putting these in the layout is a silent no-op.

   HOW THE SCOPING WORKS

   The <Link> that starts the navigation carries transitionTypes={["case-study"]}.
   That type is what these objects are keyed on:

     - forward (home → case study): the type is present, so home's snapshot
       gets the class "page-exit" and the case study's gets "page-enter".
       globals.css styles those two classes.

     - anything else (browser back, swipe back, refresh, a Suspense reveal):
       no type, so both fall through to `default: "none"`, no class is
       assigned, no rule matches, and the swap is instant.

   The bare `default="none"` prop on top of the keyed objects stops these
   wrappers animating during unrelated transitions elsewhere on the page.
   ========================================================================== */

/** Wrap the home page's content. Animates out when a case-study link is used. */
export function HomeTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition
      exit={{ "case-study": "page-exit", default: "none" }}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}

/** Wrap a case study page's content. Animates in when arriving from home. */
export function CaseStudyTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition
      enter={{ "case-study": "page-enter", default: "none" }}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}