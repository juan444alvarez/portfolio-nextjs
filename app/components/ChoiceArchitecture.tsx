// Before/after choice architecture for the Ebara case study.
// Drawn on a 540-unit grid so 1 unit = 1px at the column's max width;
// labels scale with cqw like JourneyChart. No hooks, so it works as a server component.

const CA_W = 540;
const CA_H = 444;
const SQ = 12;
const GAP = 5;
const PAD = 8;
const STEP = SQ + GAP;

type FlowBlock = { x: number; y: number; cols: number; count: number; label: [string, string] };

type Flow = {
  color: string;
  dashed: boolean;
  reloads: boolean;
  title: [string, string];
  x: number;
  blocks: FlowBlock[];
  time: { value: string; y: number };
  connectorLabel?: string;
};

const beforeFlow: Flow = {
  color: "#eebcb6",
  dashed: false,
  reloads: true,
  title: ["Before", "everything at once"],
  x: 0,
  blocks: [
    { x: 0, y: 32, cols: 8, count: 31, label: ["Menu", "31 options"] },
    { x: 0, y: 167, cols: 4, count: 4, label: ["Level 2", "Product categories"] },
    { x: 0, y: 251, cols: 6, count: 6, label: ["Level 3", "Subcategories"] },
    { x: 0, y: 335, cols: 3, count: 3, label: ["Level 4", "Product"] },
  ],
  time: { value: "14s", y: 387 },
};

const afterFlow: Flow = {
  color: "#a6d878",
  dashed: true,
  reloads: false,
  title: ["After", "revealed step by step"],
  x: 278,
  blocks: [
    { x: 278, y: 32, cols: 9, count: 9, label: ["Menu", "9 options"] },
    { x: 278, y: 96, cols: 6, count: 6, label: ["Level 2", "Subcategories"] },
    { x: 278, y: 160, cols: 3, count: 3, label: ["Level 3", "Product"] },
  ],
  time: { value: "7s", y: 212 },
  connectorLabel: "Opens in place",
};

const caText = "text-[length:max(9px,2.4cqw)] leading-[1.3]";
const caPct = (v: number, of: number) => `${(v / of) * 100}%`;

function blockBox(b: FlowBlock) {
  const rows = Math.ceil(b.count / b.cols);
  return {
    w: PAD * 2 + b.cols * SQ + (b.cols - 1) * GAP,
    h: PAD * 2 + rows * SQ + (rows - 1) * GAP,
    picked: (rows - 1) * b.cols, // first square of the bottom row, so the path drops straight down
  };
}

function connectors(flow: Flow) {
  return flow.blocks.slice(0, -1).map((a, i) => {
    const x = a.x + PAD + SQ / 2;
    const y1 = a.y + blockBox(a).h - PAD;
    const y2 = flow.blocks[i + 1].y;
    return { x, y1, y2, mid: (y1 + y2) / 2 };
  });
}

