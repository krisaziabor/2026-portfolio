# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A personal portfolio site built as a "machine for reading"—every element serves the consumer's ability to properly absorb what's being showcased. Minimal but intentional; nothing decorative, everything functional.

## Tech Stack

- **Next.js 16** (App Router with Turbopack)
- **React 19**
- **TypeScript** (strict mode)
- **Tailwind CSS v4** (CSS-first configuration)
- **Framer Motion** for animations
- **MDX** for content with gray-matter for frontmatter parsing

## Development Commands

```bash
npm run dev    # Start development server (localhost:3000)
npm run build  # Create production build
npm run start  # Run production server
npm run lint   # Run ESLint
```

## Design System

Defined in `styles/globals.css` using CSS custom properties:

**Colors**:
- content (#000), metadata (#6B6B6B), interactive (#8B6B5A terracotta), background (#FFF)
- Defined in both `@theme` (for Tailwind) and `:root` (for direct CSS use)

**Typography**:
- Font: Lector (Georgia fallback) - `--font-body`
- Base size: 16px - `--font-size-base`
- Letter spacing: -1% (-0.01em) - `--tracking-body`
- Line height: 140% (1.4) - `--leading-body`

**Spacing** (8px base unit):
- `--space-1` (8px), `--space-2` (16px), `--space-3` (24px), `--space-4` (32px), `--space-6` (48px), `--space-8` (64px)

**Animation**:
- Duration: 400ms - `--duration-default`
- Easing: ease-out - `--easing-default`
- Stagger delay: 100ms - `--stagger-delay`

## Architecture

### Content Management

MDX content is managed through a custom loading system (`lib/content.ts`) using gray-matter for frontmatter parsing:

**CaseStudy schema** (`content/case-studies/*.mdx`):
- title, client, protected (boolean), sequence (number), summary, tags (string[]), diptychs (Diptych[])
- Diptych type: text (markdown), media (type/src/alt/hasAudio/posterTime), ratio (50-50/40-60/60-40), alignment (top/center/bottom)
- Accessed via `getAllCaseStudies()`, `getCaseStudyBySlug()`

**Academy schema** (`content/academy/*.mdx`):
- title, type (enum: experiment/tool/exploration), sequence (number), summary, tags (string[])
- Accessed via `getAllAcademy()`, `getAcademyBySlug()`

**Photos** (`content/photos.json`):
- Single JSON file with index, title, src fields
- Accessed via `getPhotos()`, `getPhotoByIndex()` in `lib/photos.ts`

### Route Structure

```
/               Home (biographical sentence with navigation)
/works          Case studies listing
/academy        Experimental work grid
/photo          Photography gallery
/colophon       About page
```

### Component Organization

```
/components
  /ui           Base UI components (PageShell for consistent layout)
  /navigation   Navigation card system (to be built)
  /diptych      Case study content unit (to be built)
```

**PageShell** (`components/ui/PageShell.tsx`): Provides consistent padding, max-width constraints, and the "frame within frame" structure for all pages.

## Key Technical Details

- **Module format**: ES modules (`"type": "module"` in package.json)
- **Tailwind v4**: Configuration lives in CSS using `@theme` directive, not in JS config files
- **MDX setup**: Configured via `@next/mdx` in `next.config.js` and `mdx-components.tsx`
- **Path aliases**: `@/*` maps to project root
- **Content loading**: Server-side only (uses Node.js `fs` module in `lib/content.ts`)

## Content Ordering

All content types use a `sequence` field for manual ordering. When displaying content, always sort by sequence number ascending.

## Design Philosophy

**"Machine for reading"**: Every element serves the consumer's ability to absorb what's showcased. Methods must be optimized for the value the audience should take away.

**Diptych pattern**: Two-panel layout (text left, media right) inspired by presentation slides. One idea per unit, revealed through scrolling.

**Video behavior**:
- hasAudio: false → autoplay, muted, loop (behaves like animated image)
- hasAudio: true → paused by default with visible controls

**Link language**:
- External links: ↗ (arrow pointing out)
- Internal navigation: → (arrow pointing right)

## Implementation Philosophy

- Keep solutions minimal and focused
- Don't add features beyond what's requested
- Everything should serve readability and content consumption
- Typography-forward, generous whitespace, terracotta (#8B6B5A) as only accent color
- Animation should feel intentional and unhurried, not snappy or performative
