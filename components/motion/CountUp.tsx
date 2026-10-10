"use client";

import { useEffect, useRef, useState } from "react";

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const DURATION_MS = 850;

/**
 * Headline statistic that counts up once when it scrolls into view.
 *
 * Ported from the reference's motion.js, including its quirk of moving any
 * prefix after the number ("+120" settles as "120+"), which is what the
 * reference shows once its animation has run. Renders the raw value on the
 * server and whenever motion is disabled.
 */
export function CountUp({ value }: { value: string }) {
  const element = useRef<HTMLElement>(null);
  const [text, setText] = useState(value);

  useEffect(() => {
    const node = element.current;
    if (!node || !document.documentElement.classList.contains("motion-ready")) return;

    const match = value.trim().match(/([0-9۰-۹]+)/);
    if (!match) return;
    const end = Number(match[1].replace(/[۰-۹]/g, (digit) => String(PERSIAN_DIGITS.indexOf(digit))));
    if (!Number.isFinite(end) || end > 9999) return;
    const suffix = value.trim().replace(match[1], "");

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        let start: number | undefined;
        const tick = (time: number) => {
          start ??= time;
          const progress = Math.min((time - start) / DURATION_MS, 1);
          setText(Math.round(end * (1 - Math.pow(1 - progress, 3))) + suffix);
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.65 },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return <strong ref={element}>{text}</strong>;
}
