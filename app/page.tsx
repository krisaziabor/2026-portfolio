'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import NavigationCard from '@/components/navigation/NavigationCard';
import { caseStudies } from '@/content/case-studies';
import type { CaseStudy, CaseStudyHeroMedia } from '@/types/case-study';

const DEFAULT_HERO_BG = '#1a1a1a';

/** Render summary string with *italic* markdown as <em>. */
function renderSummaryWithMarkdown(summary: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /\*([^*]+)\*/g;
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(summary)) !== null) {
    if (match.index > lastIndex) {
      parts.push(summary.slice(lastIndex, match.index));
    }
    parts.push(<em key={match.index}>{match[1]}</em>);
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < summary.length) {
    parts.push(summary.slice(lastIndex));
  }
  return parts.length > 0 ? parts : summary;
}

function HomeHeroMedia({
  media,
  backgroundColor,
}: {
  media: CaseStudyHeroMedia;
  backgroundColor: string;
}) {
  if (media.type === 'image') {
    return (
      <div className="relative w-full" style={{ aspectRatio: '16 / 10', backgroundColor }}>
        <Image
          src={media.src}
          alt={media.alt}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, clamp(600px, 62.5%, 1200px)"
        />
      </div>
    );
  }
  if (media.type === 'video' && media.vimeoId) {
    const hasAudio = media.hasAudio ?? false;
    const embedParams = new URLSearchParams({
      ...(hasAudio ? {} : { background: '1', autoplay: '1', loop: '1', muted: '1' }),
      ...(media.posterTime != null && hasAudio ? { t: String(media.posterTime) } : {}),
    });
    const embedUrl = `https://player.vimeo.com/video/${media.vimeoId}?${embedParams}`;
    return (
      <div className="relative w-full" style={{ aspectRatio: '16 / 10', backgroundColor }}>
        <iframe
          src={embedUrl}
          title={media.alt}
          className="absolute inset-0 w-full h-full"
          allow={
            hasAudio
              ? 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope'
              : 'autoplay; fullscreen; picture-in-picture'
          }
          allowFullScreen
        />
      </div>
    );
  }
  return null;
}

const BIO =
  'Kris Aziabor is a design engineer tracing origins, elevating minimalism, and creating traditions of love and exploration.';

export default function Home() {
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeStudy = caseStudies[activeIndex];

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ backgroundColor: '#F8F8F8' }}>
      <div className="flex items-center justify-center min-h-screen py-12 px-8 pb-32">
        <div
          className="flex flex-col items-center w-full"
          style={{ maxWidth: 'clamp(600px, 62.5%, 1200px)', gap: '32px', paddingBottom: '30px' }}
        >
          <motion.div
            className="flex flex-col w-full h-[728px]"
            style={{
              borderRadius: '4px',
              border: '1px solid #dbd8d8',
              backgroundColor: '#FCFCFC',
              overflow: 'hidden',
              minWidth: 0,
            }}
            animate={{ y: isNavExpanded ? -96 : 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Hero: case study hero media — background transitions to match hero */}
            <div
              className="flex-1 min-h-0 flex items-center justify-center w-full shrink-0 overflow-hidden transition-colors duration-200 ease-out"
              style={{
                backgroundColor:
                  activeStudy?.heroBackgroundColor ?? DEFAULT_HERO_BG,
                padding: '20px',
              }}
            >
              {activeStudy?.heroMedia ? (
                <div
                  className="h-full max-w-full rounded-[3px] overflow-hidden"
                  style={{
                    backgroundColor:
                      activeStudy.heroBackgroundColor ?? DEFAULT_HERO_BG,
                    aspectRatio: '16 / 10',
                    width: 'auto',
                  }}
                >
                  <HomeHeroMedia
                    media={activeStudy.heroMedia}
                    backgroundColor={
                      activeStudy.heroBackgroundColor ?? DEFAULT_HERO_BG
                    }
                  />
                </div>
              ) : (
                <div
                  className="h-full max-w-full rounded-[3px]"
                  style={{
                    aspectRatio: '16 / 10',
                    width: 'auto',
                    backgroundColor: DEFAULT_HERO_BG,
                  }}
                />
              )}
            </div>

            {/* Bottom bar: two columns — case study list (left), bio (right) */}
            <div
              className="flex items-center justify-between shrink-0 w-full bg-white font-[family-name:var(--font-lector)]"
              style={{
                minHeight: '174px',
                padding: '44px 29px 44px 29px',
                fontSize: '15px',
                letterSpacing: '-0.01em',
                lineHeight: 'var(--leading-body)',
              }}
            >
              <div
                className="flex flex-col gap-[10px] min-w-0"
                style={{ maxWidth: '338px' }}
              >
                {caseStudies.map((study, index) => {
                  const isActive = index === activeIndex;

                  return (
                    <Link
                      key={study.slug}
                      href={`/work/${study.slug}`}
                      className="text-left transition-opacity duration-200 hover:opacity-100"
                      style={{
                        color: isActive ? 'var(--color-content)' : 'rgba(0, 0, 0, 0.5)',
                      }}
                      aria-current={isActive}
                      onMouseEnter={() => setActiveIndex(index)}
                      onFocus={() => setActiveIndex(index)}
                    >
                      <span className="font-normal text-[15px] leading-[var(--leading-body)]">
                        {renderSummaryWithMarkdown(study.summary)}
                      </span>
                    </Link>
                  );
                })}
              </div>

              <div
                className="min-w-0 whitespace-pre-wrap text-content"
                style={{ maxWidth: '338px' }}
              >
                <p className="mb-0">{BIO}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-8 pointer-events-none">
        <div className="pointer-events-auto">
          <NavigationCard onExpandedChange={setIsNavExpanded} />
        </div>
      </div>
    </div>
  );
}
