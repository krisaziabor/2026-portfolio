'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { gen3Items, type Gen3Item } from '@/content/gen3';

// ease-out-expo for cinematic entrances
const EASE = [0.19, 1, 0.22, 1] as const;
const EXPAND_DURATION = 0.55;
const DIM_OPACITY = 0.12;

/* ─────────────────────────────────────────────────────────
 * ENTRANCE — "Slow Cinema"
 * Reveal order: header → bio → cards → footer.
 * A long, luxurious blur dissolve with a slight rise; the
 * stagger is subtle (80ms) so the sequencing never feels
 * defined — the cinema comes from blur + duration.
 * ───────────────────────────────────────────────────────── */
const ENTRANCE = {
  y: 10,          // px rise
  blur: 16,       // px starting blur
  duration: 2.1,  // s
  ease: EASE,     // ease-out-expo
  stagger: 0.08,  // s between successive elements
  baseDelay: 0.2, // s before the first element starts
};

const CARD_WIDTH = 460;
const EDGE_FADE_WIDTH = 140;

/** Tallest thumbnail in the strip — every media slot (and the bio portrait) occupies
    this height on lg+, so all titles and the bio text start on the same line. */
const MEDIA_ROW_HEIGHT = Math.ceil(
  Math.max(...gen3Items.map((i) => (i.media.thumbWidth * i.media.height) / i.media.width))
);

const externalLinks = [
  { label: 'Archive', href: 'https://archived.krisaziabor.com' },
  { label: 'Photo', href: 'https://photo.krisaziabor.com' },
  { label: 'hello@krisaziabor.com', href: 'mailto:hello@krisaziabor.com' },
];

function NewYorkClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'America/New_York',
    });
    const tick = () => setTime(formatter.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span style={{ color: 'var(--color-metadata)' }}>
      {time ? `${time} in New York` : '\u00A0'}
    </span>
  );
}

