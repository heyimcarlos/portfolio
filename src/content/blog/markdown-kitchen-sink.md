---
title: 'The markdown kitchen sink'
description: 'Every element the zine stylesheet touches — headings, code, quotes, tables, images — on one page so the layout earns its keep.'
excerpt: 'Every element the zine stylesheet touches — headings, code, quotes, tables, images — on one page.'
pubDate: 'Apr 20 2026'
heroImage: '../../assets/blog-placeholder-1.jpg'
tag: notes
readTime: '6 min'
featured: true
---

This post exists to *visualize* every markdown element the blog layout styles. If a rule in `BlogPost.astro` renders wrong, it will be **obvious** here. Treat it like a contact sheet for typography.

## Headings set the rhythm

The H2 above is 28/700 with tight tracking. The H3 below should read as a clear step down — same family, lighter weight presence, smaller margin block.

### A third-level heading

Paragraphs sit at 17px with a 1.7 line-height. That gives prose enough air to breathe without turning the column into a ladder. The measure caps at 680px so the eye never has to travel more than ~75 characters per line.

## Inline things

Inline code like `const answer = 42` is wrapped in a 2px ink border on the page background — it should pop without shouting. We also care about *italic emphasis*, **bold weight**, and ***both at once***. Links like [heyimcarlos.dev](https://heyimcarlos.dev) inherit the accent underline treatment from the zine stylesheet.

## Code blocks

Shiki renders fenced blocks with the `github-light` theme inside a paper surface with a hard ink shadow.

```ts
type Post = {
  title: string;
  pubDate: Date;
  tag: 'essay' | 'notes' | 'case-study' | 'life';
  featured?: boolean;
};

export function neighbors(posts: Post[], index: number) {
  return {
    prev: posts[index + 1],
    next: posts[index - 1],
  };
}
```

```bash
bun install
bun dev
```

## Lists

Unordered:

- Pick boring tools.
- Ship weird products.
- Write the post *after* it works.

Ordered:

1. Draft in markdown.
2. Preview in the layout.
3. Fix the thing that looks wrong.
4. Repeat until the page stops nagging you.

## Blockquote

> The best way to predict the future is to invent it — and then write a blog post about the parts that didn't work.

## Tables

| Element     | Font       | Size | Notes                        |
| ----------- | ---------- | ---- | ---------------------------- |
| Paragraph   | sans       | 17   | lh 1.7, max-width 680        |
| H2          | sans 700   | 28   | letter-spacing −0.8          |
| H3          | sans 700   | 20   | letter-spacing −0.4          |
| Inline code | mono       | 14   | 2px ink border, bg fill      |
| Code block  | mono       | 13   | paper bg, 6px ink shadow     |

## Images

Images get the `rb-ph` frame: 3px ink border with a 6px hard shadow.

![A placeholder hero, framed like every other image on the site.](../../assets/blog-placeholder-3.jpg)

---

## Horizontal rules

The dashed `<hr>` above separates sections without the visual weight of another heading. Use it sparingly — most posts don't need one.

## Closing

If any element on this page looks off — a margin too tight, a border missing, a code block without its shadow — that is the *only* bug worth fixing before shipping the next real post. The template is the product.
