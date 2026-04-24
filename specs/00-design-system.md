# 00 — Design System

Source: `portfolio/project/styles/retro-base.css` + `V2_PALETTE` in `portfolio/project/variations/v2-zine.jsx`.

## Palette (single accent)

| Token    | Value      | Usage                                          |
| -------- | ---------- | ---------------------------------------------- |
| `bg`     | `#F6F1E6`  | Page background (warm off-white).              |
| `ink`    | `#2a2420`  | Text, borders, shadows (soft black).           |
| `paper`  | `#fefaf0`  | Cards, nav/footer, form fields.                |
| `accent` | `#F4A896`  | Peach. Only accent. Hover fills, highlights, stickers, dot terminator on headlines. |
| `live`   | `#22C55E`  | "Available" pulse dot only.                    |

Rule: no other hues. Every previous lavender/mint/butter from v1 collapses to one of the above.

## Typography

Fonts loaded via `@fontsource` (already in `package.json`):

- `Space Grotesk` 400/500/600/700 — UI, display headings. Italic (via synthetic or actual italic variant) for the emphasized run inside headlines.
- `JetBrains Mono` 400/500/700 — monospace labels, meta, uppercase eyebrow text.
- `Caveat` (Google Fonts) — form placeholders only. If avoiding Google Fonts, swap for `Space Grotesk` italic 400 at 0.6 opacity.
- `VT323` — declared in base CSS but unused in the final V2 page; do not load unless a future spec adds it.

Heading scale (matches prototype at 1000px artboard width — these are desktop; scale down on mobile):

| Role                | Size | Weight | Letter-spacing | Line-height |
| ------------------- | ---- | ------ | -------------- | ----------- |
| H1 hero (home)      | 88px | 700    | -3.5px         | 0.95        |
| H1 page (projects, blog) | 72px | 700 | -2.5px       | 0.95        |
| H1 contact          | 96px | 700    | -3.5px         | 0.92        |
| H2 section          | 52px | 700    | -2px           | 1           |
| H2 contact headline | 64px | 700    | -2.4px         | 0.95        |
| H2 featured-post    | 38px | 700    | -1.2px         | 1.05        |
| H3 card             | 19–20px | 700 | -0.4–0.5px    | 1.15–1.4    |
| Body                | 15–17px | 400 | 0              | 1.55–1.7    |
| Meta / mono         | 10–13px | 400–700 | 1.5–2px (uppercase) | — |

Italic runs inside headings carry weight 500 (not 700) — copy the pattern `Carlos builds <em>weird little</em> web things.`

Every page-hero headline ends with a period colored `accent` (the "zine dot").

## Primitives (ported from retro-base.css)

Borders: `3px solid ink`. Thin variant `2px`/`2.5px`. No border-radius (except the monogram circle in nav).

Shadows (hard, offset, no blur):

- `shadow-sm`: `4px 4px 0 ink`
- `shadow`: `6px 6px 0 ink`
- `shadow-lg`: `10px 10px 0 ink`

Buttons (`.rb-btn`): inline-flex, 3px border, 4px hard shadow, 9px/16px padding, weight 600, size 13px. Hover: translate `(2px,2px)` + shadow shrinks to `2px 2px`. Active: translate `(4px,4px)` + shadow `0`. No radius. Default fill is `paper`; primary fill is `accent`.

Tags (`.rb-tag`): 2px border, 2/8 padding, mono 10–11px, 500. Background varies by context (`bg` on accent cards, `paper` elsewhere).

Image placeholder (`.rb-ph`): 3px border, diagonal stripe overlay at 45deg (rgba black 0.08, 1px stripe every 10px). Label (`.rb-ph-label`): mono 10px, ink background, paper text, 2/6 padding, bottom-left 8px inset.

Patterns available (rarely used in V2, keep for option): dots, diag, grid, checker — all currentColor-based.

Live dot (`.rb-dot-live`): 8px circle, `#22C55E`, 2s pulse animation via box-shadow ripple.

## Layout

- **Full-bleed zine frame.** The prototype renders inside a 1000px artboard for the design canvas, but the production site occupies the **full viewport width**. The zine frame has no horizontal max-width cap; left/right borders are dropped and section backgrounds run edge to edge. Only the *content inside* each section is constrained by its own `max-width` (typical: 560 / 720 / 820 / 880 / 900 px depending on block) for readability.
- All page sections have a `3px solid ink` bottom border, forming horizontal rules between strips across the full viewport.
- Section padding: `56–72px vertical · 32px horizontal` at desktop. Contact/about hero: 72/56. Horizontal padding scales down to 20px at `< 640px`.
- Grids: 3 columns (project index cards), 2 columns (home feed, contact split, featured blog), 4 columns (about stack / meta strip). Gaps: 20 (cards), 14 (tighter grids), 24 (contact split).
- All content blocks are `text-align: center` unless inside a card body (left-aligned).

## Responsive

Prototype is desktop-only. Target breakpoints for Astro build:

- `< 640px`: single column. Hero H1 clamps to ~44px. Section padding 32/20.
- `640–1023px`: two columns for card grids. Hero H1 ~64px.
- `≥ 1024px`: full-width sections; inner content blocks keep their per-block max-widths as noted above. No 1000px outer cap.

Use CSS `clamp()` for H1/H2 sizes; don't hard-code desktop values.

## Global CSS

Port `retro-base.css` classes into `src/styles/global.css` (already imported app-wide). Replace inline `style={{ ... color: palette.xxx }}` patterns with CSS custom properties:

```css
:root {
  --zine-bg: #F6F1E6;
  --zine-ink: #2a2420;
  --zine-paper: #fefaf0;
  --zine-accent: #F4A896;
  --zine-live: #22C55E;
}
```

Expose the same via Tailwind v4 `@theme` so utilities like `bg-zine-accent`, `border-zine-ink` work. Prefer utilities; keep `rb-btn`, `rb-tag`, `rb-ph`, `rb-dot-live` as component classes because they package multi-property primitives with pseudo-elements and animations.

## Deliverables for this spec

- `src/styles/global.css`: tokens + ported `rb-*` primitives.
- `astro.config.mjs` / Tailwind `@theme`: expose zine tokens.
- Remove unused Atkinson font config (optional; it's from the Astro blog starter) or keep as fallback — decide once. Add `@fontsource/jetbrains-mono` and `space-grotesk` imports in the base layout (already in `package.json`).
</content>
</invoke>
