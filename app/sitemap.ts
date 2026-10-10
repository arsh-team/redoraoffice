import type { MetadataRoute } from "next";
import { articles } from "@/lib/content/articles";
import { projects } from "@/lib/content/projects";
import { absoluteUrl } from "@/lib/content/site";

/** Last content change. The detail-page date matches the reference sitemap. */
const PAGES_UPDATED = "2026-10-10";
const DETAILS_UPDATED = "2026-09-27";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/about", "/services", "/projects", "/blog", "/contact"];

  return [
    ...pages.map((path) => ({
      url: absoluteUrl(path),
      lastModified: PAGES_UPDATED,
      priority: path === "/" ? 1 : 0.8,
    })),
    ...projects.map((project) => ({
      url: absoluteUrl(`/projects/${project.slug}`),
      lastModified: DETAILS_UPDATED,
      priority: 0.6,
    })),
    ...articles.map((article) => ({
      url: absoluteUrl(`/blog/${article.slug}`),
      lastModified: DETAILS_UPDATED,
      priority: 0.6,
    })),
  ];
}
