# 06 — Blog post (`/blog/[slug]`)

Route: `src/pages/blog/[...slug].astro` (exists from Astro starter; rewrite to match zine).
Layout: `src/layouts/BlogPost.astro` (exists; rewrite).
Source: not directly shown in the V2 prototype (the design scopes only the index). This spec extends the zine aesthetic to the article reading view, matching the typographic scale and surfaces established in spec 00.

## Composition

1. `<Nav active="blog" />`
2. Article header strip
3. Hero image (optional)
4. Article body
5. Article footer (tags, share, subscribe CTA)
6. Related / previous-next
7. `<Footer />`

## 1. Article header

Padding `64px 32px 32px`. Centered. Background `bg`.

- Back link row (above H1): mono 11 uppercase ls 2 opacity 0.7 `← all posts` → `/blog`.
- Eyebrow: `{TAG} · {READ}` (mono 11 uppercase ls 2 opacity 0.6). "Featured" pill (accent + 2px border, mono 11 uppercase, "★ FEATURED") prepended if `featured`.
- H1: post title, 56 / 700 / -2 / lh 0.98, max-width 780, clamp `(36px, 5.5vw, 56px)`. Italic emphasis via markdown `*word*` is not parsed — author wraps in HTML `<em>` in frontmatter if needed, or we keep titles plain.
- Date line (mono 13 opacity 0.7, margin-top 12): `{Month D, YYYY}` via `<FormattedDate>`. If `updatedDate` exists: append ` · updated {formatted}`.

## 2. Hero image

If `frontmatter.heroImage`:

- Container: `max-width: 880; margin: 40px auto 0; aspect-ratio: 16/9`. Wrapped in `rb-ph` frame with `3px ink` border and `8px 8px 0 ink` shadow.
- Render via `<Image>` from `astro:assets`.

Omit entirely if absent. Do not show a placeholder on the live article view (placeholders are for the blog index grid only).

## 3. Body

Padding `48px 32px`. Single column: `max-width: 680; margin: 0 auto; text-align: left`.

Typography (same as project detail body, spec 04 § 4):

- Paragraphs: 17 / lh 1.7 / margin `0 0 18px`.
- H2: 28 / 700 / -0.8 / margin `40px 0 12px`.
- H3: 20 / 700 / -0.4 / margin `28px 0 8px`.
- UL/OL: 17 / lh 1.7 / padding-left 24.
- `<em>` italic 500; `<strong>` 700.
- Inline code: mono 14, `bg` fill, `2px ink` border, `1px 5px` padding.
- Code blocks (Shiki): `paper` bg, `3px ink` border, `6px 6px 0 ink` shadow, padding 16, mono 13 / lh 1.6. Set `astro.config.mjs` `markdown.shikiConfig.theme` to `github-light` (or author a custom theme mapping ink/bg later).
- Blockquote: `border-left: 6px accent; padding: 4px 0 4px 18px; font-style: italic; opacity: 0.9; margin: 24px 0`.
- `<hr>`: 0 height, `border-top: 2px dashed ink`, opacity 0.5, margin `32px 0`.
- Images inside MDX: auto-wrapped by a `{...props}` mapping via `components` prop to BlogPost layout, applying the `rb-ph` frame with 3px border + 6px shadow and a mono caption if `alt` is set.
- Tables: `border-collapse: collapse; border: 3px ink; width: 100%`. Cells: `2px ink` border, padding 10 14. Header row: `accent` bg. Zebra: even rows `paper`.

## 4. Article footer

Padding `32px 32px`. Background `paper`. Border-top `3px ink`.

Three-column layout on desktop, stacks on mobile:

- **Tags**: `<Tag>` for the post tag (reuse). Clickable → `/blog/?filter={tag}`.
- **Share**: three `<Button>` (size sm, ghost): X/Twitter, LinkedIn, "Copy link" (data-clipboard via a tiny inline `<script>`).
- **Byline**: mono 11 uppercase ls 2 opacity 0.7 `Written by` + Space Grotesk 700 / 14 `Carlos`. Small peach dot ✦ after the name.

## 5. Related / prev-next

Padding `28px 32px`. Background `paper`. Two-column grid.

- Left: `← Previous` + previous post title (Space Grotesk 700 / 18).
- Right: `Next →` + next post title, right-aligned.

Sort by `pubDate desc`; compute neighbors from the collection. Wrap ends (first post's "previous" is the last post, and vice versa — or hide entirely; default: hide at ends).

## 6. Subscribe strip (reuse)

Reuse the subscribe block from `/blog` (spec 05 § 4). Keeps a consistent conversion moment at the end of every post.

## BlogPost.astro layout

Rewrite `src/layouts/BlogPost.astro`:

```astro
---
import Layout from './Layout.astro';
import FormattedDate from '../components/FormattedDate.astro';
import Tag from '../components/Tag.astro';
import { Image } from 'astro:assets';
import type { CollectionEntry } from 'astro:content';

type Props = CollectionEntry<'blog'>['data'] & {
  slug: string;
  prev?: { slug: string; data: { title: string } };
  next?: { slug: string; data: { title: string } };
};

const { title, description, pubDate, updatedDate, heroImage, tag, readTime, featured, prev, next } = Astro.props;
---
<Layout title={`${title} — Carlos`} description={description} active="blog">
  <!-- header, hero, <slot />, footer strips -->
</Layout>
```

Page file `src/pages/blog/[...slug].astro` loads the collection, finds the entry, renders `<BlogPost {...entry.data} slug={entry.id} prev={...} next={...}>` and passes `<Content />` into the default slot.

## Meta

- `<title>`: `{title} — Carlos`
- Description: `frontmatter.description`.
- OG image: `heroImage` if present; else a generated fallback.
- Canonical: `https://heyimcarlos.dev/blog/{slug}` once `astro.config.mjs` `site` is updated from `https://example.com`.
</content>
</invoke>
