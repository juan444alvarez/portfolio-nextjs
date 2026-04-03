export interface Project {
  id: string;
  name: string;
  discipline: string;
  year: string;
  company: string;
  description: string;
  images: [string, string, string];
  caseStudyUrl?: string;
}

export const projects: Project[] = [
  {
    id: "1",
    name: "Devin AI",
    discipline: "AI",
    year: "2025",
    company: "Notion",
    description:
      "Designed the end-to-end experience for an autonomous AI coding agent. Focused on building trust through transparent task progression, real-time status feedback, and a conversational interface that keeps developers in control without micromanaging.",
    images: [
      "/images/projects/devin-1.png",
      "/images/projects/devin-2.png",
      "/images/projects/devin-3.png",
    ],
    caseStudyUrl: "/projects/devin-ai",
  },
  {
    id: "2",
    name: "Miranote AI",
    discipline: "AI",
    year: "2025",
    company: "Notion",
    description:
      "Explored how generative AI could fit into a freeform visual workspace. Designed prompt-driven flows for mood boards, mind maps, and briefs — balancing creative freedom with the structure AI needs to produce useful output.",
    images: [
      "/images/projects/miranote-1.png",
      "/images/projects/miranote-2.png",
      "/images/projects/miranote-3.png",
    ],
    caseStudyUrl: "/projects/miranote-ai",
  },
  {
    id: "3",
    name: "Studio Showreel (2024)",
    discipline: "—",
    year: "2024",
    company: "Notion",
    description:
      "Directed and edited a 90-second showreel highlighting the studio's best work from 2024. Handled art direction, motion graphics sequencing, and pacing to create a cohesive narrative across a range of project types.",
    images: [
      "/images/projects/showreel-1.png",
      "/images/projects/showreel-2.png",
      "/images/projects/showreel-3.png",
    ],
    caseStudyUrl: "/projects/showreel-2024",
  },
  {
    id: "4",
    name: "Rinse UI",
    discipline: "Product",
    year: "2024",
    company: "Notion",
    description:
      "Built a minimal component library focused on clarity and speed. Every component was designed around a single constraint: reduce visual noise to zero so the content does all the talking. Shipped tokens, docs, and a Figma kit.",
    images: [
      "/images/projects/rinse-1.png",
      "/images/projects/rinse-2.png",
      "/images/projects/rinse-3.png",
    ],
    caseStudyUrl: "/projects/rinse-ui",
  },
  {
    id: "5",
    name: "Lumebrite",
    discipline: "Product",
    year: "2023",
    company: "Notion",
    description:
      "Designed the mobile and web experience for a smart home lighting platform. Led user research to identify pain points in existing apps, then created an interface that makes complex scene-building feel intuitive and immediate.",
    images: [
      "/images/projects/lumebrite-1.png",
      "/images/projects/lumebrite-2.png",
      "/images/projects/lumebrite-3.png",
    ],
    caseStudyUrl: "/projects/lumebrite",
  },
  {
    id: "6",
    name: "Castle AI",
    discipline: "Product",
    year: "2023",
    company: "Notion",
    description:
      "Prototyped an AI-powered home security dashboard. Focused on reducing alert fatigue through smarter notification grouping and a timeline view that gives homeowners context before asking them to act.",
    images: [
      "/images/projects/castle-1.png",
      "/images/projects/castle-2.png",
      "/images/projects/castle-3.png",
    ],
    caseStudyUrl: "/projects/castle-ai",
  },
  {
    id: "7",
    name: "Atomic UI",
    discipline: "Product",
    year: "2023",
    company: "Notion",
    description:
      "Created a design system grounded in atomic design methodology. Defined primitives, composed molecules and organisms, and documented usage patterns — enabling a small team to ship consistent interfaces three times faster.",
    images: [
      "/images/projects/atomic-1.png",
      "/images/projects/atomic-2.png",
      "/images/projects/atomic-3.png",
    ],
    caseStudyUrl: "/projects/atomic-ui",
  },
];