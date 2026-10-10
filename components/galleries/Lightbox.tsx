"use client";

import Image from "next/image";
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { Photo, PHOTO_QUALITY } from "@/components/ui/Photo";
import { defaultImageAlt, images, type ImageKey } from "@/lib/content/images";

interface LightboxImage {
  image: ImageKey;
  alt: string;
}

const LightboxContext = createContext<((image: LightboxImage, trigger: HTMLElement) => void) | null>(
  null,
);

/** Provides a single full-screen image viewer for every zoomable photo beneath it. */
export function LightboxProvider({ children }: { children: ReactNode }) {
  const [shown, setShown] = useState<LightboxImage | null>(null);
  const [open, setOpen] = useState(false);
  const closeButton = useRef<HTMLButtonElement>(null);
  const trigger = useRef<HTMLElement | null>(null);

  const show = useCallback((image: LightboxImage, source: HTMLElement) => {
    trigger.current = source;
    setShown(image);
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    trigger.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    // The dialog fades in from `visibility: hidden` and cannot take focus until
    // that transition is under way, so focus moves just after it starts.
    const focusTimer = window.setTimeout(() => closeButton.current?.focus(), 60);
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  return (
    <LightboxContext value={show}>
      {children}
      <div
        className={open ? "lightbox open" : "lightbox"}
        role="dialog"
        aria-modal="true"
        aria-label="نمای بزرگ تصویر"
        aria-hidden={!open}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        <button ref={closeButton} className="lightboxClose" type="button" aria-label="بستن" onClick={close}>
          ×
        </button>
        {shown ? (
          <Image
            src={images[shown.image]}
            alt={shown.alt || "نمای بزرگ پروژه"}
            sizes="(max-width: 1220px) 90vw, 1100px"
            quality={PHOTO_QUALITY}
          />
        ) : null}
      </div>
    </LightboxContext>
  );
}

interface ZoomablePhotoProps {
  image: ImageKey;
  alt?: string;
  sizes?: string;
  className?: string;
}

/** A photo that opens in the lightbox on click, Enter or Space. */
export function ZoomablePhoto({ image, alt = defaultImageAlt, sizes, className }: ZoomablePhotoProps) {
  const show = use(LightboxContext);

  if (!show) return <Photo image={image} alt={alt} sizes={sizes} className={className} />;

  const onKeyDown = (event: KeyboardEvent<HTMLImageElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    show({ image, alt }, event.currentTarget);
  };

  return (
    <Photo
      image={image}
      alt={alt}
      sizes={sizes}
      className={className}
      role="button"
      tabIndex={0}
      aria-label={`بزرگ‌نمایی تصویر: ${alt}`}
      onClick={(event) => show({ image, alt }, event.currentTarget)}
      onKeyDown={onKeyDown}
    />
  );
}