function FlowShapes({ flow }: { flow: Flow }) {
  const { color, dashed, reloads, blocks } = flow;
  const stroke = { stroke: color, strokeWidth: 1.5, strokeDasharray: dashed ? "6 4" : undefined };

  return (
    <g>
      {blocks.map((b, bi) => {
        const box = blockBox(b);
        const isLast = bi === blocks.length - 1;
        return (
          <g key={bi}>
            <rect x={b.x + 0.5} y={b.y + 0.5} width={box.w - 1} height={box.h - 1} rx="6"
              fill="currentColor" fillOpacity="0.03" stroke="currentColor" strokeOpacity="0.14" />
            {Array.from({ length: b.count }, (_, i) => {
              const sx = b.x + PAD + (i % b.cols) * STEP;
              const sy = b.y + PAD + Math.floor(i / b.cols) * STEP;
              const picked = i === box.picked;
              if (picked && isLast) {
                return (
                  <g key={i}>
                    <rect x={sx} y={sy} width={SQ} height={SQ} rx="2.5" fill={color} opacity="0.6" filter="url(#ca-glow)" />
                    <rect x={sx} y={sy} width={SQ} height={SQ} rx="2.5" fill={color} />
                    <path d="M5 12.5l4.5 4.5L19 7.5" transform={`translate(${sx} ${sy}) scale(0.5)`}
                      fill="none" stroke="#111" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                );
              }
              return (
                <rect key={i} x={sx + 0.5} y={sy + 0.5} width={SQ - 1} height={SQ - 1} rx="2.5"
                  fill={picked ? color : "currentColor"} fillOpacity={picked ? 0.18 : 0.05}
                  stroke={picked ? color : "currentColor"} strokeOpacity={picked ? 1 : 0.28} />
              );
            })}
          </g>
        );
      })}

      {connectors(flow).map(({ x, y1, y2, mid }, i) =>
        reloads ? (
          <g key={i}>
            <line x1={x} y1={y1} x2={x} y2={mid - 10} {...stroke} />
            <line x1={x} y1={mid + 10} x2={x} y2={y2} {...stroke} />
            <circle cx={x} cy={mid} r="9.5" fill="none" stroke="currentColor" strokeOpacity="0.28" />
            <g transform={`translate(${x - 6} ${mid - 6}) scale(0.5)`} fill="none" stroke={color}
              strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 1 1-2.64-6.36" />
              <path d="M21 3v6h-6" />
            </g>
          </g>
        ) : (
          <line key={i} x1={x} y1={y1} x2={x} y2={y2} {...stroke} />
        ),
      )}
    </g>
  );
}

function FlowLabels({ flow }: { flow: Flow }) {
  const { blocks, reloads, color, title, x, time, connectorLabel } = flow;

  return (
    <>
      <div
        className="absolute -translate-y-1/2 whitespace-nowrap text-[length:max(10px,2.8cqw)] font-medium leading-none"
        style={{ left: caPct(x, CA_W), top: caPct(10, CA_H) }}
      >
        {title[0]} <span className="font-normal opacity-60">— {title[1]}</span>
      </div>

      {blocks.map((b, i) => {
        const box = blockBox(b);
        return (
          <div
            key={i}
            className={`absolute -translate-y-1/2 whitespace-nowrap ${caText}`}
            style={{ left: caPct(b.x + box.w + 10, CA_W), top: caPct(b.y + box.h / 2, CA_H) }}
          >
            <span className="block">{b.label[0]}</span>
            <span className="block opacity-60">{b.label[1]}</span>
          </div>
        );
      })}

      {connectors(flow).map(({ x: cx, mid }, i) => {
        const label = reloads ? "Page load" : i === 0 ? connectorLabel : undefined;
        if (!label) return null;
        return (
          <div
            key={i}
            className={`absolute -translate-y-1/2 whitespace-nowrap opacity-60 ${caText}`}
            style={{ left: caPct(cx + (reloads ? 18 : 10), CA_W), top: caPct(mid, CA_H) }}
          >
            {label}
          </div>
        );
      })}

      <div className="absolute whitespace-nowrap" style={{ left: caPct(x, CA_W), top: caPct(time.y, CA_H) }}>
        <span className="block text-[length:max(18px,5.2cqw)] font-medium leading-none tracking-tight" style={{ color }}>
          {time.value}
        </span>
        <span className={`mt-[1.2cqw] block opacity-60 ${caText}`}>Time to find</span>
      </div>
    </>
  );
}

export default function ChoiceArchitecture() {
  return (
    <div
      role="img"
      aria-label="Choice architecture before and after. Before: a menu of 31 options, then a page load before product categories, another before subcategories and another before the product, about 14 seconds to find. After: a menu of 9 options, with subcategories and then the product opening in place, about 7 seconds to find."
      className="@container relative aspect-[540/444] w-full select-none"
    >
      <svg viewBox={`0 0 ${CA_W} ${CA_H}`} aria-hidden="true" className="absolute inset-0 size-full overflow-visible">
        <defs>
          <filter id="ca-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>
        <FlowShapes flow={beforeFlow} />
        <FlowShapes flow={afterFlow} />
      </svg>
      <FlowLabels flow={beforeFlow} />
      <FlowLabels flow={afterFlow} />
    </div>
  );
}