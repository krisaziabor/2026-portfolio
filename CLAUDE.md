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

Defined in `styles/globals.css` using Tailwind v4 `@theme` syntax:

- **Colors**: content (#000), metadata (#6B6B6B), interactive (#8B6B5A), background (#FFF)
- **Typography**: Georgia serif placeholder (Lector font to be added later)
- **Base size**: 16px
- **Animation defaults**: 400ms ease-out, 100ms stagger delay

## Architecture

### Content Management

MDX content is managed through a custom loading system (`lib/content.ts`) using gray-matter for frontmatter parsing:

**CaseStudy schema** (`content/case-studies/*.mdx`):
- title, client, protected (boolean), sequence (number)
- Accessed via `getAllCaseStudies()`, `getCaseStudyBySlug()`

**Academy schema** (`content/academy/*.mdx`):
- title, type (enum: experiment/tool/exploration), sequence (number)
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
  /ui           Base UI components
  /navigation   Navigation card system
  /diptych      Case study content unit (diptych pattern)
```

## Key Technical Details

- **Module format**: ES modules (`"type": "module"` in package.json)
- **Tailwind v4**: Configuration lives in CSS using `@theme` directive, not in JS config files
- **MDX setup**: Configured via `@next/mdx` in `next.config.js` and `mdx-components.tsx`
- **Path aliases**: `@/*` maps to project root
- **Content loading**: Server-side only (uses Node.js `fs` module in `lib/content.ts`)

## Content Ordering

All content types use a `sequence` field for manual ordering. When displaying content, always sort by sequence number ascending.

## Implementation Philosophy

- Keep solutions minimal and focused
- Don't add features beyond what's requested
- Everything should serve readability and content consumption
- Use system serif font until Lector font files are added
