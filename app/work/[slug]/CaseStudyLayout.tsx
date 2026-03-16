'use client';

import React, { useState, useTransition, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import SiteHeader from '@/components/navigation/SiteHeader';
import { CaseStudyBody } from '@/components/case-study/CaseStudyBody';
import { CaseStudyTOC } from '@/components/case-study/CaseStudyTOC';
import type { CaseStudy, CaseStudyHeroMedia, CaseStudyHeroChrome } from '@/types/case-study';
import { verifyCaseStudyPassword } from './actions';

// ease-out-expo — cinematic, responsive feel
const EASE = [0.19, 1, 0.22, 1] as const;
const DURATION = 0.7;

interface CaseStudyLayoutProps {
  caseStudy: CaseStudy;
  nextCaseStudy: CaseStudy | null;
  isUnlocked: boolean;
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
const DEFAULT_VIDEO_ASPECT = 16 / 9;

function HeroMedia({
  media,
  backgroundColor,
  videoAspectRatio = DEFAULT_VIDEO_ASPECT,
  onImageLoad,
}: {
  media: CaseStudyHeroMedia;
  backgroundColor: string;
  videoAspectRatio?: number;
  onImageLoad?: () => void;
}) {
  if (media.type === 'image') {
    return (
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: '16 / 10', backgroundColor }}
      >
        <Image
          src={media.src}
          alt={media.alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, clamp(600px, 62.5%, 1200px)"
          onLoad={onImageLoad}
        />
      </div>
    );
  }
  if (media.type === 'video' && media.vimeoId) {
    const hasAudio = media.hasAudio ?? false;
    const embedParams = new URLSearchParams({
      ...(hasAudio ? {} : { background: '1', autoplay: '1', loop: '1', muted: '1', playsinline: '1' }),
      ...(media.posterTime != null && hasAudio ? { t: String(media.posterTime) } : {}),
    });
    const embedUrl = `https://player.vimeo.com/video/${media.vimeoId}?${embedParams}`;
    return (
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: String(videoAspectRatio) }}>
        <iframe
          src={embedUrl}
          title={media.alt}
          className="absolute inset-0 w-full h-full border-0"
          allow={hasAudio ? 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope' : 'autoplay; fullscreen; picture-in-picture'}
          allowFullScreen
        />
      </div>
    );
  }
  return null;
}

