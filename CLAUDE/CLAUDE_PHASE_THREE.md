# Colophon Page — Layout & Typesetting

## Reference
See `DESIGN_CONTEXT.md` for design tokens and philosophy.

## Page Structure

Two-column layout inside a framed container:
```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│   [EXTERNAL LINKS]              │                                │
│   LinkedIn ↗                    │                                │
│   Email ↗                       │                                │
│   Resume ↗                      │                                │
│                                 │                                │
│                                 │        [PORTRAIT PHOTO]        │
│   [BIO PARAGRAPHS]              │                                │
│                                 │                                │
│   Paragraph 1...                │                                │
│   Paragraph 2 with links...     │                                │
│   Paragraph 3...                │                                │
│   Paragraph 4...                │                                │
│                                 │                                │
│                                 │                                │
│   [FOOTER METADATA - gray]      │                                │
│   Last updated January 2026     │                                │
│   Type in Lector by...          │                                │
│   Built with Next.js            │                                │
│                                 │                                │
└──────────────────────────────────────────────────────────────────┘
```

---

## Specifications

### Container
- Light gray border: `border border-gray-200`
- White background: `bg-white`
- Two equal columns: `grid grid-cols-2`
- Generous internal padding: `p-12` or similar

### Left Column
- Use `flex flex-col justify-between h-full` to push footer to bottom

**External links (top):**
- Stack vertically: `flex flex-col gap-1`
- Color: `text-[#8B6B5A]` (terracotta)
- Each link on its own line
- ↗ character after each (Unicode, not icon)

**Bio paragraphs (middle):**
- Container: `flex flex-col gap-6` (or `space-y-6`)
- Inline links use `text-[#8B6B5A]`
- Links: "Design at Yale", "Kensho", "S&P Global", "Fidelity Investments", "cyclio"

**Footer metadata (bottom):**
- Color: `text-[#6B6B6B]` (metadata gray)
- Smaller text: `text-sm`
- Stack: `flex flex-col gap-1`
- Three lines:
  - "Last updated January 2026"
  - "Type in Lector by Forgotten Shapes"
  - "Built with Next.js"

### Right Column
- `flex items-center justify-center` (centers image)
- Padding: `p-8` or similar so image doesn't touch edges
- Image maintains aspect ratio

---

## Tailwind Config

Extend with design tokens if not already done:
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        content: '#000000',
        metadata: '#6B6B6B',
        interactive: '#8B6B5A',
      },
    },
  },
}
```

Then use `text-interactive` instead of `text-[#8B6B5A]`, etc.

---

## Content
```tsx
const externalLinks = [
  { label: 'LinkedIn', href: 'https://linkedin.com/in/...' },
  { label: 'Email', href: 'mailto:...' },
  { label: 'Resume', href: '/resume.pdf' },
];

// Bio with markdown-style link notation
const bio = [
  "I am a design engineer in love with elevating minimalism and embracing friction to create traditions of love and exploration.",
  
  "I study Computer Science and Fine Arts at Yale and lead the university's design community & studio, forming & overseeing the largest ever designer cohort in Design at Yale's history. I've previously worked at Kensho, S&P Global, Fidelity Investments, and cyclio.",
  
  "If I'm not designing, you'll probably find me supporting Arsenal (this year is our year), playing pickleball and tennis, taking photos, writing, and listening to R&B.",
  
  "Welcome to my digital home! Thanks for stopping by <3"
];

const footer = {
  lastUpdated: 'January 2026',
  typeface: 'Lector by Forgotten Shapes',
  builtWith: 'Next.js',
};
```

---

## Technical Notes

- Use Tailwind utilities throughout, avoid inline styles
- Portrait image: Next.js `<Image>` component
- For now, use placeholder image
- Hover states: `hover:opacity-80` or `hover:underline` on links

---

## What NOT to do yet
- No animations
- No hover transitions beyond basic state change
- Ignore the nav card at bottom — separate component
- No responsive/mobile layout yet