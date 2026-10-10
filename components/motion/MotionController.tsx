"use client";

import { useEffect } from "react";

/**
 * Scroll-driven motion, ported from the reference's motion.js: staggered
 * section reveals and a very small parallax offset on hero imagery (desktop only).
 *
 * It works on the rendered DOM by class name, exactly like the source, so the
 * page sections themselves stay Server Components. Two rules follow from that:
 *
 *  - Elements matched by REVEAL_SELECTOR must keep a static `className` in
 *    React, or a re-render would drop the classes added here.
 *  - The controller is rendered by PageShell, inside the page, so its effect
 *    runs only after that page's markup has hydrated.
 */
const REVEAL_SELECTOR =
  "main > section, main > .wrap, .sectionHead, .sectionTitle, .projectCard, .projectShowcase, .serviceCard, .valueCard, .journalCard, .magFeaturedCard, .pdIntro, .pdGalleryGrid figure, .pdFeatureVisual, .pdMaterialSample, .pdCompareCards figure, .contactCard, .faqItem";
const PARALLAX_SELECTOR = ".heroMedia img,.organicImage img,.pdHero>img";
const REVEAL_RATIO = 0.09;

declare global {
  interface Window {
    /** Set once the controller has mounted; read by the inline bootstrap in app/layout.tsx. */
    __redoraMotion?: boolean;
  }
}

export function MotionController() {
  useEffect(() => {
    window.__redoraMotion = true;
    if (!document.documentElement.classList.contains("motion-ready")) return;

    const seen = new WeakSet<Element>();
    let order = 0;

    const revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          // Reference rule: reveal once 9% of the element is in view. A block so
          // tall that 9% of it exceeds the viewport could never get there, so it
          // is revealed as soon as it appears — content must not stay hidden.
          const unreachable =
            entry.rootBounds !== null &&
            entry.boundingClientRect.height * REVEAL_RATIO > entry.rootBounds.height;
          if (entry.intersectionRatio < REVEAL_RATIO && !unreachable) continue;
          entry.target.classList.add("motion-in");
          revealObserver.unobserve(entry.target);
        }
      },
      { threshold: [0, REVEAL_RATIO], rootMargin: "0px 0px -7% 0px" },
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

    // Pick up elements that mount after the first pass.
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
      mutationObserver.disconnect();
      detachParallax();
    };
  }, []);

  return null;
}
