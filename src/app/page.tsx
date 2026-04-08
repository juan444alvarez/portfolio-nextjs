"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { projects } from "../utils/ProjectData";
import { useTransitionRouter } from "next-view-transitions";

const pageAnimation = () => {
  document.documentElement.animate(
    [
      { opacity: 1, scale: 1, transform: "translateY(0)" },
      { opacity: 0.5, scale: 0.9, transform: "translateY(-100px)" },
    ],
    {
      duration: 1000,
      easing: "cubic-bezier(0.76, 0, 0.24, 1)",
      fill: "forwards",
      pseudoElement: "::view-transition-old(root)",
    }
  );

  document.documentElement.animate(
    [
      { transform: "translateY(100%)" },
      { transform: "translateY(0)" },
    ],
    {
      duration: 1000,
      easing: "cubic-bezier(0.76, 0, 0.24, 1)",
      fill: "forwards",
      pseudoElement: "::view-transition-new(root)",
    }
  );
};

const caseStudyRoutes = ["/sanctuary", "/notable", "/ckmarket-online"];

let hasAnimated = false;

export default function PortfolioPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const router = useTransitionRouter();

  const shouldAnimate = !hasAnimated;

  useEffect(() => {
    hasAnimated = true;
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const macroGridGap = "gap-x-12 lg:gap-x-24";

  const titleText = "Juan Alvarez — User Experience Designer";
  const titleWords = titleText.split(" ");

  const headlineContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const wordVariant = {
    hidden: { opacity: 0, filter: "blur(5px)" },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      transition: { duration: 1.2, ease: "easeOut" },
    },
  };

  const layoutFadeVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut", delay: 1.4 },
    },
  };

  const expandVariants = {
    collapsed: {
      height: 0,
      opacity: 0,
      transition: {
        height: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
        opacity: { duration: 0.2, ease: "easeOut" },
      },
    },
    expanded: {
      height: "auto",
      opacity: 1,
      transition: {
        height: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
        opacity: { duration: 0.3, ease: "easeIn", delay: 0.15 },
      },
    },
  };

  const panelContentVariants = {
    collapsed: { opacity: 0 },
    expanded: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.2 },
    },
  };

  const panelChildVariant = {
    collapsed: { opacity: 0, y: 12 },
    expanded: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  const arrowVariants = {
    collapsed: { rotate: 0 },
    expanded: { rotate: 45 },
  };

  return (
    <main className="min-h-screen overflow-hidden wrapper">

      {/* 1. Header Section */}
      <motion.header
        variants={layoutFadeVariant}
        initial={shouldAnimate ? "hidden" : "visible"}
        animate="visible"
        className={`grid grid-cols-1 md:grid-cols-2 ${macroGridGap} mb-10 mt-6 text-sm`}
      >
        <div>
          <h1 className="font-medium">Juan Alvarez</h1>
          <p className="text-gray-600">UX Design Intern @ CalPERS</p>
        </div>

        <div className="grid grid-cols-[100px_1fr] md:grid-cols-[120px_1fr] w-full">
          <span className="font-medium">Selected works</span>
          <span className="text-gray-600">5 projects</span>
          <span className="font-medium">Disciplines</span>
          <span className="text-gray-600">User Experience, Research, Development</span>
        </div>
      </motion.header>

      {/* 2. Hero Section */}
      <section className={`grid grid-cols-1 md:grid-cols-2 ${macroGridGap} mb-20`}>
        <motion.div
          variants={layoutFadeVariant}
          initial={shouldAnimate ? "hidden" : "visible"}
          animate="visible"
          className="w-full max-w-[350px] aspect-square relative overflow-hidden"
        >
          <Image
            src="/images/juan-portrait.jpg"
            alt="Portrait"
            fill
            priority
            className="object-cover"
          />
        </motion.div>

        <div className="w-full flex flex-col justify-between pt-8 md:pt-0">
          <motion.div
            variants={layoutFadeVariant}
            initial={shouldAnimate ? "hidden" : "visible"}
            animate="visible"
          >
            <div className="w-10 border-t border-gray-400 hidden md:block"></div>
          </motion.div>

          <div className="w-full">
            <motion.h2
              variants={headlineContainer}
              initial={shouldAnimate ? "hidden" : "visible"}
              animate="visible"
              className="text-[1.25rem] font-medium mb-3 leading-snug text-black flex flex-wrap"
            >
              {titleWords.map((word, i) => (
                <motion.span key={i} variants={wordVariant} className="mr-[0.25em]">
                  {word}
                </motion.span>
              ))}
            </motion.h2>

            <motion.div
              variants={layoutFadeVariant}
              initial={shouldAnimate ? "hidden" : "visible"}
              animate="visible"
              className="text-gray-600 text-[0.9375rem] leading-relaxed w-full"
            >
              <p className="w-full">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. Interactive Projects Section */}
      <motion.section
        variants={layoutFadeVariant}
        initial={shouldAnimate ? "hidden" : "visible"}
        animate="visible"
        className="text-sm"
      >
        <div className={`grid grid-cols-1 md:grid-cols-2 ${macroGridGap} pb-4 border-b border-gray-300 font-semibold text-[11px] uppercase tracking-wider text-gray-400`}>
          <div>Project</div>
          <div className="grid grid-cols-3 gap-4">
            <div>Discipline</div>
            <div>Year</div>
            <div>Company</div>
          </div>
        </div>

        <div className="flex flex-col w-full">
          {projects.map((project, projectIndex) => {
            const isExpanded = expandedId === project.id;

            return (
              <div key={project.id} className="w-full">
                <div
                  onClick={() => toggleExpand(project.id)}
                  className={`
                    group grid grid-cols-1 md:grid-cols-2 ${macroGridGap} py-4
                    border-b border-gray-200 cursor-pointer
                    transition-colors duration-200 items-center
                    ${isExpanded ? "bg-neutral-50" : "hover:bg-neutral-50/60"}
                  `}
                >
                  <div className="flex items-center gap-3 font-medium text-black">
                    <motion.span
                      variants={arrowVariants}
                      animate={isExpanded ? "expanded" : "collapsed"}
                      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                      className="inline-flex items-center justify-center w-5 h-5 shrink-0 text-[15px] leading-none text-gray-400 group-hover:text-black transition-colors"
                    >
                      +
                    </motion.span>
                    <span className="truncate">{project.name}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-gray-500">
                    <div className="truncate">{project.discipline}</div>
                    <div>{project.year}</div>
                    <div className="truncate">{project.company}</div>
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      key="panel"
                      variants={expandVariants}
                      initial="collapsed"
                      animate="expanded"
                      exit="collapsed"
                      className="overflow-hidden border-b border-gray-200"
                    >
                      <motion.div
                        variants={panelContentVariants}
                        initial="collapsed"
                        animate="expanded"
                        exit="collapsed"
                        className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-10 p-8 lg:py-10 lg:px-12"
                      >
                        <motion.div
                          variants={panelChildVariant}
                          className="flex flex-col justify-center space-y-4"
                        >
                          <h3 className="text-base font-medium text-black tracking-tight">
                            {project.name}
                          </h3>
                          <p className="text-gray-500 leading-relaxed text-[13px]">
                            {project.description}
                          </p>
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              const href = caseStudyRoutes[projectIndex] ?? project.caseStudyUrl;
                              router.push(href, {
                                onTransitionReady: pageAnimation,
                              });
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="mt-2 px-5 py-2.5 bg-black text-white w-max rounded-md text-xs font-medium hover:bg-neutral-800 transition-colors inline-block cursor-pointer"
                          >
                            View Case Study →
                          </motion.button>
                        </motion.div>

                        <motion.div
                          variants={panelChildVariant}
                          className="grid grid-cols-3 gap-3"
                        >
                          {project.images.map((src, imgIndex) => (
                            <motion.div
                              key={imgIndex}
                              initial={{ opacity: 0, scale: 0.96 }}
                              animate={{
                                opacity: 1,
                                scale: 1,
                                transition: {
                                  duration: 0.4,
                                  delay: 0.25 + imgIndex * 0.08,
                                  ease: [0.25, 0.1, 0.25, 1],
                                },
                              }}
                              className="relative aspect-[4/3] bg-neutral-100 rounded-md overflow-hidden border border-neutral-200/80"
                            >
                              <Image
                                src={src}
                                alt={`${project.name} preview ${imgIndex + 1}`}
                                fill
                                className="object-cover"
                              />
                            </motion.div>
                          ))}
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.section>

    </main>
  );
}