'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Lenis from 'lenis';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE, fadeUp as entrance } from '@/lib/entrance';
import type { Photo } from '@/lib/photos';

/* Home — the bio centred in the first screen, with the photo column peeking in
   along the bottom edge. Press the photo (or just scroll) to move down into it.
   Scrolling is inertial (Lenis) and each photo dissolves in as it arrives. */

// Portrait sits on the left edge; the bio runs alongside it.
const PORTRAIT_SRC = '/gen3/portrait.png';
const PORTRAIT_WIDTH = 60;
const PORTRAIT_HEIGHT = 58;
const PORTRAIT_GAP = 20;
const BIO_WIDTH = 360;
const TEXT_X = PORTRAIT_WIDTH + PORTRAIT_GAP; // on lg+ the photos align with the bio text, not the portrait

const PEEK = 120;      // "Selected photos" line + ~80px of the first photo show in the first screen
const PHOTO_GAP = 48;

const EASE_TUPLE = [...EASE] as [number, number, number, number];

// Per-photo arrival as it scrolls into view — brisk, since there are many of them
const REVEAL_HIDDEN = { opacity: 0, y: 16, filter: 'blur(6px)' };
const REVEAL_SHOWN = { opacity: 1, y: 0, filter: 'blur(0px)' };
const REVEAL_DURATION = 0.8;

// Programmatic scroll eases in as well as out, so the travel feels deliberate rather than flung
const sineInOut = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;
const SCROLL_DURATION = 1.8;

export default function HomeClient({ photos }: { photos: Photo[] }) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const rootRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);
  const photosRef = useRef<HTMLElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const [bioGone, setBioGone] = useState(false);

  // Shared "Slow Cinema" entrance; `order` is the reveal position (bio 0, photos 1).
  const fadeUp = (order: number) => entrance(order, shouldReduceMotion);

  // The peeking photo is only a "go down" control while the bio is still on screen
  useEffect(() => {
    const el = bioRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setBioGone(!entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Inertial scroll. Lenis honours prefers-reduced-motion on its own.
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.07, autoRaf: true });
    lenisRef.current = lenis;
    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollToPhotos = () => {
    const el = photosRef.current;
    if (!el || !rootRef.current) return;
    const offset = -(parseFloat(getComputedStyle(rootRef.current).getPropertyValue('--photo-top')) || 36);
    const lenis = lenisRef.current;
    if (lenis && !shouldReduceMotion) {
      lenis.scrollTo(el, { offset, duration: SCROLL_DURATION, easing: sineInOut });
      return;
    }
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: shouldReduceMotion ? 'auto' : 'smooth' });
  };

  return (
    <div
      ref={rootRef}
      className="font-[family-name:var(--font-body)] [--page-x:24px] [--photo-top:64px] md:[--page-x:50px] md:[--photo-top:36px]"
      style={{
        backgroundColor: 'var(--color-background)',
        fontSize: '16px',
        letterSpacing: '-0.025em',
        lineHeight: '1.38',
        color: 'var(--color-content)',
      }}
    >
      {/* Bio — portrait on the left, text adjacent on the right, centred in the first screen */}
      <section className="flex items-center px-[var(--page-x)]" style={{ minHeight: `calc(100svh - ${PEEK}px)` }}>
        <motion.div ref={bioRef} className="flex w-full items-start" style={{ gap: PORTRAIT_GAP }} {...fadeUp(0)}>
          <div
            className="relative shrink-0 overflow-hidden"
            style={{ width: PORTRAIT_WIDTH, height: PORTRAIT_HEIGHT, borderRadius: '2px' }}
          >
            <Image
              src={PORTRAIT_SRC}
              alt="Portrait of Kristopher Aziabor"
              fill
              priority
              className="object-cover"
              sizes={`${PORTRAIT_WIDTH}px`}
            />
          </div>

          <div className="min-w-0" style={{ maxWidth: BIO_WIDTH }}>
            <p>
              Making new things feel familiar and familiar things feel new,{' '}
              <span style={{ color: 'var(--color-emphasis)' }}>Kristopher Aziabor</span> is a design
              engineer tracing origins, elevating minimalism, and creating traditions of love and
              exploration.
            </p>
            <p style={{ marginTop: '1.38em' }}>
              Kris graduated from Yale University in May 2026 and now works as a Product Design
              Analyst in Asset and Wealth Management for Goldman Sachs.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Photo column. On lg+ it sits on the bio text's x and takes half the page;
          below that the photos need the room, so the column runs gutter to gutter.
          No titles, no years; just the pictures. */}
      <motion.section
        ref={photosRef}
        className="w-full px-[var(--page-x)] pb-16 lg:w-1/2 lg:pl-[calc(var(--page-x)+var(--text-x))] lg:pr-0"
        style={{ ['--text-x' as string]: `${TEXT_X}px` }}
        {...fadeUp(1)}
      >
        <p style={{ marginBottom: '16px' }}>Selected works, 2019 to 2025.</p>

        {photos.map((photo, i) => {
          const isPeek = i === 0 && !bioGone;
          const reveal = i > 0 && !shouldReduceMotion; // the first is already on screen
          return (
            <motion.img
              key={photo.index}
              src={photo.src}
              alt={photo.title}
              loading={i < 2 ? 'eager' : 'lazy'}
              draggable={false}
              onClick={isPeek ? scrollToPhotos : undefined}
              // svh, not dvh: the dynamic viewport changes as mobile browser chrome
              // shows/hides on direction change, which would resize every photo mid-scroll
              className="block h-auto max-h-[70svh] max-w-full lg:max-h-[60svh]"
              style={{ marginTop: i > 0 ? PHOTO_GAP : 0, width: 'auto', cursor: isPeek ? 'pointer' : undefined }}
              initial={reveal ? REVEAL_HIDDEN : false}
              whileInView={reveal ? REVEAL_SHOWN : undefined}
              viewport={{ once: true, margin: '0px 0px -8% 0px' }}
              transition={{ duration: REVEAL_DURATION, ease: EASE_TUPLE }}
            />
          );
        })}
      </motion.section>
    </div>
  );
}
