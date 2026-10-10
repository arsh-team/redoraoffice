import type { Metadata } from "next";
import { imagePublicPath, images, type ImageKey } from "@/lib/content/images";
import { site } from "@/lib/content/site";

interface PageMetadataInput {
  /** Page title without the site suffix. Omit for the homepage. */
  title?: string;
  description?: string;
  /** Route path starting with "/". */
  path: string;
  image?: ImageKey;
  type?: "website" | "article";
  publishedTime?: string;
}

/** Builds title, canonical, Open Graph and Twitter metadata for one route. */
export function buildMetadata({
  title,
  description = site.description,
  path,
  image = "hero",
  type = "website",
  publishedTime,
}: PageMetadataInput): Metadata {
  const fullTitle = title ? `${title} | ${site.name}` : site.defaultTitle;
  const canonical = path === "/" ? "/" : path;
  const picture = images[image];

  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical },
    openGraph: {
      type,
      locale: site.locale,
      siteName: site.name,
      title: fullTitle,
      description,
      url: canonical,
      images: [{ url: imagePublicPath[image], width: picture.width, height: picture.height }],
      ...(type === "article" && publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imagePublicPath[image]],
    },
  };
}
