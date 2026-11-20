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
    <div className="">
        <div className="mx-auto w-full max-w-[540px] text-pretty">
          <h1 className="max-w-[36ch] text-[22px] font-semibold tracking-tight leading-snug text-balance mb-3">
            Rethinking Product Navigation for $250K+ Industrial Systems
          </h1>
          <p className="text-lg mb-3">At this price point, people approach purchasing differently than in a typical e-commerce experience.</p>
          <p className="text-lg mb-3">
            Most of us have never bought anything this expensive online, so my work began with one question:{" "}
            <em>how should navigation work for a purchase like this?</em>
          </p>
          <h2 className="max-w-[36ch] text-[21px] font-semibold tracking-tight leading-snug text-balance mb-3">Untangling choice architecture through end-to-end UX research</h2>
            <p className="text-lg mb-3">I opened by tracing user journeys and drop-off points through Google Analytics, then interviewed stakeholders (senior leadership and sales reps) to learn who we were designing for.</p>
            <p className="text-lg mb-3">The data and conversations pointed toward two audiences:</p>
          <p className="text-lg mb-3">
  <span className="font-semibold">1. Engineers who know what they need</span>. They’re looking for technical specifications, but layers of navigation bog them down.</p>
          <figure className="mx-0 mb-10">
            <JourneyChart {...engineerJourney} />
          </figure>

          <p className="text-lg mb-3">
  <span className="font-semibold">2. Visitors exploring what they need</span>. They’re looking for smaller accessory purchases, but a tangle of choices confuses them.</p>
          <figure className="mx-0 mb-10">
            <JourneyChart {...newBuyerJourney} />
          </figure>
          <p className="text-lg mb-3">Engineers make larger purchases, so they became our primary audience, with visitors secondary. Despite having different levels of knowledge, both were nudged to leave before finding what they came for.</p>
          <p className="text-lg mb-3">Thinking inversely, the design opportunity was to nudge them forward by reducing the number of options and pacing decisions across sequential steps.</p>

          <h2 className="max-w-[36ch] text-[21px] font-semibold tracking-tight leading-snug text-balance mb-3">Forming Hypotheses</h2>
          <p className="text-lg mb-3">My primary hypothesis was that collapsing the catalog’s hierarchy into a single view would help both audiences find products more easily. I took a user-centric approach to click rate optimization, aiming to make each click count instead of adding more.</p>
          <p className="text-lg mb-3">My secondary hypothesis was technical: every click triggered a full page reload, which I could remove on the front end by revealing each level in place.</p>
          </div>
    </div>
  );
}