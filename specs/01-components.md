# 01 — Shared Components

All components live in `src/components/`. Astro components (`.astro`) unless interactivity is needed (none is, in the V2 design). Consume tokens from global CSS / Tailwind theme — no prop-drilled palette.

## `Layout.astro` (base layout)

New file at `src/layouts/Layout.astro`. Replaces implicit starter layouts for the zine pages.

Slots: `default`.

Props:
- `title: string`
- `description?: string`
- `active: 'home' | 'work' | 'blog' | 'about' | 'contact'` — passed through to `<Nav>`.

Renders:
- `<BaseHead>` (reuse existing).
- `<Nav active={active} />`
- `<main>` wrapping `<slot />` — full-bleed (no outer max-width, no left/right borders). Section strips fill the viewport; inner content blocks define their own `max-width` per section.
- `<Footer />`

No `zine-frame` wrapper. The earlier spec capped layout at 1000px; the production site occupies the full viewport width per spec 00.

## `Nav.astro`

Source: `V2Nav` in `v2-zine.jsx`.

Structure:
```
<nav>
  <brand>
    <monogram>C</monogram>
    <stack>
      <wordmark>heyimcarlos.dev</wordmark>
      <issue>issue №06 · spring 2026</issue>
    </stack>
  </brand>
  <menu>[home, work, blog, about, contact]</menu>
</nav>
```

Specs:
- Background `paper`, border-bottom `3px ink`, padding `16px 32px`, `display: flex`, `justify-content: space-between`.
- Monogram: 34×34 circle, `accent` fill, `2.5px ink` border, `border-radius: 50%`, centered "C", weight 700 / 16px.
- Wordmark: Space Grotesk 700 / 14px, letter-spacing -0.3.
- Issue line: JetBrains Mono / 9px / opacity 0.6 / `margin-top: -2px`.
- Menu items: 5 items (`home`, `work`, `blog`, `about`, `contact`), Space Grotesk 600 / 13px, padding `6px 14px`, gap 4px. Active item: `accent` background + `2px ink` border. Inactive: transparent border (to preserve alignment) + no background.
- Hrefs: `/`, `/projects`, `/blog`, `/about`, `/contact`. (The nav label is "work" but the route is `/projects` — user-facing label can stay "work"; decide during implementation. Default: label "work", route `/projects`.)
- Include the "available" pulsing dot (`rb-dot-live`) tucked next to the wordmark or menu — subtle. Design says "Subtle 'available' dot in nav on all variations". Place it immediately after the issue line: `<issue>... · <span class="rb-dot-live"></span> open</issue>`.

Mobile: below 640px, collapse menu into a 2-row layout (brand row + scrollable horizontal menu). No hamburger.

## `Footer.astro`

Source: `V2Footer`.

- Background `paper`, ink text, padding `14px 32px`, `display: flex`, `justify-content: space-between`, mono 10px / opacity 0.7.
- Three spans: left = `heyimcarlos.dev · issue №06`, middle = `printed on the internet · © carlos`, right = `turn page →`. "Turn page" links to the next page in the canonical order (optional; safe to make it a static label).

## `Button.astro` (wraps `.rb-btn`)

Props: `href?`, `variant?: 'default' | 'primary' | 'ghost'`, `size?: 'sm' | 'md'`, class pass-through.

- `default`: paper fill.
- `primary`: accent fill.
- `ghost`: transparent fill, border-only.
- `sm`: 12px / 6–14 padding (used in filter chips).

## `Tag.astro`

Renders `.rb-tag`. Prop: `variant?: 'bg' | 'paper'` (controls fill depending on surrounding surface).

## `ImagePlaceholder.astro`

Source: `rb-ph` + the geometric grid inside project cards.

Props:
- `label: string` (filename-style, e.g. `oer_lab.png`)
- `aspect?: string` (default `4/3`)
- `variant?: 'quad' | 'rows' | 'plain'` — controls inner composition:
  - `quad`: 2×2 grid (paper, ink, ink, paper) — used on project cards.
  - `rows`: 3 horizontal bands (paper, ink, paper) — used on blog featured hero.
  - `plain`: just the striped placeholder.