function LinkRow({ className, dimmed }: { className?: string; dimmed: boolean }) {
  return (
    <div className={className} style={dimStyle(dimmed)}>
      {externalLinks.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target={link.href.startsWith('http') ? '_blank' : undefined}
          rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}

/** Everything except the expanded video dims while a video is open. */
function dimStyle(dimmed: boolean): React.CSSProperties {
  return {
    opacity: dimmed ? DIM_OPACITY : 1,
    transition: 'opacity 400ms ease-out',
  };
}

/** Renders `[label](url)` spans inside description copy as external links. */
function renderWithLinks(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = linkPattern.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    parts.push(
      <a key={match.index} href={match[2]} target="_blank" rel="noopener noreferrer">
        {match[1]}
      </a>
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function CardMedia({
  item,
  expanded,
  onToggle,
  shouldReduceMotion,
  dimmed,
}: {
  item: Gen3Item;
  expanded: boolean;
  onToggle?: () => void;
  shouldReduceMotion: boolean;
  dimmed?: boolean;
}) {
  const { media } = item;
  const aspect = media.width / media.height;
  const aspectCss = `${media.width} / ${media.height}`;

  // Pause + rewind the Vimeo player while it's out of the viewport so every
  // video starts from the beginning when it comes back into view.
  const placeholderRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isVideo = media.type === 'vimeo';
  useEffect(() => {
    const el = placeholderRef.current;
    if (!isVideo || !el) return;
    const post = (method: string, value?: number) => {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify(value !== undefined ? { method, value } : { method }),
        'https://player.vimeo.com'
      );
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          post('play');
        } else {
          post('pause');
          post('setCurrentTime', 0);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isVideo]);

  if (media.type === 'image') {
    // Static logos — optional href turns the mark into an external link.
    const boxStyle: React.CSSProperties = {
      aspectRatio: aspectCss,
      backgroundColor: media.background,
      borderRadius: '2px',
      overflow: 'hidden',
      ...dimStyle(dimmed ?? false),
    };
    const boxClass =
      'relative block w-[12.5%] max-w-[var(--media-w)] lg:w-[var(--media-w)] lg:max-w-none';
    const image = (
      <Image
        src={media.src}
        alt={media.alt}
        fill
        className="object-cover"
        sizes={`${media.thumbWidth}px`}
      />
    );
    if (media.href) {
      return (
        <a
          href={media.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={media.alt}
          className={boxClass}
          style={boxStyle}
        >
          {image}
        </a>
      );
    }
    return (
      <div className={boxClass} style={boxStyle}>
        {image}
      </div>
    );
  }

  const embedUrl = `https://player.vimeo.com/video/${media.vimeoId}?background=1&autoplay=1&loop=1&muted=1&playsinline=1`;

  return (
    // Placeholder keeps the card layout intact while the video floats to the center.
    <div
      ref={placeholderRef}
      className="relative w-1/3 lg:w-[var(--media-w)]"
      style={{ aspectRatio: aspectCss, ...dimStyle(dimmed ?? false) }}
    >
      <motion.div
        layout
        // Only re-measure layout when the expanded state flips. Without this,
        // any re-render during a page layout shift (e.g. mobile URL-bar resize
        // while scrolling) makes the video glide to its new position instead
        // of moving rigidly with the page.
        layoutDependency={expanded}
        transition={{ layout: { duration: shouldReduceMotion ? 0 : EXPAND_DURATION, ease: EASE } }}
        role="button"
        tabIndex={0}
        aria-label={expanded ? `Close ${item.title} video` : `Expand ${item.title} video`}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle?.();
          }
        }}
        className={expanded ? 'fixed z-50 cursor-pointer' : 'absolute inset-0 cursor-pointer'}
        style={{
          backgroundColor: media.background,
          borderRadius: '2px',
          overflow: 'hidden',
          ...(expanded
            ? {
                // inset 0 + margin auto centers the definite-sized box in the viewport
                inset: 0,
                margin: 'auto',
                width: `min(57vw, calc(${aspect.toFixed(4)} * 58.5vh))`,
                aspectRatio: aspectCss,
              }
            : {}),
        }}
      >
        <iframe
          ref={iframeRef}
          src={embedUrl}
          title={item.title}
          className="absolute inset-0 h-full w-full border-0"
          style={{ pointerEvents: 'none' }}
          allow="autoplay; fullscreen; picture-in-picture"
        />
      </motion.div>
    </div>
  );
}

export default function Home() {
  const shouldReduceMotion = useReducedMotion();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const anyExpanded = expandedId !== null;

  const stripRef = useRef<HTMLDivElement>(null);
  const expandedRef = useRef(anyExpanded);
  expandedRef.current = anyExpanded;

  // Edge fades only show where more content exists: the left fade appears once
  // scrolled, the right fade disappears at the end of the strip.
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const update = () => {
      setAtStart(strip.scrollLeft <= 4);
      setAtEnd(strip.scrollLeft + strip.clientWidth >= strip.scrollWidth - 4);
    };
    update();
    strip.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      strip.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  // On lg+: redirect all scroll gestures (vertical or horizontal) to the horizontal strip.
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;

    const onWheel = (e: WheelEvent) => {
      if (window.innerWidth < 1024) return;
      e.preventDefault();
      if (expandedRef.current) return; // page is frozen while a video is open
      const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      strip.scrollBy({ left: delta * 0.7, behavior: 'auto' });
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, []);

  // Escape closes the expanded video.
  useEffect(() => {
    if (!expandedId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpandedId(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [expandedId]);

  // Lock body scroll (mobile) while a video is open.
  useEffect(() => {
    if (!expandedId) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [expandedId]);

  // `order` is the element's position in the reveal sequence (header 0 … footer 5).
  const fadeUp = (order: number) => ({
    initial: shouldReduceMotion
      ? false
      : { opacity: 0, y: ENTRANCE.y, filter: `blur(${ENTRANCE.blur}px)` },
    animate: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      // A lingering `filter` (even blur(0px)) makes this element the containing
      // block for fixed-position descendants, breaking the expanded video's
      // viewport centering — so clear it back to `none` once the entrance ends.
      transitionEnd: { filter: 'none' as const },
    },
    transition: {
      duration: ENTRANCE.duration,
      ease: [...ENTRANCE.ease] as [number, number, number, number],
      delay: shouldReduceMotion ? 0 : ENTRANCE.baseDelay + order * ENTRANCE.stagger,
    },
  });

  return (
    <div
      className="flex min-h-svh flex-col font-[family-name:var(--font-lector)] lg:h-dvh lg:overflow-hidden"
      style={{
        backgroundColor: 'var(--color-background)',
        fontSize: '15px',
        letterSpacing: '-0.01em',
        lineHeight: '1.4',
        color: 'var(--color-content)',
      }}
    >
      {/* Header — studio name + New York clock */}
      <motion.header className="px-6 pt-6 md:px-[72px] lg:pt-9" {...fadeUp(0)}>
        <div className="flex items-baseline gap-6" style={dimStyle(anyExpanded)}>
          <span style={{ color: 'var(--color-metadata)' }}>Studio Atteh Kojo</span>
          <NewYorkClock />
        </div>
      </motion.header>

      <main className="flex flex-1 flex-col px-6 py-12 md:px-[72px] lg:min-h-0 lg:flex-row lg:items-center lg:px-0 lg:pb-0 lg:pt-16">
        <div className="relative lg:min-w-0 lg:flex-1">
          {/* Everything — bio included — scrolls horizontally on lg+; vertical stack on mobile.
              The strip runs edge to edge so content clips at the screen, not mid-page. */}
          <div
            ref={stripRef}
            className="scrollbar-hide flex flex-col gap-20 lg:flex-row lg:items-start lg:gap-[210px] lg:overflow-x-auto lg:px-[72px]"
            style={{ ['--media-row-h' as string]: `${MEDIA_ROW_HEIGHT}px` }}
          >
            {/* Bio — first stop of the strip; portrait and text share the cards' grid lines */}
            <motion.aside className="w-full shrink-0 lg:w-[420px]" {...fadeUp(1)}>
              <div style={dimStyle(anyExpanded)}>
                <div className="lg:flex lg:h-[var(--media-row-h)] lg:items-end">
                  <div
                    className="relative overflow-hidden"
                    style={{ width: '72px', height: '72px', borderRadius: '2px' }}
                  >
                    <Image
                      src="/gen3/portrait.png"
                      alt="Portrait of Kristopher Aziabor"
                      fill
                      className="object-cover"
                      sizes="72px"
                    />
                  </div>
                </div>
                <p className="mt-6 lg:mt-[14px]">
              Making new things feel familiar and familiar things feel new,{' '}
              <span style={{ color: 'var(--color-emphasis)' }}>Kristopher Aziabor</span> is a design
              engineer tracing origins, elevating minimalism, and creating traditions of love and
              exploration.
            </p>
            <p style={{ marginTop: '20px' }}>
              After graduating from Yale University, he now works as a UI/UX Design Analyst in{' '}
              <a
                href="https://www.goldmansachs.com"
                target="_blank"
                rel="noopener noreferrer"
                className="whitespace-normal"
              >
                <Image
                  src="/gen3/goldman-sachs.svg"
                  alt=""
                  width={15}
                  height={15}
                  unoptimized
                  className="inline-block align-[-2px]"
                  style={{ borderRadius: '2px', marginRight: '5px' }}
                />
                Goldman Sachs&apos;s
              </a>{' '}
              Asset and Wealth Management division.
            </p>
              </div>
            </motion.aside>

            {gen3Items.map((item, i) => {
            const isVideo = item.media.type === 'vimeo';
            const isExpanded = expandedId === item.id;
            return (
              <motion.article
                key={item.id}
                className="flex w-full shrink-0 flex-col lg:w-[var(--card-w)]"
                style={{
                  ['--card-w' as string]: `${CARD_WIDTH}px`,
                  ['--media-w' as string]: `${item.media.thumbWidth}px`,
                }}
                {...fadeUp(2 + i)}
              >
                {/* Dimming is applied per media item (not on this row) so extras
                    still fade when this card's own video expands. */}
                <div className="lg:flex lg:h-[var(--media-row-h)] lg:items-end">
                  <div className="flex w-full items-end gap-3">
                    <CardMedia
                      item={item}
                      expanded={isExpanded}
                      onToggle={
                        isVideo
                          ? () => setExpandedId(isExpanded ? null : item.id)
                          : undefined
                      }
                      shouldReduceMotion={shouldReduceMotion ?? false}
                      dimmed={anyExpanded && !isExpanded}
                    />
                    {item.extraMedia?.map((extra, mi) => (
                      <div
                        key={mi}
                        className="contents"
                        style={{ ['--media-w' as string]: `${extra.thumbWidth}px` }}
                      >
                        <CardMedia
                          item={{ ...item, media: extra }}
                          expanded={false}
                          shouldReduceMotion={shouldReduceMotion ?? false}
                          dimmed={anyExpanded}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div style={dimStyle(anyExpanded)}>
                  <h2 style={{ marginTop: '14px', fontSize: '15px', fontWeight: 400 }}>
                    {item.href ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        // Classes (not inline style) so the terracotta hover can win
                        className="text-[color:var(--color-emphasis)] hover:text-[color:var(--color-interactive)]"
                      >
                        {item.title}
                      </a>
                    ) : (
                      <span style={{ color: 'var(--color-emphasis)' }}>{item.title}</span>
                    )}
                    {item.date && <span>, {item.date}</span>}
                  </h2>
                  {item.description.map((paragraph, pi) => (
                    <p
                      key={pi}
                      className="whitespace-pre-line"
                      style={{ marginTop: pi === 0 ? '14px' : '20px' }}
                    >
                      {renderWithLinks(paragraph)}
                    </p>
                  ))}
                </div>
              </motion.article>
            );
          })}
          </div>

          {/* Soft edge fades over the strip (lg+). Each side only shows while more
              content exists in that direction, and both hide while a video is open. */}
          <div
            aria-hidden
            className="hidden lg:block absolute inset-y-0 left-0 pointer-events-none"
            style={{
              width: EDGE_FADE_WIDTH,
              background: 'linear-gradient(to right, var(--color-background), transparent)',
              opacity: atStart || anyExpanded ? 0 : 1,
              transition: shouldReduceMotion ? undefined : 'opacity 300ms ease-out',
            }}
          />
          <div
            aria-hidden
            className="hidden lg:block absolute inset-y-0 right-0 pointer-events-none"
            style={{
              width: EDGE_FADE_WIDTH,
              background: 'linear-gradient(to left, var(--color-background), transparent)',
              opacity: atEnd || anyExpanded ? 0 : 1,
              transition: shouldReduceMotion ? undefined : 'opacity 300ms ease-out',
            }}
          />
        </div>
      </main>

      {/* Footer — Archive / Photo / email sit at the bottom on every breakpoint */}
      <motion.footer className="px-6 pb-8 md:px-[72px]" {...fadeUp(5)}>
        <LinkRow className="flex flex-wrap items-baseline gap-5 lg:gap-6" dimmed={anyExpanded} />
      </motion.footer>

      {/* Click anywhere — including the video itself — closes the expanded state */}
      {anyExpanded && (
        <div
          className="fixed inset-0 z-40 cursor-pointer"
          onClick={() => setExpandedId(null)}
          aria-hidden
        />
      )}
    </div>
  );
}
