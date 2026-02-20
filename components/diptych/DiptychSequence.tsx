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
  /** Background color for media panel (matches intro card). */
  titleCardBackgroundColor?: string;
  /** When set, diptych image src is resolved to /work/{caseStudySlug}/{src}. */
  caseStudySlug?: string;
}

const SCROLL_DEBOUNCE_MS = 700;
const SCROLL_DELTA_THRESHOLD = 90;
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
  titleCardBackgroundColor,
  caseStudySlug,
}: DiptychSequenceProps) {
  const touchStartYRef = useRef<number | null>(null);
  const lastScrollTimeRef = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const wheelAccumRef = useRef(0);

  const totalDiptychs = diptychs.length;
  const currentDiptych = diptychs[currentIndex];

  // Keep card position static: when index changes, reset scroll so the card stays in the same place as the first diptych.
  // Otherwise focus or layout in the new content can cause the scroll container to scroll, making the card appear lower.
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollTop = 0;
    // Run again after paint so we override any scroll-into-view from focus in the new content.
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.scrollTop = 0;
      });
    });
    return () => cancelAnimationFrame(raf);
  }, [currentIndex]);

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
      e.preventDefault();

      const now = Date.now();
      if (now - lastScrollTimeRef.current < SCROLL_DEBOUNCE_MS) {
        return;
      }

      wheelAccumRef.current += e.deltaY;

      if (wheelAccumRef.current >= SCROLL_DELTA_THRESHOLD) {
        if (currentIndex < totalDiptychs - 1) {
          lastScrollTimeRef.current = now;
          wheelAccumRef.current = 0;
          goNext();
        } else {
          wheelAccumRef.current = SCROLL_DELTA_THRESHOLD;
        }
      } else if (wheelAccumRef.current <= -SCROLL_DELTA_THRESHOLD) {
        lastScrollTimeRef.current = now;
        wheelAccumRef.current = 0;
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

      if (Math.abs(deltaY) < SCROLL_DELTA_THRESHOLD) return;

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

  const CARD_BOTTOM_PADDING = 182 + 32;

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden">
      <div className="flex-1 min-h-0 overflow-hidden relative">
        <div
          ref={scrollContainerRef}
          className="absolute inset-0 flex flex-col items-center justify-end overflow-auto pt-12 px-8"
          style={{ paddingBottom: CARD_BOTTOM_PADDING }}
        >
          {/* Static frame: border and background never change position or animate */}
          <div
            className="bg-white w-full overflow-hidden flex flex-col shrink-0"
            style={{
              maxWidth: 'clamp(600px, 62.5%, 1200px)',
              height: 728,
              minHeight: 728,
              borderRadius: '4px',
              border: '1px solid #dbd8d8',
              backgroundColor: '#FCFCFC',
            }}
          >
            {/* Only the content inside transitions */}
            <div className="relative flex-1 min-h-0">
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
                  className="absolute inset-0 flex flex-col min-h-0"
                >
                <Diptych
                  diptych={currentDiptych}
                  isFirstInSection={isFirstInSection(diptychs, currentIndex)}
                  titleCardBackgroundColor={titleCardBackgroundColor}
                  caseStudySlug={caseStudySlug}
                />
                </motion.div>
              ) : null}
            </AnimatePresence>
            </div>
          </div>
        </div>
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
