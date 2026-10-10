import Image, { type ImageProps } from "next/image";
import { defaultImageAlt, images, type ImageKey } from "@/lib/content/images";

/**
 * The source photographs are small, already-compressed JPEGs that the layout
 * often shows larger than their pixel size, so they are re-encoded gently.
 * Must be listed in `images.qualities` in next.config.ts.
 */
export const PHOTO_QUALITY = 90;

/**
 * Every frame in the design crops its photo with `object-fit: cover`, and the
 * frames are much taller than the photos (kitchen-hero is a 2.75:1 panorama).
 * To fill a frame's height the browser needs more source pixels than the
 * frame is wide, so the `sizes` hint — written at call sites as the frame's
 * width — is scaled by roughly photo-aspect ÷ typical-frame-aspect. Without
 * this the optimizer would hand out images that get visibly upscaled.
 */
const COVER_SCALE: Record<ImageKey, number> = { hero: 2.25, dark: 1.4, light: 1.4 };

function scaleSizes(sizes: string, factor: number): string {
  return sizes
    .split(",")
    .map((entry) =>
      // Only the trailing length of each entry is a size; anything before it is a media condition.
      entry.replace(/(\d+(?:\.\d+)?)(vw|px)\s*$/, (_, value: string, unit: string) => {
        return `${Math.round(Number(value) * factor)}${unit}`;
      }),
    )
    .join(",");
}

interface PhotoProps extends Omit<ImageProps, "src" | "alt" | "width" | "height" | "fill" | "quality"> {
  image: ImageKey;
  /** Defaults to the reference's generic description; pass "" for purely decorative use. */
  alt?: string;
  /** Width of the frame the photo sits in (standard `sizes` syntax). */
  sizes?: string;
}

/**
 * One of the site's photographs through next/image.
 * The element stays a bare <img>, so the ported stylesheet controls its box
 * exactly as it does on the reference; intrinsic dimensions prevent layout shift.
 */
export function Photo({ image, alt = defaultImageAlt, sizes = "100vw", ...rest }: PhotoProps) {
  return (
    <Image
      src={images[image]}
      alt={alt}
      sizes={scaleSizes(sizes, COVER_SCALE[image])}
      quality={PHOTO_QUALITY}
      {...rest}
    />
  );
}
