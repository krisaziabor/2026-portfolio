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

export default function PhotoPageClient({ photos, isNavExpanded = false }: PhotoPageClientProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const lastNavigateTimeRef = useRef<number>(0);

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

  // Wheel-based navigation - one scroll gesture = one image
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
  }, []); // Empty deps - handler uses refs, never needs to re-attach

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
      className="flex flex-col items-center justify-center min-h-screen w-full overflow-hidden"
      style={{ backgroundColor: '#FFFFFF' }}
    >
      {/* Centered container: photo + caption, max 2/3 viewport - pushes up when nav expands */}
      <motion.div
        className="inline-flex flex-col items-center gap-6 px-8"
        style={{ maxWidth: '66.67vw' }}
        animate={{ y: isNavExpanded ? -96 : 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Photo frame - max 2/3 viewport in each dimension, shown in totality */}
        <div
          className="flex items-center justify-center"
          style={{ maxHeight: '66.67vh' }}
        >
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
                className="max-w-full max-h-[66.67vh] w-auto h-auto object-contain"
                loading="eager"
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Caption card - fixed width, centered; only title and index transition subtly */}
        <div className="flex items-center justify-between w-[560px] shrink-0 px-6 py-4 border border-[#E8E8E8] bg-white overflow-hidden">
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
