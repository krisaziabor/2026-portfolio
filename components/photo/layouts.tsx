'use client';

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Photo } from '@/lib/photos';
import { EASE, fadeUp } from '@/lib/entrance';
import { usePhotoNav, usePressArea, type PhotoNav } from './usePhotoNav';

/* ─── Shared pieces ────────────────────────────────────────────────────────
   Every layout keeps the photo and its title on the left (the name sits on the
   right edge), uses the same gutters, caption, and photo-to-photo swap. */

export type LayoutProps = { photos: Photo[]; shouldReduceMotion: boolean };

// Same ease-out-expo family as the home page, with a touch of blur so a swap
// reads as a lens change rather than a slide.
const SWAP_HIDDEN = { opacity: 0, y: 10, filter: 'blur(8px)' };
const SWAP_SHOWN = { opacity: 1, y: 0, filter: 'blur(0px)' };
const SWAP_EXIT = { opacity: 0, filter: 'blur(6px)' };
const SWAP_TRANSITION = { duration: 0.8, ease: [...EASE] as [number, number, number, number] };

/** Left column: page gutters, name-safe width on md+. */
const STAGE = 'flex h-full w-full flex-col pb-8 pl-[var(--page-x)] pr-[var(--page-x)] pt-[var(--photo-top)] md:w-[60%] md:pr-0';
const PRESS = 'relative flex min-h-0 flex-1 flex-col select-none';

/** Image that shrinks to fit its column while keeping its own aspect ratio,
    so whatever follows it sits directly beneath the picture. */
const FIT_IMG_CLASS = 'block min-h-0 max-w-full self-start';
const FIT_IMG_STYLE: React.CSSProperties = { flex: '0 1 auto', width: 'auto', height: 'auto', objectFit: 'contain', objectPosition: 'left top' };

const pad = (n: number) => String(n).padStart(2, '0');

function useSeries(photos: Photo[]) {
  return useMemo(() => {
    const groups: { series: string; items: { photo: Photo; i: number }[] }[] = [];
    photos.forEach((photo, i) => {
      const last = groups[groups.length - 1];
      if (last && last.series === photo.series) last.items.push({ photo, i });
      else groups.push({ series: photo.series, items: [{ photo, i }] });
    });
    return groups;
  }, [photos]);
}

function Caption({ photo, className = '', children }: { photo: Photo; className?: string; children?: ReactNode }) {
  return (
    <div
      className={`shrink-0 ${className}`}
      style={{ cursor: 'default' }}
      onClick={(e) => e.stopPropagation()}
    >
      <div>
        {photo.title}
        {photo.year ? <span style={{ color: 'var(--color-metadata)' }}>, {photo.year}</span> : null}
      </div>
      {children}
    </div>
  );
}

function SwapImage({
  photo,
  nav,
  shouldReduceMotion,
  className,
  style,
}: {
  photo: Photo;
  nav: PhotoNav;
  shouldReduceMotion: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.img
        key={photo.index}
        src={photo.src}
        alt={photo.title}
        className={className}
        style={style}
        initial={shouldReduceMotion ? false : SWAP_HIDDEN}
        animate={shouldReduceMotion ? {} : nav.photoLoaded ? SWAP_SHOWN : SWAP_HIDDEN}
        exit={shouldReduceMotion ? {} : SWAP_EXIT}
        transition={SWAP_TRANSITION}
        onLoad={() => nav.setPhotoLoaded(true)}
        ref={(el) => {
          // Cached images never fire onLoad
          if (el?.complete && el.naturalWidth > 0) nav.setPhotoLoaded(true);
        }}
        draggable={false}
      />
    </AnimatePresence>
  );
}

/* ─── Strip (default) ─────────────────────────────────────────────────────
   Photo anchored to the bottom of the stage, caption on the baseline beneath,
   full-width thumbnail strip grouped by series. */

const STRIP_HEIGHT = 60;
const GAP_RATIO = 4; // between-series gap = 4× within-series gap

