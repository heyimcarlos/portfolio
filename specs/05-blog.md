# 05 — Blog index (`/blog`)

Route: `src/pages/blog/index.astro` (replace the starter list view).
Source: `V2BlogPage` in `v2-zine.jsx`.

## Content source

Existing `src/content/blog` collection. Schema updates needed in `src/content.config.ts`:

```ts
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: image().optional(),
    tag: z.enum(['essay', 'notes', 'case-study', 'life']).default('notes'),
    readTime: z.string().optional(),    // e.g. "6 min"; compute at build if absent
    featured: z.boolean().default(false),
    excerpt: z.string().optional(),     // falls back to description
  }),
});
```

Auto-computed `readTime`: count words in body, divide by 220, round up, fall back to frontmatter override. Keep it simple — a small util at `src/lib/readTime.ts`.

Seed posts (match prototype content for design verification; real posts replace later):

| Title | Date | Read | Tag | Featured |
| ----- | ---- | ---- | --- | -------- |
| Type safety is a love language. | Mar 14, 2026 | 6 min | essay | yes |
| Boring tech, weird products. | Feb 02, 2026 | 4 min | notes | no |
| From internet café to compiler. | Jan 10, 2026 | 8 min | life | no |
| Rewriting a 12k-student platform, quietly. | Dec 18, 2025 | 10 min | case-study | no |
| The case for small internal tools. | Nov 04, 2025 | 5 min | essay | no |
| BJJ taught me to debug. | Oct 21, 2025 | 3 min | notes | no |

## Composition

1. `<Nav active="blog" />`
2. Hero section
3. Featured post block
4. Grid of remaining posts
5. Subscribe strip
6. `<Footer />`

## 1. Hero

Padding `64px 32px 32px`. Centered.

- Eyebrow: `COLUMN · THE MARGINALIA` (mono 11 uppercase ls 2 opacity 0.7).
- H1:
  > Things I *wrote* down**.**

  72 / 700 / -2.5 / lh 0.95 (clamp down on mobile).
- Body: max-width 520, 15, opacity 0.85:
  > Short essays, build notes, and the occasional rant. Updated whenever I survive a deploy worth writing about.
- `<FilterChips items={['all', 'essay', 'notes', 'case-study', 'life']} />` — behavior same as projects (pre-generate per-filter pages via `getStaticPaths` or use hash/query filter).

## 2. Featured post

Padding `40px 32px`.

Use `<FeaturedBlogCard post={featured} />`. "Featured" = first post with `featured: true`, or the most-recent post if none flagged.

Hero image: `post.heroImage` if present (rendered inside the `rb-ph` wrapper with accent background); else `<ImagePlaceholder variant="rows" label="cover_{tag}.png" />`.

CTA: primary `<Button>` → `/blog/{slug}` with text `Read post →`.

## 3. Posts grid

Padding `8px 32px 40px`.

- Divider (centered): mono 11 uppercase ls 2 opacity 0.6, margin `24 0 20`: `· also in this issue ·`.
- Grid: `repeat(3, 1fr); gap: 20`.
- Render `<BlogCard post={p} index={i} />` for each non-featured post, sorted by `pubDate desc`.
- Card clickable → `/blog/{slug}`.

## 4. Subscribe strip

Padding `40px 32px`. Background `accent`. Centered.

- Eyebrow: `SUBSCRIBE` (mono 11 uppercase ls 2 opacity 0.7).
- H3: `New post, *roughly once a month.*` (32 / 700 / -1 / lh 1).
- Form (centered, max-width 480, border 3px ink, background paper, zero-gap flex):
  - Input: flex 1, padding `12px 14px`, Caveat 16 opacity 0.5 placeholder "you@somewhere.com". Background transparent.
  - Submit: ink bg, paper text, padding `12px 22px`, Space Grotesk 700 / 14 / ls 0.3, text `Subscribe →`.
- Wire to a provider (Buttondown / ConvertKit / EmailOctopus). Confirm with user before choosing. Non-functional fallback: submit to `/api/subscribe` that returns 501 and a message — good enough for first ship.

## Pagination

Add only once posts exceed ~9. Omitted for first ship.

## Meta

- `<title>`: `Blog — Carlos`
- Description: "Short essays, build notes, and the occasional rant."
- RSS: keep/update `src/pages/rss.xml.js` to pull from the collection with the new schema. Include tag, pubDate, readTime in items.
</content>
</invoke>
