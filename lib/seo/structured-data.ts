import type { Article } from "@/lib/content/articles";
import { imagePublicPath } from "@/lib/content/images";
import type { Project } from "@/lib/content/projects";
import { absoluteUrl, site } from "@/lib/content/site";

export type JsonLdData = Record<string, unknown>;

/** Mirrors the Organization block the reference prints on every page. */
export const organizationJsonLd: JsonLdData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  logo: absoluteUrl("/images/logo-transparent.png"),
  email: site.email,
  telephone: site.phone,
  address: { "@type": "PostalAddress", addressLocality: site.locality },
};

export function projectJsonLd(project: Project): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    image: absoluteUrl(imagePublicPath[project.cover]),
    url: absoluteUrl(`/projects/${project.slug}`),
    creator: { "@type": "Organization", name: site.name },
  };
}

export function articleJsonLd(article: Article): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: [absoluteUrl(imagePublicPath[article.cover])],
    datePublished: article.body.publishedIso,
    dateModified: article.body.publishedIso,
    mainEntityOfPage: absoluteUrl(`/blog/${article.slug}`),
    author: { "@type": "Organization", name: site.name },
    publisher: { "@type": "Organization", name: site.name },
  };
}
