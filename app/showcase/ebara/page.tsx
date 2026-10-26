import Link from "next/link";
import { ShowcaseShell } from "@/components/Shell";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { ExternalLink, ReturnArrow } from "@/components/icons";
import { backButton, link, type } from "@/components/tokens";

/* The fullest showcase: back link, title, an external link, a hero image and
   one section. calpers/ and veeva/ are the same shape without the extras.
   To add a section, copy the <section> block at the bottom. */

export const metadata = { title: "Ebara Technologies" };

/* ---------- Journey graphs ----------
   Both charts share one 480 x 250 viewBox. Markers are positioned in % of
   that box, and every size inside the chart uses container-query units (cqw),
   so the graph scales as one piece inside the narrow showcase column.
   Curves and fills run edge to edge; the fill overshoots the viewBox so the
   blur never softens the left and right edges.
   Colors come from currentColor, so it follows the page's text color. */

type Point =
  | { x: number; y: number; pill: string }
  | { x: number; y: number; label: [string, string]; lift?: number };

const engineerJourney = {
  id: "eng",
  alt: "Journey of an engineer or contractor: focused at first, then frustrated as the catalog follows business segments and every level reloads the page.",
  line: "M0 200 C35 160 95 60 150 60 C190 60 226 108 258 134 C286 157 308 170 336 174 C364 178 392 197 420 198 L480 201",
  fill: "M-20 250 L-20 223 L0 200 C35 160 95 60 150 60 C190 60 226 108 258 134 C286 157 308 170 336 174 C364 178 392 197 420 198 L480 201 L500 202 L500 250 Z",
  points: [
    { x: 31.25, y: 24, pill: "Focused" },
    { x: 53.75, y: 53.6, label: ["Specs are buried", "levels deep"], lift: 11.5 },
    { x: 70, y: 69.6, label: ["A page reload", "at every level"] },
    { x: 87.5, y: 79.2, pill: "Frustrated" },
  ] satisfies Point[],
};

/* Different shape on purpose: a lower peak, a dip, a brief rebound when
   they try another category, then a slide into giving up. */
const newBuyerJourney = {
  id: "new",
  alt: "Journey of a new buyer: curious at first, dipping when unsure which product line to choose, recovering briefly on another category, then lost.",
  line: "M0 190 C30 140 85 100 120 100 C152 100 172 172 205 172 C238 172 268 130 300 130 C340 130 380 205 420 205 L480 207",
  fill: "M-20 250 L-20 214 L0 190 C30 140 85 100 120 100 C152 100 172 172 205 172 C238 172 268 130 300 130 C340 130 380 205 420 205 L480 207 L500 208 L500 250 Z",
  points: [
    { x: 25, y: 40, pill: "Curious" },
    { x: 42.7, y: 68.8, label: ["Unsure which", "product line"] },
    { x: 62.5, y: 52, label: ["Tries another", "category"] },
    { x: 87.5, y: 82, pill: "Lost" },
  ] satisfies Point[],
};

function JourneyChart({
  id,
  alt,
  line,
  fill,
  points,
}: {
  id: string;
  alt: string;
  line: string;
  fill: string;
  points: Point[];
}) {
  return (
    <div
      role="img"
      aria-label={alt}
      className="@container relative aspect-[480/250] w-full select-none"
    >
      <svg
        viewBox="0 0 480 250"
        aria-hidden="true"
        className="absolute inset-0 size-full"
      >
        <defs>
          <linearGradient
            id={`${id}-tint`}
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="480"
            y2="0"
          >
            <stop offset="0" stopColor="#a6d878" />
            <stop offset="0.3" stopColor="#bfdd8e" />
            <stop offset="0.5" stopColor="#e6dca2" />
            <stop offset="0.75" stopColor="#f1d0ae" />
            <stop offset="1" stopColor="#eebcb6" />
          </linearGradient>
          <linearGradient
            id={`${id}-fadeG`}
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="30"
            x2="0"
            y2="250"
          >
            <stop offset="0" stopColor="#fff" stopOpacity="1" />
            <stop offset="0.45" stopColor="#fff" stopOpacity="0.8" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <mask
            id={`${id}-fade`}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="480"
            height="250"
          >
            <rect width="480" height="250" fill={`url(#${id}-fadeG)`} />
          </mask>
          <filter id={`${id}-soft`} x="-10%" y="-10%" width="120%" height="130%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
        </defs>
        <g mask={`url(#${id}-fade)`}>
          <path
            d={fill}
            fill={`url(#${id}-tint)`}
            filter={`url(#${id}-soft)`}
          />
        </g>
        <path
          d={line}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeDasharray="6 4"
        />
      </svg>

      {points.map((p) => (
        <div
          key={p.x}
          className="absolute size-0"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
        >
          {"pill" in p ? (
            <span className="absolute bottom-[4cqw] left-0 -translate-x-1/2 whitespace-nowrap rounded-full border border-current px-[2.4cqw] py-[1.1cqw] text-[length:max(9px,2.4cqw)] leading-none">
              {p.pill}
            </span>
          ) : (
            <>
              <span
                className="absolute left-0 w-px -translate-x-1/2 bg-current opacity-60"
                style={{
                  top: `-${(p.lift ?? 10.4) - 0.8}cqw`,
                  height: `${(p.lift ?? 10.4) + 4.6}cqw`,
                }}
              />
              <span
                className="absolute left-0 -translate-x-1/2 whitespace-nowrap text-center text-[length:max(9px,2.4cqw)] leading-[1.3]"
                style={{ bottom: `${p.lift ?? 10.4}cqw` }}
              >
                <span className="block">{p.label[0]}</span>
                <span className="block">{p.label[1]}</span>
              </span>
            </>
          )}
          <span className="absolute left-0 top-0 z-10 size-[1.5cqw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-current" />
        </div>
      ))}
    </div>
  );
}

