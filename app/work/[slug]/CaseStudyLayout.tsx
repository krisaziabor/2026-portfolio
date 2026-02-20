'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import NavigationCard from '@/components/navigation/NavigationCard';
import { CaseStudyBody } from '@/components/case-study/CaseStudyBody';
import type { CaseStudy, CaseStudyHeroMedia, CaseStudyHeroChrome } from '@/types/case-study';

interface CaseStudyLayoutProps {
  caseStudy: CaseStudy;
  nextCaseStudy: { slug: string; title: string; vimeoId: string } | null;
}

/** Strip markdown italic/bold for plain text display. */
function summaryAsPlainText(summary: string): string {
  return summary.replace(/\*+/g, '').trim();
}

/** Convert markdown italic syntax to React elements. */
function renderSummaryWithMarkdown(summary: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /\*([^*]+)\*/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(summary)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(summary.slice(lastIndex, match.index));
    }
    // Add italicized text
    parts.push(<em key={match.index}>{match[1]}</em>);
    lastIndex = regex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < summary.length) {
    parts.push(summary.slice(lastIndex));
  }

  return parts.length > 0 ? parts : summary;
}

function HeroChromeBar({ siteName, navItems }: CaseStudyHeroChrome) {
  return (
    <div
      className="flex items-center justify-between px-4 py-2.5 border-b border-white/10"
      style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
    >
      <div className="flex items-center gap-2 text-white text-xs uppercase tracking-wide">
        <span className="w-4 h-4 rounded-sm bg-white/20" aria-hidden />
        <span>{siteName}</span>
      </div>
      <nav className="flex items-center gap-4 text-white/90 text-xs uppercase tracking-wide">
        {navItems.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </nav>
    </div>
  );
}

const DEFAULT_HERO_BG = '#1a1a1a';

function HeroMedia({ media, backgroundColor }: { media: CaseStudyHeroMedia; backgroundColor: string }) {
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
          allow={hasAudio ? 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope' : 'autoplay; fullscreen; picture-in-picture'}
          allowFullScreen
        />
      </div>
    );
  }
  return null;
}

export function CaseStudyLayout({ caseStudy }: CaseStudyLayoutProps) {
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const hasHero = caseStudy.heroMedia || caseStudy.heroChrome;
  const introText = caseStudy.intro ?? '';
  const skipLabel = caseStudy.skipToSection ? `Skip to ${caseStudy.skipToSection} →` : 'Skip to content →';
  const skipTargetId = caseStudy.skipToSection
    ? caseStudy.skipToSection.toLowerCase().replace(/\s+/g, '-')
    : 'case-study-body';

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ backgroundColor: '#F8F8F8' }}>
      <div className="flex items-center justify-center min-h-screen py-12 px-8 pb-32">
        <div
          className="flex flex-col items-center w-full"
          style={{ maxWidth: 'clamp(570px, 59.375%, 1140px)', gap: '32px', paddingBottom: '30px' }}
        >
          <motion.div
            className="bg-white w-full overflow-hidden"
            style={{
              borderRadius: '4px',
              border: '1px solid #dbd8d8',
              backgroundColor: '#FCFCFC',
              minWidth: 0,
              minHeight: 728,
            }}
            animate={{ y: isNavExpanded ? -96 : 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Hero: optional browser chrome + media */}
            {hasHero && (
              <div
                className="w-full overflow-hidden mb-[var(--space-4)]"
                style={{
                  backgroundColor: caseStudy.heroBackgroundColor ?? DEFAULT_HERO_BG,
                }}
              >
                {caseStudy.heroChrome && (
                  <HeroChromeBar
                    siteName={caseStudy.heroChrome.siteName}
                    navItems={caseStudy.heroChrome.navItems}
                  />
                )}
                {caseStudy.heroMedia && (
                  <HeroMedia
                    media={caseStudy.heroMedia}
                    backgroundColor={caseStudy.heroBackgroundColor ?? DEFAULT_HERO_BG}
                  />
                )}
                {!caseStudy.heroMedia && caseStudy.heroChrome && (
                  <div
                    className="w-full"
                    style={{ aspectRatio: '16 / 10', backgroundColor: caseStudy.heroBackgroundColor ?? DEFAULT_HERO_BG }}
                    aria-hidden
                  />
                )}
              </div>
            )}
            <div
              className="flex flex-col font-[family-name:var(--font-lector)] lector-font w-full"
              style={{
                fontSize: '15px',
                padding: '16px 24px 24px 20px',
                minWidth: 0,
              }}
            >

              {/* Headline (summary as hero title) */}
              <h1
                className="text-content font-normal mb-[var(--space-4)]"
                style={{
                  fontSize: '20px',
                  letterSpacing: 'var(--tracking-body)',
                  lineHeight: 'var(--leading-body)',
                }}
              >
                {renderSummaryWithMarkdown(caseStudy.summary)}
              </h1>

              {/* Two-column intro: left = intro text, right = metadata */}
              <div
                className="grid gap-x-12 gap-y-[var(--space-2)] mb-[var(--space-6)]"
                style={{
                  gridTemplateColumns: '1fr auto',
                  alignItems: 'start',
                }}
              >
                <div className="min-w-0" style={{ maxWidth: '75%' }}>
                  {introText ? (
                    <div
                      className="text-content"
                      style={{
                        fontSize: '15px',
                        lineHeight: 'var(--leading-body)',
                        letterSpacing: 'var(--tracking-body)',
                      }}
                    >
                      {introText.split('\n\n').map((p, i) => (
                        <p key={i} className="mb-[var(--space-2)] last:mb-0">
                          {p}
                        </p>
                      ))}
                    </div>
                  ) : null}
                  <Link
                    href={`#${skipTargetId}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById(skipTargetId);
                      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      window.history.pushState(null, '', `#${skipTargetId}`);
                    }}
                    className="inline-block mt-[var(--space-2)] text-interactive transition-opacity duration-[var(--duration-default)] hover:opacity-70"
                    style={{ color: 'var(--color-interactive)' }}
                  >
                    {skipLabel}
                  </Link>
                </div>
                {caseStudy.metadata && caseStudy.metadata.length > 0 && (
                  <div
                    className="flex flex-col text-left"
                    style={{ gap: '0', fontSize: '15px' }}
                  >
                    {caseStudy.metadata.map((item, index) => (
                      <p key={index} style={{ display: 'flex', gap: '0.25em' }}>
                        <span style={{ fontWeight: 'normal', color: 'var(--color-metadata)', width: '80px', flexShrink: 0 }}>
                          {item.key}
                        </span>
                        <span style={{ color: 'var(--color-content)' }}>{item.value}</span>
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* Body markdown */}
              <div id="case-study-body">
                <CaseStudyBody caseStudy={caseStudy} />
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