- Inner grid uses `2px ink` borders between cells; outer inset 16–24px.

Once real images exist, replace by a regular `<Image>` from `astro:assets` keeping the same frame/shadow wrapper.

## `SectionHeader.astro`

The eyebrow + headline pattern that opens every section.

Props:
- `eyebrow: string` (e.g. `"Chapter 01 · origins"`, `"Featured in this issue"`)
- `title: string` — support italic emphasis via markdown-ish `*word*` tokens or a slot. Recommend a slot:

```astro
<SectionHeader eyebrow="Featured in this issue">
  The work, <em>curated</em>.
</SectionHeader>
```

- Renders eyebrow (mono, uppercase, 11px, letter-spacing 2, opacity 0.6–0.7) above a centered H2/H1 with the `accent`-colored trailing period injected via CSS `::after` when a `trailing` prop is set.
- Optional `subtitle` slot below headline.

## `Manifesto.astro` (deprecated on home)

Source: `V2Manifesto`. Dark strip of 4 phrases separated by accent diamonds (✦).

> **Status:** not used by any spec'd page. The home page dropped the manifesto strip in `chats/chat2.md` ("remove the section below the hero, the one that says SMALL TEAMS, BIG SHIPS"). Keep the component available for future reuse (e.g., an interstitial on a long page); do not import it in the initial build.

- Background `ink`, text `bg`, padding `24px 32px`, border-bottom `3px ink`.
- Row: `display: flex`, gap 40, centered, Space Grotesk 700 / 30px, letter-spacing -1.
- Phrases: `SMALL TEAMS · BIG SHIPS · BORING SYSTEMS · WEIRD PRODUCTS` (configurable via prop `phrases: string[]`).
- Separators: `✦` in `accent`.
- Below 768px: stack vertically or shrink font to 18px with wrap.

## `FeedCard.astro`

Source: `V2FeedCard` in `v2-zine.jsx`. Used by the home "Recently published" section to render a unified feed of projects and blog posts.

Props:
```ts
type FeedItem = {
  kind: 'project' | 'blog';
  title: string;
  date: Date | string;   // pre-formatted or Date — accept both
  desc: string;
  meta: string[];        // tags / stack / read-time chips
  href: string;
  cta: string;           // 'View project →' | 'Read post →'
};
```

Structure:
- `<article>` with `paper` bg, `3px ink` border, `6px 6px 0 ink` shadow, padding 20, `display: flex; flex-direction: column`.
- Top row (mono 10 uppercase ls 1.5, margin-bottom 12): left pill + right date.
  - Pill: `1.5px ink` border, `2px 8px` padding, weight 700.
    - `kind === 'blog'` → `bg` fill, label `✎ blog post`.
    - `kind === 'project'` → `accent` fill, label `◉ project`.
  - Date right-aligned, opacity 0.65.
- H3 title: 22 / 700 / -0.5 / lh 1.15 / margin `0 0 10px`.
- Excerpt p: 14 / lh 1.6 / opacity 0.9 / margin `0 0 16px` / `flex-grow: 1`.
- Footer row: `border-top: 1.5px dashed ink; padding-top: 12px; display: flex; justify-content: space-between; align-items: center`.
  - Left: `<Tag variant="bg">` per `meta` item (flex-wrap, gap 5, mono 10).
  - Right: Space Grotesk 700 / 12px — the `cta` string.
- Whole card wrapped in `<a href={item.href}>` for a single click target; remove default link decoration/color.

Differences vs `<BlogCard>`: pill shows kind (not tag); always shows a CTA string; used only on home. Differences vs `<ProjectCard>`: no cover image; compact text-only card.

## `Timeline.astro` + `TimelineCard.astro`

Source: `V2Timeline` + `V2TLCard` in `v2-zine.jsx`. Used on `/about` (Chapter 02). Renders a vertical central rail with alternating cards left/right.

