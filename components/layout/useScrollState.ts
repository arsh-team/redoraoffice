"use client";

import { useEffect, useState } from "react";

/** True once the page has scrolled past the point where the nav condenses (45px on the reference). */
export function useScrolled(threshold = 45): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}

/**
 * Header auto-hide, ported from the reference: it slides away only on a
 * deliberate downward scroll and returns immediately on any upward scroll.
 */
export function useHeaderHidden(): boolean {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - last;
      if (y < 90 || delta < -5) setHidden(false);
      else if (delta > 7 && y > 220) setHidden(true);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return hidden;
}
