"use client";

import { useEffect, useState } from "react";
import { Photo } from "@/components/ui/Photo";
import { heroSlides } from "@/lib/content/home";

const INTERVAL_MS = 6500;
const pad = (value: number) => String(value).padStart(2, "0");

/** Hero image slider: auto-advances every 6.5s; thumbnails and arrows jump directly. */
export function HeroSlider() {
  // `turn` increments on every change so the progress bar restarts even on the same slide.
  const [{ index, turn }, setSlide] = useState({ index: 0, turn: 0 });
  const total = heroSlides.length;

  const show = (next: number) =>
    setSlide((current) => ({ index: (next + total) % total, turn: current.turn + 1 }));

  useEffect(() => {
    // Auto-advancing content is switched off for visitors who prefer reduced motion.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(
      () => setSlide((current) => ({ index: (current.index + 1) % total, turn: current.turn + 1 })),
      INTERVAL_MS,
    );
    return () => window.clearInterval(timer);
  }, [turn, total]);

  return (
    <div className="heroMedia">
      <div className="heroSlides">
        {heroSlides.map((slide, slideIndex) => (
          <figure
            key={slide.label}
            className={slideIndex === index ? "heroSlide active" : "heroSlide"}
            aria-hidden={slideIndex !== index}
          >
            <Photo
              image={slide.image}
              alt={slide.alt}
              sizes="(max-width: 900px) 100vw, 60vw"
              loading={slideIndex === 0 ? "eager" : "lazy"}
              fetchPriority={slideIndex === 0 ? "high" : "auto"}
            />
            <figcaption>
              <small>{slide.label}</small>
              <strong>{slide.title}</strong>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="heroThumbs" role="group" aria-label="انتخاب اسلاید">
        {heroSlides.map((slide, slideIndex) => (
          <button
            key={slide.label}
            type="button"
            className={slideIndex === index ? "heroThumb active" : "heroThumb"}
            aria-label={`نمایش اسلاید ${pad(slideIndex + 1)}`}
            aria-current={slideIndex === index ? "true" : undefined}
            onClick={() => show(slideIndex)}
          >
            <Photo image={slide.image} alt="" sizes="96px" />
            <span>{pad(slideIndex + 1)}</span>
          </button>
        ))}
      </div>
      <div className="heroArrows">
        <button className="heroPrev" type="button" aria-label="اسلاید قبلی" onClick={() => show(index - 1)}>
          →
        </button>
        <div className="heroProgress">
          <i key={turn} style={{ animation: `heroProgress ${INTERVAL_MS}ms linear forwards` }} />
        </div>
        <span className="heroCount" aria-live="polite">
          {pad(index + 1)} / {pad(total)}
        </span>
        <button className="heroNext" type="button" aria-label="اسلاید بعدی" onClick={() => show(index + 1)}>
          ←
        </button>
      </div>
    </div>
  );
}
