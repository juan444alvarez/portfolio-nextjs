import ChoiceArchitecture from "../../components/ChoiceArchitecture";
import Slider from "../../components/Slider";
import ebaraBefore from "../../../public/ebara-before.jpg";
import ebaraAfter from "../../../public/ebara-after.png";

type Point =
  | { x: number; y: number; pill: string }
  | { x: number; y: number; label: [string, string]; lift?: number };

const engineerJourney = {
  id: "eng",
  alt: "Journey of an engineer or contractor: focused at first, then frustrated as the catalog follows business segments and every level reloads the page.",
  line: "M0 200 C35 160 95 60 150 60 C190 60 226 108 258 134 C286 157 308 170 336 174 C364 178 392 197 420 198 L480 201",
  fill: "M-20 250 L-20 223 L0 200 C35 160 95 60 150 60 C190 60 226 108 258 134 C286 157 308 170 336 174 C364 178 392 197 420 198 L480 201 L500 202 L500 250 Z",
  points: [
    { x: 31.25, y: 24, pill: "Purposeful" },
    { x: 53.75, y: 53.6, label: ["Digs layers deep", "for specs"], lift: 11.5 },
    { x: 70, y: 69.6, label: ["Every click", "reloads the page"] },
    { x: 87.5, y: 79.2, pill: "Stalled" },
  ] satisfies Point[],
};

const newBuyerJourney = {
  id: "new",
  alt: "Journey of a new buyer: curious at first, dipping when unsure which product line to choose, recovering briefly on another category, then lost.",
  line: "M0 190 C30 140 85 100 120 100 C152 100 172 172 205 172 C238 172 268 130 300 130 C340 130 380 205 420 205 L480 207",
  fill: "M-20 250 L-20 214 L0 190 C30 140 85 100 120 100 C152 100 172 172 205 172 C238 172 268 130 300 130 C340 130 380 205 420 205 L480 207 L500 208 L500 250 Z",
  points: [
  { x: 25, y: 40, pill: "Curious" },
  { x: 42.7, y: 68.8, label: ["Can't tell product", "lines apart"] },
  { x: 62.5, y: 52, label: ["Thinks they", "found it"] },
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
      <svg viewBox="0 0 480 250" aria-hidden="true" className="absolute inset-0 size-full">
        <defs>
          <linearGradient id={`${id}-tint`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="480" y2="0">
            <stop offset="0" stopColor="#a6d878" />
            <stop offset="0.3" stopColor="#bfdd8e" />
            <stop offset="0.5" stopColor="#e6dca2" />
            <stop offset="0.75" stopColor="#f1d0ae" />
            <stop offset="1" stopColor="#eebcb6" />
          </linearGradient>
          <linearGradient id={`${id}-fadeG`} gradientUnits="userSpaceOnUse" x1="0" y1="30" x2="0" y2="250">
            <stop offset="0" stopColor="#fff" stopOpacity="1" />
            <stop offset="0.45" stopColor="#fff" stopOpacity="0.8" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <mask id={`${id}-fade`} maskUnits="userSpaceOnUse" x="0" y="0" width="480" height="250">
            <rect width="480" height="250" fill={`url(#${id}-fadeG)`} />
          </mask>
          <filter id={`${id}-soft`} x="-10%" y="-10%" width="120%" height="130%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
        </defs>
        <g mask={`url(#${id}-fade)`}>
          <path d={fill} fill={`url(#${id}-tint)`} filter={`url(#${id}-soft)`} />
        </g>
        <path d={line} fill="none" stroke="currentColor" strokeWidth="1.8" strokeDasharray="6 4" />
      </svg>

      {points.map((p) => (
        <div key={p.x} className="absolute size-0" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
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

export default function Home() {
  return (
    <div className="overflow-x-clip">
        <div className="mx-auto w-full max-w-[540px] text-pretty">
          <h1 className="max-w-[36ch] text-[22px] font-semibold tracking-tight leading-snug text-balance mt-10">
            Rethinking Product Navigation for $250K+ Industrial Systems
          </h1>
          <ul className="mt-3.5 mb-4.5 flex items-start gap-2 text-[15px]">
          <li>
            <a
              href="https://www.ebaratech.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-[30px] items-center gap-1.5 rounded-full border border-current/15 px-3 transition-colors hover:border-current/40"
            >
              <span className="opacity-60">Web Redesign</span>
              <span>Ebara Technologies</span>
              <svg aria-hidden="true" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17 17 7" />
                <path d="M8 7h9v9" />
              </svg>
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
          {[
            ["Focus", "Navigation"],
          ].map(([label, value]) => (
            <li key={label} className="inline-flex h-[30px] items-center gap-1.5 rounded-full border border-current/15 px-3">
              <span className="opacity-60">{label}</span>
              <span>{value}</span>
            </li>
          ))}
        </ul>
        <figure className="mx-0 my-5">
            <Slider
              before={ebaraBefore}
              after={ebaraAfter}
              beforeAlt="The old products page, with all 10 categories shown at once"
              afterAlt="The redesigned mega menu, with each level opening in place"
            />
          </figure>
          <p className="text-lg mb-3">
            Most of us have never bought anything this expensive online, so my work began by asking:{" "}
            <em>how should navigation work for a purchase like this?</em>
          </p>
          <hr className="border-current/20 mb-3.5" />

          <h2 className="max-w-[36ch] text-[21px] font-semibold tracking-tight leading-snug text-balance mb-3">Untangling Choice Architecture</h2>
          <p className="text-lg mb-3">To explore that question, I interviewed stakeholders (senior leadership & sales reps) and audited our navigation’s choice architecture.</p>
<p className="text-lg mb-3"> something here. Combined, the qualitative and quantitative findings pointed toward two audiences:</p>
          <p className="text-lg mb-3">
  <span className="font-semibold">1. Engineers who know what they need</span>. They’re looking for technical specifications, but layers of navigation stall them.</p>
          <figure className="mx-0 mb-10">
            <JourneyChart {...engineerJourney} />
          </figure>

          <p className="text-lg mb-3">
  <span className="font-semibold">2. Visitors exploring what they need</span>. They’re looking for smaller accessory purchases, but get lost in a tangle of choices.</p>
          <figure className="mx-0 mb-10">
            <JourneyChart {...newBuyerJourney} />
          </figure>
          <p className="text-lg mb-3">Though they arrived with different goals, both were nudged away by high interaction costs before finding what they came for.</p>
          <hr className="border-current/20 mb-3.5" />


          <h2 className="max-w-[36ch] text-[21px] font-semibold tracking-tight leading-snug text-balance mb-3">Forming Hypotheses</h2>
<p className="text-lg mb-8">Thinking inversely, I started from where users dropped off and designed backward. That led to two hypotheses.</p>

<dl className="mb-8 grid gap-x-6 gap-y-6 pt-6 sm:grid-cols-[9rem_1fr]">
  <dt className="font-semibold">Findability</dt>
  <dd className="text-lg opacity-80">Through progressive disclosure, a guided path would lead users to what they need, instead of leaving them to find it alone.</dd>
  <dt className="font-semibold">Performance</dt>
  <dd className="text-lg opacity-80">Through a mega menu, each level would open in place, instead of reloading the full page on every click.</dd>
</dl>

          <figure className="mt-5">
  <ChoiceArchitecture />
</figure>
          </div>
    </div>
  );
}