export default function Page() {
  return (
    <ShowcaseShell>
      <div className="flex items-center gap-2">
<Link href="/" aria-label="Home" className={`${backButton} size-10! relative after:absolute after:bottom-[9px] after:left-1/2 after:h-[0.5px]! after:w-4 after:-translate-x-1/2 after:bg-current after:opacity-0 hover:after:opacity-100`}>
  <ReturnArrow className="h-4 w-4" strokeWidth={50} />
</Link>
  <a
    href="https://ebaratech.com"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-1.5 rounded-full bg-neutral-200 px-4 py-2 text-md leading-5 text-accent underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
  >
    ebaratech.com
    <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
    <span className="sr-only">(opens in a new tab)</span>
  </a>
</div>

      <h1 className={`mt-4 ${type.showcaseName}`}>
        Untangling information architecture through end-to-end UX research
      </h1>

      <p className={`mt-3 ${type.body}`}>
  I researched and redesigned navigation for an extensive product catalog.
  Finding a specific product meant clicking through a category page, then a
  product family, and finally... the product.
</p>
<p className={`mt-3 ${type.body}`}>
  So, I designed a mega menu with progressive reveal, putting every level in one
  view and{" "}
  <span className="font-semibold">
    cut the average findability time by ~40%
  </span>
  .
</p>

      {/* Before sits under After. Drag the handle to wipe between them. The
          screenshots are different sizes, so the box takes the After ratio
          (1429 x 618) and shows it whole; Before (1424 x 766) is scaled to the
          same width and trimmed at the bottom, where its menu runs off anyway.
          Both files live in /public. */}
      <BeforeAfterSlider
        className="my-6"
        aspect={1429 / 618}
        sizes="480px"
        before={{
          src: "/ebara-before.webp",
          alt: "The original Ebara product navigation: a wide menu listing every dry pump, abatement and turbomolecular model at once",
        }}
        after={{
          src: "/ebara-after.webp",
          alt: "The redesigned Ebara product navigation, with the mega menu open across category, family and model",
        }}
      />

      <h2 className={`mt-4 ${type.showcaseHeading}`}>
        Rethinking Product Navigation for $200K+ Industrial Systems
      </h2>
      <p className={`mt-3 ${type.body}`}>
      Nobody adds a $200K+ machine to a cart, so my focus wasn't on a checkout flow. My goal was to get the right person to the right product. But “the right person” wasn’t one person.
      </p>
      <p className={`mt-3 ${type.body}`}>
      Two audience types arrived at the site:</p>
      <p className={`mt-3 ${type.body}`}>
        <strong>1. An engineer who knows what they need</strong>. They want technical specifications, but layers of navigation bog them down.
      </p>
      <figure className="mx-0 mt-3">
        <JourneyChart {...engineerJourney} />
      </figure>
      <hr className="border-t border-gray-400 mt-11 mb-10" />
      <p className={`mt-3 -mb-8 ${type.body}`}>
        <strong>2. A prospective buyer browsing the site</strong>. Unsure where to look, they get confused and leave the site.
      </p>
      <figure className="mx-0 mt-4">
        <JourneyChart {...newBuyerJourney} />
      </figure>

      <h3 className={`mt-4 ${type.showcaseHeadingSecondary}`}>
        Measuring Effort over Speed
      </h3>
            <p>My hypothesis was that full page reloads at every click were holding both groups back. To validate it, I ran usability tests.</p>

      <h3 className={`mt-4 ${type.showcaseHeadingSecondary}`}>Results</h3>
      <ul className={`mt-3 list-disc pl-5 ${type.body}`}>
        <li>Average time to find a product was cut by ~40%</li>
        <li>
          Users could bypass intermediate pages entirely, which reduced
          cognitive load and helped visitors on slower connections
        </li>
      </ul>
      <p className={`mt-3 ${type.body}`}>
        By giving buyers direct access to the information they needed, it moved
        them toward a sales conversation on their own terms, serving the
        business goal without forcing users down a funnel.
      </p>
    </ShowcaseShell>
  );
}