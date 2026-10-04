/* ─────────────────────────────────────────────────────────
 * ENTRANCE — "Slow Cinema"
 * Shared by every page. Elements reveal in `order` with a
 * long, luxurious blur dissolve and a slight rise; the
 * stagger is subtle (80ms) so the sequencing never feels
 * defined — the cinema comes from blur + duration.
 * ───────────────────────────────────────────────────────── */

// ease-out-expo for cinematic entrances
export const EASE = [0.19, 1, 0.22, 1] as const;

export const ENTRANCE = {
  y: 10,          // px rise
  blur: 16,       // px starting blur
  duration: 2.1,  // s
  ease: EASE,     // ease-out-expo
  stagger: 0.08,  // s between successive elements
  baseDelay: 0.2, // s before the first element starts
};

/** Framer Motion props for an entering element. `order` is its position in the reveal. */
export function fadeUp(order: number, shouldReduceMotion: boolean) {
  return {
    initial: shouldReduceMotion
      ? false
      : { opacity: 0, y: ENTRANCE.y, filter: `blur(${ENTRANCE.blur}px)` },
    animate: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      // A lingering `filter` (even blur(0px)) makes this element the containing
      // block for fixed-position descendants, breaking the expanded video's
      // viewport centering — so clear it back to `none` once the entrance ends.
      transitionEnd: { filter: 'none' as const },
    },
    transition: {
      duration: ENTRANCE.duration,
      ease: [...ENTRANCE.ease] as [number, number, number, number],
      delay: shouldReduceMotion ? 0 : ENTRANCE.baseDelay + order * ENTRANCE.stagger,
    },
  };
}
