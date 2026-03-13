'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import SiteHeader from '@/components/navigation/SiteHeader';
import { caseStudies } from '@/content/case-studies';
import type { CaseStudyHeroMedia } from '@/types/case-study';

const MotionLink = motion(Link);

// ease-out-expo for cinematic entrances
const EASE = [0.19, 1, 0.22, 1] as const;
const DURATION = 0.85;

function renderWithMarkdown(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /\*([^*]+)\*/g;
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    parts.push(<em key={match.index}>{match[1]}</em>);
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts.length > 0 ? parts : text;
}

function HeroMedia({ media, backgroundColor }: { media: CaseStudyHeroMedia; backgroundColor: string }) {
  if (media.type === 'image') {
    return (
      <div className="relative w-full h-full" style={{ backgroundColor }}>
        <Image
          src={media.src}
          alt={media.alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 62.5vw"
        />
      </div>
    );
  }
  if (media.type === 'video' && media.vimeoId) {
    const hasAudio = media.hasAudio ?? false;
    const embedParams = new URLSearchParams({
      ...(hasAudio ? {} : { background: '1', autoplay: '1', loop: '1', muted: '1' }),
    });
    const embedUrl = `https://player.vimeo.com/video/${media.vimeoId}?${embedParams}`;
    return (
      <iframe
        src={embedUrl}
        title={media.alt}
        className="absolute inset-0 w-full h-full"
        style={{ backgroundColor }}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    );
  }
  return null;
}

export default function Home() {
  const shouldReduceMotion = useReducedMotion();

  const fadeUp = (delay: number) => ({
    initial: shouldReduceMotion ? false : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: DURATION, ease: EASE, delay: shouldReduceMotion ? 0 : delay },
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F8F8' }}>
      <SiteHeader />

      {/* Bio */}
      <div
        className="font-[family-name:var(--font-lector)] px-6 md:px-[72px]"
        style={{
          paddingTop: '72px',
          paddingBottom: '32px',
          maxWidth: '600px',
          fontSize: '15px',
          letterSpacing: '-0.01em',
          lineHeight: '1.4',
          color: '#000',
        }}
      >
        <motion.p {...fadeUp(0.1)}>
          <em>Making new things feel familiar and familiar things feel new,</em>
          <br />
          Kris is a design engineer tracing origins, elevating minimalism, and creating traditions of love and exploration.
        </motion.p>
        <motion.p style={{ marginTop: '24px' }} {...fadeUp(0.2)}>
          CS &amp; Art at Yale, previously Product Design at Kensho &amp; S&amp;P Global
        </motion.p>
      </div>

      {/* Case Studies */}
      <div className="px-6 md:px-[72px]" style={{ paddingTop: '24px', paddingBottom: '96px' }}>
        <div
          className="flex flex-col md:flex-row md:overflow-x-auto scrollbar-hide"
          style={{ gap: '32px', scrollSnapType: 'x mandatory' }}
        >
          {caseStudies.map((study, i) => {
            const overlayDelay = shouldReduceMotion ? 0 : 0.40 + i * 0.13;
            const bgColor = study.heroBackgroundColor ?? '#1a1a1a';

            return (
              <MotionLink
                key={study.slug}
                href={`/work/${study.slug}`}
                className="flex flex-col shrink-0 group w-full md:w-[50.625vw]"
                style={{ scrollSnapAlign: 'start' }}
                // y + scale only — no opacity, so iframes always paint
                initial={shouldReduceMotion ? false : { y: 24, scale: 0.96 }}
                animate={{ y: 0, scale: 1 }}
                transition={{
                  duration: DURATION,
                  ease: EASE,
                  delay: shouldReduceMotion ? 0 : 0.1 + i * 0.05,
                }}
              >
                <div
                  className="relative w-full overflow-hidden"
                  style={{
                    aspectRatio: '3 / 2',
                    backgroundColor: bgColor,
                    borderRadius: '2px',
                  }}
                >
                  <HeroMedia media={study.heroMedia!} backgroundColor={bgColor} />

                  {/* Overlay dissolves to reveal the already-loaded video */}
                  {!shouldReduceMotion && (
                    <motion.div
                      className="absolute inset-0"
                      style={{ backgroundColor: bgColor, zIndex: 2 }}
                      initial={{ opacity: 1 }}
                      animate={{ opacity: 0 }}
                      transition={{ duration: 0.7, ease: EASE, delay: overlayDelay }}
                    />
                  )}
                </div>

                {/* Summary — wrapper handles entrance; <p> keeps CSS hover intact */}
                <motion.div
                  initial={shouldReduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, ease: EASE, delay: overlayDelay + 0.1 }}
                >
                  <p
                    className="font-[family-name:var(--font-lector)] group-hover:opacity-50 transition-opacity duration-200"
                    style={{
                      marginTop: '12px',
                      fontSize: '15px',
                      letterSpacing: '-0.01em',
                      lineHeight: '1.4',
                      color: '#000',
                    }}
                  >
                    {renderWithMarkdown(study.summary)}
                  </p>
                </motion.div>
              </MotionLink>
            );
          })}
        </div>
      </div>
    </div>
  );
}
