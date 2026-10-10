// Captures full-page and above-the-fold screenshots of every page type at the
// four audit viewports, from either the reference site or a local build.
//
//   node scripts/capture.mjs reference            -> screenshots/reference
//   node scripts/capture.mjs local [baseUrl]      -> screenshots/local
//
// Both runs use identical browser settings so the two sets are comparable.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [, , target = "local", baseArg, ...filters] = process.argv;

const bases = { reference: "https://redoraoffice.ir", local: "http://localhost:3000" };
const base = (baseArg && baseArg.startsWith("http") ? baseArg : bases[target]).replace(/\/$/, "");
const only = [baseArg, ...filters].filter((value) => value && !value.startsWith("http"));

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

const outDir = path.join(root, "screenshots", target);
fs.mkdirSync(outDir, { recursive: true });

/** Scrolls through the page so scroll-triggered reveals and lazy images settle. */
async function settle(page) {
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.6);
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 120));
    }
    window.scrollTo(0, document.documentElement.scrollHeight);
    await new Promise((resolve) => setTimeout(resolve, 250));
    window.scrollTo(0, 0);
  });
  await page.evaluate(() =>
    Promise.all(
      [...document.images].map((img) =>
        img.complete ? null : new Promise((resolve) => ((img.onload = resolve), (img.onerror = resolve))),
      ),
    ),
  );
  await page.evaluate(() => document.fonts.ready);
  // Count-up numbers (850ms) and reveal transitions (≤ 850ms) finish well inside this.
  await page.waitForTimeout(1600);
}

const browser = await chromium.launch({ channel: "chrome" });
const report = [];

for (const viewport of viewports) {
  if (only.length && only.some((f) => viewports.some((v) => v.name === f)) && !only.includes(viewport.name)) continue;
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
    locale: "fa-IR",
    reducedMotion: "no-preference",
  });
  for (const route of routes) {
    if (only.length && only.some((f) => routes.some((r) => r.name === f)) && !only.includes(route.name)) continue;
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(String(error)));
    try {
      const response = await page.goto(base + route.path, { waitUntil: "load", timeout: 90_000 });
      await settle(page);
      const file = `${route.name}.${viewport.name}`;
      await page.screenshot({ path: path.join(outDir, `${file}.fold.png`), animations: "disabled" });
      await page.screenshot({
        path: path.join(outDir, `${file}.full.png`),
        fullPage: true,
        animations: "disabled",
      });
      const metrics = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        height: document.documentElement.scrollHeight,
      }));
      report.push({ route: route.name, viewport: viewport.name, status: response?.status(), ...metrics, errors });
      console.log(`${file}  ${response?.status()}  ${metrics.clientWidth}x${metrics.height}`);
    } catch (error) {
      report.push({ route: route.name, viewport: viewport.name, error: String(error) });
      console.error(`${route.name}.${viewport.name} FAILED: ${error}`);
    } finally {
      await page.close();
    }
  }
  await context.close();
}

await browser.close();
fs.writeFileSync(path.join(outDir, "report.json"), JSON.stringify(report, null, 2));
