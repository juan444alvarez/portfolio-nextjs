import type { ReactNode } from "react";

/* ==========================================================================
   BREAKOUT   →   components/Breakout.tsx

   Lets one thing be WIDER than the text column it sits in, while staying
   centred on that column. Wrap anything: a screenshot, a table, a
   side-by-side comparison, a full-bleed hero.

     <Breakout>            up to 760px
     <Breakout size="full">  as wide as the page allows

   A case study is a canvas, so this is the one escape hatch from the 480px
   column — and having exactly one means the trick is defined once instead of
   being re-derived every time something needs more room.

   WHY NOT mx-auto. When a child is wider than its containing block, CSS
   resolves auto margins to zero, so mx-auto would hang the content off the
   right edge only. Instead: left-1/2 puts the box's left edge at the
   column's centre, and -translate-x-1/2 pulls it back by half its OWN
   width — so the two centres meet whatever the width turns out to be. It
   needs `relative` for `left` to apply, and it leaves the flow only
   horizontally, so vertical spacing behaves normally.

   ⚠️ COUPLED TO Shell's px-6. The widths below subtract 3rem, which is
   Shell's 1.5rem gutter on each side. If you change the padding in
   Shell.tsx, change the 3rem here to match — otherwise a wide element can
   overhang the viewport and the page scrolls sideways on phones. Shell.tsx
   carries the same warning on the other side of the coupling.

   Measured across 375 → 1920px: the centres line up to the pixel and there
   is no horizontal scroll at any width. "full" deliberately stops at the
   page gutter rather than going true edge-to-edge, because a real
   edge-to-edge element wants 100vw, and 100vw INCLUDES the scrollbar on
   desktops that still have one — which is exactly how a page ends up
   scrolling sideways by 15px.
   ========================================================================== */

const SIZES = {
  /* 47.5rem = 760px, or the full gutter-to-gutter width when the viewport is
     the tighter constraint — so on a phone this lands flush with the column
     instead of overhanging it. */
  wide: "w-[min(47.5rem,calc(100vw-3rem))]",
  full: "w-[calc(100vw-3rem)]",
} as const;

export function Breakout({
  children,
  size = "wide",
}: {
  children: ReactNode;
  size?: keyof typeof SIZES;
}) {
  return (
    <div className={`relative left-1/2 -translate-x-1/2 ${SIZES[size]}`}>
      {children}
    </div>
  );
}