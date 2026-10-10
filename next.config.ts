import type { NextConfig } from "next";

/*
 * `cacheComponents` / `partialPrefetching` (on in the create-next-app template)
 * are deliberately off. This site is fully static, and with Cache Components
 * Next keeps previously visited pages mounted but hidden, which duplicates
 * element ids across pages and breaks the in-page anchors (#consult,
 * #projectForm, article contents) the design relies on. It also made unknown
 * /projects/* and /blog/* slugs answer 200 instead of 404.
 */
const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // See PHOTO_QUALITY in components/ui/Photo.tsx.
    qualities: [75, 90],
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        // Same baseline security headers the reference host sends.
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
