// Captures full-page and above-the-fold screenshots, plus a structural layout
// snapshot, of every page type at the four audit viewports — from either the
// reference site or a local server.
//
//   node scripts/capture.mjs reference [route…] [viewport…]   -> screenshots/reference
//   node scripts/capture.mjs local     [route…] [viewport…]   -> screenshots/local
//
// The local base URL defaults to http://localhost:3000 (override with LOCAL_BASE_URL).
// Both targets use identical browser settings so the two sets are comparable.
import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";
import { bases, chromeArgs, parseFilters, root } from "./audit-config.mjs";
import { collectLayout } from "./collect-layout.mjs";

const [, , target = "local", ...words] = process.argv;
if (!(target in bases)) {
  console.error('First argument must be "reference" or "local".');
  process.exit(1);
}
const base = bases[target].replace(/\/$/, "");
const selection = parseFilters(words);

const outDir = path.join(root, "screenshots", target);
fs.mkdirSync(outDir, { recursive: true });

/** Scrolls through the page so scroll-triggered reveals and lazy images settle. */
async function settle(page) {
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.6);
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((resolve) => setTimeout(resolve, 120));
    }
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" });
    await new Promise((resolve) => setTimeout(resolve, 250));
    window.scrollTo({ top: 0, behavior: "instant" });
  });
  await page.evaluate(() =>
    Promise.all(
      [...document.images].map((img) =>
        img.complete
          ? null
          : new Promise((resolve) => {
              img.addEventListener("load", resolve, { once: true });
              img.addEventListener("error", resolve, { once: true });
              setTimeout(resolve, 15_000);
            }),
      ),
    ),
  );
  await page.evaluate(() => document.fonts.ready);
  // The homepage slider auto-advances; pin it to the first slide so both targets match.
  // (Dispatched from script because the thumbnails are hidden on small screens.)
  await page.evaluate(() => document.querySelector(".heroThumb")?.click());
  // Count-up numbers (850ms), reveal transitions (≤ 850ms) and the header's
  // return after scrolling back to the top all finish well inside this.
  await page.waitForTimeout(1800);
}

async function capture(context, route, viewport) {
  const page = await context.newPage();
  const errors = [];
  const failures = [];
  page.on("pageerror", (error) => errors.push(String(error)));
  page.on("requestfailed", (request) => failures.push(`${request.url()} :: ${request.failure()?.errorText}`));
  try {
    const response = await page.goto(base + route.path, { waitUntil: "load", timeout: 90_000 });
    await settle(page);
    const file = `${route.name}.${viewport.name}`;
    await page.screenshot({ path: path.join(outDir, `${file}.fold.png`), animations: "disabled" });
    await page.screenshot({ path: path.join(outDir, `${file}.full.png`), fullPage: true, animations: "disabled" });
    const layout = await page.evaluate(collectLayout);
    fs.writeFileSync(path.join(outDir, `${file}.layout.json`), JSON.stringify(layout));
    const metrics = await page.evaluate(() => ({
      stylesheets: document.styleSheets.length,
      // Finished loading but decoded to nothing. Images without a source (the empty
      // lightbox) or still deferred inside hidden containers are not failures.
      brokenImages: [...document.images].filter(
        (img) => img.getAttribute("src") && img.complete && img.naturalWidth === 0,
      ).length,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      height: document.documentElement.scrollHeight,
    }));
    return { route: route.name, viewport: viewport.name, status: response?.status(), ...metrics, errors, failures };
  } finally {
    await page.close();
  }
}

const browser = await chromium.launch({ channel: "chrome", args: chromeArgs });
const reportFile = path.join(outDir, "report.json");
const report = fs.existsSync(reportFile) ? JSON.parse(fs.readFileSync(reportFile, "utf8")) : [];
let failed = 0;

for (const viewport of selection.viewports) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
    locale: "fa-IR",
    reducedMotion: "no-preference",
  });
  for (const route of selection.routes) {
    let entry;
    for (let attempt = 1; attempt <= 3 && !entry; attempt++) {
      try {
        const result = await capture(context, route, viewport);
        // A capture without the site stylesheet or with broken images is not usable.
        if (result.brokenImages > 0 || result.failures.length > 0) {
          throw new Error(`incomplete load (${result.brokenImages} broken images, ${result.failures.length} failed requests)`);
        }
        entry = result;
      } catch (error) {
        console.error(`${route.name}.${viewport.name} attempt ${attempt} failed: ${String(error).split("\n")[0]}`);
      }
    }
    const index = report.findIndex((item) => item.route === route.name && item.viewport === viewport.name);
    const record = entry ?? { route: route.name, viewport: viewport.name, error: "capture failed" };
    if (index >= 0) report[index] = record;
    else report.push(record);
    if (entry) console.log(`${route.name}.${viewport.name}  ${entry.status}  ${entry.clientWidth}x${entry.height}`);
    else failed++;
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
  }
  await context.close();
}

await browser.close();
if (failed) {
  console.error(`${failed} capture(s) failed`);
  process.exit(1);
}
