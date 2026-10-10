# Design system

Tokens and measurements below were read from the reference with
`getComputedStyle` / `getBoundingClientRect` (see `scripts/collect-layout.mjs`)
at the four audit viewports. They describe the design; they are not a second
implementation of it.

## How styling is organised

| Layer | File | Purpose |
| --- | --- | --- |
| theme | `app/globals.css` (`@theme`) | Tailwind tokens named after the values below (`text-redora-ink`, `bg-redora-ivory`, …). |
| components | `app/styles/reference.css` | The reference stylesheet, ported mechanically. Never edited by hand. |
| components | `app/styles/enhancements.css` | The few rules this implementation adds (listed under *Additions*). |
| utilities | Tailwind utilities | Used for everything that has no counterpart on the reference: 404 / error / loading pages, the skip link. |

### Why the reference stylesheet is ported rather than rewritten

The stylesheet is ~60 stacked revisions; a value on screen is usually the
winner among several competing rules, often decided by specificity or
`!important`. Re-deriving ~2,000 rules as utility classes would mean
re-deciding every one of those contests by hand. Porting it in source order
keeps the cascade — and therefore the rendering — identical, which the layout
diff confirms (see *Verification*). Tailwind's preflight is not loaded,
because the reference was written against browser defaults.

`scripts/port-reference-css.mjs` applies exactly four rewrites:

1. `url('images/…')` → `url('/images/…')`.
2. `body.motion-ready` → `html.motion-ready` (the flag is set on `<html>` before
   first paint; same specificity).
3. `.motion-ready .detailPageV47 …` → `.motion-ready.detailPageV47 …`. On the
   reference both classes sit on `<body>`, so those rules never match; they are
   kept inert here too.
4. `body:not(.innerPage)…` → `div:where(.pageRoot):not(.innerPage)…`. The
   reference puts a page class on `<body>`; here it goes on a wrapper `<div>`
   so one root layout can serve every page. `:where()` keeps the specificity
   at (0,4,1) — it must stay below a later `main>section:not(…)` rule.

Because React components reuse the reference's class names and DOM structure,
component files contain almost no styling code.

## Colour

| Token | Value | Use |
| --- | --- | --- |
| ink | `#171614` (text `rgb(24,23,22)`) | Headings, dark buttons, dark bands |
| charcoal | `#252321` / `rgb(27,25,23)` | Nav bar (94% opacity), statistics bar |
| ivory | `#f7f2ea` | Page background |
| hero wash | `rgb(245,240,232)` | Homepage hero background |
| sand | `rgb(239,230,219)`, `rgb(242,233,222)`, `rgb(238,228,216)` | Alternating section bands |
| paper | `#ffffff` / `#f8f4ee` | Cards |
| muted | `rgb(125,120,111)`, `rgb(110,103,95)`, `#756d64` | Body copy |
| eyebrow | `rgb(141,134,124)` | Small-caps labels |
| red | `#ef342f` (`#e3312b` in shadows and focus rings) | Accent, emphasis, primary pills |
| line | `#ddd6cc`, `rgba(35,31,27,.13)` | Dividers and borders |
| contact band | `rgb(18,18,18)` | Homepage consultation section |

## Typography

Vazirmatn (variable, 300–900), fallback `system-ui, sans-serif`. Glyphs the
font lacks — notably the arrows — fall through to the system font; the
metric-adjusted fallback face that `next/font` normally adds is switched off
so they render at the same width as on the reference.

| Role | 1440 | 1280 | 768 | 390 |
| --- | --- | --- | --- | --- |
| Home h1 | 66.2 / 78.2, 700 | 58.9 / 69.5 | 48 / 56.6 | 38 / 44.8 |
| About h1 | 57.6 / 73.7 | — | `clamp(34px, 9vw, 48px)` | 32 |
| Section h2 | 38 / 51.3, 700 | 38 / 51.3 | 38 / 55.1 | 29.25 / 42.4 |
| Body | 16 / 32 | 16 / 32 | 14 / 28 | 14 / 27.3 |
| Hero lead | 16 / 32.8 | 16 / 32.8 | 16 / 32.8 | 14 / 28.7 |
| Eyebrow | 11, 750, letter-spaced | 11 | 10 | 10 |
| Button | 16, 750 | 16 | 14 | 12 |

