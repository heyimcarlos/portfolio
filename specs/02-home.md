# 02 — Home (`/`)

Route: `src/pages/index.astro`.
Source: `V2Home` in `v2-zine.jsx` (final state — post "remove manifesto / add blog / single accent / recently-published feed" rounds in `chats/chat2.md`).

## Composition (top → bottom)

1. **`<Nav active="home" />`**
2. **Hero section**
3. **Recently published** (2×2 feed: mixed project + blog entries)
4. **Contact CTA** strip
5. **`<Footer />`**

Sections divided by `3px solid ink` bottom border. Each section is full-bleed horizontally (no inner max-width wrapper on the section itself — `bg` color runs to the viewport edge). Content inside each section is constrained by its own `max-width` on the content block (see below).

> The home page no longer renders a `<Manifesto />` strip. The component still exists in spec 01 for potential reuse but is not imported here.

## 1. Hero

Padding `72px 32px 56px`. Centered.

- Eyebrow row: three inline elements, gap 10, mono 11, uppercase, letter-spacing 2:
  `—— Issue №06 · Spring 2026 ——`
  Rules are 40px × 2px ink rectangles flanking the text.
- H1 (max-width 820, centered):
  > Carlos builds *weird little* web things**.**

  The italic run is weight 500. The trailing period is `accent`-colored.
  Size 88 / weight 700 / letter-spacing -3.5 / line-height 0.95 — responsive via `clamp(44px, 8vw, 88px)`.
- Body (max-width 560, size 17, lh 1.6):
  > A Dominican-Canadian full-stack dev, ex-competitive gamer, lifelong tinkerer. Currently leading engineering at [Centennial OER Lab].

  "Centennial OER Lab" has `accent` background, `0 4px` padding (inline highlight).
- CTA row: two `<Button>`s, gap 12, centered:
  - Primary (accent): "Read the projects →" → `/projects`
  - Default (paper): "Grab résumé" → `/resume.pdf` (place file in `public/`).

## 2. Recently published

Padding `56px 32px`. Background `bg`. Centered.

- Eyebrow: `LATEST DISPATCHES` (mono 11 uppercase ls 2 opacity 0.6, margin-bottom 6).
- H2:
  > Recently *published*.

  52 / 700 / -2 / lh 1 (clamp `(34px, 5.5vw, 52px)`). No trailing accent dot here.
- Subtitle (mono 11 / opacity 0.6, margin-bottom 32):
  `latest / 04  ·  new posts and project updates, ordered by date`
- Grid: `grid-template-columns: 1fr 1fr; gap: 20px; text-align: left; max-width: 900px; margin: 0 auto`.
- Items: up to 4, mixing `projects` and `blog` collections, sorted by most recent date desc (`pubDate` for blog, `updatedDate || pubDate` for projects — add `updatedDate` to projects schema).
- Render each with `<FeedCard item={...} />` (see spec 01).
- Below the grid: two `<Button>`s, gap 14, centered, margin-top 28:
  - Primary (accent): `All projects →` → `/projects`
  - Default (paper): `All posts →` → `/blog`

### Feed item source

Build a unified list at page scope:

```ts
const projectItems = (await getCollection('projects')).map(p => ({
  kind: 'project' as const,
  title: p.data.title,
  date: p.data.updatedDate ?? new Date(p.data.year, 0, 1),
  desc: p.data.description,
  meta: p.data.stack.slice(0, 3),
  href: `/projects/${p.id}`,
  cta: 'View project →',
}));
const blogItems = (await getCollection('blog')).map(b => ({
  kind: 'blog' as const,
  title: b.data.title,
  date: b.data.pubDate,
  desc: b.data.excerpt ?? b.data.description,
  meta: [b.data.tag, b.data.readTime].filter(Boolean),
  href: `/blog/${b.id}`,
  cta: 'Read post →',
}));
const items = [...projectItems, ...blogItems]
  .sort((a, b) => +b.date - +a.date)
  .slice(0, 4);
```

Initial seed (matches prototype, in case collections are empty at first build):

| Kind | Title | Date | Excerpt | Meta |
|------|-------|------|---------|------|
| project | OER Lab Platform | Mar 28, 2026 | Shipped v3 of the course-authoring flow. Bulk import from Canvas, live preview, fewer moving parts. | Next.js, TS, Postgres |
| blog | Type safety is a love language. | Mar 14, 2026 | On why I gave up on "just ship it" and learned to trust the compiler. A small confession from a former TS hater. | essay, 6 min |
| project | retro-ui-kit · v0.8 | Feb 21, 2026 | Open-source neobrutalist components — now with a polaroid card, a riso-tag, and proper TS types. 340★. | React, OSS |
| blog | Boring tech, weird products. | Feb 02, 2026 | How Postgres + Next.js + a little discipline lets a team of three move faster than a team of twenty. | notes, 4 min |

## 3. Contact CTA

Padding `64px 32px`. Background `accent`. Centered.

- Eyebrow: `LAST PAGE · GET IN TOUCH` (mono 11 uppercase ls 2 opacity 0.7).
- H2 (64 / 700 / -2.4 / lh 0.95):
  > Let's make *something weird.*
- Body (16, max-width 520, opacity 0.9):
  > Full-time, contract, or just a fun idea — my inbox is open. I read everything.
- Grid: `repeat(3, 1fr); gap: 12; max-width: 720`; three `<Button variant="default">` (paper fill) centered:
  - `carlos@heyimcarlos.dev ↗` → `mailto:`
  - `github.com/heyimcarlos ↗` → `https://github.com/heyimcarlos`
  - `/in/heyimcarlos ↗` → LinkedIn.

## Meta

- `<title>`: `Carlos — builds weird little web things`
- `<meta description>`: "Dominican-Canadian full-stack developer. Lead engineer at Centennial OER Lab. Building small, weird, useful things on the web."
- OG image: export a rendered hero snapshot into `public/og/home.png`. Placeholder until then.

## Responsive notes

- Feed grid: 2 → 1 columns at 640.
- Contact CTA buttons: 3 → 1 columns at 640.
- All sections run full-bleed horizontally; only the inner content block has a `max-width`.
