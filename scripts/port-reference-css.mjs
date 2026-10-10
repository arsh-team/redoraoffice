// Ports the reference site's stylesheet into this project.
//
//   node scripts/port-reference-css.mjs <path-to-downloaded-style.css>
//
// The reference stylesheet (https://redoraoffice.ir/assets/style.css) is ~60
// revisions appended to one file, each overriding the previous. The rendered
// design is the result of that whole cascade, so the port keeps every rule in
// its original order and only applies the mechanical rewrites below.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const input = process.argv[2];
if (!input) {
  console.error("Usage: node scripts/port-reference-css.mjs <path-to-style.css>");
  process.exit(1);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "app", "styles", "reference.css");

let css = fs.readFileSync(input, "utf8");

const rewrites = [
  // 1. Asset URLs: the source resolves them relative to /assets/.
  [/url\('images\//g, "url('/images/"],
  // 2. The motion flag lives on <html> here (set before first paint), not on <body>.
  //    (`html.` keeps the selector's specificity identical to the original `body.`.)
  [/body\.motion-ready/g, "html.motion-ready"],
  // 2b. On the source both the motion flag and the page class sit on <body>, so
  //     "body.motion-ready .detailPageV47 …" can never match there. Keep those rules
  //     inert here too by requiring both classes on one element.
  [
    /(?<!html)\.motion-ready (\.(?:aboutPage|servicesPage|innerPage|blogPage|contactPage|articlePage|detailPage|detailPageV47)\b)/g,
    ".motion-ready$1",
  ],
  // 3. Page-level classes sit on a wrapper <div class="pageRoot …"> instead of <body>,
  //    so the one selector that inspects <body> itself is retargeted. `div:where(…)`
  //    keeps its specificity at (0,4,1): a later `main>section:not(…)` rule at (0,4,2)
  //    must keep winning, exactly as it does on the source.
  [
    /body:not\(\.innerPage\):not\(\.contactPage\):not\(\.detailPageV47\)/g,
    "div:where(.pageRoot):not(.innerPage):not(.contactPage):not(.detailPageV47)",
  ],
];

for (const [pattern, replacement] of rewrites) {
  const before = css;
  css = css.replace(pattern, replacement);
  if (before === css) console.warn(`warning: rewrite had no effect: ${pattern}`);
}

const banner = `/*
 * Ported from https://redoraoffice.ir/assets/style.css — do not edit by hand.
 * Regenerate with scripts/port-reference-css.mjs; project-specific additions
 * belong in app/styles/enhancements.css. See docs/design-system.md.
 */
`;

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, banner + css);
console.log(`wrote ${path.relative(root, output)} (${css.length} bytes)`);
