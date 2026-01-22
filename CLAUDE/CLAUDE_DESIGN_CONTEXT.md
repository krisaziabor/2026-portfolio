# Portfolio Design Context

## Philosophy

"Machine for reading" — every element serves the consumer's ability to absorb what's showcased. Minimal but intentional; nothing decorative, everything functional. Default is standard text; elements are pushed forward only to signify purpose.

This portfolio is not showcasing for showcasing's sake. There is a consumer who needs to properly absorb what's being presented. Methods can't just be experimental or "vibey" — they must be optimized for the value the audience should take away.

---

## Component Spec: Diptych

### What it is

A diptych is the core content unit for case studies — a two-panel layout inspired by presentation slides. The term comes from two-panel art pieces.

### Visual structure

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│   [TEXT CONTENT]         │    [MEDIA]               │
│                          │                          │
│   Body copy explaining   │    Image or video        │
│   the work, decisions,   │    demonstrating         │
│   or context. Minimal,   │    the point.            │
│   purposeful.            │                          │
│                          │                          │
└─────────────────────────────────────────────────────┘
```

- Text always on left, media always on right
- Ratio is configurable: 50-50, 40-60, or 60-40
- Vertical alignment configurable: top, center, or bottom
- Each diptych is a self-contained unit — one idea, one visual

### Behavior

- Diptychs are revealed through scrolling, not clicking
- They appear sequentially as the user scrolls down a case study
- No pagination or "next slide" buttons — continuous vertical flow
- Animation: fade in with 400ms ease-out, staggered if multiple elements

### Design philosophy

Inspired by presentation slides: minimal text, clear structure, one concept per unit. But unlike slides, users control their own pace through scrolling rather than being presented to.

---

## Video Behavior

| hasAudio | Behavior |
|----------|----------|
| false | autoplay, muted, loop, controls hidden (or minimal on hover) |
| true | paused by default, visible controls, clear play affordance |

Videos without audio (slide deck captures, prototype demos) behave like animated images. Videos with audio require user consent to play.

---

## Aesthetic

### Overall vibe

- Minimal but warm (not cold/tech minimal)
- Serious, professional, but not corporate
- Typography-forward — Lector serif gives it editorial quality
- Generous whitespace
- Terracotta (#8B6B5A) as the only accent color — used sparingly for interactive elements

### What to avoid

- Decorative elements without function
- Hover effects for their own sake
- Busy layouts or competing visual elements
- Generic portfolio aesthetics (dark mode, neon accents, glassmorphism)

### Reference points

- Museum exhibition design (sparse, considered placement)
- Editorial print layouts (typography hierarchy)
- Presentation slides (one idea per view)

---

## Animation Principles

- Default duration: 400ms
- Default easing: ease-out (not ease-in-out — things should feel weighted, not bouncy)
- Stagger delay: 100ms between sequential elements
- Motion should feel intentional and unhurried, not snappy or performative

---

## Color System

| Role | Color | Usage |
|------|-------|-------|
| Content | #000000 (black) | Body text, headings |
| Metadata | #6B6B6B (gray) | Secondary info, captions, dates |
| Interactive | #8B6B5A (terracotta) | Links, buttons, hover states |
| Background | #FFFFFF (white) | Page background |

Three-color hierarchy. No gradients, no additional accent colors.

---

## Typography

- Font: Lector by Forgotten Shapes (system serif as fallback)
- Base size: 16px
- Letter spacing: -1% (-0.01em)
- Line height: 140% (1.4)

Lector was chosen for its elegant yet modern feel that breaks from typical sans-serif design portfolios.

---

## Link Language

- External links: ↗ (arrow pointing out)
- Internal navigation: → (arrow pointing right)

Arrows distinguish where a link takes you before clicking.
