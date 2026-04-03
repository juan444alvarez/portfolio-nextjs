"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Optional custom easing
    });

    lenis.on("scroll", (e) => {
      // console.log(e); // Uncomment for debugging
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  return null;
}
