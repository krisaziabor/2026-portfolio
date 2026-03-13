'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import SiteHeader from '@/components/navigation/SiteHeader';

// ease-out-expo for cinematic entrances — match landing page feel
const EASE = [0.19, 1, 0.22, 1] as const;
const DURATION = 0.85;

const externalLinks = [
  { label: 'LinkedIn', href: 'https://linkedin.com/in/krisaziabor' },
  { label: 'Email', href: 'mailto:kris.aziabor@yale.edu' },
  { label: 'Resume', href: '/resume.pdf' },
];

export default function Colophon() {
  const shouldReduceMotion = useReducedMotion();
  const contentRef = useRef<HTMLDivElement>(null);

  // Use RAF to guarantee the browser paints opacity:0 before revealing content.
  // useState+useEffect can be batched in React 18 concurrent mode, causing a flash
  // at the wrong position. RAF fires after the browser's first paint.
  useEffect(() => {
    let cancelled = false;

    const reveal = () => {
      if (cancelled) return;
      const id = requestAnimationFrame(() => {
        if (!contentRef.current) return;
        contentRef.current.style.opacity = '';
        contentRef.current.style.visibility = '';
      });
      return id;
    };

    // Wait for fonts to settle before revealing, to avoid position jumps
    let rafId: number | undefined;
    const fonts = (document as any).fonts;
    if (fonts?.ready) {
      fonts.ready.then(() => {
        if (!cancelled) {
          rafId = reveal();
        }
      });
    } else {
      rafId = reveal();
    }

    return () => {
      cancelled = true;
      if (rafId !== undefined) cancelAnimationFrame(rafId);
    };
  }, []);

  const fadeInPlace = (delay: number, options?: { duration?: number; scaleFrom?: number }) => {
    const { duration = DURATION, scaleFrom = 0.98 } = options ?? {};
    return {
      initial: shouldReduceMotion ? false : { opacity: 0, scale: scaleFrom },
      animate: { opacity: 1, scale: 1 },
      transition: { duration, ease: EASE, delay: shouldReduceMotion ? 0 : delay },
    };
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F8F8F8' }}>
      <SiteHeader />

      <div className="flex-1 flex flex-col justify-end">
        {/* Content — links, bio, portrait all tightly grouped */}
        {/* opacity:0 on initial render; RAF clears it after the browser's first paint
            so the flex layout has resolved before content becomes visible */}
        <div
          ref={contentRef}
          className="font-[family-name:var(--font-lector)] px-6 pb-12 md:px-[72px] md:pb-20"
          style={{
            fontSize: '15px',
            letterSpacing: '-0.01em',
            lineHeight: '1.4',
            color: '#000',
            opacity: 0,
            visibility: 'hidden',
          }}
        >
          {/* Links — each staggered individually */}
          <div className="flex items-baseline flex-wrap" style={{ gap: '20px', marginBottom: '18px' }}>
            {externalLinks.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                className="transition-colors duration-200 hover:text-[#8B6B5A]"
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                {...fadeInPlace(0.1 + i * 0.06, { duration: 0.7, scaleFrom: 0.99 })}
              >
                {link.label}
              </motion.a>
            ))}
          </div>

          {/* Bio — paragraphs staggered */}
          <div className="flex flex-col" style={{ maxWidth: '520px', gap: '18px', marginBottom: '52px' }}>
            <motion.p {...fadeInPlace(0.22, { duration: 0.8, scaleFrom: 0.985 })}>
              I am in my final semester studying Computer Science and Fine Arts at Yale and led the
              university&apos;s design community &amp; studio, forming &amp; overseeing the largest
              ever designer cohort in{' '}
              <a
                href="https://designatyale.com"
                className="transition-colors duration-200 hover:text-[#8B6B5A]"
                target="_blank"
                rel="noopener noreferrer"
              >
                Design at Yale
              </a>
              &apos;s history.
            </motion.p>
            <motion.p {...fadeInPlace(0.3, { duration: 0.8, scaleFrom: 0.985 })}>
              I&apos;ve previously interned as a designer and engineer at companies including{' '}
              <a
                href="https://kensho.com"
                className="transition-colors duration-200 hover:text-[#8B6B5A]"
                target="_blank"
                rel="noopener noreferrer"
              >
                Kensho
              </a>
              ,{' '}
              <a
                href="https://spglobal.com"
                className="transition-colors duration-200 hover:text-[#8B6B5A]"
                target="_blank"
                rel="noopener noreferrer"
              >
                S&amp;P Global
              </a>
              , and{' '}
              <a
                href="https://fidelity.com"
                className="transition-colors duration-200 hover:text-[#8B6B5A]"
                target="_blank"
                rel="noopener noreferrer"
              >
                Fidelity Investments
              </a>
              .
            </motion.p>
            <motion.p {...fadeInPlace(0.38, { duration: 0.8, scaleFrom: 0.985 })}>
              Away from my computer, you&apos;ll probably find me supporting Arsenal, playing
              pickleball and tennis, taking photos, writing, and listening to R&amp;B.
            </motion.p>
          </div>

          {/* Portrait + metadata */}
          <div className="flex flex-col md:flex-row md:items-end" style={{ gap: '24px' }}>
            <motion.div
              className="relative w-full md:w-[525px] md:shrink-0"
              {...fadeInPlace(0.44, { duration: 0.95, scaleFrom: 0.96 })}
            >
              <Image
                src="/KristopherAziaborPortrait.jpeg"
                alt="Portrait of Kristopher Aziabor"
                width={525}
                height={700}
                className="object-cover w-full h-auto"
              />
            </motion.div>

            <motion.div
              className="flex flex-col"
              style={{ color: '#6B6B6B', gap: '0px', paddingBottom: '4px' }}
              {...fadeInPlace(0.52)}
            >
              <p>Last updated March 2026</p>
              <p>Type in Lector by Forgotten Shapes</p>
              <p>Built with Next.js and Cursor</p>
              <p>Image taken by Nico Prescott, Cynthia Lin, &amp; Mona Chen</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
