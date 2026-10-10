// Evaluates an expression on the same route of the reference and local sites and prints both results.
//   node scripts/probe.mjs <path> "<js expression>" [width] [height]
import { chromium } from "@playwright/test";
import { bases, chromeArgs } from "./audit-config.mjs";

const [, , route = "/", expression = "document.title", width = "1440", height = "900"] = process.argv;
const browser = await chromium.launch({ channel: "chrome", args: chromeArgs });

for (const [target, base] of Object.entries(bases)) {
  const context = await browser.newContext({ viewport: { width: Number(width), height: Number(height) }, locale: "fa-IR" });
  const page = await context.newPage();
  try {
    await page.goto(base.replace(/\/$/, "") + route, { waitUntil: "load", timeout: 90_000 });
    await page.waitForTimeout(1500);
    const result = await page.evaluate(expression);
    console.log(`${target}:`, JSON.stringify(result, null, 1));
  } catch (error) {
    console.log(`${target}: ERROR ${String(error).split("\n")[0]}`);
  }
  await context.close();
}
await browser.close();
