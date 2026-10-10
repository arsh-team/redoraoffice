import type { Locator, Page } from "@playwright/test";
import { articles } from "../../lib/content/articles";
import { projects } from "../../lib/content/projects";

export const mainRoutes = ["/", "/about", "/services", "/projects", "/blog", "/contact"];

export const allRoutes = [
  ...mainRoutes,
  ...projects.map((project) => `/projects/${project.slug}`),
  ...articles.map((article) => `/blog/${article.slug}`),
];

/** Collects console errors, uncaught exceptions and failed or 4xx/5xx requests for a page. */
export function trackProblems(page: Page) {
  const problems: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") problems.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => problems.push(`exception: ${error.message}`));
  page.on("requestfailed", (request) => {
    const reason = request.failure()?.errorText ?? "";
    // Prefetches cancelled by the browser are not failures.
    if (reason.includes("ERR_ABORTED")) return;
    problems.push(`request failed: ${request.url()} ${reason}`);
  });
  page.on("response", (response) => {
    if (response.status() >= 400) problems.push(`HTTP ${response.status()}: ${response.url()}`);
  });
  return problems;
}

/** Scrolls to the bottom and back so lazy images load and scroll reveals run. */
export async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.7);
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((resolve) => setTimeout(resolve, 60));
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  });
  await page.waitForLoadState("networkidle");
}

/**
 * Clicks an element after centring it in the viewport. On small screens the
 * floating call-to-action is a full-width bar along the bottom edge (as on the
 * reference), so controls must be clear of it before they can be pressed.
 */
export async function centerClick(locator: Locator) {
  await locator.evaluate((element) => element.scrollIntoView({ block: "center", behavior: "instant" }));
  await locator.click();
}

export const isMobile =(page: Page) => (page.viewportSize()?.width ?? 1440) <= 900;
