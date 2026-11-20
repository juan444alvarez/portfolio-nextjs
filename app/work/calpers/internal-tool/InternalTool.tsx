"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

/* =========================================================
   TYPES
   ========================================================= */
type StyleId = "driver" | "guardian" | "pioneer" | "integrator";

type Pairing = {
  with: StyleId;
  summary: ReactNode;
  do: string;
  skip: string;
  use: string[]; // keys from this style's strengths
  callout: { title: string; body: string };
};

type ChemistryStyle = {
  label: string;
  plural: string;
  blurb: string; // card description on screen one
  lede: string; // heading on screen two
  strengths: Record<string, { title: string; desc: string }>;
  pairings: Pairing[];
};

/* =========================================================
   CONTENT: edit copy and team here
   ========================================================= */

// Add initials and respective chemistry style to populate avatars
const TEAM: { initials: string; style: StyleId }[] = [
  { initials: "JK", style: "integrator" },
  { initials: "SC", style: "integrator" },
  { initials: "JP", style: "integrator" },
  { initials: "CT", style: "integrator" },
  { initials: "TR", style: "integrator" },
  { initials: "KF", style: "integrator" },
  { initials: "JR", style: "guardian" },
];
const MAX_AVATARS = Infinity; // show everyone

// Card order on screen one
const ORDER: StyleId[] = ["driver", "guardian", "pioneer", "integrator"];

