'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Photo } from '@/lib/photos';

interface PhotoPageClientProps {
  photos: Photo[];
  isNavExpanded?: boolean;
}

const transitionDuration = 0.4;
const easing = [0.22, 1, 0.36, 1] as const;
const captionTransitionDuration = 0.2;
const wheelCooldownMs = 1200; // One scroll gesture = one image; must exceed typical gesture duration
const touchSwipeThreshold = 50; // Minimum swipe distance (px) to trigger navigation

export default function PhotoPageClient({ photos, isNavExpanded = false }: PhotoPageClientProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const lastNavigateTimeRef = useRef<number>(0);
  const touchStartRef = useRef<{ y: number } | null>(null);

  const total = photos.length;
  const currentPhoto = photos[currentIndex];

  const goToNext = useCallback(() => {
    if (isTransitioning || total === 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total, isTransitioning]);

  const goToPrev = useCallback(() => {
    if (isTransitioning || total === 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total, isTransitioning]);

  // Refs for stable wheel handler (avoids stale closure)
  const goToNextRef = useRef(goToNext);
  const goToPrevRef = useRef(goToPrev);
  goToNextRef.current = goToNext;
  goToPrevRef.current = goToPrev;

  // Reset transition lock after animation completes
  useEffect(() => {
    if (!isTransitioning) return;
    const timer = setTimeout(() => setIsTransitioning(false), transitionDuration * 1000);
    return () => clearTimeout(timer);
  }, [isTransitioning, currentIndex]);

  // Wheel-based navigation (desktop) - one scroll gesture = one image
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = Date.now();
      if (now - lastNavigateTimeRef.current < wheelCooldownMs) return;
      lastNavigateTimeRef.current = now;
      if (e.deltaY > 0) goToNextRef.current();
      else if (e.deltaY < 0) goToPrevRef.current();
    };

    const container = document.getElementById('photo-page-container');
    if (!container) return;

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  // Touch swipe navigation (mobile) - swipe down = next, swipe up = prev
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartRef.current = { y: e.touches[0].clientY };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return;
      const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;
      touchStartRef.current = null;

      const now = Date.now();
      if (now - lastNavigateTimeRef.current < wheelCooldownMs) return;
      if (Math.abs(deltaY) < touchSwipeThreshold) return;

      lastNavigateTimeRef.current = now;
      if (deltaY > 0) goToNextRef.current(); // Swipe down = next
      else goToPrevRef.current(); // Swipe up = prev
    };

    const container = document.getElementById('photo-page-container');
    if (!container) return;

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        goToPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev]);

  if (total === 0) return null;

  const captionText = currentPhoto.year
    ? `${currentPhoto.title}, ${currentPhoto.year}`
    : currentPhoto.title;

  return (
    <div
      id="photo-page-container"
      className="flex flex-col items-center justify-center min-h-screen w-full overflow-hidden touch-manipulation"
      style={{ backgroundColor: '#FFFFFF' }}
    >
      {/* Centered container: photo + caption; larger on mobile (90%), 2/3 viewport on desktop */}
      <motion.div
        className="inline-flex flex-col items-center gap-4 md:gap-6 px-4 md:px-8 w-full max-w-[90vw] md:max-w-[66.67vw]"
        animate={{ y: isNavExpanded ? -96 : 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Photo frame - 90% viewport on mobile, 2/3 on desktop; shown in totality */}
        <div className="flex items-center justify-center w-full max-h-[90vh] md:max-h-[66.67vh]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPhoto.index}
              className="flex items-center justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { duration: transitionDuration, ease: easing },
              }}
              exit={{
                opacity: 0,
                y: -20,
                transition: { duration: transitionDuration, ease: easing },
              }}
            >
              <img
                src={currentPhoto.src}
                alt={currentPhoto.title}
                className="max-w-full max-h-[90vh] md:max-h-[66.67vh] w-auto h-auto object-contain"
                loading="eager"
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Caption card - full width on mobile, 560px on desktop; only title and index transition subtly */}
        <div className="flex items-center justify-between gap-6 w-full max-w-[560px] shrink-0 px-4 md:px-6 py-4 border border-[#E8E8E8] bg-white overflow-hidden">
          <div className="min-w-0 flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.span
                key={`title-${currentPhoto.index}`}
                className="block text-content text-base font-[family-name:var(--font-body)]"
                initial={{ opacity: 0.6 }}
                animate={{
                  opacity: 1,
                  transition: { duration: captionTransitionDuration, ease: easing },
                }}
                exit={{
                  opacity: 0.6,
                  transition: { duration: captionTransitionDuration * 0.5, ease: easing },
                }}
              >
                {captionText}
              </motion.span>
            </AnimatePresence>
          </div>
          <AnimatePresence mode="wait">
            <motion.span
              key={`index-${currentPhoto.index}`}
              className="text-metadata text-base font-[family-name:var(--font-body)] shrink-0"
              style={{ letterSpacing: 'var(--tracking-body)' }}
              initial={{ opacity: 0.6 }}
              animate={{
                opacity: 1,
                transition: { duration: captionTransitionDuration, ease: easing },
              }}
              exit={{
                opacity: 0.6,
                transition: { duration: captionTransitionDuration * 0.5, ease: easing },
              }}
            >
              <span className="text-content font-medium">{currentPhoto.index}</span>
              {' of '}
              <span>{total}</span>
            </motion.span>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
