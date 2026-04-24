# 08 — Contact (`/contact`)

Route: `src/pages/contact.astro`.
Source: `V2ContactPage` in `v2-zine.jsx`.

## Composition

1. `<Nav active="contact" />`
2. Hero (headline + pitch)
3. Form + links split (2-column)
4. `<Footer />`

## 1. Hero

Padding `72px 32px 56px`. Centered. `bg` surface.

- Eyebrow: `CORRESPONDENCE` (mono 11 uppercase ls 2 opacity 0.6 margin-bottom 10).
- H1:
  > *Write* to me**.**

  96 / 700 / -3.5 / lh 0.92. Responsive `clamp(48px, 9vw, 96px)`.
- Body (max-width 500, 16, opacity 0.85):
  > Job opportunity, weird side project, or just a "hey" — all welcome. Reply in &lt; 48h.

## 2. Split section

Padding `48px 32px`. Grid: `1fr 1fr; gap: 24; max-width: 900; margin: 0 auto; border-bottom: 3px ink`.

### Left column — `<ContactForm />`

See spec 01 for component detail. Fields: name, email, message. Primary button "Stamp & send →".

Submission:

- Default: POST to `src/pages/api/contact.ts` which forwards to a provider (Formspree, Resend, or a Netlify form). Confirm with user before choosing. Fallback: `action="mailto:carlos@heyimcarlos.dev"` with appropriate `enctype` — ugly but functional with zero backend.
- Client validation: rely on native `required`, `type=email`, `minlength` on message. No JS needed for first ship.
- Success / error: full-page reload to `/contact?sent=1` or `/contact?error=...`. Show a `<div>` banner above the form when `sent=1` — accent fill, 2px ink border, mono 13 "message delivered. reply in < 48h.".
- Spam: add a honeypot field (`<input name="website" tabindex="-1" style="position:absolute;left:-9999px">`); reject on server if filled.

### Right column — `<ContactLinks />`

Four links (see spec 01 for styling):

| Label | Value | Href |
| ----- | ----- | ---- |
| email | carlos@heyimcarlos.dev | `mailto:carlos@heyimcarlos.dev` |
| github | @heyimcarlos | https://github.com/heyimcarlos |
| linkedin | /in/heyimcarlos | https://www.linkedin.com/in/heyimcarlos |
| twitter / x | @heyimcarlos | https://x.com/heyimcarlos |

All open in new tab with `rel="noopener"`.

## Responsive

- Split: 2-col → 1-col at 768. Form first, links below.
- H1 clamps as noted.

## Meta

- `<title>`: `Contact — Carlos`
- Description: "Get in touch. Job opportunity, weird side project, or just a 'hey' — reply in less than 48 hours."

## Open questions for user

1. Form backend: Formspree, Resend, Netlify forms, or a custom endpoint? Affects hosting choice.
2. Twitter/X: keep it in the list? (prototype includes it; user can remove.)
3. Résumé: where does `/resume.pdf` live — in `public/`, or behind an email gate?
</content>
</invoke>
