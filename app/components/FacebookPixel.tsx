"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { pageview } from "@/lib/fpixel";

export default function FacebookPixel() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // The initial pageview is already triggered by the base Facebook Pixel script in layout.tsx.
    // We skip the first render to prevent duplicate PageView events, and trigger on subsequent SPA route changes.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    pageview();
  }, [pathname]);

  return null;
}