const STYLES: Record<StyleId, ChemistryStyle> = {
  driver: {
    label: "Driver",
    plural: "Drivers",
    blurb:
      "Direct, quantitative, focused on outcomes. You move fast, debate openly, and want decisions made.",
    lede: "Drivers thrive on challenges. They value competence and are energized by sharp thinking. They do their best work with people who get to the point and keep things moving.",
    strengths: {
      focus: { title: "Focus", desc: "You cut through optionality to the next step." },
      directness: { title: "Directness", desc: "You name what you want without flourish." },
      logic: { title: "Logic", desc: "You test ideas against the evidence." },
      momentum: { title: "Momentum", desc: "You keep decisions from stalling." },
    },
    pairings: [
      {
        with: "pioneer",
        summary: (
          <>
            <strong>You’re both inventive, and Pioneers value decisiveness</strong>. They still
            need room to explore, so don’t let skepticism shut down a big idea just because it
            sounds impractical at first.
          </>
        ),
        do: "Move the conversation forward, but leave room for them to think aloud and refine the approach.",
        skip: "Don’t rush to pick apart an idea before they’ve had a chance to fully think it through.",
        use: ["focus", "directness"],
        callout: {
          title: "Channel focus into generative pressure.",
          body: "Pair your directness with one open question per meeting. A Driver who asks ‘what else could work?’ unlocks the Pioneer’s best ideas and keeps the timeline intact.",
        },
      },
      {
        with: "guardian",
        summary: (
          <>
            <strong>You both thrive on facts and data</strong>. Be patient with a Guardian’s need
            to get into details. Help them see the big picture and don’t short-circuit the
            process.
          </>
        ),
        do: "Be prepared to continue reviewing the details even if you’ve already reached a conclusion yourself.",
        skip: "Avoid forcing a decision before they’ve had a chance to fully consider it.",
        use: ["logic", "focus"],
        callout: {
          title: "Turn rigor into patience.",
          body: "Use your strength for clarity and evidence to support a more patient pace, so the process feels thorough rather than rushed.",
        },
      },
      {
        with: "driver",
        summary: (
          <>
            <strong>
              You appreciate each other’s directness and can challenge one another in a productive
              way
            </strong>
            , but you may need to stay mindful of who is steering the conversation.
          </>
        ),
        do: "Consider the broader context and the human impact of your decisions, not just the fastest path forward.",
        skip: "Avoid turning every conversation into a contest.",
        use: ["momentum", "directness"],
        callout: {
          title: "Point the momentum outward.",
          body: "Agree on the goal first, then divide responsibilities clearly. Each of you should name one risk you may be overlooking, so you can move quickly without missing something important.",
        },
      },
      {
        with: "integrator",
        summary: (
          <>
            <strong>How you approach the conversation matters as much as where it ends up.</strong>{" "}
            Slowing down enough to notice their perspective can help things move more smoothly.
          </>
        ),
        do: "Help them make a decision and be patient with their desire for consensus.",
        skip: "Don’t be so focused on your goal that you forget to connect on a personal level.",
        use: ["directness", "logic"],
        callout: {
          title: "Use directness to ask about people.",
          body: "Be as direct about people as you are about outcomes: ask ‘who does this affect, and how will it land?’ Then weigh the answer as seriously as any data point.",
        },
      },
    ],
  },

  guardian: {
    label: "Guardian",
    plural: "Guardians",
    blurb:
      "Methodical, detail-oriented, careful with risk. You value structure, follow through, and want it done right.",
    lede: "Guardians value stability and strive for accuracy and certainty. They focus on details and are known for bringing order to chaos. They expect others to be prepared.",
    strengths: {
      structure: { title: "Structure", desc: "You turn loose plans into clear steps." },
      diligence: { title: "Diligence", desc: "You catch the detail everyone else skipped." },
      reliability: { title: "Reliability", desc: "You do what you said, when you said." },
      prudence: { title: "Prudence", desc: "You see risk before it becomes a problem." },
    },
    pairings: [
      {
        with: "integrator",
        summary: (
          <>
            <strong>Connect with them before diving into any plans.</strong> Be open to tangential
            thinking and share facts that may help them make a decision.
          </>
        ),
        do: "Integrators share your distaste for confrontation, so make sure any issues that need to be discussed are surfaced and not ignored.",
        skip: "Avoid assuming a roundabout discussion is off track; an Integrator may simply be thinking through the issue differently.",
        use: ["reliability", "structure"],
        callout: {
          title: "Turn reliability into warmth.",
          body: "Follow through on the small personal things too: the check-in you promised, the thank-you you meant to send. Integrators read consistency as care.",
        },
      },
      {
        with: "driver",
        summary: (
          <>
            You both <strong>lean on data and analysis</strong>, but Drivers want to jump straight
            to the bottom line. Keep your focus on what makes sense for the future, rather than
            what’s worked in the past.
          </>
        ),
        do: "Work at their speed while helping them feel informed, supported, and ready to move forward.",
        skip: "Don’t over-explain your full thought process to a Driver, or you may lose their attention.",
        use: ["diligence", "prudence"],
        callout: {
          title: "Let rigor speed you up.",
          body: "Do the analysis, then commit to a call with a confidence level: ‘I’m 80% sure, and here’s why.’ Drivers trust a fast, reasoned answer.",
        },
      },
      {
        with: "guardian",
        summary: (
          <>
            <strong>Challenge yourselves to revisit the over-arching goal</strong>, and ask if your
            approach continues to serve that objective.
          </>
        ),
        do: "Support each other by slowing things down just enough to think clearly, then moving forward with confidence.",
        skip: "Avoid fixating on unknowns and instead focus on what is necessary to move ahead.",
        use: ["structure", "prudence"],
        callout: {
          title: "Put a limit on caution.",
          body: "Agree on what success looks like before you start. Two Guardians can keep improving something well past the point of usefulness, so set a clear finish line and commit to it.",
        },
      },
      {
        with: "pioneer",
        summary: (
          <>
            <strong>Hold off on the details</strong> and let the conversation flow. Stay open to
            new ideas and shifts in direction, and offer structure only where it actually helps.
          </>
        ),
        do: "Say what you like before what concerns you.",
        skip: "Don’t get lost in caution and detail at the expense of their energy and ideas.",
        use: ["structure", "diligence"],
        callout: {
          title: "Use structure to make room for ideas.",
          body: "Block a short, no-critique window for brainstorming, then run your risk review after. Your process becomes the thing that lets a Pioneer’s ideas survive.",
        },
      },
    ],
  },

  pioneer: {
    label: "Pioneer",
    plural: "Pioneers",
    blurb:
      "Imaginative, spontaneous, energized by possibility. You chase big ideas, take risks, and want to try what’s next.",
    lede: "Pioneers love exploring new possibilities. They particularly enjoy working with others and generating novel ideas. Pioneers believe everyone should dream big.",
    strengths: {
      imagination: { title: "Imagination", desc: "You see options others haven’t considered." },
      energy: { title: "Energy", desc: "You lift the room and get people moving." },
      adaptability: { title: "Adaptability", desc: "You adjust to change while keeping a steady pace." },
      boldness: { title: "Boldness", desc: "You’re willing to try before it’s certain." },
    },
    pairings: [
      {
        with: "driver",
        summary: (
          <>
            <strong>You’re both bold, fast thinkers</strong>. Show Drivers the logic behind your
            ideas, think through the implications of a decision, and watch that you don’t get too
            comfortable with risk.
          </>
        ),
        do: "Your naturally bold and quick thinking is likely to engage a Driver. Bring your out-of-the-box ideas; Drivers like to explore too.",
        skip: "Provide too many options or caveats; they want a clear recommendation without a lot of noise.",
        use: ["boldness", "energy"],
        callout: {
          title: "Aim your boldness at a result.",
          body: "Before you share an idea, name what it achieves and how you’d know it worked. Drivers back an idea more willingly when it comes with a clear win.",
        },
      },
      {
        with: "integrator",
        summary: (
          <>
            <strong>You share a creative streak</strong>, but Integrators appreciate your ideas
            more if you give them context. Help them see how your thinking applies in practice.
          </>
        ),
        do: "Frame ideas with context and people stories.",
        skip: "Don’t treat structure or consensus as a roadblock.",
        use: ["energy", "adaptability"],
        callout: {
          title: "Turn energy into invitation.",
          body: "Share the idea early and unfinished, then ask who else should shape it. Integrators commit when they feel included.",
        },
      },
      {
        with: "pioneer",
        summary: (
          <>
            <strong>
              You’ll feed off each other’s energy and love exploring possibilities together
            </strong>
            . Just bring it back down to earth by turning the best ideas into concrete next steps
            so the direction is clear.
          </>
        ),
        do: "Build on each other’s energy by exploring possibilities together before narrowing in on a direction.",
        skip: "Don’t let the excitement of a new idea pull you away from finishing the work at hand.",
        use: ["imagination", "adaptability"],
        callout: {
          title: "Use adaptability to close loops.",
          body: "Choose main ideas to pursue and park the rest. Two Pioneers bring a lot of energy and imagination, and it’s especially rewarding when that starts to take shape in a real, concrete way.",
        },
      },
      {
        with: "guardian",
        summary: (
          <>
            <strong>Bring your ideas down to earth a bit</strong>; give the conversation some
            structure. Be patient, clear, and give Guardians time to think and respond in their
            own way.
          </>
        ),
        do: "Bring the conversation back to the essentials, and make it easy for them to stay with you.",
        skip: "Avoid cutting in or trying to cover every silence in the conversation.",
        use: ["imagination", "boldness"],
        callout: {
          title: "Imagine the risks, too.",
          body: "Point your imagination at what could go wrong and how you’d handle it. A Pioneer who arrives with a plan B earns a Guardian’s trust and enables them to help.",
        },
      },
    ],
  },

  integrator: {
    label: "Integrator",
    plural: "Integrators",
    blurb:
      "Empathetic, diplomatic, built for connection. You read the room, seek consensus, and bring everyone along.",
    lede: "Integrators are all about connection. They value meaning, exploring different interpretations or perspectives, and believe everything involves a bit of give and take.",
    strengths: {
      empathy: { title: "Empathy", desc: "You notice how people are really doing." },
      diplomacy: { title: "Diplomacy", desc: "You find the words that keep everyone in." },
      patience: { title: "Patience", desc: "You give ideas and people time to land." },
      connection: { title: "Connection", desc: "You know who should be talking to whom." },
    },
    pairings: [
      {
        with: "guardian",
        summary: (
          <>
            <strong>You bring different strengths to the conversation</strong>. Help Guardians see
            where things are headed, invite their help with the details, and be clear about who
            is doing what and when.
          </>
        ),
        do: "Give the conversation enough shape that your ideas feel clear and easy to follow.",
        skip: "Avoid backing away from a difficult point when it would help move things forward.",
        use: ["patience", "diplomacy"],
        callout: {
          title: "Let patience show up as precision.",
          body: "Use your high-level perspective to guide the way, and lean on the Guardian’s rigor to make sure the finer points are fully thought through.",
        },
      },
      {
        with: "pioneer",
        summary: (
          <>
            <strong>You share a big imagination and comfort with ambiguity</strong>. Think through
            how it gets done, step by step, and resist trying to bring everyone in or tackle
            everything at once.
          </>
        ),
        do: "Bring your strength for connection and consensus to help the idea move forward without losing momentum.",
        skip: "Avoid adding extra layers to a process when the way forward is already taking shape.",
        use: ["connection", "empathy"],
        callout: {
          title: "Use connection to move faster.",
          body: "As things unfold, stay connected and bring the right people in early so you can keep moving without leaving anyone out.",
        },
      },
      {
        with: "integrator",
        summary: (
          <>
            <strong>Connection comes easily, but exploring every alternative</strong> can stall
            you both. If there’s an elephant in the room, name it, even when it’s uncomfortable.
          </>
        ),
        do: "Name the tension out loud.",
        skip: "Agreeing just to avoid friction.",
        use: ["diplomacy", "empathy"],
        callout: {
          title: "Use diplomacy to disagree well.",
          body: "Take turns playing the skeptic. Two Integrators can keep everyone comfortable, so make room for an honest no.",
        },
      },
      {
        with: "driver",
        summary: (
          <>
            <strong>You both see the big picture, which Drivers appreciate.</strong> Get to the
            point fast and back it with logic, don’t take their directness personally, and hold
            your ground.
          </>
        ),
        do: "Start with the bottom line.",
        skip: "Taking their directness personally.",
        use: ["empathy", "connection"],
        callout: {
          title: "Be direct because you care.",
          body: "Be honest and direct, while making it clear that your intent is to help move things forward in a thoughtful way.",
        },
      },
    ],
  },
};

