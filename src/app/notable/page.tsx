"use client";
import { useState } from "react";
import ProjectLayout from "@/components/ProjectLayout";
import SmoothScroll from "@/components/SmoothScroll";
import { div } from "framer-motion/client";
import PageWrapper from "@/components/PageWrapper";
import Link from "next/link";

export default function Sanctuary() {
  const [layoutMode, setLayoutMode] = useState<"split" | "column">("split");

  const sidebarContent = (
    <div className="grid grid-cols-1 text-[.8125rem] leading-[1rem]">
      {/* Top bar: Previous Page + Layout Toggle */}
      <div className="flex items-center justify-between py-2">
        <Link 
          href="/" 
          className="hover:underline"
        >
          ← Back to Home
        </Link>

        {/* Toggle buttons – shown only on desktop */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => setLayoutMode("split")}
            title="Split View"
            className={`text-sm ${
              layoutMode === "split" ? "text-white" : "text-gray-400"
            }`}
          >
            ⬜⬜
          </button>
          <button
            onClick={() => setLayoutMode("column")}
            title="Column View"
            className={`text-sm ${
              layoutMode === "column" ? "text-white" : "text-gray-400"
            }`}
          >
            🟥
          </button>
        </div>
      </div>

      <ul className="divide-y divide-[#e6e6e63a] relative after:content-[''] after:block after:h-px after:bg-[#e6e6e63a] after:mt-1 space-y-2">
        <li className="grid grid-cols-4 items-start gap-4 py-2">
          <span className="col-span-1 opacity-60 font-medium">Project</span>
          <span className="col-span-3">🌞 Sanctuary</span>
        </li>
        <li className="grid grid-cols-4 items-start gap-4 py-2">
          <span className="col-span-1 opacity-60 font-medium">Time</span>
          <span className="col-span-3">24 hrs</span>
        </li>
        <li className="grid grid-cols-4 items-start gap-4 py-2">
          <span className="col-span-1 opacity-60 font-medium">Type</span>
          <span className="col-span-3">Wellness</span>
        </li>
        <li className="grid grid-cols-4 items-start gap-4 py-2">
          <span className="col-span-1 opacity-70 font-medium">Team</span>
          <span className="col-span-3 space-y-1">
            <div>Erin Park</div>
            <div>Giang Le</div>
            <div>Nanette Ta</div>
          </span>
        </li>
        <li className="grid grid-cols-4 items-start gap-4 py-2">
          <span className="col-span-1 opacity-60 font-medium">Link</span>
          <span className="col-span-3">
            <a
              href="https://davisdi.notion.site/Sanctuary-1a31a107243f80f7a933c6c7aab90277"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Notion Page ↗
            </a>
          </span>
        </li>
      </ul>

      <p className="pt-6 leading-relaxed">
        Built in response to a designathon prompt to show how design can create transformative moments. This project reimagines the way we talk about and respond to domestic violence.
      </p>
    </div>
  );

  const splitOrColumn = layoutMode === "split" ? "md:grid-cols-2" : "grid-cols-1";

  return (
    <PageWrapper>
      <SmoothScroll />
      <ProjectLayout sidebar={sidebarContent}>
        <div className="flex flex-col gap-2 bg-black">
          {/* Section 1 */}
          <section className={`grid grid-cols-1 ${splitOrColumn} min-h-[33.3vh] gap-2 mt-[49px]`}>
            <div className="relative w-full h-full">
              <img
                src="/images/notable-logo.jpg"
                alt="Description"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="relative w-full h-full">
              <img
                src="/images/img_notable_1.webp"
                alt="Description"
                className="object-cover w-full h-full"
              />
            </div>
          </section>


          <div className="divide-y divide-gray-700">
  

            {/* Section 2 (Replaced with Wireflow) */}
            <section className={`relative min-h-[50vh] text-white p-[2.5rem] bg-[var(--bg-primary)]`}>

              {/* Wireflow CSS embedded safely */}
              <style dangerouslySetInnerHTML={{ __html: `
                .wireflow-wrapper {
                  --bg-primary: #ffffff;
                  --bg-secondary: #f7f7f5;
                  --bg-tertiary: #ededea;
                  --text-primary: #1a1a1a;
                  --text-secondary: #6b6b6b;
                  --text-tertiary: #9b9b9b;
                  --border-tertiary: rgba(0,0,0,0.12);
                  --border-secondary: rgba(0,0,0,0.2);
                  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                  --dr: #D85A30; --dr-bg: #FAECE7; --dr-border: #F0997B; --dr-text: #993C1D;
                  --gu: #378ADD; --gu-bg: #E6F1FB; --gu-border: #85B7EB; --gu-text: #185FA5;
                  --pi: #BA7517; --pi-bg: #FAEEDA; --pi-border: #FAC775; --pi-text: #854F0B;
                  --in: #1D9E75; --in-bg: #E1F5EE; --in-border: #5DCAA5; --in-text: #0F6E56;
                  
                  font-family: var(--font-sans); 
                  color: var(--text-primary); 
                  margin: 0 auto;
                }
                @media (prefers-color-scheme: dark) {
                  .wireflow-wrapper {
                    --bg-primary: #1a1a1a;
                    --bg-secondary: #2a2a28;
                    --bg-tertiary: #333331;
                    --text-primary: #e8e6df;
                    --text-secondary: #9c9a92;
                    --text-tertiary: #73726c;
                    --border-tertiary: rgba(255,255,255,0.12);
                    --border-secondary: rgba(255,255,255,0.2);
                  }
                }
                .wireflow-wrapper *, .wireflow-wrapper *::before, .wireflow-wrapper *::after { box-sizing:border-box; }

                .wf-step { margin-bottom: 8px; }
                .wf-step-label { font-size: 12px; font-weight: 500; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: .08em; margin-bottom: 10px; padding-left: 4px; }

                .wf-screen { background: var(--bg-secondary); border: 1px solid var(--border-tertiary); border-radius: 10px; overflow: visible; box-shadow: 0 1px 3px rgba(0,0,0,.06); position: relative; }
                .wf-screen-body { padding: 10px 12px; font-size: 11px; color: var(--text-secondary); line-height: 1.5; }
                .wf-screen-title { font-size: 12px; font-weight: 500; color: var(--text-primary); margin-bottom: 4px; }

                .wf-btn-pill { padding: 2px 7px; border-radius: 4px; font-size: 9px; font-weight: 500; border: 1px solid; display: inline-block; }
                .wf-c-dr { background: var(--dr-bg); color: var(--dr-text); border-color: var(--dr-border); }
                .wf-c-gu { background: var(--gu-bg); color: var(--gu-text); border-color: var(--gu-border); }
                .wf-c-pi { background: var(--pi-bg); color: var(--pi-text); border-color: var(--pi-border); }
                .wf-c-in { background: var(--in-bg); color: var(--in-text); border-color: var(--in-border); }
                .wf-cond-badge { position: absolute; top: -8px; right: 8px; padding: 1px 6px; border-radius: 8px; font-size: 8px; font-weight: 500; z-index: 2; }

                .wf-fan-out { display: flex; flex-direction: column; align-items: center; padding: 4px 0; }
                .wf-fan-out .wf-stem { width: 2px; height: 16px; background: var(--border-secondary); }
                .wf-fan-out .wf-branch-bar { height: 2px; background: var(--border-secondary); width: calc(100% - 40px); max-width: 800px; }
                .wf-fan-out .wf-drops { display: flex; justify-content: space-between; width: calc(100% - 40px); max-width: 800px; }
                .wf-fan-out .wf-drop { display: flex; flex-direction: column; align-items: center; }
                .wf-fan-out .wf-drop .wf-line { width: 2px; height: 14px; position: relative; }
                .wf-fan-out .wf-drop .wf-line::after { content: ''; position: absolute; bottom: -4px; left: 50%; transform: translateX(-50%); border-left: 4px solid transparent; border-right: 4px solid transparent; }
                .wf-fan-out .wf-drop:nth-child(1) .wf-line { background: var(--dr); }
                .wf-fan-out .wf-drop:nth-child(1) .wf-line::after { border-top: 5px solid var(--dr); }
                .wf-fan-out .wf-drop:nth-child(2) .wf-line { background: var(--gu); }
                .wf-fan-out .wf-drop:nth-child(2) .wf-line::after { border-top: 5px solid var(--gu); }
                .wf-fan-out .wf-drop:nth-child(3) .wf-line { background: var(--pi); }
                .wf-fan-out .wf-drop:nth-child(3) .wf-line::after { border-top: 5px solid var(--pi); }
                .wf-fan-out .wf-drop:nth-child(4) .wf-line { background: var(--in); }
                .wf-fan-out .wf-drop:nth-child(4) .wf-line::after { border-top: 5px solid var(--in); }
                .wf-fan-out .wf-drop .wf-tag { font-size: 10px; font-weight: 500; padding: 1px 6px; border-radius: 6px; margin-bottom: 4px; }

                .wf-converge { display: flex; flex-direction: column; align-items: center; padding: 4px 0; }
                .wf-converge .wf-drops-up { display: flex; justify-content: space-between; width: calc(100% - 40px); max-width: 800px; }
                .wf-converge .wf-drop-up { width: 2px; height: 14px; }
                .wf-converge .wf-drop-up:nth-child(1) { background: var(--dr); opacity:.5; }
                .wf-converge .wf-drop-up:nth-child(2) { background: var(--gu); opacity:.5; }
                .wf-converge .wf-drop-up:nth-child(3) { background: var(--pi); opacity:.5; }
                .wf-converge .wf-drop-up:nth-child(4) { background: var(--in); opacity:.5; }
                .wf-converge .wf-branch-bar { height: 2px; background: var(--border-secondary); width: calc(100% - 40px); max-width: 800px; opacity:.5; }
                .wf-converge .wf-stem { width: 2px; height: 14px; background: var(--border-secondary); position: relative; }
                .wf-converge .wf-stem::after { content: ''; position: absolute; bottom: -4px; left: 50%; transform: translateX(-50%); border-left: 4px solid transparent; border-right: 4px solid transparent; border-top: 5px solid var(--border-secondary); }
                .wf-converge-label { text-align: center; font-size: 9px; color: var(--text-tertiary); padding: 2px 0 6px; }

                .wf-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
                .wf-grid-center { display: flex; justify-content: center; }

                @media (max-width: 840px) {
                  .wf-grid-4 { grid-template-columns: repeat(2, 1fr); }
                  .wf-fan-out .wf-branch-bar, .wf-converge .wf-branch-bar { display: none; }
                  .wf-fan-out .wf-drops, .wf-converge .wf-drops-up { flex-wrap: wrap; justify-content: space-around; gap: 8px; }
                }
                @media (max-width: 480px) {
                  .wf-grid-4 { grid-template-columns: 1fr; }
                  .wireflow-wrapper { padding: 40px 10px 10px 10px; }
                  .wf-screen-body { padding: 8px 10px; }
                }

                .wf-placeholder { height: 10px; border-radius: 3px; background: var(--bg-tertiary); margin: 3px 0; }
                .wf-placeholder.w80{width:80%}.wf-placeholder.w100{width:100%}

                .wf-team-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; }
                @media (max-width: 400px) { .wf-team-grid { grid-template-columns: 1fr; } }
                .wf-member-row { display: flex; align-items: center; gap: 4px; padding: 4px 8px; border-radius: 5px; font-size: 10px; border: 1px solid; }
                .wf-member-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

                .wf-profile-section { margin: 4px 0; }
                .wf-profile-section-title { font-size: 8px; font-weight: 500; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: .04em; margin-bottom: 2px; }
                .wf-interaction-tip { padding: 4px 6px; border-radius: 4px; font-size: 9px; margin: 2px 0; border-left: 2px solid; }

                .wf-ellipsis { text-align: center; padding: 8px 0; color: var(--text-tertiary); font-size: 18px; letter-spacing: 4px; }
                .wf-ellipsis-note { text-align: center; font-size: 10px; color: var(--text-tertiary); padding-bottom: 8px; }

                .wf-matrix-screen { border-style: dashed; max-width: 420px; margin: 0 auto; }
                .wf-matrix-screen table { width: 100%; border-collapse: collapse; font-size: 9px; text-align: center; }
                .wf-matrix-screen td { padding: 4px; }
                @media (max-width: 480px) { .wf-matrix-screen table { font-size: 7px; } .wf-matrix-screen td { padding: 2px; } }

                .wf-flow-label { text-align: center; padding: 4px 0; font-size: 10px; color: var(--text-secondary); font-weight: 500; }
              `}} />

              <div className="wireflow-wrapper relative z-0">
                {/* STEP 1 */}
<div className="wf-step">
                  <div className="wf-grid-center">
                    {/* Removed maxWidth: '320px' so the 4 columns can expand */}
                    <div className="wf-screen" style={{ width: '100%' }}>
                      <div className="wf-screen-body">                        
                        {/* Changed grid-template-columns to 1 row, 4 columns */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                          <div style={{ padding: '8px', borderRadius: '6px', textAlign: 'center', background: 'var(--dr-bg)', border: '1px solid var(--dr-border)' }}>
                            <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--dr-text)' }}>Driver</div>
                            <div style={{ fontSize: '11px', color: 'var(--dr-text)', opacity: .8 }}>Quantitative, logical</div>
                          </div>
                          <div style={{ padding: '8px', borderRadius: '6px', textAlign: 'center', background: 'var(--gu-bg)', border: '1px solid var(--gu-border)' }}>
                            <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--gu-text)' }}>Guardian</div>
                            <div style={{ fontSize: '11px', color: 'var(--gu-text)', opacity: .8 }}>Methodical, reserved</div>
                          </div>
                          <div style={{ padding: '8px', borderRadius: '6px', textAlign: 'center', background: 'var(--pi-bg)', border: '1px solid var(--pi-border)' }}>
                            <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--pi-text)' }}>Pioneer</div>
                            <div style={{ fontSize: '11px', color: 'var(--pi-text)', opacity: .8 }}>Imaginative, spontaneous</div>
                          </div>
                          <div style={{ padding: '8px', borderRadius: '6px', textAlign: 'center', background: 'var(--in-bg)', border: '1px solid var(--in-border)' }}>
                            <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--in-text)' }}>Integrator</div>
                            <div style={{ fontSize: '11px', color: 'var(--in-text)', opacity: .8 }}>Empathic, diplomatic</div>
                          </div>
                        </div>
                        
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fan-out */}
                <div className="wf-fan-out">
                  <div className="wf-stem"></div>
                  <div className="wf-branch-bar"></div>
                  <div className="wf-drops">
                    <div className="wf-drop"><div className="wf-tag wf-btn-pill wf-c-dr">if Driver</div><div className="wf-line"></div></div>
                    <div className="wf-drop"><div className="wf-tag wf-btn-pill wf-c-gu">if Guardian</div><div className="wf-line"></div></div>
                    <div className="wf-drop"><div className="wf-tag wf-btn-pill wf-c-pi">if Pioneer</div><div className="wf-line"></div></div>
                    <div className="wf-drop"><div className="wf-tag wf-btn-pill wf-c-in">if Integrator</div><div className="wf-line"></div></div>
                  </div>
                </div>

                {/* STEP 2 */}
                <div className="wf-step">
                  <div className="wf-step-label">Step 2 — Conditional dashboard</div>
                  <div className="wf-grid-4">
                    <div className="wf-screen" style={{ marginTop: '6px' }}>
                      <div className="wf-screen-body">
                        <div className="wf-screen-title">Your dashboard</div>
                        <div style={{ fontSize: '9px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>How to work with others as a Driver</div>
                        <div style={{ padding: '4px 6px', borderRadius: '4px', background: 'var(--dr-bg)', margin: '3px 0', fontSize: '9px', color: 'var(--dr-text)', borderLeft: '2px solid var(--dr)' }}>→ With Guardians: slow down, give detail</div>
                        <div style={{ padding: '4px 6px', borderRadius: '4px', background: 'var(--dr-bg)', margin: '3px 0', fontSize: '9px', color: 'var(--dr-text)', borderLeft: '2px solid var(--dr)' }}>→ With Pioneers: match energy, stay open</div>
                        <div style={{ padding: '4px 6px', borderRadius: '4px', background: 'var(--dr-bg)', margin: '3px 0', fontSize: '9px', color: 'var(--dr-text)', borderLeft: '2px solid var(--dr)' }}>→ With Integrators: show empathy first</div>
                        <div className="wf-placeholder w80"></div>
                        <div style={{ marginTop: '6px', padding: '4px 8px', borderRadius: '4px', background: 'var(--bg-tertiary)', fontSize: '9px', fontWeight: 500, textAlign: 'center', color: 'var(--text-secondary)' }}>View team →</div>
                      </div>
                    </div>
                    <div className="wf-screen" style={{ marginTop: '6px' }}>
                      <div className="wf-screen-body">
                        <div className="wf-screen-title">Your dashboard</div>
                        <div style={{ fontSize: '9px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>How to work with others as a Guardian</div>
                        <div style={{ padding: '4px 6px', borderRadius: '4px', background: 'var(--gu-bg)', margin: '3px 0', fontSize: '9px', color: 'var(--gu-text)', borderLeft: '2px solid var(--gu)' }}>→ With Drivers: be direct, lead with data</div>
                        <div style={{ padding: '4px 6px', borderRadius: '4px', background: 'var(--gu-bg)', margin: '3px 0', fontSize: '9px', color: 'var(--gu-text)', borderLeft: '2px solid var(--gu)' }}>→ With Pioneers: embrace brainstorming</div>
                        <div style={{ padding: '4px 6px', borderRadius: '4px', background: 'var(--gu-bg)', margin: '3px 0', fontSize: '9px', color: 'var(--gu-text)', borderLeft: '2px solid var(--gu)' }}>→ With Integrators: build trust slowly</div>
                        <div className="wf-placeholder w80"></div>
                        <div style={{ marginTop: '6px', padding: '4px 8px', borderRadius: '4px', background: 'var(--bg-tertiary)', fontSize: '9px', fontWeight: 500, textAlign: 'center', color: 'var(--text-secondary)' }}>View team →</div>
                      </div>
                    </div>
                    <div className="wf-screen" style={{ marginTop: '6px' }}>
                      <div className="wf-screen-body">
                        <div className="wf-screen-title">Your dashboard</div>
                        <div style={{ fontSize: '9px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>How to work with others as a Pioneer</div>
                        <div style={{ padding: '4px 6px', borderRadius: '4px', background: 'var(--pi-bg)', margin: '3px 0', fontSize: '9px', color: 'var(--pi-text)', borderLeft: '2px solid var(--pi)' }}>→ With Drivers: bring supporting facts</div>
                        <div style={{ padding: '4px 6px', borderRadius: '4px', background: 'var(--pi-bg)', margin: '3px 0', fontSize: '9px', color: 'var(--pi-text)', borderLeft: '2px solid var(--pi)' }}>→ With Guardians: provide structure</div>
                        <div style={{ padding: '4px 6px', borderRadius: '4px', background: 'var(--pi-bg)', margin: '3px 0', fontSize: '9px', color: 'var(--pi-text)', borderLeft: '2px solid var(--pi)' }}>→ With Integrators: check in on feelings</div>
                        <div className="wf-placeholder w80"></div>
                        <div style={{ marginTop: '6px', padding: '4px 8px', borderRadius: '4px', background: 'var(--bg-tertiary)', fontSize: '9px', fontWeight: 500, textAlign: 'center', color: 'var(--text-secondary)' }}>View team →</div>
                      </div>
                    </div>
                    <div className="wf-screen" style={{ marginTop: '6px' }}>
                      <div className="wf-screen-body">
                        <div className="wf-screen-title">Your dashboard</div>
                        <div style={{ fontSize: '9px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>How to work with others as an Integrator</div>
                        <div style={{ padding: '4px 6px', borderRadius: '4px', background: 'var(--in-bg)', margin: '3px 0', fontSize: '9px', color: 'var(--in-text)', borderLeft: '2px solid var(--in)' }}>→ With Drivers: be concise, skip small talk</div>
                        <div style={{ padding: '4px 6px', borderRadius: '4px', background: 'var(--in-bg)', margin: '3px 0', fontSize: '9px', color: 'var(--in-text)', borderLeft: '2px solid var(--in)' }}>→ With Guardians: present clear options</div>
                        <div style={{ padding: '4px 6px', borderRadius: '4px', background: 'var(--in-bg)', margin: '3px 0', fontSize: '9px', color: 'var(--in-text)', borderLeft: '2px solid var(--in)' }}>→ With Pioneers: match their enthusiasm</div>
                        <div className="wf-placeholder w80"></div>
                        <div style={{ marginTop: '6px', padding: '4px 8px', borderRadius: '4px', background: 'var(--bg-tertiary)', fontSize: '9px', fontWeight: 500, textAlign: 'center', color: 'var(--text-secondary)' }}>View team →</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Converge */}
                <div className="wf-converge">
                  <div className="wf-drops-up"><div className="wf-drop-up"></div><div className="wf-drop-up"></div><div className="wf-drop-up"></div><div className="wf-drop-up"></div></div>
                  <div className="wf-branch-bar"></div>
                  <div className="wf-stem"></div>
                </div>
                <div className="wf-converge-label">All 4 paths → same layout, personalized content</div>

                {/* STEP 3 */}
                <div className="wf-step">
                  <div className="wf-step-label">Step 3 — Team chart</div>
                  <div className="wf-grid-center">
                    <div className="wf-screen" style={{ width: '100%', maxWidth: '440px' }}>
                      <div className="wf-screen-body">
                        <div className="wf-screen-title">Your team (10 members)</div>
                        <div style={{ fontSize: '9px', color: 'var(--text-tertiary)', marginBottom: '6px' }}>Tap any person to see their profile + how to collaborate</div>
                        <div className="wf-team-grid">
                          <div className="wf-member-row" style={{ background: 'var(--dr-bg)', borderColor: 'var(--dr-border)' }}><div className="wf-member-dot" style={{ background: 'var(--dr)' }}></div><span style={{ color: 'var(--dr-text)', fontWeight: 500 }}>Alex M.</span><span style={{ color: 'var(--dr-text)', opacity: .6, fontSize: '8px', marginLeft: 'auto' }}>Driver</span></div>
                          <div className="wf-member-row" style={{ background: 'var(--gu-bg)', borderColor: 'var(--gu-border)' }}><div className="wf-member-dot" style={{ background: 'var(--gu)' }}></div><span style={{ color: 'var(--gu-text)', fontWeight: 500 }}>Sam K.</span><span style={{ color: 'var(--gu-text)', opacity: .6, fontSize: '8px', marginLeft: 'auto' }}>Guardian</span></div>
                          <div className="wf-member-row" style={{ background: 'var(--pi-bg)', borderColor: 'var(--pi-border)' }}><div className="wf-member-dot" style={{ background: 'var(--pi)' }}></div><span style={{ color: 'var(--pi-text)', fontWeight: 500 }}>Jordan L.</span><span style={{ color: 'var(--pi-text)', opacity: .6, fontSize: '8px', marginLeft: 'auto' }}>Pioneer</span></div>
                          <div className="wf-member-row" style={{ background: 'var(--in-bg)', borderColor: 'var(--in-border)' }}><div className="wf-member-dot" style={{ background: 'var(--in)' }}></div><span style={{ color: 'var(--in-text)', fontWeight: 500 }}>Taylor R.</span><span style={{ color: 'var(--in-text)', opacity: .6, fontSize: '8px', marginLeft: 'auto' }}>Integrator</span></div>
                          <div className="wf-member-row" style={{ background: 'var(--dr-bg)', borderColor: 'var(--dr-border)' }}><div className="wf-member-dot" style={{ background: 'var(--dr)' }}></div><span style={{ color: 'var(--dr-text)', fontWeight: 500 }}>Morgan P.</span><span style={{ color: 'var(--dr-text)', opacity: .6, fontSize: '8px', marginLeft: 'auto' }}>Driver</span></div>
                          <div className="wf-member-row" style={{ background: 'var(--gu-bg)', borderColor: 'var(--gu-border)' }}><div className="wf-member-dot" style={{ background: 'var(--gu)' }}></div><span style={{ color: 'var(--gu-text)', fontWeight: 500 }}>Casey W.</span><span style={{ color: 'var(--gu-text)', opacity: .6, fontSize: '8px', marginLeft: 'auto' }}>Guardian</span></div>
                          <div className="wf-member-row" style={{ background: 'var(--pi-bg)', borderColor: 'var(--pi-border)' }}><div className="wf-member-dot" style={{ background: 'var(--pi)' }}></div><span style={{ color: 'var(--pi-text)', fontWeight: 500 }}>Riley N.</span><span style={{ color: 'var(--pi-text)', opacity: .6, fontSize: '8px', marginLeft: 'auto' }}>Pioneer</span></div>
                          <div className="wf-member-row" style={{ background: 'var(--in-bg)', borderColor: 'var(--in-border)' }}><div className="wf-member-dot" style={{ background: 'var(--in)' }}></div><span style={{ color: 'var(--in-text)', fontWeight: 500 }}>Avery B.</span><span style={{ color: 'var(--in-text)', opacity: .6, fontSize: '8px', marginLeft: 'auto' }}>Integrator</span></div>
                          <div className="wf-member-row" style={{ background: 'var(--gu-bg)', borderColor: 'var(--gu-border)' }}><div className="wf-member-dot" style={{ background: 'var(--gu)' }}></div><span style={{ color: 'var(--gu-text)', fontWeight: 500 }}>Drew H.</span><span style={{ color: 'var(--gu-text)', opacity: .6, fontSize: '8px', marginLeft: 'auto' }}>Guardian</span></div>
                          <div className="wf-member-row" style={{ background: 'var(--pi-bg)', borderColor: 'var(--pi-border)' }}><div className="wf-member-dot" style={{ background: 'var(--pi)' }}></div><span style={{ color: 'var(--pi-text)', fontWeight: 500 }}>Quinn F.</span><span style={{ color: 'var(--pi-text)', opacity: .6, fontSize: '8px', marginLeft: 'auto' }}>Pioneer</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fan-out */}
                <div className="wf-fan-out">
                  <div className="wf-stem"></div>
                  <div className="wf-branch-bar"></div>
                  <div className="wf-drops">
                    <div className="wf-drop"><div className="wf-line"></div></div>
                    <div className="wf-drop"><div className="wf-line"></div></div>
                    <div className="wf-drop"><div className="wf-line"></div></div>
                    <div className="wf-drop"><div className="wf-line"></div></div>
                  </div>
                </div>
                <div className="wf-flow-label">Tap any member → personalized profile (YOUR archetype × THEIR archetype)</div>

                {/* STEP 4 */}
                <div className="wf-step" style={{ marginTop: '8px' }}>
                  <div className="wf-step-label">Step 4 — Member profile</div>
                  <div className="wf-grid-4">
                    <div className="wf-screen" style={{ marginTop: '6px' }}>
                      <div className="wf-cond-badge wf-c-dr" style={{ fontSize: '7px' }}>You: Driver</div>
                      <div className="wf-screen-body">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--gu-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#0C447C', fontWeight: 500, flexShrink: 0 }}>SK</div>
                          <div>
                            <div className="wf-screen-title" style={{ margin: 0 }}>Sam K.</div>
                            <div style={{ fontSize: '8px' }} className="wf-btn-pill wf-c-gu">Guardian</div>
                          </div>
                        </div>
                        <div className="wf-profile-section">
                          <div className="wf-profile-section-title">Their strengths</div>
                          <div className="wf-placeholder w100"></div><div className="wf-placeholder w80"></div>
                        </div>
                        <div className="wf-profile-section">
                          <div className="wf-profile-section-title">How to collaborate</div>
                          <div className="wf-interaction-tip" style={{ background: 'var(--dr-bg)', borderColor: 'var(--dr)', color: 'var(--dr-text)' }}>As a Driver, provide data upfront — Guardians need evidence before acting</div>
                          <div className="wf-interaction-tip" style={{ background: 'var(--dr-bg)', borderColor: 'var(--dr)', color: 'var(--dr-text)' }}>Avoid rushing decisions — give them time to process</div>
                        </div>
                        <div className="wf-profile-section">
                          <div className="wf-profile-section-title">Potential friction</div>
                          <div className="wf-placeholder w100"></div>
                        </div>
                      </div>
                    </div>
                    <div className="wf-screen" style={{ marginTop: '6px' }}>
                      <div className="wf-cond-badge wf-c-gu" style={{ fontSize: '7px' }}>You: Guardian</div>
                      <div className="wf-screen-body">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--pi-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#633806', fontWeight: 500, flexShrink: 0 }}>JL</div>
                          <div>
                            <div className="wf-screen-title" style={{ margin: 0 }}>Jordan L.</div>
                            <div style={{ fontSize: '8px' }} className="wf-btn-pill wf-c-pi">Pioneer</div>
                          </div>
                        </div>
                        <div className="wf-profile-section">
                          <div className="wf-profile-section-title">Their strengths</div>
                          <div className="wf-placeholder w100"></div><div className="wf-placeholder w80"></div>
                        </div>
                        <div className="wf-profile-section">
                          <div className="wf-profile-section-title">How to collaborate</div>
                          <div className="wf-interaction-tip" style={{ background: 'var(--gu-bg)', borderColor: 'var(--gu)', color: 'var(--gu-text)' }}>As a Guardian, stay open to unstructured brainstorming — it's how Pioneers think</div>
                          <div className="wf-interaction-tip" style={{ background: 'var(--gu-bg)', borderColor: 'var(--gu)', color: 'var(--gu-text)' }}>Offer to handle the follow-through after ideation</div>
                        </div>
                        <div className="wf-profile-section">
                          <div className="wf-profile-section-title">Potential friction</div>
                          <div className="wf-placeholder w100"></div>
                        </div>
                      </div>
                    </div>
                    <div className="wf-screen" style={{ marginTop: '6px' }}>
                      <div className="wf-cond-badge wf-c-pi" style={{ fontSize: '7px' }}>You: Pioneer</div>
                      <div className="wf-screen-body">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--dr-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#4A1B0C', fontWeight: 500, flexShrink: 0 }}>AM</div>
                          <div>
                            <div className="wf-screen-title" style={{ margin: 0 }}>Alex M.</div>
                            <div style={{ fontSize: '8px' }} className="wf-btn-pill wf-c-dr">Driver</div>
                          </div>
                        </div>
                        <div className="wf-profile-section">
                          <div className="wf-profile-section-title">Their strengths</div>
                          <div className="wf-placeholder w100"></div><div className="wf-placeholder w80"></div>
                        </div>
                        <div className="wf-profile-section">
                          <div className="wf-profile-section-title">How to collaborate</div>
                          <div className="wf-interaction-tip" style={{ background: 'var(--pi-bg)', borderColor: 'var(--pi)', color: 'var(--pi-text)' }}>As a Pioneer, lead with a clear bottom line — Drivers want the punchline first</div>
                          <div className="wf-interaction-tip" style={{ background: 'var(--pi-bg)', borderColor: 'var(--pi)', color: 'var(--pi-text)' }}>Back your ideas with numbers to earn their buy-in</div>
                        </div>
                        <div className="wf-profile-section">
                          <div className="wf-profile-section-title">Potential friction</div>
                          <div className="wf-placeholder w100"></div>
                        </div>
                      </div>
                    </div>
                    <div className="wf-screen" style={{ marginTop: '6px' }}>
                      <div className="wf-cond-badge wf-c-in" style={{ fontSize: '7px' }}>You: Integrator</div>
                      <div className="wf-screen-body">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--in-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#04342C', fontWeight: 500, flexShrink: 0 }}>TR</div>
                          <div>
                            <div className="wf-screen-title" style={{ margin: 0 }}>Taylor R.</div>
                            <div style={{ fontSize: '8px' }} className="wf-btn-pill wf-c-in">Integrator</div>
                          </div>
                        </div>
                        <div className="wf-profile-section">
                          <div className="wf-profile-section-title">Their strengths</div>
                          <div className="wf-placeholder w100"></div><div className="wf-placeholder w80"></div>
                        </div>
                        <div className="wf-profile-section">
                          <div className="wf-profile-section-title">How to collaborate</div>
                          <div className="wf-interaction-tip" style={{ background: 'var(--in-bg)', borderColor: 'var(--in)', color: 'var(--in-text)' }}>As a fellow Integrator, be careful not to over-accommodate — make sure decisions get made</div>
                          <div className="wf-interaction-tip" style={{ background: 'var(--in-bg)', borderColor: 'var(--in)', color: 'var(--in-text)' }}>Leverage shared empathy to mediate team tensions</div>
                        </div>
                        <div className="wf-profile-section">
                          <div className="wf-profile-section-title">Potential friction</div>
                          <div className="wf-placeholder w100"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="wf-ellipsis">···</div>
                <div className="wf-ellipsis-note">× 10 team members each = up to 40 unique profile views</div>

                {/* MATRIX LEGEND */}
                <div className="wf-step" style={{ marginTop: '12px' }}>
                  <div className="wf-screen wf-matrix-screen">
                    <div className="wf-screen-body" style={{ padding: '12px 16px' }}>
                      <div className="wf-screen-title" style={{ textAlign: 'center', marginBottom: '6px' }}>Branching logic: 4 × 4 content matrix</div>
                      <div style={{ fontSize: '9px', color: 'var(--text-tertiary)', textAlign: 'center', marginBottom: '8px' }}>Profile content is determined by the intersection of YOUR archetype and THEIR archetype</div>
                      <table>
                        <tbody>
                          <tr>
                            <td style={{ color: 'var(--text-tertiary)' }}></td>
                            <td style={{ fontWeight: 500, color: 'var(--dr-text)' }}>Their: DR</td>
                            <td style={{ fontWeight: 500, color: 'var(--gu-text)' }}>Their: GU</td>
                            <td style={{ fontWeight: 500, color: 'var(--pi-text)' }}>Their: PI</td>
                            <td style={{ fontWeight: 500, color: 'var(--in-text)' }}>Their: IN</td>
                          </tr>
                          <tr>
                            <td style={{ fontWeight: 500, color: 'var(--dr-text)' }}>You: DR</td>
                            <td style={{ background: 'var(--dr-bg)', borderRadius: '3px' }}>DR↔DR</td>
                            <td style={{ background: 'var(--dr-bg)', borderRadius: '3px' }}>DR→GU</td>
                            <td style={{ background: 'var(--dr-bg)', borderRadius: '3px' }}>DR→PI</td>
                            <td style={{ background: 'var(--dr-bg)', borderRadius: '3px' }}>DR→IN</td>
                          </tr>
                          <tr>
                            <td style={{ fontWeight: 500, color: 'var(--gu-text)' }}>You: GU</td>
                            <td style={{ background: 'var(--gu-bg)', borderRadius: '3px' }}>GU→DR</td>
                            <td style={{ background: 'var(--gu-bg)', borderRadius: '3px' }}>GU↔GU</td>
                            <td style={{ background: 'var(--gu-bg)', borderRadius: '3px' }}>GU→PI</td>
                            <td style={{ background: 'var(--gu-bg)', borderRadius: '3px' }}>GU→IN</td>
                          </tr>
                          <tr>
                            <td style={{ fontWeight: 500, color: 'var(--pi-text)' }}>You: PI</td>
                            <td style={{ background: 'var(--pi-bg)', borderRadius: '3px' }}>PI→DR</td>
                            <td style={{ background: 'var(--pi-bg)', borderRadius: '3px' }}>PI→GU</td>
                            <td style={{ background: 'var(--pi-bg)', borderRadius: '3px' }}>PI↔PI</td>
                            <td style={{ background: 'var(--pi-bg)', borderRadius: '3px' }}>PI→IN</td>
                          </tr>
                          <tr>
                            <td style={{ fontWeight: 500, color: 'var(--in-text)' }}>You: IN</td>
                            <td style={{ background: 'var(--in-bg)', borderRadius: '3px' }}>IN→DR</td>
                            <td style={{ background: 'var(--in-bg)', borderRadius: '3px' }}>IN→GU</td>
                            <td style={{ background: 'var(--in-bg)', borderRadius: '3px' }}>IN→PI</td>
                            <td style={{ background: 'var(--in-bg)', borderRadius: '3px' }}>IN↔IN</td>
                          </tr>
                        </tbody>
                      </table>
                      <div style={{ fontSize: '8px', color: 'var(--text-tertiary)', textAlign: 'center', marginTop: '6px' }}>= 16 unique content variations across 10 team member profiles</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section className={`relative grid grid-cols-1 md:grid-cols-2 items-center ${splitOrColumn} min-h-[50vh] gap-12 text-white text-[1.5rem] p-[2.5rem]`}>
              <div className="absolute top-0 left-0 flex items-center gap-2 text-xs uppercase tracking-widest text-white pl-8 pt-8">
                <span>Elevate</span>
                <span className="transform rotate-45 text-white text-[0.75rem]">➝</span>
              </div>

              <div className="relative w-full flex justify-center">
                <img
                  src="/images/untitled-2.svg"
                  alt="Glowing logo"
                  className="w-48 h-48 object-contain animate-pulse drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                />
              </div>

              <div className="leading-relaxed">
                <p className="text-[0.75rem] text-gray-400 mb-2">03</p>
                <p>
                  We believe in elevating ideas into experiences. From concept to execution, we sculpt design that resonates deeply and globally.
                </p>
              </div>
            </section>
          </div>

          {/* Section 5 – Full-width */}
          <section className="min-h-[65vh] bg-neutral-300 flex items-center justify-center">
            <div className="relative w-full h-full">
              <img
                src="/images/img_notable_1.webp"
                alt="Description"
                className="object-cover w-full h-full"
              />
            </div>
          </section>
        </div>
      </ProjectLayout>
    </PageWrapper>
  );
}