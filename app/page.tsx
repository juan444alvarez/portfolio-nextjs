import FlipClock from "./components/FlipClock";

export default function Home() {
  return (
    <div className="">
        <div className="mx-auto w-full max-w-[570px] text-pretty">
          <h1 className="max-w-[36ch] text-[22px] font-semibold tracking-tight leading-snug text-balance mb-3">
            Rethinking Product Navigation for $250K+ Industrial Systems
          </h1>
          <p className="text-lg mb-3">At this price point, people approach purchasing differently than in a typical e-commerce experience.</p>
          <p className="text-lg mb-3">
            Most of us have never bought anything this expensive online, so my work started with one question:{" "}
            <em>how should navigation work in a catalog like this?</em>
          </p>
          <h2 className="max-w-[36ch] text-[21px] font-semibold tracking-tight leading-snug text-balance mb-3">Untangling choice architecture through end-to-end UX research</h2>
        </div>

      <footer className="">
        <FlipClock />
      </footer>
    </div>
  );
}