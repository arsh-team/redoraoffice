// Logs every request the reference page makes, with status or failure reason.
//   node scripts/diagnose-reference.mjs [url] [--headed]
import { chromium } from "@playwright/test";

const url = process.argv.find((arg) => arg.startsWith("http")) ?? "https://redoraoffice.ir/about";
const headed = process.argv.includes("--headed");

const args = process.argv.filter((arg) => arg.startsWith("--disable-"));
console.log("chrome args:", args.join(" ") || "(none)");
const browser = await chromium.launch({ channel: "chrome", headless: !headed, args });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: "fa-IR" });
const page = await context.newPage();

console.log("UA:", await page.evaluate(() => navigator.userAgent));
page.on("response", (response) => {
  const request = response.request();
  console.log(response.status(), request.resourceType().padEnd(10), response.url().slice(0, 110));
});
page.on("requestfailed", (request) => {
  console.log("FAILED", request.resourceType().padEnd(10), request.url().slice(0, 110), "::", request.failure()?.errorText);
});

const started = Date.now();
try {
  await page.goto(url, { waitUntil: "load", timeout: 60_000 });
  console.log("load fired after", Date.now() - started, "ms");
} catch (error) {
  console.log("goto error after", Date.now() - started, "ms:", String(error).split("\n")[0]);
}
console.log("stylesheets:", await page.evaluate(() => document.styleSheets.length));
await browser.close();