function StripLayout({ photos, shouldReduceMotion }: LayoutProps) {
  const nav = usePhotoNav(photos.length);
  const press = usePressArea(nav, shouldReduceMotion);
  const groups = useSeries(photos);
  const photo = photos[nav.currentIndex];

  const [captionDimmed, setCaptionDimmed] = useState(false);
  const [captionHovered, setCaptionHovered] = useState(false);
  const [imageWidths, setImageWidths] = useState<Record<number, number>>({});
  const [containerWidth, setContainerWidth] = useState(0);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const stripRef = useRef<HTMLDivElement>(null);

  const measureThumb = (index: number, img: HTMLImageElement) => {
    const width = img.naturalWidth * (STRIP_HEIGHT / img.naturalHeight);
    setImageWidths((prev) => (prev[index] === width ? prev : { ...prev, [index]: width }));
  };

  // Caption: show fully on each new photo, then retreat
  useEffect(() => {
    setCaptionDimmed(false);
    const t = setTimeout(() => setCaptionDimmed(true), 1800);
    return () => clearTimeout(t);
  }, [nav.currentIndex]);

  useEffect(() => {
    thumbRefs.current[nav.currentIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [nav.currentIndex]);

  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => setContainerWidth(entries[0].contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Spread the thumbs across the full width once every width is known
  const { innerGap, outerGap } = useMemo(() => {
    const allLoaded = photos.every((p) => imageWidths[p.index] !== undefined);
    if (!allLoaded || containerWidth <= 0) return { innerGap: 2, outerGap: 8 };
    const totalImageWidth = photos.reduce((sum, p) => sum + (imageWidths[p.index] ?? 0), 0);
    const innerGapCount = photos.length - groups.length;
    const outerGapCount = groups.length - 1;
    const available = containerWidth - totalImageWidth;
    const units = innerGapCount + outerGapCount * GAP_RATIO;
    if (units <= 0 || available <= 0) return { innerGap: 2, outerGap: 8 };
    const g = available / units;
    return { innerGap: g, outerGap: g * GAP_RATIO };
  }, [imageWidths, containerWidth, photos, groups]);

  return (
    <div className="flex h-full flex-col">
      <motion.div ref={press.ref} className={PRESS} {...press.areaProps} {...fadeUp(1, shouldReduceMotion)}>
        <div
          className="flex min-h-0 flex-1 items-end overflow-hidden md:w-[60%]"
          style={{ paddingTop: 'var(--photo-top)', paddingLeft: 'var(--page-x)', paddingRight: 'var(--page-x)', paddingBottom: '100px' }}
        >
          <SwapImage photo={photo} nav={nav} shouldReduceMotion={shouldReduceMotion} className="block w-auto" style={{ maxHeight: '100%', maxWidth: '100%' }} />
        </div>

        <AnimatePresence mode="sync">
          <motion.div
            key={photo.index}
            className="text-left md:text-right"
            style={{ position: 'absolute', bottom: '54px', left: 'var(--page-x)', right: 'var(--page-x)', cursor: 'default' }}
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: shouldReduceMotion ? 1 : captionHovered ? 1 : captionDimmed ? 0.18 : 1 }}
            exit={shouldReduceMotion ? {} : { opacity: 0 }}
            transition={{ duration: captionHovered ? 0.2 : 0.6, ease: 'easeOut' }}
            onMouseEnter={() => setCaptionHovered(true)}
            onMouseLeave={() => setCaptionHovered(false)}
            onClick={(e) => e.stopPropagation()}
          >
            {photo.title}
            {photo.year ? <span style={{ color: 'var(--color-metadata)' }}>, {photo.year}</span> : null}
          </motion.div>
        </AnimatePresence>
        {press.cursor}
      </motion.div>

      <motion.div
        ref={stripRef}
        className="scrollbar-hide flex shrink-0 items-center overflow-x-auto"
        style={{ paddingTop: '8px', paddingBottom: 'calc(env(safe-area-inset-bottom) + 20px)', paddingLeft: 'var(--page-x)', paddingRight: 'var(--page-x)' }}
        {...fadeUp(2, shouldReduceMotion)}
      >
        {groups.map((group, gi) => (
          <div key={group.series} className="flex shrink-0 items-center" style={{ marginLeft: gi > 0 ? outerGap : 0 }}>
            {group.items.map(({ photo: p, i }, k) => (
              <button
                key={p.index}
                ref={(el) => { thumbRefs.current[i] = el; }}
                onClick={() => nav.goTo(i)}
                className="block shrink-0 cursor-pointer border-0 bg-transparent p-0"
                style={{
                  height: STRIP_HEIGHT,
                  marginLeft: k > 0 ? innerGap : 0,
                  opacity: i === nav.currentIndex ? 1 : 0.35,
                  transition: shouldReduceMotion ? 'none' : 'opacity 400ms ease-out',
                }}
              >
                <img
                  src={p.src}
                  alt={p.title}
                  draggable={false}
                  className="block h-full w-auto"
                  onLoad={(e) => measureThumb(p.index, e.currentTarget)}
                  ref={(el) => {
                    // Cached images never fire onLoad
                    if (el?.complete && el.naturalWidth > 0) measureThumb(p.index, el);
                  }}
                />
              </button>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Counter ────────────────────────────────────────────────────────────
   Nothing but the photo, its title, and "02 / 10" beneath. Pure press. */

function CounterLayout({ photos, shouldReduceMotion }: LayoutProps) {
  const nav = usePhotoNav(photos.length);
  const press = usePressArea(nav, shouldReduceMotion);
  const photo = photos[nav.currentIndex];

  return (
    <div className={STAGE}>
      <motion.div ref={press.ref} className={PRESS} {...press.areaProps} {...fadeUp(1, shouldReduceMotion)}>
        <SwapImage photo={photo} nav={nav} shouldReduceMotion={shouldReduceMotion} className={FIT_IMG_CLASS} style={FIT_IMG_STYLE} />
        <Caption photo={photo} className="mt-3">
          <div style={{ color: 'var(--color-metadata)' }}>
            {pad(nav.currentIndex + 1)} / {pad(nav.total)}
          </div>
        </Caption>
        {press.cursor}
      </motion.div>
    </div>
  );
}

/* ─── Index ──────────────────────────────────────────────────────────────
   The thumbnail strip, but typographic: a row of numbers grouped by series.
   Current number is full strength; press any to jump. */

function IndexLayout({ photos, shouldReduceMotion }: LayoutProps) {
  const nav = usePhotoNav(photos.length);
  const press = usePressArea(nav, shouldReduceMotion);
  const groups = useSeries(photos);
  const photo = photos[nav.currentIndex];

  return (
    <div className={STAGE}>
      <motion.div ref={press.ref} className={PRESS} {...press.areaProps} {...fadeUp(1, shouldReduceMotion)}>
        <SwapImage photo={photo} nav={nav} shouldReduceMotion={shouldReduceMotion} className={FIT_IMG_CLASS} style={FIT_IMG_STYLE} />
        <Caption photo={photo} className="mt-3" />
        {press.cursor}
      </motion.div>

      <motion.nav className="mt-6 flex shrink-0 flex-wrap items-baseline" {...fadeUp(2, shouldReduceMotion)}>
        {groups.map((group, gi) => (
          <div key={group.series} className="flex" style={{ marginLeft: gi > 0 ? 24 : 0 }}>
            {group.items.map(({ i }, k) => (
              <button
                key={i}
                onClick={() => nav.goTo(i)}
                className="cursor-pointer border-0 bg-transparent p-0 hover:text-[color:var(--color-interactive)]"
                style={{
                  marginLeft: k > 0 ? 8 : 0,
                  color: i === nav.currentIndex ? 'var(--color-emphasis)' : undefined,
                  opacity: i === nav.currentIndex ? 1 : 0.35,
                  transition: shouldReduceMotion ? 'none' : 'opacity 400ms ease-out, color 150ms ease',
                }}
              >
                {pad(i + 1)}
              </button>
            ))}
          </div>
        ))}
      </motion.nav>
    </div>
  );
}

/* ─── Column ─────────────────────────────────────────────────────────────
   Thumbnails stand in a narrow column on the far left; the photo and its
   title sit beside them. */

const COLUMN_W = 44;

function ColumnLayout({ photos, shouldReduceMotion }: LayoutProps) {
  const nav = usePhotoNav(photos.length);
  const press = usePressArea(nav, shouldReduceMotion);
  const groups = useSeries(photos);
  const photo = photos[nav.currentIndex];
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    thumbRefs.current[nav.currentIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [nav.currentIndex]);

  return (
    <div className={`${STAGE} !flex-row`} style={{ gap: 20 }}>
      <motion.div
        className="scrollbar-hide flex h-full shrink-0 flex-col overflow-y-auto"
        style={{ width: COLUMN_W }}
        {...fadeUp(2, shouldReduceMotion)}
      >
        {groups.map((group, gi) => (
          <div key={group.series} className="flex flex-col" style={{ marginTop: gi > 0 ? 16 : 0 }}>
            {group.items.map(({ photo: p, i }, k) => (
              <button
                key={p.index}
                ref={(el) => { thumbRefs.current[i] = el; }}
                onClick={() => nav.goTo(i)}
                className="block w-full cursor-pointer border-0 bg-transparent p-0"
                style={{
                  marginTop: k > 0 ? 4 : 0,
                  opacity: i === nav.currentIndex ? 1 : 0.35,
                  transition: shouldReduceMotion ? 'none' : 'opacity 400ms ease-out',
                }}
              >
                <img src={p.src} alt={p.title} draggable={false} className="block h-auto w-full" />
              </button>
            ))}
          </div>
        ))}
      </motion.div>

      <motion.div ref={press.ref} className={`${PRESS} min-w-0`} {...press.areaProps} {...fadeUp(1, shouldReduceMotion)}>
        <SwapImage photo={photo} nav={nav} shouldReduceMotion={shouldReduceMotion} className={FIT_IMG_CLASS} style={FIT_IMG_STYLE} />
        <Caption photo={photo} className="mt-3" />
        {press.cursor}
      </motion.div>
    </div>
  );
}

/* ─── Stack ──────────────────────────────────────────────────────────────
   The photos are a deck. The current one is on top; the next two peek out
   behind it. Pressing sends the top card away and the deck steps forward. */

const STACK_DEPTH = 3;

function StackLayout({ photos, shouldReduceMotion }: LayoutProps) {
  const nav = usePhotoNav(photos.length);
  const press = usePressArea(nav, shouldReduceMotion);
  const photo = photos[nav.currentIndex];
  const deck = photos.slice(nav.currentIndex, nav.currentIndex + STACK_DEPTH);

  return (
    <div className={STAGE}>
      <motion.div ref={press.ref} className={PRESS} {...press.areaProps} {...fadeUp(1, shouldReduceMotion)}>
        <div className="relative min-h-0 flex-1">
          <AnimatePresence initial={false}>
            {deck.map((p, depth) => (
              <motion.img
                key={p.index}
                src={p.src}
                alt={depth === 0 ? p.title : ''}
                aria-hidden={depth !== 0}
                draggable={false}
                className="absolute left-0 top-0 h-full w-full"
                style={{ objectFit: 'contain', objectPosition: 'left top', transformOrigin: 'top left', zIndex: STACK_DEPTH - depth }}
                initial={shouldReduceMotion ? false : { opacity: 0, x: (depth + 1) * 12, y: (depth + 1) * 12, scale: 1 - (depth + 1) * 0.03 }}
                animate={{
                  opacity: depth === 0 ? 1 : 0.5 - depth * 0.15,
                  x: depth * 12,
                  y: depth * 12,
                  scale: 1 - depth * 0.03,
                  filter: depth === 0 ? 'blur(0px)' : `blur(${depth * 1.5}px)`,
                }}
                exit={shouldReduceMotion ? {} : { opacity: 0, x: -24, filter: 'blur(8px)' }}
                transition={shouldReduceMotion ? { duration: 0 } : SWAP_TRANSITION}
              />
            ))}
          </AnimatePresence>
        </div>
        <Caption photo={photo} className="mt-3" />
        {press.cursor}
      </motion.div>
    </div>
  );
}

/* ─── Scroll ─────────────────────────────────────────────────────────────
   Every photo in one column, title under each. No pressing — just read down. */

function ScrollLayout({ photos, shouldReduceMotion }: LayoutProps) {
  const groups = useSeries(photos);

  return (
    <motion.div
      className="w-full pb-16 pl-[var(--page-x)] pr-[var(--page-x)] pt-[var(--photo-top)] md:w-[60%] md:pr-0"
      {...fadeUp(1, shouldReduceMotion)}
    >
      {groups.map((group, gi) => (
        <section key={group.series} style={{ marginTop: gi > 0 ? 120 : 0 }}>
          {group.items.map(({ photo }, k) => (
            <figure key={photo.index} style={{ marginTop: k > 0 ? 48 : 0 }}>
              <img
                src={photo.src}
                alt={photo.title}
                loading={gi === 0 && k === 0 ? 'eager' : 'lazy'}
                draggable={false}
                className="block h-auto max-w-full"
                style={{ maxHeight: '80dvh', width: 'auto' }}
              />
              <Caption photo={photo} className="mt-3" />
            </figure>
          ))}
        </section>
      ))}
    </motion.div>
  );
}

export type PhotoLayout = 'Strip' | 'Counter' | 'Index' | 'Column' | 'Stack' | 'Scroll';

export const PHOTO_LAYOUT_COMPONENTS: Record<PhotoLayout, (props: LayoutProps) => ReactNode> = {
  Strip: StripLayout,
  Counter: CounterLayout,
  Index: IndexLayout,
  Column: ColumnLayout,
  Stack: StackLayout,
  Scroll: ScrollLayout,
};
