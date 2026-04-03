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
    name: "Website & Nav Redesign",
    discipline: "Product",
    year: "2025",
    company: "Ebara Technologies",
    description:
      "Redesigned the corporate website and navigation architecture for a global precision machinery manufacturer. Simplified complex product hierarchies into an intuitive wayfinding system that reduced user drop-off and helped engineers find technical specs faster.",
    images: [
      "/images/projects/ebara-1.png",
      "/images/projects/ebara-2.png",
      "/images/projects/ebara-3.png",
    ],
    caseStudyUrl: "/projects/ebara-redesign",
  },
  {
    id: "2",
    name: "Index",
    discipline: "Usability Testing, Prototyping",
    year: "2025",
    company: "UC Davis",
    description:
      "Designed an AI-powered film photography assistant that helps photographers catalog, organize, and learn from their analog work. Built intelligent features for identifying film stocks, suggesting exposure settings, and surfacing visual patterns across a growing personal archive.",
    images: [
      "/images/projects/index-1.png",
      "/images/projects/index-2.png",
      "/images/projects/index-3.png",
    ],
    caseStudyUrl: "/projects/index",
  },
  {
    id: "3",
    name: "InsightSearch",
    discipline: "AI, Development",
    year: "2025",
    company: "Veeva Systems",
    description:
      "Designed an advanced search experience for Veeva's life sciences platform, enabling pharmaceutical teams to surface clinical and regulatory documents with precision. Balanced power-user filtering with an approachable interface for less technical stakeholders.",
    images: [
      "/images/projects/insightsearch-1.png",
      "/images/projects/insightsearch-2.png",
      "/images/projects/insightsearch-3.png",
    ],
    caseStudyUrl: "/projects/insightsearch",
  },
  {
    id: "4",
    name: "Sanctuary",
    discipline: "Sprint",
    year: "2025",
    company: "UC Davis",
    description:
      "Created a digital experience for Sanctuary, a UC Davis initiative focused on wellbeing and community. Designed calming, accessible interfaces that guide students toward mental health resources, events, and peer support without overwhelming them.",
    images: [
      "/images/projects/sanctuary-1.png",
      "/images/projects/sanctuary-2.png",
      "/images/projects/sanctuary-3.png",
    ],
    caseStudyUrl: "/projects/sanctuary",
  },
  {
    id: "5",
    name: "Website Audit",
    discipline: "Research",
    year: "2026",
    company: "CalPERS",
    description:
      "Analyzed qualitative user research data to evaluate the CalPERS public-facing website experience. Synthesized interview findings, usability test results, and stakeholder feedback into a comprehensive audit report with actionable recommendations for improving navigation, content clarity, and accessibility.",
    images: [
      "/images/projects/calpers-1.png",
      "/images/projects/calpers-2.png",
      "/images/projects/calpers-3.png",
    ],
    caseStudyUrl: "/projects/calpers-audit",
  },
];