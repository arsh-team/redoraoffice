# Reference audit — redoraoffice.ir

Audited on 2026-10-10 with Google Chrome driven by Playwright, plus direct
inspection of the served HTML, `assets/style.css` and the six script files.
Everything below is an observation of the live site unless it is marked
**Assumption** or **Decision**.

## 1. What the reference is

- Server-rendered Laravel site (PHP 8.3, LiteSpeed). No client framework.
- Persian, `lang="fa" dir="rtl"` on every page.
- One stylesheet (`/assets/style.css`, 167 KB, ~2,040 rules). It is about 60
  numbered revisions (`V3` … `V60`) appended to one file, each overriding the
  previous one; the rendered design is the result of the whole cascade.
- Scripts: `app.js` (home + shared), `inner.js` (projects), `blog.js`,
  `contact.js`, `motion.js`, `accessibility.js`.
- Font: Vazirmatn 300–900 from Google Fonts. Icons are Unicode glyphs
  (`◇ ⌘ ⬡ ◎ ← ↙ ⌖ …`), not an icon font or SVG set.
- Assets: one logo and **three photographs** in total, reused on every page.
- No favicon: `/favicon.ico` returns 404.
- `robots.txt`: allow all, disallow `/admin`, sitemap link.

### Capture limitation

From the audit network the host stalls CSS, JS and image requests made over
HTTP/2 or QUIC: the document arrives but the page stays unstyled and `load`
never fires. Forcing HTTP/1.1 (`--disable-http2 --disable-quic`) makes every
page load normally. All screenshots were taken that way; it does not affect
rendering.

## 2. Route inventory

`sitemap.xml` lists 18 URLs; all return 200. No other public routes were found
(`/admin` is disallowed and was not probed). Unknown URLs return 404 with an
empty body.

| Route | Type | `<title>` | Body class |
| --- | --- | --- | --- |
| `/` | Home | Redora Office \| طراحی آشپزخانه | — |
| `/about` | About | درباره ما \| REDORA Office | `aboutPage` |
| `/services` | Services | خدمات طراحی و اجرا \| REDORA Office | `servicesPage` |
| `/projects` | Portfolio archive | نمونه کارها \| REDORA Office | `innerPage` |
| `/projects/{slug}` ×6 | Case study | {project} \| REDORA Office | `innerPage detailPage detailPageV47` |
| `/blog` | Journal archive | مجله طراحی \| REDORA Office | `blogPage` |
| `/blog/{slug}` ×6 | Article | {article} \| REDORA Office | `articlePage` |
| `/contact` | Contact / project brief | تماس و درخواست مشاوره \| REDORA Office | `contactPage` |

Project slugs: `lavassan`, `farmanieh`, `niavaran`, `kordan`, `saadatabad`, `elahiyeh`.
Article slugs: `kitchen-decisions`, `island-stone`, `warm-dark-kitchen`,
`kitchen-2026`, `island-dimensions`, `natural-wood`.

There are **no service-detail pages, category pages, tag pages or pagination**
anywhere on the reference. Service tiles link to the on-page consultation form.

## 3. Shared components

- **Navigation bar** — fixed, dark rounded bar (1180 × 82 at desktop), logo
  right, six links centred, red "درخواست مشاوره ←" pill left. Active link is
  red-underlined. After 45px of scroll it gets the `scrolled` class.
  On inner pages it is wrapped in `header.siteHeader`, which gets
  `header-hidden` on a deliberate downward scroll (> 220px) and returns on any
  upward scroll. On the homepage the bar sits inside the hero instead.
- **Mobile menu** (≤ 1024px) — "☰" toggles a full-width dark panel sliding down
  from the top; "×" closes it; Escape and choosing a link close it.
- **Footer** — three columns (logo + tagline, quick links, contact) on a dark
  rounded panel with a "REDORA" watermark. The quick links and the third
  column differ per page type (see `lib/content/navigation.ts`).
- **Floating call to action** — red pill fixed bottom-left; a full-width bar on
  phones. Present on home, about, services, journal and contact (where it reads
  "شروع پروژه" and targets the form); absent on projects, case studies and articles.
- **"Start a project" band** — dark panel with a three-field form (name,
  phone, project type). Closes about, services, journal and article pages. The
  project-type options differ: three on about/services, two on journal/article.
- **Scroll motion** (`motion.js`) — sections and listed card types fade up
  18px over 0.68s with a 0–165ms stagger when 9% visible; headline numbers
  count up over 850ms; hero images get a ±few-px parallax above 900px width;
  everything is disabled under `prefers-reduced-motion`.

## 4. Pages

### Home
Hero (copy + three-slide image slider with thumbnails, arrows, progress bar and
"01 / 03" counter, auto-advancing every 6.5s; four statistics) → About intro
with four benefit cards → Services (four cards) → Featured projects (dark band,
filter chips همه/مدرن/کلاسیک/مینیمال, three cards) → Inspiration gallery (four
figures; horizontal scroll-snap carousel on phones) → Before/after comparison
slider → Five-step process → Testimonial → Latest articles (three cards) → FAQ
accordion (three items) → Consultation form → Footer. Gallery, service and
article images open in a lightbox.

### About
Hero with two overlapping images and an "8+" seal → dark Story band with pills,
quote and four numbers → four Design Values cards → Journey timeline (four
steps, "2018 — TODAY") → Manifesto (image + card) → Start-a-project band.
There are **no team or founder profiles, awards or credentials** on the reference.

