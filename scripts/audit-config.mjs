// Shared configuration for the capture / compare / metrics scripts.
import path from "node:path";
import { fileURLToPath } from "node:url";

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export const bases = {
  reference: "https://redoraoffice.ir",
  local: process.env.LOCAL_BASE_URL ?? "http://localhost:3000",
};

/** One representative URL per page type, plus a second case study with a different cover. */
export const routes = [
  { name: "home", path: "/" },
  { name: "about", path: "/about" },
  { name: "services", path: "/services" },
  { name: "projects", path: "/projects" },
  { name: "project-lavassan", path: "/projects/lavassan" },
  { name: "project-farmanieh", path: "/projects/farmanieh" },
  { name: "blog", path: "/blog" },
  { name: "article-kitchen-decisions", path: "/blog/kitchen-decisions" },
  { name: "contact", path: "/contact" },
];

export const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "laptop", width: 1280, height: 800 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
];

/**
 * The reference host stalls sub-resource requests over HTTP/2 and QUIC from
 * some networks (the document arrives, CSS/JS/images never do). Forcing
 * HTTP/1.1 makes captures reliable and has no effect on rendering.
 */
export const chromeArgs = ["--disable-quic", "--disable-http2"];

/** Splits CLI words into route and viewport filters; anything else is ignored. */
export function parseFilters(words) {
  const routeNames = words.filter((word) => routes.some((route) => route.name === word));
  const viewportNames = words.filter((word) => viewports.some((viewport) => viewport.name === word));
  return {
    routes: routeNames.length ? routes.filter((route) => routeNames.includes(route.name)) : routes,
    viewports: viewportNames.length
      ? viewports.filter((viewport) => viewportNames.includes(viewport.name))
      : viewports,
  };
}
