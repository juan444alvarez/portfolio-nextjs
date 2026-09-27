import type { SVGProps } from "react";

/* Icons take the text color (currentColor) and are sized with className.
   aria-hidden by default: the link around them carries the accessible name. */

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
