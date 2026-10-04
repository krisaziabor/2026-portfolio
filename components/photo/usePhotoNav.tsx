'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/** Current-photo state plus next/prev/jump, with ← → keyboard support.
    Shared by every press-to-navigate layout. */
export function usePhotoNav(total: number) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [photoLoaded, setPhotoLoaded] = useState(false);
  const indexRef = useRef(0);

  const goTo = useCallback(
    (i: number) => {
      const next = Math.max(0, Math.min(total - 1, i));
      if (next === indexRef.current) return; // same photo — don't hide it waiting for a load that won't come
      indexRef.current = next;
      setPhotoLoaded(false);
      setCurrentIndex(next);
    },
    [total]
  );
  const goToNext = useCallback(() => goTo(indexRef.current + 1), [goTo]);
  const goToPrev = useCallback(() => goTo(indexRef.current - 1), [goTo]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); goToNext(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); goToPrev(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goToNext, goToPrev]);

  return {
    currentIndex,
    total,
    goTo,
    goToNext,
    goToPrev,
    canGoNext: currentIndex < total - 1,
    canGoPrev: currentIndex > 0,
    photoLoaded,
    setPhotoLoaded,
  };
}

export type PhotoNav = ReturnType<typeof usePhotoNav>;

/** Click-the-right-half / swipe navigation and the "n of total" cursor.
    Spread `areaProps` on the element that should respond; attach `ref` to it too. */
export function usePressArea(nav: PhotoNav, shouldReduceMotion: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const [cursorOnRight, setCursorOnRight] = useState(true);
  const touchStartX = useRef(0);
  const swiped = useRef(false);

  const onRightHalf = (clientX: number) => {
    const rect = ref.current?.getBoundingClientRect();
    return rect ? clientX >= rect.left + rect.width / 2 : true;
  };

  const areaProps = {
    style: { cursor: 'none' } as React.CSSProperties,
    onMouseMove: (e: React.MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      setCursorOnRight(onRightHalf(e.clientX));
    },
    onMouseEnter: () => setCursorVisible(true),
    onMouseLeave: () => setCursorVisible(false),
    onClick: (e: React.MouseEvent) => {
      if (swiped.current) { swiped.current = false; return; }
      if (onRightHalf(e.clientX)) nav.goToNext();
      else nav.goToPrev();
    },
    onTouchStart: (e: React.TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      swiped.current = false;
    },
    onTouchEnd: (e: React.TouchEvent) => {
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      if (Math.abs(dx) < 40) return;
      swiped.current = true;
      if (dx < 0) nav.goToNext();
      else nav.goToPrev();
    },
  };

  const cursorActive = cursorOnRight ? nav.canGoNext : nav.canGoPrev;
  const cursor: ReactNode = (
    <AnimatePresence>
      {cursorVisible && (
        <motion.div
          className="fixed pointer-events-none z-50 select-none"
          style={{
            left: cursorPos.x,
            top: cursorPos.y,
            transform: 'translate(-50%, -50%)',
            fontSize: '13px',
            whiteSpace: 'nowrap',
            color: cursorActive ? 'var(--color-emphasis)' : 'var(--color-metadata)',
            opacity: cursorActive ? 1 : 0.4,
          }}
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={shouldReduceMotion ? {} : { opacity: 0 }}
          transition={{ duration: 0.1, ease: 'easeOut' }}
        >
          {nav.currentIndex + 1} of {nav.total}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return { ref, areaProps, cursor };
}