### `Timeline.astro`

Props:
```ts
type TimelineEvent = {
  year: string;                      // "1995" or "2023 — now"
  place?: string;                    // e.g. "Toronto, CA"
  role: string;                      // headline for the card
  org?: string;                      // org / school (omit for life events like 'Born')
  desc: string;                      // 1–2 sentence card body
  type: 'work' | 'edu' | 'life';
  current?: boolean;                 // highlights the node + adds ' · now' to the pill
};
type Props = { events: TimelineEvent[] };
```

Structure:
- Outer wrapper: `position: relative; max-width: 880; margin: 0 auto`.
- Central rail: absolutely positioned, `left: 50%`, `top: 0; bottom: 0`, `width: 2px`, background `ink`, `transform: translateX(-50%)`.
- For each event, a row: `display: grid; grid-template-columns: 1fr 40px 1fr; align-items: start; margin-bottom: 20; min-height: 60`.
  - Left column (gridColumn 1): `padding-right: 28; text-align: right`. Card renders here when `index % 2 === 0`, else `visibility: hidden`.
  - Center column (gridColumn 2): node. Circle, `border-radius: 50%`, `2.5px ink` border, `padding-top: 14`. Size 16×16 by default; 22×22 when `current`. Fill: `paper` default, `accent` when `current`. When `current`, add a `0 0 0 4px {accent}55` outer ring (box-shadow).
  - Right column (gridColumn 3): mirrors left; card renders when `index % 2 === 1`.
- After the final event, an "end cap": `· to be continued ·` in mono 10 uppercase ls 2, `paper` bg, `2px ink` border, `4px 10px` padding, centered.

### `TimelineCard.astro`

Props: `event: TimelineEvent`, `align: 'left' | 'right'`.

- `display: inline-block; max-width: 380; text-align: left; background: paper; border: 2.5px ink; box-shadow: 5px 5px 0 ink; padding: 14px 16px; position: relative`.
- Connector line: absolutely positioned 28px stub to the rail — `top: 22`, `width: 28`, `height: 2`, `background: ink`; `right: -28` when `align === 'right'`, else `left: -28`.
- Top row (margin-bottom 8, space-between):
  - Type pill: mono 10 uppercase ls 1.5 weight 700, padding `2px 8px`, `1.5px ink` border. Fill: `accent` when `type === 'work'`, else `bg`. Label is the human type (`work` / `education` / `life`) with ` · now` appended when `current`.
  - Year: mono 11 weight 700 opacity 0.85.
- Role: 16 / 700 / -0.3 / lh 1.2.
- Org + place (when `org` present): 13 / 500 / opacity 0.85 / margin-top 2 — `{org} · {place}` with place at opacity 0.6.
- Place only (no org): mono 11 / opacity 0.6 / margin-top 2.
- Desc: 13 / lh 1.55 / margin `10px 0 0` / opacity 0.9.

### Responsive

At `< 768px`, collapse the alternating layout: move the rail to `left: 20px`, render all cards to the right of the rail, flip every connector stub to `left: -28`.

## `ProjectCard.astro`

Source: `V2ProjectCard`.

Props: `project: CollectionEntry<'projects'>`, `index: number`.

Structure:
- `<article>` with `paper` bg, `3px ink` border, `6px 6px 0 ink` shadow, padding 14.
- Top: `<ImagePlaceholder variant="quad" aspect="4/3" label={slug + '.png'}>` — or real image once available. Accent background behind the placeholder grid.
- Title row: H3 20px / 700 / -0.5 + right-aligned `№{index} / {year}` in mono 11px / opacity 0.6.
- Body: `<p>` 13px / line-height 1.55, `min-height: 40px` (keeps cards aligned).
- Stack tags: flex wrap, 5px gap, mono 10px, bg fill.

## `BlogCard.astro`

Source: rest-of-posts grid in `V2BlogPage`.

Props: `post: CollectionEntry<'blog'>`, `index: number`.

