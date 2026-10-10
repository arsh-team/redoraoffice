# Redora Office — Next.js reconstruction

A reconstruction of [redoraoffice.ir](https://redoraoffice.ir/) (a Persian,
right-to-left kitchen and interior design studio site) in Next.js. The goal is
fidelity to the live reference: same pages, structure, copy, layout, motion and
responsive behaviour.

- [`docs/reference-audit.md`](docs/reference-audit.md) — what the reference
  contains, route by route, and every place this build deliberately differs.
- [`docs/design-system.md`](docs/design-system.md) — measured tokens, how the
  styling is organised, and the verification results.
- [`docs/asset-manifest.md`](docs/asset-manifest.md) — every asset and its source.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript (strict) ·
Tailwind CSS 4 · Playwright. No UI kit, state library, animation library or
icon package: the reference's motion is CSS plus ~150 lines of script, and its
icons are Unicode glyphs.

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

Requires Node 20.9 or newer. `next/font` downloads Vazirmatn from Google Fonts
during `dev` and `build`, so the first run needs network access.

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build / serve it |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run test:e2e` | Playwright suite against the production build (run `npm run build` first) |
| `npm run check` | All of the above, in order |
| `npm run audit:reference` | Re-capture screenshots + layout snapshots of the live reference |
| `npm run audit:local` | Capture the same from a local server (`LOCAL_BASE_URL`, default `http://localhost:3000`) |
| `npm run audit:compare` | Diff local against reference (add `-- --verbose` for per-element detail) |

The end-to-end tests use the installed Google Chrome. To use Playwright's own
browser instead: `npx playwright install chromium` and run with `PW_CHANNEL=`.

## Routes

| Route | Source |
| --- | --- |
| `/` | `app/page.tsx` |
| `/about` | `app/about/page.tsx` |
| `/services` | `app/services/page.tsx` |
| `/projects`, `/projects/[slug]` (6) | `app/projects/` |
| `/blog`, `/blog/[slug]` (6) | `app/blog/` |
| `/contact` | `app/contact/page.tsx` |
| `/api/contact`, `/api/newsletter` | form endpoints (POST) |
| `/sitemap.xml`, `/robots.txt`, icons | `app/sitemap.ts`, `app/robots.ts`, `app/icon.png` |

All 18 pages are statically prerendered; unknown slugs return a real 404.

There is intentionally no route-level `loading.tsx`. Every page is static, so
there is nothing to wait for — and with a loading boundary Next emits each
prerendered page with its content in a hidden container that a script swaps
in, which delays first paint and hides the page when scripts do not run.
Pending states exist where work actually happens: every form disables its
button and reads "در حال ارسال..." while submitting.

## Project layout

```text
app/                 routes, root layout, error and not-found pages
  styles/reference.css     ported reference stylesheet (generated — do not edit)
  styles/enhancements.css  the few rules this implementation adds
components/
  layout/            nav, header, footer, page shell, floating CTA, status page
  home/ services/ projects/ blog/   page-specific sections and interactive parts
  forms/             the four forms, shared submission hook and status line
  galleries/         lightbox, before/after slider
  motion/            scroll reveals, count-up, pre-paint bootstrap
  sections/ ui/ seo/ shared building blocks
lib/
  content/           all copy and collections as typed modules
  forms/             validation (shared client/server), delivery, rate limiting
  seo/               metadata and JSON-LD builders
scripts/             CSS port, icon generation, reference capture and comparison
tests/e2e/           Playwright specs
```

Pages are Server Components. Client Components are limited to what needs the
browser: navigation state, the hero slider, filters and search, the lightbox,
the comparison slider, accordions, forms and scroll motion.

## Editing content

Everything visitors read lives in `lib/content/`:

- `projects.ts` — add an object to `projects` and the archive card, case-study
  page, sitemap entry and "next project" chain follow automatically.
- `articles.ts` — same for articles. Note that the reference currently serves
  one article body for all six URLs; each entry here has its own `body` field
  ready for real copy (see the audit, defect 2).
- `site.ts` — name, URL, phone, e-mail.
- `images.ts` — maps the keys `hero` / `dark` / `light` to image files.

## Forms: what is and is not wired up

The reference posts its forms to a Laravel backend that is not part of this
repository. Here every form posts JSON to a route handler which validates it
again on the server, drops honeypot hits, rate-limits per client and then
forwards it to a webhook:

```bash
CONTACT_WEBHOOK_URL=https://…      # consultation requests and project briefs
NEWSLETTER_WEBHOOK_URL=https://…   # newsletter sign-ups
```

**Until those are set, nothing is delivered** — and the site says so: the
forms show "your request was not sent" with the studio's phone and e-mail
instead of a success message. To deliver by e-mail or to a CRM/database
instead, replace the body of `deliver()` in `lib/forms/delivery.ts`; it is the
single integration point.

## Deployment notes

- Set `NEXT_PUBLIC_SITE_URL` if the site is served from another origin
  (canonical URLs, sitemap and structured data use it).
- Any Node host or Vercel works. A fully static export is not possible while
  the two form endpoints are served by this app.
- The in-memory rate limiter is per server instance; put platform-level
  limiting in front of `/api/*` on serverless hosting.
- Confirm you are entitled to use the reference's logo, photographs and
  stylesheet before publishing (see the asset manifest).
