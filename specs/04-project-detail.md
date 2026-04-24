# 04 — Project detail (`/projects/[slug]`)

Route: `src/pages/projects/[slug].astro`.
Source: the prototype has no dedicated project detail page — the design locked in "Cards only (title, stack, 1 image)" per `chats/chat1.md`. This spec extrapolates the zine aesthetic to a detail page while staying minimal.

## Scope

Keep it light: this is a reading page for a 1–3 paragraph case study plus metadata, not a full case-study template with metrics pages. The card IS the primary surface; the detail page is the "expand" view.

## Composition

1. `<Nav active="work" />`
2. Back link strip
3. Cover + header
4. Metadata strip
5. Body (MDX content)
6. Project navigation (prev / next)
7. `<Footer />`

All sections divided by `3px ink` bottom borders.

## 1. Back link strip

Padding `16px 32px`. Background `paper`.
- Left: mono 11 uppercase ls 2 opacity 0.7 link `← all projects` → `/projects`.
- Right: mono 11 opacity 0.7 `№{index} / {total}` (computed server-side from sorted collection).

## 2. Cover + header

Padding `48px 32px 32px`. Centered, `bg` surface.

- Eyebrow (mono 11 uppercase ls 2 opacity 0.6): `{category} · {year}`.
- H1: project title, 68 / 700 / -2.4 / lh 0.95, max-width 820.
- Subtitle: the `description` field from frontmatter, 17 / lh 1.6, max-width 620, opacity 0.9.
- Stack row (centered, gap 5, wrap): `<Tag>` per stack item.
- CTA row (optional, centered, gap 12): `<Button variant="primary">Visit ↗</Button>` if `url`, `<Button>Source ↗</Button>` if `repo`.

Cover image below the CTA row:
- `<div class="rb-ph">` wrapper, `max-width: 880; margin: 32px auto 0; aspect-ratio: 16/9; border: 3px ink; box-shadow: 8px 8px 0 ink`.
- Render `frontmatter.cover` via `<Image>` from `astro:assets` if present; else `<ImagePlaceholder variant="quad" label="{slug}.png" />`.

## 3. Metadata strip

Padding `28px 32px`. Background `paper`.

Four equal cells (like about meta strip): `grid-template-columns: repeat(4, 1fr); gap: 10; max-width: 720; margin: 0 auto`. Each cell: `2px ink` border, `10px 12px`, mono 11.

- `role` — value from frontmatter (add optional `role: string` to schema).
- `year` — `frontmatter.year`.
- `stack` — count, e.g. `5 techs`.
- `status` — `shipped` | `archived` | `active` (add to schema, default `shipped`).

## 4. Body

Padding `48px 32px`. Centered column: `max-width: 680px; margin: 0 auto; text-align: left`.

Render MDX `<Content />`. Typography:

- Paragraphs: 16 / lh 1.7 / `margin: 0 0 18px`.
- H2: 28 / 700 / -0.8 / `margin: 32px 0 12px`. Trailing accent dot on first H2 only (optional).
- H3: 20 / 700 / -0.4 / `margin: 24px 0 8px`.
- Lists: disc, 16 / lh 1.7.
- Inline code: mono 13, `bg` fill, `2px ink` border, 1px 5px padding.
- Code blocks: `paper` bg, `3px ink` border, `6px 6px 0 ink` shadow, padding 16, mono 13 / lh 1.55. Use Astro's built-in Shiki; override theme to use ink/paper tokens or accept default `github-light`.
- Blockquotes: left border `6px accent`, padding-left 16, italic, opacity 0.9.
- Images inside MDX: wrapped in the `rb-ph` frame with 3px border + 6px shadow.

## 5. Project navigation

Padding `28px 32px`. Background `paper`. Two-column grid.

- Left cell: `← Previous` label (mono 11 uppercase opacity 0.6) + previous project title (Space Grotesk 700 / 18).
- Right cell: `Next →` label + next project title, right-aligned.

Computed from the sorted projects collection; wraps at ends. Omit if collection has one entry.

## 6. MDX body conventions

A project MDX file looks like:

```mdx
---
title: OER Lab Platform
year: "2024"
description: Open-ed platform for 12k+ students...
stack: [Next.js, TypeScript, Postgres]
category: web
featured: true
role: Lead engineer
status: active
url: https://oer.centennialcollege.ca
cover: ./cover.png
---

## The problem

Centennial College publishes open educational resources...

## What we built

- Type-safe API with tRPC
- Postgres + row-level security
- ...
```

## getStaticPaths

```ts
export async function getStaticPaths() {
  const projects = await getCollection('projects');
  return projects.map((project) => ({
    params: { slug: project.id },
    props: { project, all: projects },
  }));
}
```

## Meta

- `<title>`: `{title} — Carlos`
- Description: `frontmatter.description`.
- OG image: use cover if present.
</content>
</invoke>
