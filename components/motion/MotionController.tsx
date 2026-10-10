"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Scroll-driven motion, ported from the reference's motion.js:
 * staggered section reveals, a one-off count-up on headline statistics and a
 * very small parallax offset on hero imagery (desktop only).
 *
 * It works on the rendered DOM by class name, exactly like the source, so the
 * page sections themselves stay Server Components. Elements matched by
 * REVEAL_SELECTOR must therefore keep a static `className` in React.
 */
const REVEAL_SELECTOR =
  "main > section, main > .wrap, .sectionHead, .sectionTitle, .projectCard, .projectShowcase, .serviceCard, .valueCard, .journalCard, .magFeaturedCard, .pdIntro, .pdGalleryGrid figure, .pdFeatureVisual, .pdMaterialSample, .pdCompareCards figure, .contactCard, .faqItem";
const COUNT_SELECTOR = ".stat strong,.stats strong,.metric strong,.projectsHeroStats strong";
const PARALLAX_SELECTOR = ".heroMedia img,.organicImage img,.pdHero>img";
const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

declare global {
  interface Window {
    /** Set once the controller has mounted; read by the inline bootstrap in app/layout.tsx. */
    __redoraMotion?: boolean;
  }
}

function countUp(element: Element) {
  const raw = (element.textContent ?? "").trim();
  const match = raw.match(/([0-9۰-۹]+)/);
  if (!match) return;
  const end = Number(match[1].replace(/[۰-۹]/g, (digit) => String(PERSIAN_DIGITS.indexOf(digit))));
  if (!Number.isFinite(end) || end > 9999) return;
  const suffix = raw.replace(match[1], "");
  const duration = 850;
  let start: number | undefined;
  const tick = (time: number) => {
    start ??= time;
    const progress = Math.min((time - start) / duration, 1);
    element.textContent = Math.round(end * (1 - Math.pow(1 - progress, 3))) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

export function MotionController() {
  const pathname = usePathname();

  useEffect(() => {
    window.__redoraMotion = true;
    const root = document.documentElement;
    if (!root.classList.contains("motion-ready")) return;

    const seen = new WeakSet<Element>();
    let order = 0;

    const revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("motion-in");
          revealObserver.unobserve(entry.target);
        }
      },
      { threshold: 0.09, rootMargin: "0px 0px -7% 0px" },
    );

    const countObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          countUp(entry.target);
          countObserver.unobserve(entry.target);
        }
      },
      { threshold: 0.65 },
    );

    const register = () => {
      const fresh: HTMLElement[] = [];
      document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach((element) => {
        if (seen.has(element)) return;
        seen.add(element);
        element.classList.add("reveal-item");
        element.style.setProperty("--reveal-delay", `${Math.min((order++ % 4) * 55, 165)}ms`);
        revealObserver.observe(element);
        fresh.push(element);
      });
      document.querySelectorAll(COUNT_SELECTOR).forEach((element) => {
        if (seen.has(element)) return;
        seen.add(element);
        countObserver.observe(element);
      });
      if (fresh.length === 0) return;
      // Never leave content hidden when it is already above the fold.
      requestAnimationFrame(() => {
        for (const element of fresh) {
          if (element.getBoundingClientRect().top < window.innerHeight * 0.92) {
            element.classList.add("motion-in");
          }
        }
      });
    };

    register();

    // Pick up content that streams in or mounts after the first pass.
    const mutationObserver = new MutationObserver((records) => {
      const addedElements = records.some((record) =>
        Array.from(record.addedNodes).some((node) => node.nodeType === Node.ELEMENT_NODE),
      );
      if (addedElements) register();
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    let detachParallax = () => {};
    if (window.matchMedia("(min-width: 901px)").matches) {
      let ticking = false;
      const update = () => {
        const viewport = window.innerHeight;
        document.querySelectorAll<HTMLElement>(PARALLAX_SELECTOR).forEach((image) => {
          const rect = image.getBoundingClientRect();
          if (rect.bottom < 0 || rect.top > viewport) return;
          const center = rect.top + rect.height / 2 - viewport / 2;
          image.style.setProperty("--parallax-y", `${center * -0.018}px`);
        });
        ticking = false;
      };
      const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(update);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      update();
      detachParallax = () => window.removeEventListener("scroll", onScroll);
    }

    return () => {
      revealObserver.disconnect();
      countObserver.disconnect();
      mutationObserver.disconnect();
      detachParallax();
    };
  }, [pathname]);

  return null;
}
