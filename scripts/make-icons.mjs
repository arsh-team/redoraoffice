// Generates the favicon and Apple touch icon from the reference logo.
//   node scripts/make-icons.mjs
// The reference site ships no favicon (/favicon.ico is a 404), so these are
// derived from its own logo mark: the "R" monogram on the site's ink colour.
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const logo = path.join(root, "public", "images", "logo-transparent.png");
const INK = { r: 23, g: 22, b: 20, alpha: 1 };

// The monogram occupies the top of the 707×753 artwork; the wordmark sits below it.
const monogram = await sharp(logo).extract({ left: 70, top: 0, width: 580, height: 610 }).toBuffer();

async function makeIcon(size, file, { rounded }) {
  const inner = Math.round(size * 0.68);
  const mark = await sharp(monogram)
    .resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();
  const radius = rounded ? Math.round(size * 0.22) : 0;
  const background = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" fill="rgb(${INK.r},${INK.g},${INK.b})"/></svg>`,
  );
  await sharp(background)
    .composite([{ input: mark, gravity: "centre" }])
    .png()
    .toFile(path.join(root, "app", file));
  console.log(`wrote app/${file} (${size}×${size})`);
}

await makeIcon(256, "icon.png", { rounded: true });
await makeIcon(180, "apple-icon.png", { rounded: false });
