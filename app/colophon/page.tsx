'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import SiteHeader from '@/components/navigation/SiteHeader';

// ease-out-expo for cinematic entrances — match landing page feel
const EASE = [0.19, 1, 0.22, 1] as const;
const DURATION = 0.85;

const externalLinks = [
  { label: 'LinkedIn', href: 'https://linkedin.com/in/krisaziabor' },
  { label: 'Email', href: 'mailto:hello@krisaziabor.com' },
  { label: 'Resume', href: '/KristopherAziabor_March2026_Resume.pdf' },
];

export default function Colophon() {
  const shouldReduceMotion = useReducedMotion();
  const contentRef = useRef<HTMLDivElement>(null);
  const [portraitLoaded, setPortraitLoaded] = useState(false);

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
          className="font-[family-name:var(--font-lector)] px-6 pt-8 pb-12 md:pt-0 md:px-[72px] md:pb-20"
          style={{
            fontSize: '15px',
            letterSpacing: '-0.01em',
            lineHeight: '1.4',
            color: 'var(--color-content)',
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
              A year ago, I stopped looking at design and engineering as separate practices. I&apos;d
              been studying Computer Science at Yale but kept gravitating towards finding ways to merge
              code with craft, where the things I built were as beautiful and considered as they were
              functional. This portfolio marks that pivot: from software engineering into product design
              and design engineering, combining my artistic background with my technical skills.
            </motion.p>
            <motion.p {...fadeInPlace(0.3, { duration: 0.8, scaleFrom: 0.985 })}>
              Since then, I&apos;ve designed at{' '}
              <a
                href="https://kensho.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black transition-colors duration-150 hover:text-[#8B6B5A]"
              >
                Kensho
              </a>
              ,{' '}
              <a
                href="https://spglobal.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black transition-colors duration-150 hover:text-[#8B6B5A]"
              >
                S&amp;P Global
              </a>
              , and{' '}
              <a
                href="https://fidelity.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black transition-colors duration-150 hover:text-[#8B6B5A]"
              >
                Fidelity Investments
              </a>
              , led{' '}
              <a
                href="https://designatyale.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black transition-colors duration-150 hover:text-[#8B6B5A]"
              >
                Design at Yale
              </a>
              {' '}(Yale&apos;s only undergrad studio) as we grew our largest ever designer cohort,
              and pushed my personal practice of graphic design, writing, and photography to new
              levels. This site collects and celebrates all of it.
            </motion.p>
            <motion.p
              {...fadeInPlace(0.36, { duration: 0.7, scaleFrom: 0.99 })}
              style={{ color: 'var(--color-metadata)' }}
            >
              —
            </motion.p>
            <motion.p {...fadeInPlace(0.42, { duration: 0.8, scaleFrom: 0.985 })}>
              <em>Away from my computer</em>, you&apos;ll likely find me supporting Arsenal, watching hours
              and hours of tennis, playing pickleball and soccer, taking photos, reading for my
              CS &amp; Art thesis, and listening to R&amp;B and house.
            </motion.p>
          </div>

          {/* Portrait + metadata — stacked on small/medium; side-by-side only at xl */}
          <div className="flex flex-col xl:flex-row xl:items-end" style={{ gap: '24px' }}>
            <motion.div
              className="relative w-full xl:w-[525px] xl:shrink-0"
              initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96 }}
              animate={shouldReduceMotion ? {} : (portraitLoaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 })}
              transition={{ duration: 0.75, ease: EASE, delay: shouldReduceMotion ? 0 : 0.44 }}
            >
              <Image
                src="/KristopherAziaborPortrait.jpeg"
                alt="Portrait of Kristopher Aziabor"
                width={525}
                height={700}
                className="object-cover w-full h-auto"
                onLoad={() => setPortraitLoaded(true)}
              />
            </motion.div>

            <motion.div
              className="flex flex-col"
              style={{ color: '#6B6B6B', gap: '0px' }}
              {...fadeInPlace(0.52)}
            >
              <p>Last updated March 2026</p>
              <p>Type in Lector by Forgotten Shapes</p>
              <p>Built with Next.js and Claude Code</p>
              <p>Image taken by Nico Prescott, Cynthia Lin, &amp; Mona Chen</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