/* =========================================================
   TIMING (keep in sync with internal-tool.css)
   ========================================================= */
const ADVANCE_DELAY = 300; // ms between picking a card and leaving screen one
const LEAVE_MS = 360; // --load-dur (600ms) × 0.6, the screen-one exit animation

/* =========================================================
   HELPERS + ICONS
   ========================================================= */
const stagger = (i: number) => ({ "--i": i }) as CSSProperties;
const article = (word: string) => (/^[aeiou]/i.test(word) ? "an" : "a");

// Wraps the first mention of `word` in <em> so it picks up the style colour
function emphasize(text: string, word: string): ReactNode {
  const i = text.indexOf(word);
  if (i === -1) return text;
  return (
    <>
      {text.slice(0, i)}
      <em>{word}</em>
      {text.slice(i + word.length)}
    </>
  );
}

const iconArrow = (
  <svg className="icon-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
const iconCheck = (
  <svg className="icon-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);
const iconBack = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
);
const iconChevron = (
  <svg className="acc__chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 9l6 6 6-6" />
  </svg>
);
const iconDo = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);
const iconSkip = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

/* =========================================================
   PAGE
   ========================================================= */
type Phase = "intake" | "leaving" | "pairings";
type Ripple = { id: number; x: number; y: number; size: number };

