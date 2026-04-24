# Specs Index

Portfolio redesign: "Pastel Zine" — neobrutalist, single peach accent, symmetric, editorial/magazine feel. Source design: V2 from the Claude Design handoff (`portfolio/project/variations/v2-zine.jsx` + `portfolio/project/styles/retro-base.css`).

**Layout:** full-bleed. Section strips run edge-to-edge; only the inner content block in each section has a `max-width`. No outer 1000px cap.

**Home composition (latest):** Hero → Recently published (2×2 mixed feed) → Contact CTA → Footer. *No* manifesto strip.

**About composition (latest):** Chapter 01 Origins → Chapter 02 Timeline → Chapter 03 Stack → Meta strip.

Implementation target: Astro 6 (static), Tailwind v4, MDX content collections for blog (and new projects collection).

## Index

- [00 — Design System](./00-design-system.md) — tokens, typography, palette, CSS primitives.
- [01 — Shared Components](./01-components.md) — Nav, Footer, Button, Tag, ImagePlaceholder, ProjectCard, BlogCard, SectionHeader, Manifesto.
- [02 — Home page](./02-home.md) — `/`
- [03 — Projects index](./03-projects.md) — `/projects`
- [04 — Project detail](./04-project-detail.md) — `/projects/[slug]`
- [05 — Blog index](./05-blog.md) — `/blog`
- [06 — Blog post](./06-blog-post.md) — `/blog/[slug]`
- [07 — About](./07-about.md) — `/about`
- [08 — Contact](./08-contact.md) — `/contact`

## Conventions

- Specs describe intent. Check the codebase before concluding something is or isn't built.
- Pages route straight from `src/pages/`. One `.astro` file per spec unless noted.
- Blog uses the existing content collection (`src/content/blog`). Projects will use a new `src/content/projects` collection (see spec 04).
- All new components live in `src/components/`, colocated with existing ones.
- Styling: Tailwind v4 utilities first; use `src/styles/global.css` for the zine primitives (`rb-*` classes from `retro-base.css`) and the design tokens. No runtime CSS-in-JS (no inline `style={{}}` on every element — inline styles in the prototype are a prototype artifact, not the target).
</content>
</invoke>