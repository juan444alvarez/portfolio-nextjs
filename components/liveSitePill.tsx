import { ExternalLink } from "@/components/icons";

/* ==========================================================================
   LIVE SITE PILL   →   components/LiveSitePill.tsx

     <LiveSitePill href="https://www.ebaratechnologies.com" />
     <LiveSitePill href="https://…" label="Visit ebaratechnologies.com" />

   Sits ABOVE the hero figure, not on it. Over a screenshot it would have to
   fight whatever pixels happen to be behind it; above, it reads as a stated
   fact about the project.

   WHY THE STYLES ARE IN globals.css AND NOT IN CLASS STRINGS HERE

   Everything else on this site is Tailwind utilities, and that's still the
   default. This one component is the exception, for two reasons:

     1. Its look is four stacked box-shadows across three states. As
        arbitrary Tailwind values that's a 300-character unreadable string
        per state, with underscores standing in for spaces.
     2. The status light needs @keyframes, which utilities cannot express at
        all. The animation had to live in CSS regardless, and splitting one
        component's look across two files is worse than moving all of it.

   So globals.css has a `.live-pill` block with the colours hoisted to
   variables at the top of it. Tune the shadows there. Converting it back to
   utilities is mechanical if you'd rather.

   THE TEXT IS NEUTRAL, NOT ACCENT BLUE. Every other link on the site is blue
   with a hover underline, because those are links inside sentences. This is
   an object: the pill shape and the shadow already say "press me", and blue
   on top of that double-signals it while fighting the green light for
   attention. One property in globals.css if you disagree.
   ========================================================================== */

export function LiveSitePill({
  href,
  label = "Visit live site",
}: {
  href: string;
  /** Override when naming the destination reads better than the action. */
  label?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="live-pill"
    >
      {/* The light carries no information a screen reader needs — "live
          site" is already in the label — so it's hidden rather than
          announced as a stray green dot. */}
      <span className="live-pill__led" aria-hidden />

      {label}

      {/* Not aria-label on the <a>: that would REPLACE the visible label,
          so the accessible name would stop matching the words on screen.
          Appending sr-only text keeps them in sync. */}
      <span className="sr-only"> (opens in a new tab)</span>

      <ExternalLink />
    </a>
  );
}