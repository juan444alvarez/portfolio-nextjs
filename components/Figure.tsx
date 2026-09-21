import Image from "next/image";
import type { StaticImageData } from "next/image";
import { Breakout } from "@/components/Breakout";
import { type } from "@/components/tokens";

/* ==========================================================================
   FIGURE   →   components/Figure.tsx

   An image with a caption under it, as a real <figure> / <figcaption> so the
   caption is programmatically tied to the image rather than just sitting
   near it.

   USAGE — the image lives in the case study's own folder:

     app/work/ebara/
       page.tsx
       mega-menu.png          ← next to the page that uses it

     import megaMenu from "./mega-menu.png";

     <Figure
       wide
       src={megaMenu}
       alt="The mega menu expanded, showing all six product categories"
       caption="The full IA, surfaced in the nav bar itself."
     />

   NO WIDTH OR HEIGHT. That's the reason for the static import: the bundler
   reads the file at build time and hands <Image> an object carrying the real
   pixel dimensions, so Next reserves the right space before the image loads
   and layout shift is impossible. A string src (a /public URL) can't do
   that — nothing read the file — which is why those need you to type the
   dimensions by hand and why a typo there squashes the picture.

   It also means each image gets a content-hashed filename, so it caches
   forever and a replaced image gets a new URL automatically instead of
   serving stale from someone's browser.

   `wide` goes through <Breakout>, which owns the centring trick for
   everything on the site — tables and side-by-sides use the same component.
   For an image wider than 760px, skip this prop and wrap the whole thing in
   <Breakout size="full"> yourself.

   TO ADD A BLUR-UP PLACEHOLDER: add placeholder="blur" to the <Image>
   below. Static imports generate the blur data automatically, so it's a
   one-word change — left off by default because nothing else on the site
   has a loading state.
   ========================================================================== */

type FigureProps = {
  /** A static import, not a path string: import img from "./thing.png" */
  src: StaticImageData;
  /** Required, not optional-with-a-default. An optional alt is an empty alt
      in practice. Describe what the image SHOWS; pass "" only if it's
      genuinely decorative and the caption already says everything. */
  alt: string;
  /** Rendered as <figcaption>. Omit for a bare image. */
  caption?: string;
  /** Break out of the 480px column, up to 760px. */
  wide?: boolean;
  /** Set on the first image in the viewport so Next loads it eagerly —
      otherwise it lazy-loads and can hurt your largest-contentful-paint. */
  priority?: boolean;
};

export function Figure({
  src,
  alt,
  caption,
  wide = false,
  priority = false,
}: FigureProps) {
  const image = (
    <Image
      src={src}
      alt={alt}
      priority={priority}
      /* block kills the few pixels of descender space an inline img leaves
         under itself. h-auto keeps the real aspect ratio while w-full fills
         whichever container it lands in — the column, or the Breakout.

         No max-w-none needed, despite Tailwind's preflight setting
         max-width:100% on every img: that 100% resolves against the
         IMMEDIATE parent, which when wide is the 760px Breakout, not the
         480px column. (An earlier version of this file claimed the override
         was required. It wasn't.) */
      className="block h-auto w-full rounded-md border border-neutral-300"
      /* Tells Next which srcset entry to serve at each viewport, so a phone
         doesn't download a 1440px screenshot. These match the two real
         widths — 760px broken out, 480px in-column — each falling back to
         100vw once the viewport itself is the constraint. The breakpoints
         are the width plus Shell's 3rem of gutters. */
      sizes={
        wide
          ? "(min-width: 808px) 760px, 100vw"
          : "(min-width: 528px) 480px, 100vw"
      }
    />
  );

  return (
    /* my-4 carries its own vertical rhythm, matching the mt-4 the pages use
       before a hero. The pages space their own blocks with margins rather
       than a flex gap, so a figure has to bring its clearance with it. */
    <figure className="my-4">
      {wide ? <Breakout>{image}</Breakout> : image}

      {caption && (
        /* OUTSIDE the Breakout on purpose: the image widens, the caption
           stays in the text column at the column's left edge. A caption
           centred under a wide image reads as a title for it rather than a
           note about it.

           Same token as the client eyebrow — text-sm at 80% opacity is
           already exactly a caption, so this adds no new type token. */
        <figcaption className={`mt-2 ${type.subtext}`}>{caption}</figcaption>
      )}
    </figure>
  );
}