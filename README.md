# 2026 Portfolio — Kristopher Aziabor

Personal portfolio site for [krisaziabor.com](https://krisaziabor.com). A "machine for reading" — every element serves the audience's ability to absorb what's being showcased.

## Stack

- **Next.js** (App Router, Turbopack)
- **React 19**
- **TypeScript** (strict)
- **Tailwind CSS v4** (CSS-first, no JS config)
- **Framer Motion** for animations
- **MDX** + gray-matter for content

## Development

```bash
npm run dev      # localhost:3000
npm run build    # production build
npm run lint     # ESLint
```

## Routes

| Path | Content |
|---|---|
| `/` | Home — bio + case study strip |
| `/work/[slug]` | Case study detail |
| `/academy` | Experimental work grid |
| `/photo` | Photography gallery |
| `/colophon` | About page |

## Content

- **Case studies** — TypeScript modules in `content/case-studies/`. Password-protected studies use `CASE_STUDY_PASSWORD_<SLUG>` env vars (see `.env.local`).
- **Academy items** — MDX files in `content/academy/`.
- **Photos** — `content/photos.json`.

## Design

- Font: Lector by Forgotten Shapes (Georgia fallback)
- Accent: terracotta `#8B6B5A`
- Background: `#F8F8F8` (light), `#141414` (photo page)
- 8px base spacing unit
- Animations use `ease-out-expo [0.19, 1, 0.22, 1]` throughout; all media reveals are load-gated, not time-gated
