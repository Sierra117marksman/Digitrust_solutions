"use client";

import { useEffect, useState } from "react";

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) {
        setProgress(0);
        return;
      }
      const currentScroll = window.scrollY;
      const percentage = Math.min(Math.max((currentScroll / scrollHeight) * 100, 0), 100);
      setProgress(percentage);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className="scroll-progress-bar"
      style={{ transform: `scaleX(${progress / 100})` }}
      aria-hidden="true"
    />
  );
}
