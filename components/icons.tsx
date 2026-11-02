import Link from "next/link";
import type { ReactNode, SVGProps } from "react";

/* Icons take the text color (currentColor) and are sized with className.
   aria-hidden by default: the link around them carries the accessible name.

   The buttons at the bottom wrap these icons in one shared surface, so every
   showcase page gets the same back button and live-site link. */

/** U-turn arrow for the showcase "back to home" link. */
export function ReturnArrow({ className = "h-5 w-5", ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="none"
      stroke="currentColor"
      strokeWidth="40"
      strokeLinecap="butt"
      strokeLinejoin="miter"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <polyline points="160 38 32 165 160 292" />
      <path d="M32 165H335A155 155 0 0 1 335 475H100" />
    </svg>
  );
}

/** Box-with-arrow for links that open another site. */
export function ExternalLink({ className = "h-4 w-4", ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="none"
      stroke="currentColor"
      strokeWidth="44"
      strokeLinecap="butt"
      strokeLinejoin="miter"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d="M416 304V470H42V96H208" />
      <polyline points="320 42 470 42 470 192" />
      <line x1="470" y1="42" x2="224" y2="288" />
    </svg>
  );
}

/* ---------- Buttons ----------
   Vercel-style light mode: a flat white surface, a hairline ring drawn as a
   box-shadow (so it adds no width) and a barely-there shadow underneath.
   Hover darkens the ring and tints the fill a step; press tints it again.
   Both buttons are 36px tall, so they sit level in a row.
   No text color here: each button sets its own. Two color classes on one
   element don't resolve by order in the className, so a shared color would
   randomly win over the button's own.
   Every class is written out in full so Tailwind's scanner can find it. */
const button = [
  // layout
  "inline-flex h-9 items-center justify-center rounded-full select-none",
  // surface
  "bg-white",
  "shadow-[0_0_0_1px_rgb(0_0_0/0.08),0_1px_2px_rgb(0_0_0/0.04)]",
  // hover
  "hover:bg-neutral-50 hover:shadow-[0_0_0_1px_rgb(0_0_0/0.14),0_1px_2px_rgb(0_0_0/0.06)]",
  // press
  "active:bg-neutral-100",
  // motion
  "transition-[background-color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
  // keyboard focus
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current",
].join(" ");

/** Round "back to home" button for the top of a showcase page. */
export function BackButton() {
  return (
    <Link href="/" aria-label="Home" className={`${button} w-9 text-accent`}>
      <ReturnArrow className="h-4 w-4" strokeWidth={50} />
    </Link>
  );
}

/** Pill link to a live site, opening in a new tab.
    children is the visible text, e.g. "ebaratech.com". */
export function SiteButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${button} gap-1.5 px-3.5 text-sm font-medium text-accent`}
    >
      {children}
      {/* No color of its own: the icon's currentColor is the text's accent blue. */}
      <ExternalLink className="h-3.5 w-3.5" />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}