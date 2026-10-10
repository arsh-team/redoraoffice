# Asset manifest

The reference site ships four image files in total. All were downloaded
unmodified from their public URLs on 2026-10-10 for this reconstruction of the
same site. **Confirm with the site owner that this use is authorised before
deploying**; nothing here was sourced from a third party.

| Local file | Type | Source | Pixels | Size | Used for | Transformation |
| --- | --- | --- | --- | --- | --- | --- |
| `public/images/logo-transparent.png` | Logo (PNG, alpha) | `https://redoraoffice.ir/assets/logo-transparent.png` | 707 × 753 | 160 KB | Navigation bar, footer, Organization JSON-LD | None. Served through `next/image`. |
| `public/images/kitchen-hero.jpg` | Photograph | `https://redoraoffice.ir/assets/images/kitchen-hero.jpg` | 1536 × 558 | 231 KB | Hero slide 1, about/services/contact/article heroes, cards, Open Graph image | None. |
| `public/images/kitchen-dark.jpg` | Photograph | `https://redoraoffice.ir/assets/images/kitchen-dark.jpg` | 766 × 456 | 93 KB | Hero slide 2, projects hero, story band, cards, testimonial background (CSS) | None. |
| `public/images/kitchen-light.jpg` | Photograph | `https://redoraoffice.ir/assets/images/kitchen-light.jpg` | 760 × 456 | 86 KB | Hero slide 3, manifesto, process, cards | None. |

Derived files:

| Local file | Derived from | How |
| --- | --- | --- |
| `app/icon.png` (256²), `app/apple-icon.png` (180²) | `logo-transparent.png` | `node scripts/make-icons.mjs` — the "R" monogram cropped from the logo on the site's ink colour. The reference has no favicon (`/favicon.ico` is 404), so this is an addition, not a copy. |
| `app/styles/reference.css` | `https://redoraoffice.ir/assets/style.css` | `node scripts/port-reference-css.mjs` — four mechanical rewrites, see `docs/design-system.md`. |

Notes

- The photographs are small for the frames they fill (the reference upscales
  them too). `components/ui/Photo.tsx` requests enough source pixels for each
  cropped frame and re-encodes at quality 90 (AVIF/WebP), so they are never
  softer than on the reference. Real project photography should be at least
  2,000px on the long edge.
- Which photograph appears in which slot is data, not markup:
  `lib/content/images.ts` maps the keys `hero`, `dark`, `light` to files and
  every content module refers to those keys.
- Fonts: Vazirmatn (SIL Open Font License) is fetched from Google Fonts at
  build time by `next/font` and self-hosted; no font files are committed.
- Icons: the reference uses Unicode glyphs; they are reproduced as text, so no
  icon library is installed.
- Material samples on case-study pages and the swatches on the services page
  are CSS gradients from the reference stylesheet, not images.
- No stock or placeholder imagery was introduced.