Structure:
- `paper` bg, `3px ink` border, `6px 6px 0 ink` shadow, padding 20, `display: flex; flex-direction: column`.
- Top row: left = `Tag` with accent fill and 1.5px border + uppercase mono 10/500 (e.g. `essay`); right = `№0{index+2}` mono 10px / opacity 0.7.
- H3 19px / 700 / -0.4 / lh 1.15 / `margin: 0 0 10px`.
- Excerpt p: 13px / lh 1.55 / opacity 0.85 / `flex-grow: 1` / `margin: 0 0 14px`.
- Footer row: `border-top: 1.5px dashed ink; padding-top: 10px; opacity 0.7`; left = date, right = `{readTime} →`. Mono 11px.

## `FeaturedBlogCard.astro`

Source: featured block in `V2BlogPage` (2-col article grid).

- `paper` bg, `3px ink` border, `8px 8px 0 ink` shadow (heavier than normal).
- Grid: `1fr 1.3fr`.
- Left: `<ImagePlaceholder variant="rows" aspect="auto">` with accent fill, `border-right: 3px ink`, `min-height: 240px`.
- Right: padded 28, flex-col centered. Includes a "★ Featured" pill (accent fill, 2px border, mono 11 uppercase) next to `{tag} · {date} · {readTime}` meta. H2 38px. Excerpt 15px / lh 1.6 / opacity 0.9. CTA is a primary `<Button>` aligned flex-start: "Read post →".

## `FilterChips.astro`

Source: filter rows on `/projects` and `/blog`.

Props: `items: string[]`, `active?: string`.

- Flex, gap 8, center, wrap.
- Each chip is an `<a>` with `.rb-btn` styling, 12px font, 6/14 padding. Active chip: `accent` fill. Others: `paper`.
- Non-JS: clicking navigates to `?filter=<value>` and the page re-renders filtered content server-side. (Astro's static build means client JS not needed; a full page reload is acceptable.)

## `ContactForm.astro`

Source: "Send a postcard" card in `V2ContactPage`.

- `paper` bg, `3px ink` border, `6px 6px 0 ink` shadow, padding 24.
- H3 "Send a postcard" 20/700 / `margin: 0 0 16px`.
- Fields: `name`, `email`, `message`. Each field: mono 11 uppercase label opacity 0.6 above a styled input/textarea with `bg` background, `2.5px ink` border, Caveat (or Space Grotesk italic @ 0.5 opacity) placeholder. Message textarea min-height 90px.
- Submit: primary button "Stamp & send →", full width centered.
- Posts to a provider of choice — recommend Formspree / a Netlify/Astro endpoint `src/pages/api/contact.ts`. Confirm with user before wiring.

## `ContactLinks.astro`

Source: right column of `V2ContactPage`.

- `display: flex; flex-direction: column; gap: 14`.
- Each link: `paper` bg, `3px ink` border, `5px 5px 0 ink` shadow, padding `16px 18px`, `justify-content: space-between`. Left: mono 11 uppercase opacity 0.7 label (`email`, `github`, `linkedin`, `twitter / x`). Right: Space Grotesk 700 / 15px value with trailing `↗`.
- Hover: same translate/shrink as `.rb-btn`.

## File layout summary

```
src/components/
  Nav.astro
  Footer.astro
  Button.astro
  Tag.astro
  ImagePlaceholder.astro
  SectionHeader.astro
  Manifesto.astro          (deprecated — keep but unused)
  ProjectCard.astro
  BlogCard.astro
  FeaturedBlogCard.astro
  FeedCard.astro           (home "Recently published")
  Timeline.astro           (about Chapter 02)
  TimelineCard.astro       (internal to Timeline)
  FilterChips.astro
  ContactForm.astro
  ContactLinks.astro

src/layouts/
  Layout.astro           — new zine base
  BlogPost.astro         — update to match zine styling (spec 06)
```

Delete / repurpose existing starter components (`Header.astro`, `HeaderLink.astro`) once `Nav.astro` is in place. Keep `BaseHead.astro`, `FormattedDate.astro`.
</content>
</invoke>
