# 03 — Projects index (`/projects`)

Route: `src/pages/projects/index.astro`.
Source: `V2ProjectsPage` in `v2-zine.jsx`.

Note: the nav label is "work" but the route is `/projects`. Decide whether to rename the nav label to "projects" for route/label parity; default spec: keep label "work", route `/projects`.

## Content source

New collection `src/content/projects/` with one MDX or Markdown file per project. Update `src/content.config.ts`:

```ts
import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    year: z.string(),              // "2024"
    description: z.string(),       // 1-sentence, card text
    stack: z.array(z.string()),
    cover: image().optional(),
    category: z.enum(['web', 'oss', 'side-quests']).default('web'),
    featured: z.boolean().default(false),
    url: z.string().url().optional(),
    repo: z.string().url().optional(),
    order: z.number().optional(),  // manual sort fallback
  }),
});
```

Seed with 6 entries (matches prototype):

1. **OER Lab Platform** · 2024 · web · Next.js, TS, Postgres
2. **Ntornos** · 2023 · web · Mapbox, React
3. **305 Dashboard** · 2022 · web · Next.js, Mongo
4. **Exactera Tax AI** · 2022 · web · React, Py
5. **Grappler CLI** · 2023 · oss · Rust
6. **retro-ui-kit** · 2024 · oss · React

## Composition

1. `<Nav active="work" />`
2. Hero section (below)
3. Filter chips row
4. Project grid
5. `<Footer />`

All sections separated by `3px ink` bottom border.

## Hero

Padding `64px 32px 32px`. Centered.

- Eyebrow: `THE BACK CATALOG` (mono 11 uppercase ls 2 opacity 0.7).
- H1:
  > Everything *I've* shipped**.**

  72 / 700 / -2.5 / lh 0.95. Responsive `clamp(40px, 6.5vw, 72px)`.
- Body: max-width 520, 15px, opacity 0.85, margin-bottom 24:
  > Six projects across agencies, startups, and late nights. Some broke prod, all taught me something.
- `<FilterChips>` (flex gap 8 wrap centered):
  items `['all', 'web', 'oss', 'side-quests', '2024', '2023']`. Active defaults to `all`.

## Filter behavior

- Static build: rendering is server-side per query-string (`?filter=oss`). Astro re-renders on full-page nav. For a pre-rendered static site, generate the `all` view at `/projects/` and each filter as `/projects/[filter]/` (Astro dynamic routes via `getStaticPaths`), or accept a single page + client-side hash filter. Default: pre-generate `getStaticPaths` pages, one per filter value.
- Year filters (`2024`, `2023`) filter by `year === filter`. Category filters (`web`, `oss`, `side-quests`) filter by `category === filter`. `all` returns everything.

## Grid

Padding `36px 32px`. `grid-template-columns: repeat(3, 1fr); gap: 20`.

Sort: `featured` first, then `year desc`, then `order asc`. Render `<ProjectCard project={p} index={i+1} />` for each.

Card → `/projects/{slug}` (whole card clickable). Use an `<a>` wrapping the `<article>` or make only the title an anchor; pick whole-card for a better target.

## Responsive

- Grid: 3 → 2 → 1 at 1024 / 640.
- Filter chips stay as wrapping row; on narrow screens let them wrap to 2 rows.

## Meta

- `<title>`: `Projects — Carlos`
- Description: "Six projects across agencies, startups, and late nights."
</content>
</invoke>
