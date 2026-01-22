# Portfolio Site: Initial Setup

## Philosophy

This is a "machine for reading"—every element serves the consumer's ability to properly absorb what's being showcased. Minimal but intentional; nothing decorative, everything functional.

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion (animations)
- Contentlayer (content modeling)
- Mux (video hosting - configure later)

## Design Tokens

```
Colors:
- Content text: black (#000)
- Metadata text: gray (#6B6B6B)
- Interactive elements: terracotta (#8B6B5A)
- Background: white (#FFF)

Typography:
- Font: Lector (will add custom font files later, use system serif placeholder)
- Base size: 16px

Animation:
- Default duration: 400ms
- Default easing: ease-out
- Fade-in delay pattern: stagger by 100ms
```

## Structure

Create the foundational architecture:

```
/app
  /layout.tsx        (root layout with font setup)
  /page.tsx          (home - biographical sentence with navigation)
  /works/page.tsx    (case studies listing)
  /academy/page.tsx  (experimental work grid)
  /photo/page.tsx    (photography gallery)
  /colophon/page.tsx (about)

/components
  /ui               (base components)
  /navigation       (nav card system)
  /diptych          (case study content unit)

/content
  /case-studies     (MDX files)
  /academy          (MDX files)
  /photos.json      (single file with all photo entries)

/lib
  /contentlayer     (schema definitions)

/styles
  /globals.css      (Tailwind base + custom properties)
```

## Content Schemas

### CaseStudy (MDX files)

- title (string)
- client (string)
- protected (boolean)
- sequence (number for ordering)
- diptychs (nested array - define later)

### Academy (MDX files)

- title (string)
- type (enum: 'experiment', 'tool', 'exploration')
- sequence (number for ordering)

### Photos (JSON file)

Single `/content/photos.json` file structured as:

```json
[
  {
    "index": 1,
    "title": "Untitled (Market)",
    "src": "/photos/001.jpg"
  },
  {
    "index": 2,
    "title": "Untitled (Window)",
    "src": "/photos/002.jpg"
  }
]
```

## First Milestone

1. Initialize Next.js 14 with TypeScript and Tailwind
2. Set up the folder structure above
3. Create a root layout with the design tokens as CSS custom properties
4. Create placeholder pages for each route
5. Set up Contentlayer with CaseStudy and Academy schemas
6. Create the photos.json file with 2-3 placeholder entries and a typed loader function

Don't build components yet—just the scaffolding. I'll iterate on components in Cursor.
