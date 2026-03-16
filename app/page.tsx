'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import SiteHeader from '@/components/navigation/SiteHeader';
import { caseStudies } from '@/content/case-studies';
import type { CaseStudyHeroMedia, CaseStudyLandingMedia } from '@/types/case-study';

const DEFAULT_VIDEO_ASPECT = 4 / 3;

const MotionLink = motion.create(Link);

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

function HeroMedia({
  media,
  backgroundColor,
  videoAspectRatio = DEFAULT_VIDEO_ASPECT,
  /** When true and media is video, iframe uses pointer-events: none and a click overlay so the page scrolls; click activates the video. */
  videoScrollPassthrough = false,
  videoActivated = false,
  onVideoActivate,
  onImageLoad,
}: {
  media: CaseStudyHeroMedia | CaseStudyLandingMedia;
  backgroundColor: string;
  videoAspectRatio?: number;
  videoScrollPassthrough?: boolean;
  videoActivated?: boolean;
  onVideoActivate?: () => void;
  onImageLoad?: () => void;
}) {
  if (media.type === 'image') {
    return (
      <div className="relative w-full h-full" style={{ backgroundColor }}>
        <Image
          src={media.src}
          alt={media.alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 62.5vw"
          onLoad={onImageLoad}
        />
      </div>
    );
  }
  if (media.type === 'video' && media.vimeoId) {
    const hasAudio = media.hasAudio ?? false;
    const embedParams = new URLSearchParams({
      ...(hasAudio ? {} : { background: '1', autoplay: '1', loop: '1', muted: '1', playsinline: '1' }),
    });
    const embedUrl = `https://player.vimeo.com/video/${media.vimeoId}?${embedParams}`;
    const allowScroll = videoScrollPassthrough && !videoActivated;
    return (
      <>
        <iframe
          src={embedUrl}
          title={media.alt}
          className="absolute inset-0 w-full h-full border-0"
          style={{
            backgroundColor,
            pointerEvents: allowScroll ? 'none' : 'auto',
          }}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
        {allowScroll && onVideoActivate && (
          <button
            type="button"
            className="absolute inset-0 w-full h-full cursor-pointer"
            style={{ zIndex: 1 }}
            onClick={onVideoActivate}
            aria-label="Interact with video"
          />
        )}
      </>
    );
  }
  return null;
}

export default function Home() {
  const shouldReduceMotion = useReducedMotion();
  const [heroVideoRatios, setHeroVideoRatios] = useState<Record<string, number>>({});
  /** Slugs of case study cards whose video has been clicked (so iframe can receive pointer events and page scrolls by default). */
  const [activatedVideos, setActivatedVideos] = useState<Set<string>>(new Set());
  /** Slugs of image (non-video) case study cards whose image has finished loading. */
  const [loadedImageCards, setLoadedImageCards] = useState<Set<string>>(new Set());

  // Fetch Vimeo oEmbed for landing card videos (landingMedia ?? heroMedia) so containers match actual dimensions
  useEffect(() => {
    caseStudies.forEach((study) => {
      const media = study.landingMedia ?? study.heroMedia;
      const vimeoId = media?.type === 'video' ? media.vimeoId : null;
      if (!vimeoId || heroVideoRatios[vimeoId]) return;
      fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${vimeoId}&width=400`)
        .then((r) => r.json())
        .then((data) => {
          if (data.width && data.height) {
            setHeroVideoRatios((prev) => ({ ...prev, [vimeoId]: data.width / data.height }));
          }
        })
        .catch(() => {});
    });
  }, [caseStudies]);

  // When the strip is horizontal (lg+), treat strong vertical wheel as page scroll so the strip
  // doesn't steal it. Below lg the strip is vertical — don't hijack wheel so native scroll stays smooth.
  const handleCaseStudyStripWheel: React.WheelEventHandler<HTMLDivElement> = (event) => {
    if (typeof window === 'undefined' || window.innerWidth < 1024) return;
    const { deltaX, deltaY } = event;
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      event.preventDefault();
      window.scrollBy({ top: deltaY, behavior: 'auto' });
    }
  };

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
          paddingTop: '48px',
          paddingBottom: '32px',
          maxWidth: '600px',
          fontSize: '15px',
          letterSpacing: '-0.01em',
          lineHeight: '1.4',
          color: 'var(--color-content)',
        }}
      >
        <motion.p {...fadeUp(0.1)}>
          <em>Making new things feel familiar and familiar things feel new,</em>
          <br />
          Kris is a design engineer tracing origins, elevating minimalism, and creating traditions of love and exploration.
        </motion.p>
        <motion.p style={{ marginTop: '24px' }} {...fadeUp(0.2)}>
          CS &amp; Art at{' '}
          <Link href="https://catalog.yale.edu/ycps/subjects-of-instruction/computing-arts/" target="_blank" rel="noopener noreferrer" className="text-[#000] hover:text-[var(--color-interactive)] transition-colors">
            Yale
          </Link>
          , previously Product Design at{' '}
          <Link href="https://kensho.com/" target="_blank" rel="noopener noreferrer" className="text-[#000] hover:text-[var(--color-interactive)] transition-colors">
            Kensho
          </Link>
          {' '}&amp;{' '}
          <Link href="https://www.spglobal.com/" target="_blank" rel="noopener noreferrer" className="text-[#000] hover:text-[var(--color-interactive)] transition-colors">
            S&amp;P Global
          </Link>
        </motion.p>
      </div>

      {/* Case Studies — vertical stack until lg (half MacBook ~720px stays stacked) */}
      <div className="px-6 md:px-[72px]" style={{ paddingTop: '24px', paddingBottom: '96px' }}>
        <div
          className="flex flex-col lg:flex-row lg:overflow-x-auto scrollbar-hide"
          style={{ gap: '40px', scrollSnapType: 'x mandatory' }}
          onWheel={handleCaseStudyStripWheel}
        >
          {caseStudies.map((study, i) => {
            const media = study.landingMedia ?? study.heroMedia;
            const overlayDelay = shouldReduceMotion ? 0 : 0.40 + i * 0.13;
            const bgColor = study.heroBackgroundColor ?? '#1a1a1a';
            const isVideo = media?.type === 'video';
            const vimeoId = isVideo ? media.vimeoId : null;
            const cardAspectRatio = isVideo && vimeoId
              ? (heroVideoRatios[vimeoId] ?? DEFAULT_VIDEO_ASPECT)
              : DEFAULT_VIDEO_ASPECT;

            return (
              <MotionLink
                key={study.slug}
                href={`/work/${study.slug}`}
                className="flex flex-col shrink-0 group w-full lg:w-[48vw]"
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
                  className="relative w-full overflow-hidden transition-opacity duration-200 ease-out group-hover:opacity-70 lg:max-h-[calc(100vh-420px)]"
                  style={{
                    aspectRatio: String(cardAspectRatio),
                    backgroundColor: bgColor,
                    borderRadius: '2px',
                  }}
                >
                  <HeroMedia
                    media={media!}
                    backgroundColor={bgColor}
                    videoAspectRatio={isVideo && vimeoId ? (heroVideoRatios[vimeoId] ?? DEFAULT_VIDEO_ASPECT) : undefined}
                    videoScrollPassthrough={isVideo}
                    videoActivated={isVideo && activatedVideos.has(study.slug)}
                    onVideoActivate={isVideo ? () => setActivatedVideos((prev) => new Set([...prev, study.slug])) : undefined}
                    onImageLoad={!isVideo ? () => setLoadedImageCards((prev) => new Set([...prev, study.slug])) : undefined}
                  />

                  {/* Overlay: videos use time-based dissolve; images gate on onLoad so content is never revealed before it's ready */}
                  {!shouldReduceMotion && (
                    <motion.div
                      className="absolute inset-0"
                      style={{ backgroundColor: bgColor, zIndex: 2, pointerEvents: 'none' }}
                      initial={{ opacity: 1 }}
                      animate={{ opacity: isVideo ? 0 : (loadedImageCards.has(study.slug) ? 0 : 1) }}
                      transition={{ duration: 0.7, ease: EASE, delay: isVideo ? overlayDelay : 0 }}
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
                    className="font-[family-name:var(--font-lector)] group-hover:opacity-50 transition-opacity duration-200 ease-out"
                    style={{
                      marginTop: '12px',
                      fontSize: '15px',
                      letterSpacing: '-0.01em',
                      lineHeight: '1.4',
                      color: 'var(--color-content)',
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
