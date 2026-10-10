// Compares the local capture against the reference capture.
//
//   node scripts/compare.mjs [route…] [viewport…] [--verbose]
//
// For every route × viewport it reports
//   • layout: elements whose box (relative to their parent) or key computed
//     styles differ, and elements present on only one side;
//   • pixels: share of differing pixels in the full-page screenshots, with a
//     diff image written to screenshots/diff/.
// Run scripts/capture.mjs for both targets first.
import fs from "node:fs";
import path from "node:path";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import { parseFilters, root } from "./audit-config.mjs";

const words = process.argv.slice(2);
const verbose = words.includes("--verbose");
const selection = parseFilters(words);
const dir = (target) => path.join(root, "screenshots", target);
const diffDir = dir("diff");
fs.mkdirSync(diffDir, { recursive: true });

const BOX_TOLERANCE = 1.5;
const STYLE_KEYS = ["display", "position", "fontSize", "fontWeight", "lineHeight", "color", "background", "radius"];

function compareLayout(name) {
  const load = (target) => {
    const file = path.join(dir(target), `${name}.layout.json`);
    return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : null;
  };
  const reference = load("reference");
  const local = load("local");
  if (!reference || !local) return null;

  const localByKey = new Map(local.map((record) => [record.key, record]));
  const referenceKeys = new Set(reference.map((record) => record.key));
  const issues = [];
  const missing = [];

  for (const ref of reference) {
    const mine = localByKey.get(ref.key);
    if (!mine) {
      // Report only the topmost missing element of a missing subtree.
      if (!missing.some((key) => ref.key.startsWith(`${key} > `))) missing.push(ref.key);
      continue;
    }
    // Hidden on both sides: geometry is meaningless.
    if (ref.style.display === "none" && mine.style.display === "none") continue;
    const parts = [];
    for (const field of ["rx", "ry", "w", "h"]) {
      const delta = mine[field] - ref[field];
      if (Math.abs(delta) > BOX_TOLERANCE) parts.push(`${field} ${ref[field]}→${mine[field]}`);
    }
    const isImage = / > img[^>]*$/.test(ref.key);
    for (const field of STYLE_KEYS) {
      // next/image sets `color: transparent` on <img> to hide alt text while loading.
      if (isImage && field === "color") continue;
      if (ref.style[field] !== mine.style[field]) parts.push(`${field} ${ref.style[field]}→${mine.style[field]}`);
    }
    if (ref.text !== undefined && mine.text !== undefined && ref.text !== mine.text) {
      parts.push(`text "${ref.text}"→"${mine.text}"`);
    }
    if (parts.length) issues.push({ key: ref.key, y: ref.y, parts });
  }

  const extra = [];
  for (const mine of local) {
    if (referenceKeys.has(mine.key)) continue;
    if (!extra.some((key) => mine.key.startsWith(`${key} > `))) extra.push(mine.key);
  }

  return { total: reference.length, issues, missing, extra };
}

function comparePixels(name) {
  const read = (target) => {
    const file = path.join(dir(target), `${name}.full.png`);
    return fs.existsSync(file) ? PNG.sync.read(fs.readFileSync(file)) : null;
  };
  const reference = read("reference");
  const local = read("local");
  if (!reference || !local) return null;

  const width = Math.min(reference.width, local.width);
  const height = Math.min(reference.height, local.height);
  const crop = (image) => {
    if (image.width === width && image.height === height) return image.data;
    const out = Buffer.alloc(width * height * 4);
    for (let row = 0; row < height; row++) {
      image.data.copy(out, row * width * 4, row * image.width * 4, row * image.width * 4 + width * 4);
    }
    return out;
  };
  const diff = new PNG({ width, height });
  const differing = pixelmatch(crop(reference), crop(local), diff.data, width, height, { threshold: 0.1 });
  fs.writeFileSync(path.join(diffDir, `${name}.diff.png`), PNG.sync.write(diff));
  return {
    reference: `${reference.width}x${reference.height}`,
    local: `${local.width}x${local.height}`,
    ratio: differing / (width * height),
  };
}

const summary = [];
const shorten = (key) => key.split(" > ").slice(-3).join(" > ");

for (const viewport of selection.viewports) {
  for (const route of selection.routes) {
    const name = `${route.name}.${viewport.name}`;
    const layout = compareLayout(name);
    const pixels = comparePixels(name);
    if (!layout && !pixels) {
      console.log(`${name}: no captures to compare`);
      continue;
    }
    const line = [
      name.padEnd(36),
      pixels ? `size ${pixels.reference} vs ${pixels.local}`.padEnd(30) : "".padEnd(30),
      pixels ? `pixels ${(pixels.ratio * 100).toFixed(2)}%`.padEnd(16) : "".padEnd(16),
      layout ? `layout ${layout.issues.length} diff / ${layout.missing.length} missing / ${layout.extra.length} extra (of ${layout.total})` : "",
    ].join(" ");
    console.log(line);
    summary.push({ name, pixels, layout: layout && { issues: layout.issues.length, missing: layout.missing.length, extra: layout.extra.length } });
    if (verbose && layout) {
      for (const issue of layout.issues.slice(0, 60)) console.log(`   ~ y${Math.round(issue.y)} ${shorten(issue.key)} :: ${issue.parts.join(", ")}`);
      if (layout.issues.length > 60) console.log(`   … ${layout.issues.length - 60} more`);
      for (const key of layout.missing.slice(0, 25)) console.log(`   - missing locally: ${shorten(key)}`);
      for (const key of layout.extra.slice(0, 25)) console.log(`   + only local: ${shorten(key)}`);
    }
  }
}

fs.writeFileSync(path.join(diffDir, "summary.json"), JSON.stringify(summary, null, 2));