export function CaseStudyLayout({ caseStudy, nextCaseStudy, isUnlocked }: CaseStudyLayoutProps) {
  const [passwordValue, setPasswordValue] = useState('');
  const [isPending, startTransition] = useTransition();
  const [passwordError, setPasswordError] = useState(false);
  const [locallyUnlocked, setLocallyUnlocked] = useState(false);
  const [heroVideoRatio, setHeroVideoRatio] = useState<number>(DEFAULT_VIDEO_ASPECT);
  const [nextVideoRatio, setNextVideoRatio] = useState<number>(DEFAULT_VIDEO_ASPECT);
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);
  const [nextHeroImageLoaded, setNextHeroImageLoaded] = useState(false);
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const hasHero = caseStudy.heroMedia || caseStudy.heroChrome;

  // Fetch Vimeo oEmbed so hero video container matches actual video dimensions (no letterboxing)
  const heroVimeoId = caseStudy.heroMedia?.type === 'video' ? caseStudy.heroMedia.vimeoId : null;
  const nextVimeoId = nextCaseStudy?.heroMedia?.type === 'video' ? nextCaseStudy.heroMedia.vimeoId : null;

  useEffect(() => {
    if (!heroVimeoId) return;
    fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${heroVimeoId}&width=400`)
      .then((r) => r.json())
      .then((data) => {
        if (data.width && data.height) {
          setHeroVideoRatio(data.width / data.height);
        }
      })
      .catch(() => {});
  }, [heroVimeoId]);

  useEffect(() => {
    if (!nextVimeoId) return;
    fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${nextVimeoId}&width=400`)
      .then((r) => r.json())
      .then((data) => {
        if (data.width && data.height) {
          setNextVideoRatio(data.width / data.height);
        }
      })
      .catch(() => {});
  }, [nextVimeoId]);
  const introText = caseStudy.intro ?? '';
  const skipLabel = caseStudy.skipToSection ? `Skip to ${caseStudy.skipToSection} →` : 'Skip to content →';
  const skipTargetId = caseStudy.skipToSection
    ? caseStudy.skipToSection.toLowerCase().replace(/\s+/g, '-')
    : 'case-study-body';
  const showBody = !caseStudy.isProtected || isUnlocked || locallyUnlocked;
  const showPasswordSection = caseStudy.isProtected && !isUnlocked && !locallyUnlocked;

  const fadeUp = (delay: number, duration = DURATION) => ({
    initial: shouldReduceMotion ? false : { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration, ease: EASE, delay: shouldReduceMotion ? 0 : delay },
  });

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: '#F8F8F8' }}>
      <SiteHeader />
      <div className="flex flex-1 min-h-0">

        {/* Left TOC panel — desktop only */}
        <motion.div
          className="hidden xl:flex flex-col shrink-0 pt-12"
          style={{ width: '240px', paddingLeft: '72px' }}
          {...fadeUp(0.45)}
        >
          {showBody && <CaseStudyTOC caseStudy={caseStudy} scrollContainerId="case-study-scroll" />}
        </motion.div>

        {/* Main scroll area */}
        <div className="flex-1 overflow-y-auto scrollbar-hide flex justify-center items-start py-12 px-8" id="case-study-scroll">
        <div
          className="flex flex-col items-center w-full"
          style={{ maxWidth: 'clamp(570px, 59.375vw, 1140px)', gap: '32px', paddingBottom: '30px' }}
        >
          {/* Card — y+scale only, no opacity so hero iframes always paint */}
          <motion.div
            className="bg-white w-full overflow-hidden"
            style={{
              borderRadius: '4px',
              border: '1px solid #dbd8d8',
              backgroundColor: '#FCFCFC',
              minWidth: 0,
              minHeight: 728,
            }}
            initial={shouldReduceMotion ? false : { y: 20, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            transition={{ duration: DURATION, ease: EASE, delay: shouldReduceMotion ? 0 : 0.1 }}
          >
            {/* Hero: optional browser chrome + media */}
            {hasHero && (
              <div
                className="relative w-full overflow-hidden mb-[var(--space-4)]"
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
                    videoAspectRatio={heroVideoRatio}
                    onImageLoad={caseStudy.heroMedia.type === 'image' ? () => setHeroImageLoaded(true) : undefined}
                  />
                )}
                {!caseStudy.heroMedia && caseStudy.heroChrome && (
                  <div
                    className="w-full"
                    style={{ aspectRatio: '16 / 10' }}
                    aria-hidden
                  />
                )}
                {/* Overlay: images gate on onLoad, videos use time-based dissolve */}
                {!shouldReduceMotion && (
                  <motion.div
                    className="absolute inset-0"
                    style={{ backgroundColor: caseStudy.heroBackgroundColor ?? DEFAULT_HERO_BG, zIndex: 2 }}
                    initial={{ opacity: 1 }}
                    animate={{ opacity: caseStudy.heroMedia?.type === 'image' ? (heroImageLoaded ? 0 : 1) : 0 }}
                    transition={{ duration: 0.8, ease: EASE, delay: caseStudy.heroMedia?.type === 'image' ? 0 : 0.35 }}
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

              {/* Headline */}
              <motion.h1
                className="text-content font-normal mb-[var(--space-4)]"
                style={{
                  fontSize: '20px',
                  letterSpacing: 'var(--tracking-body)',
                  lineHeight: 'var(--leading-body)',
                }}
                {...fadeUp(0.38)}
              >
                {renderSummaryWithMarkdown(caseStudy.summary)}
              </motion.h1>

              {/* Two-column intro (and password row when protected): same grid so left column width matches */}
              <motion.div
                className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-x-12 gap-y-[var(--space-2)] mb-[var(--space-6)]"
                style={{ alignItems: 'start' }}
                {...fadeUp(0.48)}
              >
                <div className="min-w-0 w-full lg:max-w-[75%]">
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
                  {showBody && (
                    <Link
                      href={`#${skipTargetId}`}
                      onClick={(e) => {
                        e.preventDefault();
                        const el = document.getElementById(skipTargetId);
                        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        window.history.pushState(null, '', `#${skipTargetId}`);
                      }}
                      className="inline-block mt-[var(--space-2)]"
                    >
                      {skipLabel}
                    </Link>
                  )}
                </div>
                {caseStudy.metadata && caseStudy.metadata.length > 0 ? (
                  <div
                    className="flex flex-col text-left order-first lg:order-none"
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
                ) : !showPasswordSection ? null : (
                  <div aria-hidden style={{ width: '14rem', minWidth: '14rem' }} />
                )}

                {/* Password intro row: same grid, left column matches intro left */}
                {showPasswordSection && (
                  <>
                    <div className="min-w-0 w-full md:max-w-[75%]">
                      {caseStudy.passwordIntro ? (
                        <div
                          className="text-content [&_a]:no-underline"
                          style={{
                            fontSize: '15px',
                            lineHeight: 'var(--leading-body)',
                            letterSpacing: 'var(--tracking-body)',
                          }}
                        >
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => (
                                <p className="mb-[var(--space-2)] last:mb-0">{children}</p>
                              ),
                              a: ({ href, children }) => (
                                <a href={href} className="text-black transition-colors duration-150 hover:text-[#8B6B5A]">{children}</a>
                              ),
                            }}
                          >
                            {caseStudy.passwordIntro.trim()}
                          </ReactMarkdown>
                        </div>
                      ) : null}
                    </div>
                    <div
                      className="flex flex-col text-left"
                      style={{ fontSize: '15px', color: 'var(--color-content)' }}
                    >
                      <motion.form
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (!passwordValue.trim()) return;
                          setPasswordError(false);
                          startTransition(async () => {
                            const result = await verifyCaseStudyPassword(caseStudy.slug, passwordValue);
                            if (result.success) {
                              setLocallyUnlocked(true);
                              router.refresh();
                            } else {
                              setPasswordError(true);
                            }
                          });
                        }}
                        animate={passwordError && !shouldReduceMotion
                          ? { x: [0, -8, 8, -6, 6, -4, 4, 0] }
                          : { x: 0 }}
                        transition={{ duration: 0.4, ease: 'linear' }}
                        style={{
                          fontFamily: 'var(--font-lector)',
                          letterSpacing: 'var(--tracking-body)',
                          width: '14rem',
                        }}
                      >
                        <div className="flex items-baseline gap-1">
                          <input
                            type="password"
                            value={passwordValue}
                            onChange={(e) => {
                              setPasswordValue(e.target.value);
                              if (passwordError) setPasswordError(false);
                            }}
                            placeholder="Enter password"
                            disabled={isPending}
                            autoComplete="current-password"
                            className="flex-1 min-w-0 bg-transparent border-none p-0 outline-none placeholder:text-[var(--color-metadata)]"
                            style={{
                              fontSize: '15px',
                              lineHeight: 'var(--leading-body)',
                              color: 'var(--color-content)',
                            }}
                            aria-label="Case study password"
                          />
                          <span
                            aria-hidden
                            style={{
                              color: passwordValue.length > 0 && !isPending
                                ? 'var(--color-interactive)'
                                : 'var(--color-metadata)',
                              opacity: isPending ? 0.4 : 1,
                              transition: 'color 150ms ease, opacity 150ms ease',
                            }}
                          >
                            →
                          </span>
                        </div>
                        <AnimatePresence>
                          {passwordError && (
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.15 }}
                              style={{
                                display: 'block',
                                marginTop: '4px',
                                fontSize: '13px',
                                color: 'var(--color-metadata)',
                              }}
                            >
                              Incorrect
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.form>
                    </div>
                  </>
                )}
              </motion.div>

              {/* Body markdown (gated when protected and not unlocked) */}
              <div id="case-study-body">
                {!caseStudy.isProtected ? (
                  <CaseStudyBody caseStudy={caseStudy} />
                ) : (
                  <AnimatePresence initial={false}>
                    {showBody && (
                      <motion.div
                        key="body"
                        initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: EASE }}
                      >
                        <CaseStudyBody caseStudy={caseStudy} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            </div>
          </motion.div>

          {/* Next case study preview: intro, metadata, heroMedia, "View case study →" */}
          {nextCaseStudy && (
            <div
              className="w-full bg-white overflow-hidden shrink-0"
              style={{
                marginTop: 'var(--space-8)',
                borderRadius: '4px',
                border: '1px solid #dbd8d8',
                backgroundColor: '#FCFCFC',
              }}
            >
              {/* Hero: optional chrome + media */}
              {(nextCaseStudy.heroMedia || nextCaseStudy.heroChrome) && (
                <div
                  className="relative w-full overflow-hidden mb-[var(--space-4)]"
                >
                  {nextCaseStudy.heroChrome && (
                    <HeroChromeBar
                      siteName={nextCaseStudy.heroChrome.siteName}
                      navItems={nextCaseStudy.heroChrome.navItems}
                    />
                  )}
                  {nextCaseStudy.heroMedia && (
                    <HeroMedia
                      media={nextCaseStudy.heroMedia}
                      backgroundColor={nextCaseStudy.heroBackgroundColor ?? DEFAULT_HERO_BG}
                      videoAspectRatio={nextVideoRatio}
                      onImageLoad={nextCaseStudy.heroMedia.type === 'image' ? () => setNextHeroImageLoaded(true) : undefined}
                    />
                  )}
                  {!nextCaseStudy.heroMedia && nextCaseStudy.heroChrome && (
                    <div
                      className="w-full"
                      style={{ aspectRatio: '16 / 10' }}
                      aria-hidden
                    />
                  )}
                  {!shouldReduceMotion && (
                    <motion.div
                      className="absolute inset-0"
                      style={{ backgroundColor: nextCaseStudy.heroBackgroundColor ?? DEFAULT_HERO_BG, zIndex: 2 }}
                      initial={{ opacity: 1 }}
                      animate={{ opacity: nextCaseStudy.heroMedia?.type === 'image' ? (nextHeroImageLoaded ? 0 : 1) : 0 }}
                      transition={{ duration: 0.8, ease: EASE, delay: nextCaseStudy.heroMedia?.type === 'image' ? 0 : 0.2 }}
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
                {/* Headline (summary) */}
                <h2
                  className="text-content font-normal mb-[var(--space-4)]"
                  style={{
                    fontSize: '20px',
                    letterSpacing: 'var(--tracking-body)',
                    lineHeight: 'var(--leading-body)',
                  }}
                >
                  {renderSummaryWithMarkdown(nextCaseStudy.summary)}
                </h2>
                {/* Two-column intro + metadata */}
                <div
                  className="grid gap-x-12 gap-y-[var(--space-2)] mb-[var(--space-6)]"
                  style={{
                    gridTemplateColumns: '1fr auto',
                    alignItems: 'start',
                  }}
                >
                  <div className="min-w-0" style={{ maxWidth: '75%' }}>
                    {(nextCaseStudy.intro ?? '').trim() ? (
                      <div
                        className="text-content"
                        style={{
                          fontSize: '15px',
                          lineHeight: 'var(--leading-body)',
                          letterSpacing: 'var(--tracking-body)',
                        }}
                      >
                        {(nextCaseStudy.intro ?? '').trim().split('\n\n').map((p, i) => (
                          <p key={i} className="mb-[var(--space-2)] last:mb-0">
                            {p}
                          </p>
                        ))}
                      </div>
                    ) : null}
                    <Link
                      href={`/work/${nextCaseStudy.slug}`}
                      className="inline-block mt-[var(--space-2)]"
                    >
                      View next case study →
                    </Link>
                  </div>
                  {nextCaseStudy.metadata && nextCaseStudy.metadata.length > 0 ? (
                    <div
                      className="flex flex-col text-left"
                      style={{ gap: '0', fontSize: '15px' }}
                    >
                      {nextCaseStudy.metadata.map((item, index) => (
                        <p key={index} style={{ display: 'flex', gap: '0.25em' }}>
                          <span style={{ fontWeight: 'normal', color: 'var(--color-metadata)', width: '80px', flexShrink: 0 }}>
                            {item.key}
                          </span>
                          <span style={{ color: 'var(--color-content)' }}>{item.value}</span>
                        </p>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </div>
        </div>{/* end main scroll area */}

        {/* Right balance spacer — desktop only */}
        <div className="hidden xl:block shrink-0" style={{ width: '240px' }} />

      </div>
    </div>
  );
}
