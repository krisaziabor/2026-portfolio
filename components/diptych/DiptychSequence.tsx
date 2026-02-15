'use client';

import { useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Diptych as DiptychType } from '@/types/case-study';
import { Diptych } from './Diptych';
import { EndTeaser } from './EndTeaser';

interface DiptychSequenceProps {
  diptychs: DiptychType[];
  nextCaseStudy?: { slug: string; title: string; vimeoId: string } | null;
  /** Controlled: current diptych index */
  currentIndex: number;
  /** Controlled: called when index changes (scroll, keyboard, or programmatic) */
  onIndexChange: (index: number) => void;
  onCurrentDiptychChange?: (info: {
    index: number;
    section: string;
    total: number;
  }) => void;
  /** Called when user scrolls up on the first diptych (e.g. to return to title view) */
  onScrollUpFromFirst?: () => void;
}

const SCROLL_DEBOUNCE_MS = 400;
const TRANSITION_DURATION = 0.4;

function isFirstInSection(diptychs: DiptychType[], index: number): boolean {
  if (index === 0) return true;
  return diptychs[index].section !== diptychs[index - 1].section;
}

export function DiptychSequence({
  diptychs,
  nextCaseStudy,
  currentIndex,
  onIndexChange,
  onCurrentDiptychChange,
  onScrollUpFromFirst,
}: DiptychSequenceProps) {
  const touchStartYRef = useRef<number | null>(null);
  const lastScrollTimeRef = useRef(0);

  const totalDiptychs = diptychs.length;
  const currentDiptych = diptychs[currentIndex];

  useEffect(() => {
    onCurrentDiptychChange?.({
      index: currentIndex,
      section: currentDiptych?.section ?? '',
      total: totalDiptychs,
    });
  }, [currentIndex, currentDiptych?.section, totalDiptychs, onCurrentDiptychChange]);

  const goNext = useCallback(() => {
    onIndexChange(Math.min(currentIndex + 1, totalDiptychs - 1));
  }, [currentIndex, totalDiptychs, onIndexChange]);

  const goPrev = useCallback(() => {
    if (currentIndex === 0) {
      onScrollUpFromFirst?.();
    } else {
      onIndexChange(Math.max(0, currentIndex - 1));
    }
  }, [currentIndex, onIndexChange, onScrollUpFromFirst]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (totalDiptychs === 0) return;

      const now = Date.now();
      if (now - lastScrollTimeRef.current < SCROLL_DEBOUNCE_MS) {
        e.preventDefault();
        return;
      }

      if (e.deltaY > 0) {
        if (currentIndex < totalDiptychs - 1) {
          e.preventDefault();
          lastScrollTimeRef.current = now;
          goNext();
        }
      } else if (e.deltaY < 0) {
        e.preventDefault();
        lastScrollTimeRef.current = now;
        goPrev();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowDown', 'ArrowRight', ' ', 'PageDown'].includes(e.key)) {
        e.preventDefault();
        goNext();
      } else if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key)) {
        e.preventDefault();
        goPrev();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0]?.clientY ?? null;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const startY = touchStartYRef.current;
      if (startY === null) return;

      const currentY = e.touches[0]?.clientY ?? startY;
      const deltaY = startY - currentY;

      if (Math.abs(deltaY) < 50) return;

      const now = Date.now();
      if (now - lastScrollTimeRef.current < SCROLL_DEBOUNCE_MS) {
        e.preventDefault();
        return;
      }

      lastScrollTimeRef.current = now;
      touchStartYRef.current = null;
      e.preventDefault();

      if (deltaY > 0) goNext();
      else goPrev();
    };

    const handleTouchEnd = () => {
      touchStartYRef.current = null;
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [currentIndex, totalDiptychs, goNext, goPrev]);

  const showTeaser = currentIndex === totalDiptychs - 1 && nextCaseStudy;

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden">
      <div className="flex-1 min-h-0 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {currentIndex < totalDiptychs && currentDiptych ? (
            <motion.div
              key={currentDiptych.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: TRANSITION_DURATION,
                ease: 'easeOut',
              }}
              className="absolute inset-0 flex flex-col"
            >
              <Diptych
                diptych={currentDiptych}
                isFirstInSection={isFirstInSection(diptychs, currentIndex)}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
      {showTeaser && nextCaseStudy && (
        <div className="shrink-0 border-t border-[#F0F0F0]">
          <EndTeaser
            nextTitle={nextCaseStudy.title}
            nextSlug={nextCaseStudy.slug}
            vimeoId={nextCaseStudy.vimeoId}
          />
        </div>
      )}
    </div>
  );
}