export default function InternalTool({ className = "" }: { className?: string }) {
  const [phase, setPhase] = useState<Phase>("intake");
  const [selected, setSelected] = useState<StyleId | null>(null);
  const [ripple, setRipple] = useState<Ripple | null>(null);
  const [openId, setOpenId] = useState<StyleId | null>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Card picked → wait a beat → play screen one's exit
  useEffect(() => {
    if (!selected || phase !== "intake") return;
    const t = setTimeout(() => setPhase("leaving"), ADVANCE_DELAY);
    return () => clearTimeout(t);
  }, [selected, phase]);

  // Exit finished → show screen two
  useEffect(() => {
    if (phase !== "leaving") return;
    const t = setTimeout(() => setPhase("pairings"), LEAVE_MS);
    return () => clearTimeout(t);
  }, [phase]);

  // Screen two shown → move focus to its heading and jump to the top
  useEffect(() => {
    if (phase !== "pairings") return;
    titleRef.current?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, [phase]);

  /* ---------- Spotlight follows the cursor on each card ---------- */
  function moveSpotlight(e: ReactPointerEvent<HTMLButtonElement>) {
    if (selected) return;
    const card = e.currentTarget;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    card.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  }
  function resetSpotlight(e: ReactPointerEvent<HTMLButtonElement>) {
    if (selected) return;
    e.currentTarget.style.removeProperty("--mx");
    e.currentTarget.style.removeProperty("--my");
  }

  /* ---------- Selection ---------- */
  function pick(id: StyleId, e: ReactMouseEvent<HTMLButtonElement>) {
    if (selected) return;
    const r = e.currentTarget.getBoundingClientRect();
    const fromPointer = e.detail > 0; // keyboard clicks have detail === 0
    const x = fromPointer ? e.clientX - r.left : r.width / 2;
    const y = fromPointer ? e.clientY - r.top : r.height / 2;
    const size = Math.hypot(Math.max(x, r.width - x), Math.max(y, r.height - y)) * 2;
    setRipple({ id: Date.now(), x, y, size });
    setSelected(id);
  }

  function goBack() {
    setSelected(null);
    setRipple(null);
    setOpenId(null);
    setPhase("intake");
  }

  /* ---------- Screen two ---------- */
  if (phase === "pairings" && selected) {
    const self = STYLES[selected];
    return (
      <div className={`chem ${className}`}>
        <section className="screen screen--top" aria-labelledby="pairings-title">
          <div className="shell shell--wide">
            <button className="back reveal" style={stagger(0)} type="button" onClick={goBack}>
              {iconBack}
              Change style <span className={`back__dot hue--${selected}`} aria-hidden="true" />
            </button>

            <h2
              id="pairings-title"
              ref={titleRef}
              tabIndex={-1}
              className={`s2__lede reveal hue--${selected}`}
              style={stagger(1)}
            >
              {emphasize(self.lede, self.plural)}
            </h2>

            <div className="segmented reveal" style={stagger(2)}>
              <span className="segmented__item">Pairings</span>
            </div>

            <ul className="acc" role="list">
              {self.pairings.map((p, idx) => (
                <PairingRow
                  key={p.with}
                  selfId={selected}
                  pairing={p}
                  index={idx}
                  open={openId === p.with}
                  onToggle={() => setOpenId((cur) => (cur === p.with ? null : p.with))}
                />
              ))}
            </ul>
          </div>
        </section>
      </div>
    );
  }

  /* ---------- Screen one ---------- */
  return (
    <div className={`chem ${className}`}>
      <section
        className={`screen${phase === "leaving" ? " is-leaving" : ""}`}
        aria-labelledby="intake-title"
      >
        <div className="shell">
          <header className="intro">
            <h1 id="intake-title" className="intro__title reveal" style={stagger(0)}>
              Work better,
              <br />
              with anyone.
            </h1>
            <p className="intro__lede reveal" style={stagger(1)}>
              Pick the chemistry style that sounds most like you, and learn how to work well with
              the other ones.
            </p>
          </header>

          <ul className={`cards${selected ? " has-selection" : ""}`} role="list">
            {ORDER.map((id, i) => {
              const s = STYLES[id];
              const isSelected = selected === id;
              return (
                <li key={id} className="card-wrap reveal" style={stagger(2 + i)}>
                  <button
                    type="button"
                    className={`card card--${id}${isSelected ? " is-selected" : ""}`}
                    aria-pressed={isSelected}
                    aria-disabled={selected && !isSelected ? true : undefined}
                    onPointerMove={moveSpotlight}
                    onPointerLeave={resetSpotlight}
                    onClick={(e) => pick(id, e)}
                  >
                    <span className="card__content">
                      <span className="card__title">{s.label}</span>
                      <span className="card__desc">{s.blurb}</span>
                    </span>
                    <span className="card__action" aria-hidden="true">
                      {iconArrow}
                      {iconCheck}
                    </span>
                    {isSelected && ripple && (
                      <span
                        key={ripple.id}
                        className="ripple"
                        style={{ left: ripple.x, top: ripple.y, width: ripple.size, height: ripple.size }}
                        onAnimationEnd={() => setRipple(null)}
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          <p className="sr-only" aria-live="polite">
            {selected ? `${STYLES[selected].label} selected.` : ""}
          </p>
        </div>
      </section>
    </div>
  );
}

/* =========================================================
   PIECES
   ========================================================= */
function PairingRow({
  selfId,
  pairing,
  index,
  open,
  onToggle,
}: {
  selfId: StyleId;
  pairing: Pairing;
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  const self = STYLES[selfId];
  const other = STYLES[pairing.with];
  const id = `pair-${pairing.with}`;
  const title =
    pairing.with === selfId
      ? `Get more from two ${self.plural}`
      : `Build ${other.label} skills as ${article(self.label)} ${self.label}`;

  return (
    <li
      className={`acc__item hue--${pairing.with} reveal${open ? " is-open" : ""}`}
      style={stagger(3 + index)}
    >
      <h3 className="acc__heading">
        <button
          className="acc__trigger"
          type="button"
          id={`${id}-btn`}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={onToggle}
        >
          <span className="acc__who">
            {iconChevron}
            <span className="acc__name">
              <span className="dot" aria-hidden="true" />
              With {other.plural}
            </span>
            <span className="acc__summary">{pairing.summary}</span>
          </span>
          <Team styleId={pairing.with} />
        </button>
      </h3>

      <div
        className="acc__panel"
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-btn`}
        inert={!open}
      >
        <div className="acc__panel-inner">
          <div className="acc__body">
            <div className="acc__section dos">
              <div className="dos__col">
                <span className="label label--do">{iconDo}Do</span>
                <p className="dos__text">{pairing.do}</p>
              </div>
              <div className="dos__col">
                <span className="label label--skip">{iconSkip}Skip</span>
                <p className="dos__text">{pairing.skip}</p>
              </div>
            </div>

            <div className="acc__section">
              <div className="grow__head">
                <h4 className="grow__title">{title}</h4>
                <p className="grow__sub">
                  Draw on what you already do well as {article(self.label)} {self.label}.
                </p>
              </div>
              <div className="grow__grid">
                <ul
                  className={`strengths hue--${selfId}`}
                  role="list"
                  aria-label={`Your ${self.label} strengths`}
                >
                  {pairing.use.map((key) => {
                    const s = self.strengths[key];
                    return (
                      <li key={key} className="tile strength">
                        <p className="tile__title">
                          <span className="dot" aria-hidden="true" />
                          {s.title}
                        </p>
                        <p className="tile__body">{s.desc}</p>
                      </li>
                    );
                  })}
                </ul>
                <div className="tile callout">
                  <p className="tile__title">
                    <span className="dot" aria-hidden="true" />
                    {pairing.callout.title}
                  </p>
                  <p className="tile__body">{pairing.callout.body}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

function Team({ styleId }: { styleId: StyleId }) {
  const people = TEAM.filter((p) => p.style === styleId);
  const { label, plural } = STYLES[styleId];

  if (!people.length) {
    return (
      <span className="team team--empty">
        <span className="team__label">No {plural} on your team yet</span>
      </span>
    );
  }

  const shown = people.slice(0, MAX_AVATARS);
  const extra = people.length - shown.length;

  return (
    <span
      className="team"
      aria-label={`${people.length} ${people.length === 1 ? label : plural} on your team`}
    >
      <span className="avatars" aria-hidden="true">
        {shown.map((p, i) => (
          <span key={`${p.initials}-${i}`} className={`avatar hue--${p.style}`}>
            {p.initials}
          </span>
        ))}
        {extra > 0 && <span className="avatar avatar--more">+{extra}</span>}
      </span>
      <span className="team__label" aria-hidden="true">
        {people.length} on your team
      </span>
    </span>
  );
}
