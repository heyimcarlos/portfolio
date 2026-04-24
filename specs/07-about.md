# 07 — About (`/about`)

Route: `src/pages/about.astro` (exists from starter; rewrite).
Source: `V2AboutPage` in `v2-zine.jsx` (final state with timeline inserted between origins and stack).

## Composition

1. `<Nav active="about" />`
2. **Chapter 01 — Origins** (hero + prose)
3. **Chapter 02 — The timeline** (`<Timeline />`)
4. **Chapter 03 — The stack** (4-up grid)
5. Meta strip (4 cells)
6. `<Footer />`

All sections full-bleed horizontally with `3px ink` bottom borders between strips.

## 1. Origins

Padding `64px 32px 48px`. Centered.

- Eyebrow: `CHAPTER 01 · ORIGINS` (mono 11 uppercase ls 2 opacity 0.6 margin-bottom 8).
- H1, max-width 820:
  > I came for the gaming, *stayed* for the compiler**.**

  68 / 700 / -2.4 / lh 0.95. Clamp `(38px, 6vw, 68px)`.
- Prose block (max-width 720, 16, lh 1.7, left-aligned even though the column is centered):

  > Santo Domingo, DR. I spent my teens in internet cafés trying to go pro at Counter-Strike. I was decent. Not pro. Sponsorship money dried up, I got older, and at a family wedding a cousin told me, "you should learn to code."

  > One bootcamp, three jobs, and a move to Toronto later, I lead engineering at the [Centennial OER Lab] — building open tools for students who can't afford textbooks.

  > Outside the screen: BJJ (blue belt, forever), surfing, building silly things. This site is one of them.

  "Centennial OER Lab" highlighted: `accent` background, `padding: 0 3px`.

## 2. The timeline (Chapter 02)

Padding `56px 32px 48px`. Centered. See spec 01 for the `<Timeline />` component details.

- Eyebrow: `CHAPTER 02 · THE TIMELINE` (mono 11 uppercase ls 2 opacity 0.6 margin-bottom 6).
- H2:
  > The long *way* here**.**

  44 / 700 / -1.6 / lh 1 / margin-bottom 8 (clamp `(28px, 5vw, 44px)`).
- Subtitle (mono 11 / opacity 0.6): `~31 years · 4 cities · 1 reasonably consistent career`.
- `<Timeline events={TIMELINE_EVENTS} />` — centered rail, alternating cards left/right, with a pulsing ring on the `current: true` node.
- End cap below the last event: mono 10 uppercase ls 2, `paper` bg, `2px ink` border, padding `4px 10px`, text `· to be continued ·`.

### Events (verbatim from prototype)

Store in a local `const TIMELINE_EVENTS` at the top of `about.astro` (or extract to `src/data/timeline.ts` if it grows). Types: `work | edu | life`. Only one event may carry `current: true`.

| Year          | Place             | Role                                         | Org                                      | Type  | Current |
|---------------|-------------------|----------------------------------------------|------------------------------------------|-------|---------|
| 1995          | Santo Domingo, DO | Born                                         | —                                        | life  |         |
| 2019          | Santiago, DO      | B.B.A. Business Administration               | Pontifical Catholic University (PUCMM)   | edu   |         |
| 2020          | New York, NY      | Software Engineering Immersive               | Fullstack Academy                        | edu   |         |
| 2020 — 2022   | Remote            | Full-Stack Developer                         | 305 Global Marketing                     | work  |         |
| 2022 — 2023   | Remote            | SDE II                                       | Exactera                                 | work  |         |
| 2023 — now    | Toronto, CA       | B.Eng. Software Engineering Tech             | Centennial College                       | edu   |         |
| 2024 — now    | Toronto, CA       | Lead Software Developer & Coordinator        | Centennial OER Lab                       | work  | ✓       |

Card descriptions (verbatim — used as the `desc` field on each event):

- **Born**: Started life in the Dominican Republic — internet cafés, street basketball, and an early obsession with competitive anything.
- **PUCMM**: Graduated business school. Realized finance was not it. Started eyeing a different kind of problem-solving.
- **Fullstack Academy**: Completed the bootcamp — React, Node, Express, PostgreSQL. First time code felt as addictive as video games.
- **305GM**: Shipped the 305GM e-commerce platform and an internal ops dashboard on Next.js + Mongo. Cut order time by ~40%.
- **Exactera**: Built ML-powered tooling for transfer-pricing workflows. Learned to write code I would not be embarrassed by six months later.
- **Centennial College**: Back in school, part-time, while working full-time. Because the compiler never stops teaching.
- **OER Lab** (current): Leading engineering on open educational tools for 12k+ students. Type-safe, small team, high-leverage. Current chapter.

## 3. The stack (Chapter 03)

Padding `48px 32px`. Centered.

- Eyebrow: `CHAPTER 03 · THE STACK`.
- H2:
  > Tools of the *trade*.

  40 / 700 / -1.5 / lh 1 / margin-bottom 28.
- Grid: `repeat(4, 1fr); gap: 14; max-width: 880; margin: 0 auto; text-align: left`.
- Four cards. Each card: `paper` bg, `2.5px ink` border, `4px 4px 0 ink` shadow, padding `14px 16px`.
  - Label (mono 10 uppercase ls 1.5 weight 700 margin-bottom 8): category name.
  - Tags row: `<Tag variant="bg">` per item (mono 10).

Data:

| Category  | Items                              |
| --------- | ---------------------------------- |
| Languages | TypeScript, JS, Python, Go, Rust   |
| Frontend  | React, Next, Astro, Tailwind       |
| Backend   | Node, Postgres, Prisma, Redis      |
| Infra     | Vercel, AWS, Docker, GH Actions    |

Store in a local `const STACK` inside `about.astro`.

## 4. Meta strip

Padding `36px 32px`. Centered.

Grid: `repeat(4, 1fr); gap: 10; max-width: 720; margin: 0 auto`. Mono 11.

Each cell: `2px ink` border, `10px 12px` padding, `paper` bg.

- label (mono opacity 0.6, margin-bottom 4) + value (weight 700).

| Label     | Value                                                               |
| --------- | ------------------------------------------------------------------- |
| `loc.`    | Toronto, CA                                                         |
| `orig.`   | Santo Domingo, DO                                                   |
| `tz`      | EST · UTC-5                                                         |
| `status`  | `<span class="rb-dot-live" /> open to roles` (inline-flex, gap 6)   |

## Responsive

- Timeline: at `< 768px` collapse alternating layout — rail slides to `left: 20px`, all cards render right of the rail, connector line origin flips.
- Stack grid: 4 → 2 → 1 at 1024 / 640.
- Meta strip: 4 → 2 → 1 at 768 / 480.
- H1 hero clamped as noted.

## Meta

- `<title>`: `About — Carlos`
- Description: "Dominican-Canadian full-stack developer. Came for the gaming, stayed for the compiler. Lead engineer at Centennial OER Lab."
