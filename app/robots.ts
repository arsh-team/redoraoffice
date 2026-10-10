import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // The reference disallows /admin; /api is added because it only serves form posts.
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
