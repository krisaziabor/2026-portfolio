# Portfolio Site: Phase 2 — Design System & Content Layer

## Context
Project initialized with Next.js 16.1, TypeScript, Tailwind. Now setting up the design foundation and content schemas.

## Reference
See `DESIGN_CONTEXT.md` for philosophy, component specs, and aesthetic guidelines. That document explains what a "diptych" is, video behavior rules, and the overall visual approach.

---

## Task 1: Design Tokens as CSS Custom Properties

In `/app/globals.css`, establish:
```css
:root {
  /* Colors */
  --color-content: #000000;
  --color-metadata: #6B6B6B;
  --color-interactive: #8B6B5A;  /* terracotta */
  --color-background: #FFFFFF;

  /* Typography */
  --font-body: 'Lector', Georgia, serif;  /* Lector added later */
  --font-size-base: 16px;
  --tracking-body: -0.01em;  /* -1% letter spacing */
  --leading-body: 1.4;       /* 140% line height */

  /* Animation */
  --duration-default: 400ms;
  --easing-default: ease-out;
  --stagger-delay: 100ms;

  /* Spacing — base unit 8px */
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --space-4: 32px;
  --space-6: 48px;
  --space-8: 64px;
}

body {
  font-family: var(--font-body);
  font-size: var(--font-size-base);
  letter-spacing: var(--tracking-body);
  line-height: var(--leading-body);
  color: var(--color-content);
  background-color: var(--color-background);
}
```

Extend Tailwind config to use the color custom properties. Typography defaults are handled at the body level—only add utility classes when overriding.

---

## Task 2: Content Schemas (Contentlayer or content-collections)

### CaseStudy (`/content/case-studies/*.mdx`)
```ts
{
  title: string,
  client: string,
  protected: boolean,        // requires password
  sequence: number,          // display order (lower = first)
  summary: string,           // one-line for nav cards
  tags: string[],            // e.g., ["AI", "Design Systems"]
  diptychs: Diptych[],
}
```

### Diptych (nested type)
```ts
{
  text: markdown,            // left side content
  media: {
    type: 'image' | 'video',
    src: string,
    alt: string,
    hasAudio: boolean,       // false = autoplay muted; true = paused with controls
    posterTime?: number,     // video poster frame timestamp
  },
  ratio: '50-50' | '40-60' | '60-40',  // text-media split
  alignment: 'top' | 'center' | 'bottom',
}
```

### Academy (`/content/academy/*.mdx`)
```ts
{
  title: string,
  type: 'experiment' | 'tool' | 'exploration',
  sequence: number,
  summary: string,
  tags: string[],
}
```

### Photos (`/content/photos.json`)
```json
[
  {
    "index": 1,
    "title": "Untitled (Market)",
    "src": "/photos/001.jpg"
  }
]
```

Create a typed loader function for photos in `/lib/photos.ts`.

---

## Task 3: Base Layout Structure

### Root Layout (`/app/layout.tsx`)
- Apply CSS custom properties (via globals.css import)
- Set up font (system serif placeholder for now)
- Minimal wrapper: no nav chrome, content fills viewport

### Page Shell Component (`/components/ui/PageShell.tsx`)
- Consistent padding/margins across pages
- Max-width constraint for readability
- Handles the "frame within frame" concept

---

## Task 4: Placeholder Content

Create minimal placeholder content to test the system:

1. `/content/case-studies/kensho.mdx` — one case study with 2 diptychs
2. `/content/academy/pdf-to-video.mdx` — one academy piece
3. `/content/photos.json` — 3 placeholder entries

---

## What NOT to build yet
- Navigation components (cards, expansion behavior)
- Diptych components
- Page layouts beyond shell
- Animations

Focus only on: tokens, schemas, base layout, placeholder content.