import Image, { type ImageProps } from "next/image";
import { defaultImageAlt, images, type ImageKey } from "@/lib/content/images";

interface PhotoProps extends Omit<ImageProps, "src" | "alt" | "width" | "height" | "fill"> {
  image: ImageKey;
  /** Defaults to the reference's generic description; pass "" for purely decorative use. */
  alt?: string;
}

/**
 * One of the site's photographs through next/image.
 * The element stays a bare <img>, so the ported stylesheet controls its box
 * exactly as it does on the reference; intrinsic dimensions prevent layout shift.
 */
export function Photo({ image, alt = defaultImageAlt, sizes = "100vw", ...rest }: PhotoProps) {
  return <Image src={images[image]} alt={alt} sizes={sizes} {...rest} />;
}