### Services
Hero → intro panel → eight alternating light/dark service tiles → Material Lab
(three swatch buttons change the "suggested combination" label) → four
Deliverables → four-step Process → FAQ (`<details>`, first open) →
Start-a-project band.

### Projects
Hero (image, three-category rail, copy, three statistics, three thumbnails) →
Archive with filter chips همه/مدرن/مینیمال/کلاسیک معاصر and six two-column
editorial cards → dark statement band with a contact button. No pagination.

### Case study
Full-bleed hero with breadcrumbs → five facts → intro → four-image gallery →
four features + image → four material samples (CSS gradients) → before/after
cards with challenge and solution → back / next-project links → call to action.
Only title, category, summary, location, area and cover change between
projects; every other sentence is identical on all six pages, "year" is "—"
and "materials" is "سنگ طبیعی، چوب" everywhere. The gallery is always
cover / light / dark / cover. There is no lightbox on these pages.

### Journal
Hero with featured article card → category chips (همه/طراحی/متریال/ترند و
ایده/راهنما) and a live search box → five cards in an editorial grid →
newsletter band → Start-a-project band. No pagination.

### Article
Hero (back link, eyebrow, two-line heading, author · reading time · date,
image) → sticky contents sidebar (hidden on phones) + body (lead, headings,
pull note, figures, checklist, quote, tags) → three related cards →
Start-a-project band. No share controls.

### Contact
Hero → dark band with intro, contact details and a six-step project brief
(type → style → area/city/status → budget/timeline → description → contact
details) with a progress bar → three "what happens next" cards → FAQ.
No map, no business hours, no social links.

## 5. Defects found on the reference, and what this build does

The brief asks for fidelity, verified facts and working controls. Where the
reference contradicts itself or is broken, the least speculative fix was
chosen and is listed here. **Everything else is reproduced as observed.**

| # | Observation on the reference | Decision |
| --- | --- | --- |
| 1 | Homepage footer and the Organization JSON-LD on every page give `0912-691-1586`, `info@redoraoffice.ir`. Every inner page footer and the contact page show the placeholder `021 0000 0000`, `info@redoraoffice.com`. | The non-placeholder details are used everywhere. |
| 2 | All six article URLs serve the **same** hero and body (the "7 decisions" article); only `<title>` and the meta description differ. | Reproduced as is. No article text was invented. The model has one body per article so real copy can be added (`lib/content/articles.ts`). |
| 3 | The three "related articles" cards all link to `/blog/kitchen-trends`, which is a 404. | Each card links to the published article its title describes. |
| 4 | The three featured projects on the homepage all link to `/projects/lavassan`. | Each card links to the project it names. |
| 5 | Homepage service and article cards are not links (only their images open the lightbox). The three article titles there do not exist as articles. | Image zoom kept; the card headings link to `/services` and `/blog`. |
| 6 | Contact wizard: a later `.btn` rule overrides the script's show/hide, so "ادامه" **and** "ارسال درخواست" are visible on every step. | One primary action per step, as the script intends. This is the only visible layout difference (one button fewer; the action row is 60px shorter on phones). |
| 7 | Contact wizard on phones: the "PROJECT BRIEF" watermark pseudo-element overlaps the bottom of the form and intercepts taps. | Watermark unchanged, `pointer-events: none`. |
| 8 | Contact-page FAQ: the stylesheet styles an open state but no script opens it. | Wired up as an accordion. |
| 9 | Newsletter button is `type="button"` with no handler. | Validates the address and posts to `/api/newsletter`. |
| 10 | Homepage form shows "اطلاعات فرم معتبر است؛ در مرحله Laravel ارسال واقعی درخواست را متصل می‌کنیم." (a developer placeholder) instead of sending. | Posts to `/api/contact`; reports the real outcome. |
| 11 | Project and article JSON-LD is corrupted: the `@context` key is a leaked Blade/PHP fragment. | Valid `CreativeWork` / `Article` JSON-LD with the same fields. |
| 12 | The same meta description is used on all six main pages. | Each main page uses its own hero paragraph (verified copy) as description. |
| 13 | Statistics count-up rewrites "+120" as "120+" (prefix moved after the number). | Reproduced; it is what the reference shows after its animation. |
| 14 | "نمایش ویدیو" badge on the homepage is a static label; there is no video. | Reproduced as a non-interactive label. |
| 15 | Statistics disagree between pages (home "+120 projects / +8 years", projects "50+ / 10+"). | Reproduced as published; not reconciled. |

## 6. Not available / not reproduced

- The Laravel backend, admin area and whatever happens after a successful form
  post (redirect target, e-mail) are not observable. See
  `lib/forms/delivery.ts` for the integration point.
- No per-project photography, gallery, year or material data exists beyond the
  three shared photographs and the template text.
- No real article bodies exist for five of the six articles.

## 7. Evidence

- `screenshots/reference/` — full-page and above-the-fold captures of nine
  representative URLs (one per page type, plus a second case study) at
  1440×900, 1280×800, 768×1024 and 390×844, with a structural layout snapshot
  (`*.layout.json`) of each. About 100 MB, so the folder is git-ignored; it is
  on disk from the audit and `npm run audit:reference` recreates it.
- `screenshots/local/`, `screenshots/diff/` — the same captures of this build
  and the pixel-diff images from the last comparison.
- `scripts/capture.mjs`, `scripts/compare.mjs` — regenerate and diff them.

The remaining four case studies and five articles were not screenshotted
individually: they use the same templates as the captured ones and are covered
by the end-to-end tests (render, images, links, metadata).