Persian text keeps a generous line height (1.75–2.05). Latin labels are
upper-case with 1.5–3px tracking.

## Layout

- Content width: `min(1180px, 100% − gutters)`; full-bleed bands sit 18px
  (desktop), 10px (≤ 900px) from the viewport edge.
- Vertical rhythm: `--section-space: clamp(72px, 8vw, 118px)` between
  sections (115px at 1440), 72px ≤ 768px, 60px ≤ 600px.
- Navigation: fixed, 1180 × 82 at 14px from the top (740 × 72 tablet,
  370 × 72 phone); logo 94 × 58.
- Homepage hero: 930px tall at desktop; copy column 412px, media 714 × 620;
  statistics bar 920 × 118 overlapping the hero's bottom edge.
- Breakpoints used by the stylesheet: 1250, 1200, 1100, 1050, 1024 (nav
  collapses), 1000, 900 (main single-column switch), 768, 700, 650, 620, 600,
  560, 430, 375.

## Shape, depth, motion

- "Organic" asymmetric radii are the signature: bands `90px 24px 90px 24px` /
  `34px 100px 34px 100px`, cards `42px 14px 42px 14px`, footer
  `72px 24px 72px 24px`, case-study hero `38px 96px 38px 96px`; all shrink on
  phones (`50px 16px …`). Buttons and chips are full pills (`999px`), 50px
  tall (48px on phones). Form fields: 16px radius, 54px tall.
- Shadows are warm and soft: `0 26px 70px rgba(42,32,22,.12)` for panels,
  `0 14px 38px rgba(43,32,24,.075)` for cards, `0 12px 28px rgba(227,49,43,.18)`
  under red buttons.
- Motion: reveal `opacity 0→1`, `translateY(18px→0)`, 0.68s
  `cubic-bezier(.22,.7,.2,1)`, stagger 0/55/110/165ms (10px and 0.48s ≤ 900px);
  hover lift 3–8px on buttons and cards; image zoom 1.04–1.06 on card hover;
  slider progress bar 6.5s linear; header hide 0.34s. All motion is disabled
  under `prefers-reduced-motion: reduce`.
- Focus: `3px solid rgba(239,57,51,.42)`, 4px offset, on `:focus-visible`.

## Additions (`app/styles/enhancements.css`)

| Rule | Why |
| --- | --- |
| `.pageRoot { display: flow-root }` | Makes the wrapper a formatting context like the reference's `<body>`, so the first section's margin does not collapse through it. |
| `:where(img) { height: auto }` | `next/image` adds width/height attributes; this restores the default the reference markup relies on, at zero specificity. |
| `.projectStart::after { pointer-events: none }` | Reference defect 7. |
| `[hidden]` rules for archive cards, `.journalEmpty` | Filtering hides cards instead of unmounting them; empty state for search. |
| `.formStatus` placement, `.successPanel.failure`, `.panelActions` | Submission feedback that the reference renders server-side. |
| `.srOnly` | Honeypot wrapper (clipped instead of parked at `left: -9999px`, which widens an RTL page). |

## Verification

`node scripts/compare.mjs` diffs the local build against the reference
captures. Final result over 9 URLs × 4 viewports (36 comparisons, 116–317
elements each):

- page dimensions identical within 1px on 35 of 36; the 36th is the contact
  page on phones, 60px shorter because of the wizard fix (defect 6);
- no element differs in position, size, font, colour, background or radius
  apart from the wizard's action row and the corrected contact details;
- 0.01 %–0.43 % of pixels differ on every page except contact, which the
  wizard fix puts at 0.27 %–0.41 % above phone width and 7.6 % on phones (the
  60px shift moves everything below it). What remains elsewhere is re-encoded
  photography and the corrected contact text in the footer.

These figures cover the captured states only: each page after scrolling
through it once, with the homepage slider on its first slide. Hover, focus,
open-menu and mid-animation states were checked by exercising them (see
`tests/e2e`), not by pixel comparison.
