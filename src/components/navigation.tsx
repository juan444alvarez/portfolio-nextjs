"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Navigation() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    setMounted(true);

    const clockTimer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(clockTimer);
    };
  }, []);

  const formatTime = (date: Date, timeZone: string) => {
    return new Intl.DateTimeFormat("en-US", {
      timeZone,
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);
  };

  // 1. Add the exact same variant from your page.tsx
  const layoutFadeVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut", delay: 1 },
    },
  };

  return (
    // 2. Change <nav> to <motion.nav> and apply the animation properties
    <motion.nav 
      variants={layoutFadeVariant}
      initial="hidden"
      animate="visible"
      className="w-full bg-black text-[#8b8b8b] font-mono text-[12px] py-2.5"
    >
      
      <div className="wrapper flex flex-wrap items-center justify-between">
          {/* Left Section: Brand, Clocks, Links */}
          <div className="flex items-center gap-4 md:gap-6">
            <span className="text-white font-medium tracking-widest">portfoli0.com</span>
            {/* Dynamic Ticking Clocks */}
            <div className="hidden md:flex items-center gap-4">
              <span>SAC {mounted ? formatTime(time, "America/Los_Angeles") : "--:--:--"}</span>
            </div>
            {/* Live Blinking Dot */}
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#32d74b] animate-pulse shadow-[0_0_4px_#c26515]"></span>
              <span>Live</span>
            </div>
            <div className="hidden lg:flex items-center gap-4 ml-2">
              <a href="#" className="hover:text-white transition-colors">Github</a>
              <a href="#" className="hover:text-white transition-colors">Connect</a>
              <a href="#" className="hover:text-white transition-colors">Resume</a>
            </div>
          </div>
          {/* Right Section: Git Commit Data */}
          <div className="hidden md:flex items-center gap-3">
            <span className="text-[#a1a1a1]">b33efc4</span>
            <span>·</span>
            <div className="flex gap-1.5">
              <span className="text-[#32d74b]">-14,202</span>
              <span className="text-[#ff9f0a]">+21,202</span>
            </div>
            <span>·</span>
            <span>Last commit 8 hours ago</span>
          </div>
      </div>
      
    </motion.nav>
  );
}