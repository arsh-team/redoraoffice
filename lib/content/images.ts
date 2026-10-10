import type { StaticImageData } from "next/image";
import kitchenDark from "@/public/images/kitchen-dark.jpg";
import kitchenHero from "@/public/images/kitchen-hero.jpg";
import kitchenLight from "@/public/images/kitchen-light.jpg";
import logoTransparent from "@/public/images/logo-transparent.png";

/**
 * The reference site ships exactly three photographs and reuses them across
 * every page. Content modules refer to them by key so real project photography
 * can be dropped in later without touching components.
 */
export const images = {
  hero: kitchenHero,
  dark: kitchenDark,
  light: kitchenLight,
} as const satisfies Record<string, StaticImageData>;

export type ImageKey = keyof typeof images;

/** Stable, unhashed URLs for metadata and structured data. */
export const imagePublicPath = {
  hero: "/images/kitchen-hero.jpg",
  dark: "/images/kitchen-dark.jpg",
  light: "/images/kitchen-light.jpg",
} as const satisfies Record<ImageKey, string>;

export const logo: StaticImageData = logoTransparent;

/** Generic alt text the reference uses for decorative-but-meaningful photography. */
export const defaultImageAlt = "تصویر معماری و طراحی داخلی Redora";
