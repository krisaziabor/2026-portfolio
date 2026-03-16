'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import type { Photo } from '@/lib/photos';

const STRIP_HEIGHT = 60; // px — rendered height of each thumbnail
const GAP_RATIO = 4;     // outer (between-series) gap = 4× inner (within-series) gap

export default function PhotoPageClient({ photos }: { photos: Photo[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const [cursorOnRight, setCursorOnRight] = useState(true);
  const [imageWidths, setImageWidths] = useState<Record<number, number>>({});
  const [containerWidth, setContainerWidth] = useState(0);
  const [captionDimmed, setCaptionDimmed] = useState(false);
  const [captionHovered, setCaptionHovered] = useState(false);

  const mainAreaRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const stripRef = useRef<HTMLDivElement>(null);
  const isFirstMount = useRef(true);
  const touchStartX = useRef<number>(0);
  const swiped = useRef(false);

  const shouldReduceMotion = useReducedMotion();
  const total = photos.length;
  const currentPhoto = photos[currentIndex];

  // Build series groups once (order preserved from photos array)
  const { seriesOrder, seriesMap } = useMemo(() => {
    const order: string[] = [];
    const map: Record<string, { photo: Photo; i: number }[]> = {};
    photos.forEach((photo, i) => {
      if (!map[photo.series]) {
        order.push(photo.series);
        map[photo.series] = [];
      }
      map[photo.series].push({ photo, i });
    });
    return { seriesOrder: order, seriesMap: map };
  }, [photos]);

  // Catch images already loaded before onLoad handler was attached (SSR case)
  useEffect(() => {
    const widths: Record<number, number> = {};
    let changed = false;
    photos.forEach((photo, i) => {
      const img = imgRefs.current[i];
      if (img?.complete && img.naturalWidth > 0) {
        widths[photo.index] = img.naturalWidth * (STRIP_HEIGHT / img.naturalHeight);
        changed = true;
      }
    });
    if (changed) setImageWidths(prev => ({ ...prev, ...widths }));
  }, [photos]);

  // Track strip container width
  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      setContainerWidth(entries[0].contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Calculate gaps once all image widths are known and container width is set
  const { innerGap, outerGap } = useMemo(() => {
    const allLoaded = photos.every(p => imageWidths[p.index] !== undefined);
    if (!allLoaded || containerWidth <= 0) return { innerGap: 2, outerGap: 8 };

    const totalImageWidth = photos.reduce((sum, p) => sum + (imageWidths[p.index] ?? 0), 0);
    const numSeries = seriesOrder.length;
    const innerGapCount = total - numSeries;   // gaps within series
    const outerGapCount = numSeries - 1;       // gaps between series

    const availableSpace = containerWidth - totalImageWidth;
    const totalGapUnits = innerGapCount + outerGapCount * GAP_RATIO;

    if (totalGapUnits <= 0 || availableSpace <= 0) return { innerGap: 2, outerGap: 8 };

    const g = availableSpace / totalGapUnits;
    return { innerGap: g, outerGap: g * GAP_RATIO };
  }, [imageWidths, containerWidth, photos, seriesOrder, total]);

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => Math.min(prev + 1, total - 1));
  }, [total]);

  const goToPrev = useCallback(() => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  }, []);

  // Caption dim: show fully on each new photo, then retreat
  useEffect(() => {
    setCaptionDimmed(false);
    const t = setTimeout(() => setCaptionDimmed(true), 1800);
    return () => clearTimeout(t);
  }, [currentIndex]);

  // Auto-scroll active thumbnail into view
  useEffect(() => {
    const thumb = thumbRefs.current[currentIndex];
    if (thumb) {
      thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); goToNext(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); goToPrev(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
    const rect = mainAreaRef.current?.getBoundingClientRect();
    if (rect) {
      setCursorOnRight(e.clientX >= rect.left + rect.width / 2);
    }
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    swiped.current = false;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) < 40) return;
    swiped.current = true;
    if (dx < 0) goToNext();
    else goToPrev();
  }, [goToNext, goToPrev]);

  const handleMainClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (swiped.current) { swiped.current = false; return; }
    const rect = mainAreaRef.current?.getBoundingClientRect();
    if (!rect) return;
    if (e.clientX >= rect.left + rect.width / 2) goToNext();
    else goToPrev();
  }, [goToNext, goToPrev]);

  if (total === 0) return null;

  const canGoNext = currentIndex < total - 1;
  const canGoPrev = currentIndex > 0;
  const cursorActive = cursorOnRight ? canGoNext : canGoPrev;

  return (
    <div className="flex-1 min-h-0 flex flex-col">

      {/* Main interactive area: image + metadata */}
      <div
        ref={mainAreaRef}
        className="flex-1 min-h-0 flex flex-col select-none relative"
        style={{ cursor: 'none' }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setCursorVisible(true)}
        onMouseLeave={() => setCursorVisible(false)}
        onClick={handleMainClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Image */}
        <div
          className="flex-1 min-h-0 flex items-end overflow-hidden"
          style={{ paddingTop: '24px', paddingLeft: 'clamp(16px, 7.5vw, 72px)', paddingRight: 'clamp(16px, 5vw, 48px)', paddingBottom: '100px' }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={currentPhoto.index}
              src={currentPhoto.src}
              alt={currentPhoto.title}
              className="block w-auto"
              style={{ maxHeight: '100%', maxWidth: '100%' }}
              initial={shouldReduceMotion ? false : isFirstMount.current
                ? { opacity: 0, y: 20, scale: 0.97 }
                : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={shouldReduceMotion ? {} : { opacity: 0, y: -4 }}
              transition={isFirstMount.current
                ? { duration: 0.75, ease: [0.19, 1, 0.22, 1] }
                : { duration: 0.45, ease: [0.19, 1, 0.22, 1] }}
              onAnimationStart={() => { isFirstMount.current = false; }}
              draggable={false}
            />
          </AnimatePresence>
        </div>

        {/* Metadata: absolutely positioned to align with image bottom */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhoto.index}
            className="text-left md:text-right"
            style={{
              position: 'absolute',
              bottom: '54px',
              left: 'clamp(16px, 7.5vw, 72px)',
              right: 'clamp(16px, 7.5vw, 72px)',
              fontFamily: 'var(--font-lector)',
              fontSize: '15px',
              letterSpacing: 'var(--tracking-body)',
              lineHeight: 'var(--leading-body)',
              color: 'rgba(232,230,230,0.85)',
              cursor: 'default',
            }}
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: shouldReduceMotion ? 1 : (captionHovered ? 1 : (captionDimmed ? 0.18 : 1)) }}
            exit={shouldReduceMotion ? {} : { opacity: 0 }}
            transition={captionHovered ? { duration: 0.2, ease: 'easeOut' } : { duration: 0.6, ease: 'easeOut' }}
            onMouseEnter={() => setCaptionHovered(true)}
            onMouseLeave={() => setCaptionHovered(false)}
            onClick={e => e.stopPropagation()}
          >
            {currentPhoto.title}
            {currentPhoto.year ? `, ${currentPhoto.year}` : ''}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Thumbnail strip — grouped by series, full-width with calculated gaps */}
      <div
        ref={stripRef}
        className="shrink-0 flex items-center overflow-x-auto scrollbar-hide"
        style={{
          height: '72px',
          paddingLeft: 'clamp(16px, 7.5vw, 72px)',
          paddingRight: 'clamp(16px, 7.5vw, 72px)',
        }}
      >
        {seriesOrder.map((series, si) => {
          const group = seriesMap[series];
          return (
            <div key={series} className="flex items-center shrink-0">
              {/* Inter-series gap (not before first series) */}
              {si > 0 && <div style={{ width: outerGap, flexShrink: 0 }} />}

              {group.map(({ photo, i }, gi) => (
                <div key={photo.index} className="flex items-center shrink-0">
                  {/* Intra-series gap (not before first image in group) */}
                  {gi > 0 && <div style={{ width: innerGap, flexShrink: 0 }} />}

                  <motion.div
                    className="shrink-0"
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      ease: [0.23, 1, 0.32, 1],
                      delay: shouldReduceMotion ? 0 : 0.3 + i * 0.03,
                    }}
                  >
                    <button
                      ref={el => { thumbRefs.current[i] = el; }}
                      onClick={e => { e.stopPropagation(); setCurrentIndex(i); }}
                      className="shrink-0 block"
                      style={{
                        height: `${STRIP_HEIGHT}px`,
                        padding: 0,
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        opacity: i === currentIndex ? 1 : 0.35,
                        transition: shouldReduceMotion ? 'none' : 'opacity 150ms ease-out',
                      }}
                    >
                      <img
                        ref={el => { imgRefs.current[i] = el; }}
                        src={photo.src}
                        alt={photo.title}
                        draggable={false}
                        style={{ height: '100%', width: 'auto', display: 'block' }}
                        onLoad={e => {
                          const img = e.currentTarget;
                          const rendered = img.naturalWidth * (STRIP_HEIGHT / img.naturalHeight);
                          setImageWidths(prev => ({ ...prev, [photo.index]: rendered }));
                        }}
                      />
                    </button>
                  </motion.div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Custom cursor */}
      <AnimatePresence>
        {cursorVisible && (
          <motion.div
            className="fixed pointer-events-none z-50 select-none"
            style={{
              left: cursorPos.x,
              top: cursorPos.y,
              transform: 'translate(-50%, -50%)',
              fontFamily: 'var(--font-lector)',
              fontSize: '13px',
              letterSpacing: '0.05em',
              whiteSpace: 'nowrap',
              color: cursorActive ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.2)',
              transition: shouldReduceMotion ? 'none' : 'color 150ms ease-out',
            }}
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={shouldReduceMotion ? {} : { opacity: 0 }}
            transition={{ duration: 0.1, ease: 'easeOut' }}
          >
            {currentIndex + 1} of {total}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preload adjacent images */}
      {currentIndex > 0 && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photos[currentIndex - 1].src} alt="" aria-hidden style={{ display: 'none' }} />
      )}
      {currentIndex < total - 1 && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photos[currentIndex + 1].src} alt="" aria-hidden style={{ display: 'none' }} />
      )}
    </div>
  );
}
