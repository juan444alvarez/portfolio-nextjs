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

          {/* Section 2 – Full-width */}
          <section className="min-h-[66.6vh] bg-neutral-300 flex items-center justify-center">
          <div className="relative w-full h-full">
              <img
                src="/images/img_notable_1.webp"
                alt="Description"
                className="object-cover w-full h-full"
              />
            </div>
          </section>

          <div className="divide-y divide-gray-700">
  {/* Section 1 */}
  <section className={`relative grid grid-cols-1 md:grid-cols-2 items-center ${splitOrColumn} min-h-[50vh] gap-12 text-white text-[1.5rem] p-[2.5rem]`}>
    {/* Label + Arrow */}
    <div className="absolute top-0 left-0 flex items-center gap-2 text-xs uppercase tracking-widest text-white pl-8 pt-8">
      <span>Problem Space</span>
      <span className="transform rotate-45 text-white text-[0.75rem]">➝</span>
    </div>

    {/* Image */}
    <div className="relative w-full flex justify-center">
      <img
        src="/images/icon-placeholder.svg"
        alt="Glowing logo"
        className="w-48 h-48 object-contain animate-pulse drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]"
      />
    </div>

    {/* Text */}
    <div className="leading-relaxed">
      <p className="text-[0.75rem] text-gray-400 mb-2">01</p>
      <p>
      In the U.S., 1 in 4 men and 1 in 3 women have faced domestic violence. However, fear and a lack of support prevent 80% of victims from seeking help right away.
      </p>
    </div>
  </section>

  {/* Section 2 */}
  <section className={`relative grid grid-cols-1 md:grid-cols-2 items-center ${splitOrColumn} min-h-[50vh] gap-12 text-white text-[1.5rem] p-[2.5rem]`}>
    <div className="absolute top-0 left-0 flex items-center gap-2 text-xs uppercase tracking-widest text-white pl-8 pt-8">
      <span>Collaborate</span>
      <span className="transform rotate-45 text-white text-[0.75rem]">➝</span>
    </div>

    <div className="relative w-full flex justify-center">
      <img
        src="/images/icon-problem-space.svg"
        alt="Glowing logo"
        className="w-48 h-48 object-contain animate-pulse drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]"
      />
    </div>

    <div className="leading-relaxed">
      <p className="text-[0.75rem] text-gray-400 mb-2">02</p>
      <p>
        Collaboration over competition — creativity, for monopo saigon, is like having a nabe with friends where we combine the creativity that sets us apart.
      </p>
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
