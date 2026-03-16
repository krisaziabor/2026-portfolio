---
name: Academy grid implementation
description: The Academy page was rebuilt as a masonry grid replacing the old 2-column list layout
type: project
---

The Academy page (/academy) was rebuilt from a 2-column (title list + media detail) layout to a masonry grid.

**Why:** The prompt spec requested a rauno.me/craft-style uniform-width variable-height grid with hover dim effects and grouped item connections.

**Architecture:**
- `components/academy/AcademyGrid.tsx` — new grid component (client, Framer Motion, CSS columns masonry)
- `components/academy/AcademyPageClient.tsx` — updated to use AcademyGrid instead of AcademyList
- `lib/content.ts` — AcademyItem extended with `date`, `group`, `groupLabel` fields
- `content/academy/index.mdx` — date fields added to all items

**Masonry approach:** CSS `columns` property (`columns-1 sm:columns-2 lg:columns-3`) with `break-inside: avoid` on each cell. Simple, no JS layout math.

**Hover system:**
- Grid container `onMouseLeave` resets state (no flicker between cells)
- Individual cell `onMouseEnter` sets `hoveredSolo` (index) or `hoveredGroup` (group ID)
- Non-hovered cells dim to 0.4 opacity, 300ms ease-out
- Group cells all stay lit when any sibling is hovered

**Group connector:** `border-left: 2px solid transparent` reserved on all cells; transitions to terracotta when group is active. On touch devices (`hover: none`), `.academy-group-cell` shows the border persistently via CSS in globals.css.

**Dates:** Approximate dates added to MDX (Spring/Fall/Month Year format). User should update with accurate dates.

**How to apply:** When adding new Academy items or modifying the grid interaction, follow this component pattern.
