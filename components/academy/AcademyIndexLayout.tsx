'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { AcademyItem, AcademyContentBlock } from '@/lib/content';
import SiteHeader from '@/components/navigation/SiteHeader';

// ─── Constants ────────────────────────────────────────────────────────────────

const STRIP_HEIGHT = 56;
const GAP_RATIO    = 4;
const EASE: [number, number, number, number] = [0.19, 1, 0.22, 1];

// ─── Types ────────────────────────────────────────────────────────────────────

type VimeoMeta = { thumbUrl: string; ratio: number };

type DisplayMember = { item: AcademyItem; flatIdx: number; position: number };
type DisplayUnit   = { key: string; members: DisplayMember[]; label?: string; date?: string };
type ThumbGroup    = { groupId: string | null; items: { item: AcademyItem; flatIdx: number }[] };

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseItalics(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /\*([^*]+)\*/g;
  let lastIndex = 0, match, k = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    parts.push(<em key={k++}>{match[1]}</em>);
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts.length > 0 ? parts : [text];
}

function getFirstMediaBlock(blocks: AcademyContentBlock[]): AcademyContentBlock | null {
  return blocks.find(b => b.type === 'image' || b.type === 'photo' || b.type === 'video' || b.type === 'text') ?? null;
}

// ─── Data builders ────────────────────────────────────────────────────────────

function getDisplayUnit(items: AcademyItem[], currentIdx: number): DisplayUnit {
  const current = items[currentIdx];
  if (!current.group || current.showSolo) {
    return {
      key: `solo-${currentIdx}`,
      members: [{ item: current, flatIdx: currentIdx, position: 0 }],
      date: current.date,
    };
  }
  const members: DisplayMember[] = [];
  items.forEach((it, i) => {
    if (it.group === current.group && !it.showSolo)
      members.push({ item: it, flatIdx: i, position: members.length });
  });
  return {
    key: `group-${current.group}`,
    members,
    label: members.find(m => m.item.groupLabel)?.item.groupLabel,
    date: current.date,
  };
}

function buildThumbGroups(items: AcademyItem[]): ThumbGroup[] {
  const groups: ThumbGroup[] = [];
  const seen = new Set<string>();
  items.forEach((item, idx) => {
    if (!item.group || item.showSolo) {
      groups.push({ groupId: null, items: [{ item, flatIdx: idx }] });
    } else if (!seen.has(item.group)) {
      seen.add(item.group);
      const members: { item: AcademyItem; flatIdx: number }[] = [];
      items.forEach((it, i) => {
        if (it.group === item.group && !it.showSolo) members.push({ item: it, flatIdx: i });
      });
      groups.push({ groupId: item.group, items: members });
    }
  });
  return groups;
}

// ─── Thumbnail cell ───────────────────────────────────────────────────────────

function ThumbnailCell({
  item,
  flatIdx,
  isActive,
  thumbRef,
  onClick,
  onWidthMeasured,
  vimeoMeta,
}: {
  item: AcademyItem;
  flatIdx: number;
  isActive: boolean;
  thumbRef: (el: HTMLButtonElement | null) => void;
  onClick: () => void;
  onWidthMeasured: (idx: number, width: number) => void;
  vimeoMeta: Record<string, VimeoMeta>;
}) {
  const mediaBlock = getFirstMediaBlock(item.contentBlocks);
  const vimeoId    = mediaBlock?.type === 'video' ? mediaBlock.vimeoId : undefined;
  const meta       = vimeoId ? vimeoMeta[vimeoId] : undefined;

  // Report placeholder width for videos while meta is loading
  useEffect(() => {
    if (vimeoId && !meta) {
      onWidthMeasured(flatIdx, STRIP_HEIGHT * (16 / 9));
    }
  }, [vimeoId, meta, flatIdx, onWidthMeasured]);

  const btnStyle: React.CSSProperties = {
    height: `${STRIP_HEIGHT}px`,
    border: 'none', background: 'none', padding: 0,
    cursor: 'pointer', display: 'block', flexShrink: 0,
    opacity: isActive ? 1 : 0.3,
    transition: 'opacity 150ms ease-out',
  };

  // ── Vimeo thumbnail ──
  if (vimeoId) {
    if (meta?.thumbUrl) {
      return (
        <button ref={thumbRef} onClick={onClick} style={btnStyle}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={meta.thumbUrl}
            alt={item.title}
            draggable={false}
            style={{ height: '100%', width: 'auto', display: 'block' }}
            onLoad={e => {
              const img = e.currentTarget;
              onWidthMeasured(flatIdx, img.naturalWidth * (STRIP_HEIGHT / img.naturalHeight));
            }}
          />
        </button>
      );
    }
    // Still loading — placeholder at 16:9 width
    return (
      <button ref={thumbRef} onClick={onClick} style={{ ...btnStyle, width: STRIP_HEIGHT * (16 / 9) }}>
        <div style={{ width: '100%', height: '100%', backgroundColor: '#d4d0d0' }} />
      </button>
    );
  }

  // ── Image/photo thumbnail ──
  if (mediaBlock && (mediaBlock.type === 'image' || mediaBlock.type === 'photo') && mediaBlock.src) {
    return (
      <button ref={thumbRef} onClick={onClick} style={btnStyle}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={mediaBlock.src}
          alt={item.title}
          draggable={false}
          style={{ height: '100%', width: 'auto', display: 'block' }}
          onLoad={e => {
            const img = e.currentTarget;
            onWidthMeasured(flatIdx, img.naturalWidth * (STRIP_HEIGHT / img.naturalHeight));
          }}
        />
      </button>
    );
  }

  // ── Text block thumbnail ──
  if (mediaBlock?.type === 'text' && mediaBlock.content) {
    const textWidth = STRIP_HEIGHT * 2;
    useEffect(() => { onWidthMeasured(flatIdx, textWidth); }, [flatIdx, textWidth, onWidthMeasured]);
    return (
      <button ref={thumbRef} onClick={onClick} style={{ ...btnStyle, width: textWidth }}>
        <div style={{
          width: '100%', height: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'flex-start',
          padding: '0 8px', overflow: 'hidden',
          fontFamily: 'var(--font-lector)', fontSize: '9px',
          color: 'var(--color-content)', lineHeight: 1.2,
        }}>
          {mediaBlock.content.slice(0, 40)}
        </div>
      </button>
    );
  }

  // ── Fallback ──
  return (
    <button ref={thumbRef} onClick={onClick} style={{ ...btnStyle, width: STRIP_HEIGHT }}>
      <div style={{ width: '100%', height: '100%', backgroundColor: '#d4d0d0' }} />
    </button>
  );
}

// ─── Media display for main area ──────────────────────────────────────────────

function MainMedia({
  mediaBlock,
  title,
  maxWidth,
  maxHeight,
  vimeoMeta,
}: {
  mediaBlock: AcademyContentBlock;
  title: string;
  maxWidth: string;
  maxHeight: string;
  vimeoMeta: Record<string, VimeoMeta>;
}) {
  if ((mediaBlock.type === 'image' || mediaBlock.type === 'photo') && mediaBlock.src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={mediaBlock.src}
        alt={title}
        draggable={false}
        style={{ display: 'block', maxWidth, maxHeight, width: 'auto', height: 'auto' }}
      />
    );
  }

  if (mediaBlock.type === 'video' && mediaBlock.vimeoId) {
    // Use actual aspect ratio from oEmbed if available, else default to 16:9.
    // Container sized by the tighter of maxWidth or (maxHeight × ratio);
    // aspect-ratio then drives height — so the iframe exactly wraps the video.
    const ratio = vimeoMeta[mediaBlock.vimeoId]?.ratio ?? 16 / 9;
    return (
      <div style={{
        width: `min(${maxWidth}, calc(${maxHeight} * ${ratio}))`,
        aspectRatio: String(ratio),
        flexShrink: 0,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <iframe
          src={`https://player.vimeo.com/video/${mediaBlock.vimeoId}?background=1&autopause=0&dnt=1`}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none', pointerEvents: 'none' }}
          allow="autoplay; fullscreen; picture-in-picture"
          title={title}
        />
      </div>
    );
  }

  if (mediaBlock.type === 'video' && mediaBlock.src) {
    return (
      <video
        src={mediaBlock.src}
        muted loop autoPlay playsInline
        style={{ display: 'block', maxWidth, maxHeight, width: 'auto', height: 'auto' }}
      />
    );
  }

  if (mediaBlock.type === 'text' && mediaBlock.content) {
    return (
      <p style={{
        fontFamily: 'var(--font-lector)',
        fontSize: '24px',
        color: 'var(--color-content)',
        lineHeight: 1.3,
        letterSpacing: 'var(--tracking-body)',
        maxWidth,
        margin: 0,
      }}>
        {parseItalics(mediaBlock.content)}
      </p>
    );
  }

  return null;
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AcademyIndexLayout({ items }: { items: AcademyItem[] }) {
  const [currentIdx, setCurrentIdx]       = useState(0);
  const [cursorPos, setCursorPos]         = useState({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const [cursorOnRight, setCursorOnRight] = useState(true);
  const [thumbWidths, setThumbWidths]     = useState<Record<number, number>>({});
  const [containerWidth, setContainerWidth] = useState(0);
  const [vimeoMeta, setVimeoMeta]         = useState<Record<string, VimeoMeta>>({});
  const [isSmall, setIsSmall]             = useState(false);
  const [textHovered, setTextHovered]     = useState(false);
  const [textDimmed, setTextDimmed]       = useState(false);
  const [hoveredThumbGroup, setHoveredThumbGroup] = useState<string | null>(null);

  const mainAreaRef  = useRef<HTMLDivElement>(null);
  const stripRef     = useRef<HTMLDivElement>(null);
  const thumbRefs    = useRef<(HTMLButtonElement | null)[]>([]);
  const touchStartX  = useRef(0);
  const swiped       = useRef(false);
  const isFirstMount = useRef(true);
  const shouldReduceMotion = useReducedMotion();

  const total       = items.length;
  const thumbGroups = useMemo(() => buildThumbGroups(items), [items]);
  const displayUnit = getDisplayUnit(items, currentIdx);

  // ── Fetch Vimeo oEmbed metadata (thumbnail + aspect ratio) ──────────────────
  const vimeoIds = useMemo(() => {
    const ids = new Set<string>();
    items.forEach(item =>
      item.contentBlocks.forEach(b => { if (b.type === 'video' && b.vimeoId) ids.add(b.vimeoId); })
    );
    return Array.from(ids);
  }, [items]);

  useEffect(() => {
    vimeoIds.forEach(id => {
      if (vimeoMeta[id]) return; // already fetched
      fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${id}&width=400`)
        .then(r => r.json())
        .then(data => {
          if (data.thumbnail_url) {
            setVimeoMeta(prev => ({
              ...prev,
              [id]: {
                thumbUrl: data.thumbnail_url,
                ratio: data.width && data.height ? data.width / data.height : 16 / 9,
              },
            }));
          }
        })
        .catch(() => {});
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vimeoIds]);

  // ── Breakpoint ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    setIsSmall(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsSmall(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // ── Text dim: show fully on each new item, then retreat ──────────────────────
  useEffect(() => {
    setTextDimmed(false);
    const t = setTimeout(() => setTextDimmed(true), 1800);
    return () => clearTimeout(t);
  }, [displayUnit.key]);

  // ── Strip container width ────────────────────────────────────────────────────
  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => setContainerWidth(entries[0].contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ── Gap calculation ──────────────────────────────────────────────────────────
  const { innerGap, outerGap } = useMemo(() => {
    const allLoaded = items.every((_, i) => thumbWidths[i] !== undefined);
    if (!allLoaded || containerWidth <= 0) return { innerGap: 3, outerGap: 12 };
    const totalImgWidth  = items.reduce((s, _, i) => s + (thumbWidths[i] ?? 0), 0);
    const numGroups      = thumbGroups.length;
    const innerGapCount  = total - numGroups;
    const outerGapCount  = numGroups - 1;
    const available      = containerWidth - totalImgWidth;
    const totalUnits     = innerGapCount + outerGapCount * GAP_RATIO;
    if (totalUnits <= 0 || available <= 0) return { innerGap: 3, outerGap: 12 };
    const g = available / totalUnits;
    return { innerGap: g, outerGap: g * GAP_RATIO };
  }, [thumbWidths, containerWidth, items, thumbGroups, total]);

  // ── Unit-level navigation ────────────────────────────────────────────────────
  const unitStartIndices = useMemo(
    () => thumbGroups.map(g => g.items[0].flatIdx),
    [thumbGroups]
  );

  const currentUnitIdx = useMemo(() => {
    for (let i = unitStartIndices.length - 1; i >= 0; i--) {
      if (currentIdx >= unitStartIndices[i]) return i;
    }
    return 0;
  }, [currentIdx, unitStartIndices]);

  const goToNext = useCallback(() => {
    if (currentUnitIdx < unitStartIndices.length - 1)
      setCurrentIdx(unitStartIndices[currentUnitIdx + 1]);
  }, [currentUnitIdx, unitStartIndices]);

  const goToPrev = useCallback(() => {
    if (currentUnitIdx > 0)
      setCurrentIdx(unitStartIndices[currentUnitIdx - 1]);
  }, [currentUnitIdx, unitStartIndices]);

  // ── Scroll active thumb into view ────────────────────────────────────────────
  useEffect(() => {
    thumbRefs.current[currentIdx]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [currentIdx]);

  // ── Keyboard navigation ──────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); goToNext(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); goToPrev(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goToNext, goToPrev]);

  // ── Pointer / touch handlers ─────────────────────────────────────────────────
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
    const rect = mainAreaRef.current?.getBoundingClientRect();
    if (rect) setCursorOnRight(e.clientX >= rect.left + rect.width / 2);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    swiped.current = false;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) < 40) return;
    swiped.current = true;
    if (dx < 0) goToNext(); else goToPrev();
  }, [goToNext, goToPrev]);

  const handleMainClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (swiped.current) { swiped.current = false; return; }
    const rect = mainAreaRef.current?.getBoundingClientRect();
    if (!rect) return;
    if (e.clientX >= rect.left + rect.width / 2) goToNext(); else goToPrev();
  }, [goToNext, goToPrev]);

  const handleWidthMeasured = useCallback((idx: number, width: number) => {
    setThumbWidths(prev => ({ ...prev, [idx]: width }));
  }, []);

  if (total === 0) return null;

  const canGoNext    = currentUnitIdx < unitStartIndices.length - 1;
  const canGoPrev    = currentUnitIdx > 0;
  const cursorActive = cursorOnRight ? canGoNext : canGoPrev;

  // Media sizing — larger now per request
  const n            = displayUnit.members.length;
  const maxItemWidth = n === 1 ? '62vw' : n === 2 ? '40vw' : '26vw';
  const maxItemHeight = '68vh';

  const SIDE_PAD   = 'clamp(16px, 6vw, 64px)';
  const BOTTOM_PAD = '96px';
  const TEXT_WIDTH = 260;
  const MEDIA_GAP  = 24;

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: '#F8F8F8' }}>
      <SiteHeader />

      <div className="flex-1 min-h-0 flex flex-col">

        {/* ── Main area ────────────────────────────────────────────── */}
        <div
          ref={mainAreaRef}
          className="flex-1 min-h-0 select-none"
          style={{
            cursor: isSmall ? 'default' : 'none',
            position: isSmall ? 'static' : 'relative',
            overflowY: isSmall ? 'auto' : 'hidden',
          }}
          onClick={handleMainClick}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setCursorVisible(true)}
          onMouseLeave={() => setCursorVisible(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {isSmall ? (
            /* ── Mobile: vertical stack ─────────────────────────── */
            <AnimatePresence mode="wait">
              <motion.div
                key={displayUnit.key}
                style={{ padding: `var(--space-4) ${SIDE_PAD} var(--space-4)` }}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? {} : { opacity: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                onAnimationStart={() => { isFirstMount.current = false; }}
              >
                {/* Media items stacked vertically */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {displayUnit.members.map(({ item, position }) => {
                    const mediaBlock = getFirstMediaBlock(item.contentBlocks);
                    if (!mediaBlock) return null;
                    return (
                      <div key={position}>
                        <MainMedia
                          mediaBlock={mediaBlock}
                          title={item.title}
                          maxWidth="100%"
                          maxHeight="55vh"
                          vimeoMeta={vimeoMeta}
                        />
                        {n > 1 && (
                          <span style={{ display: 'block', fontSize: '11px', color: 'var(--color-metadata)', marginTop: '4px' }}>
                            {position + 1}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Text below media */}
                <div style={{
                  marginTop: '16px',
                  fontFamily: 'var(--font-lector)',
                  letterSpacing: 'var(--tracking-body)',
                  lineHeight: 'var(--leading-body)',
                }}>
                  {displayUnit.label && (
                    <div style={{ marginBottom: '4px' }}>
                      {displayUnit.members.map(({ item, position }) => (
                        <div key={position} style={{ fontSize: '13px', color: 'var(--color-metadata)' }}>
                          <span style={{ marginRight: '4px' }}>({position + 1})</span>
                          {parseItalics(item.title)}
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={{ fontSize: '15px', color: 'var(--color-content)', marginBottom: '4px' }}>
                    {displayUnit.label
                      ? parseItalics(displayUnit.label)
                      : parseItalics(displayUnit.members[0]?.item.title ?? '')}
                  </div>
                  {(() => {
                    const linked = displayUnit.members.find(m => m.item.link);
                    if (!linked) return null;
                    const href = linked.item.link!.startsWith('http') ? linked.item.link! : `https://${linked.item.link}`;
                    return (
                      <a href={href} target="_blank" rel="noopener noreferrer"
                        style={{ display: 'inline-block', fontSize: '13px', color: '#000', marginTop: '2px' }}>
                        {linked.item.linkText ?? linked.item.link} ↗
                      </a>
                    );
                  })()}
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            /* ── Desktop: absolute bottom-left / bottom-right ───── */
            <>
              {/* Media cluster — bottom-left, full width (text floats over it) */}
              <div style={{
                position: 'absolute',
                bottom: BOTTOM_PAD,
                left: SIDE_PAD,
                right: SIDE_PAD,
                display: 'flex',
                alignItems: 'flex-end',
              }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={displayUnit.key}
                    style={{ display: 'flex', alignItems: 'flex-end', gap: `${MEDIA_GAP}px` }}
                    initial={shouldReduceMotion ? false : isFirstMount.current ? { opacity: 0, y: 20 } : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={shouldReduceMotion ? {} : { opacity: 0, y: -4 }}
                    transition={isFirstMount.current ? { duration: 0.75, ease: EASE } : { duration: 0.45, ease: EASE }}
                    onAnimationStart={() => { isFirstMount.current = false; }}
                  >
                    {displayUnit.members.map(({ item, position }) => {
                      const mediaBlock = getFirstMediaBlock(item.contentBlocks);
                      if (!mediaBlock) return null;
                      return (
                        <div key={position} style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', flexShrink: 0 }}>
                          <MainMedia
                            mediaBlock={mediaBlock}
                            title={item.title}
                            maxWidth={maxItemWidth}
                            maxHeight={maxItemHeight}
                            vimeoMeta={vimeoMeta}
                          />
                          {n > 1 && (
                            <span style={{
                              fontSize: '11px',
                              color: 'var(--color-metadata)',
                              letterSpacing: '0.02em',
                              lineHeight: 1,
                              paddingBottom: '3px',
                              flexShrink: 0,
                            }}>
                              {position + 1}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Text — bottom-right, hover reveal */}
              <motion.div
                onMouseEnter={() => setTextHovered(true)}
                onMouseLeave={() => setTextHovered(false)}
                onClick={e => e.stopPropagation()}
                style={{
                  position: 'absolute',
                  bottom: BOTTOM_PAD,
                  right: SIDE_PAD,
                  width: `${TEXT_WIDTH}px`,
                  fontFamily: 'var(--font-lector)',
                  letterSpacing: 'var(--tracking-body)',
                  lineHeight: 'var(--leading-body)',
                  padding: '10px 12px',
                  background: 'linear-gradient(to right, transparent, rgba(248,248,248,0.92) 38%)',
                  backdropFilter: 'blur(6px)',
                  WebkitBackdropFilter: 'blur(6px)',
                  cursor: 'default',
                }}
                animate={{ opacity: shouldReduceMotion ? 1 : (textHovered ? 1 : (textDimmed ? 0.18 : 1)) }}
                transition={{ duration: textHovered ? 0.2 : 0.6, ease: 'easeOut' }}
              >
                {displayUnit.label && (
                  <div style={{ marginBottom: '6px' }}>
                    {displayUnit.members.map(({ item, position }) => (
                      <div key={position} style={{ fontSize: '13px', color: 'var(--color-metadata)' }}>
                        <span style={{ marginRight: '4px' }}>({position + 1})</span>
                        {parseItalics(item.title)}
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ fontSize: '15px', color: 'var(--color-content)', marginBottom: '4px' }}>
                  {displayUnit.label
                    ? parseItalics(displayUnit.label)
                    : parseItalics(displayUnit.members[0]?.item.title ?? '')}
                </div>
                {(() => {
                  const linked = displayUnit.members.find(m => m.item.link);
                  if (!linked) return null;
                  const href = linked.item.link!.startsWith('http') ? linked.item.link! : `https://${linked.item.link}`;
                  return (
                    <a href={href} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'inline-block', fontSize: '13px', color: '#000', marginTop: '2px' }}>
                      {linked.item.linkText ?? linked.item.link} ↗
                    </a>
                  );
                })()}
              </motion.div>
            </>
          )}
        </div>

        {/* ── Thumbnail strip ──────────────────────────────────────── */}
        <div
          ref={stripRef}
          className="shrink-0 flex items-center overflow-x-auto scrollbar-hide"
          onClick={e => e.stopPropagation()}
          style={{ height: '72px', paddingLeft: SIDE_PAD, paddingRight: SIDE_PAD }}
        >
          {thumbGroups.map((group, gi) => (
            <div
              key={gi}
              className="flex items-center shrink-0"
              onMouseEnter={() => { if (group.groupId) setHoveredThumbGroup(group.groupId); }}
              onMouseLeave={() => setHoveredThumbGroup(null)}
            >
              {gi > 0 && <div style={{ width: outerGap, flexShrink: 0 }} />}
              {group.items.map(({ item, flatIdx }, ii) => (
                <div key={flatIdx} className="flex items-center shrink-0">
                  {ii > 0 && <div style={{ width: innerGap, flexShrink: 0 }} />}
                  <motion.div
                    className="shrink-0"
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      ease: [0.23, 1, 0.32, 1],
                      delay: shouldReduceMotion ? 0 : 0.3 + flatIdx * 0.025,
                    }}
                  >
                    <ThumbnailCell
                      item={item}
                      flatIdx={flatIdx}
                      isActive={group.items.some(m => m.flatIdx === currentIdx) || (group.groupId !== null && group.groupId === hoveredThumbGroup)}
                      thumbRef={el => { thumbRefs.current[flatIdx] = el; }}
                      onClick={() => setCurrentIdx(flatIdx)}
                      onWidthMeasured={handleWidthMeasured}
                      vimeoMeta={vimeoMeta}
                    />
                  </motion.div>
                </div>
              ))}
            </div>
          ))}
        </div>

      </div>

      {/* Custom cursor */}
      <AnimatePresence>
        {cursorVisible && (
          <motion.div
            className="fixed pointer-events-none z-50 select-none"
            style={{
              left: cursorPos.x,
              top: cursorPos.y,
              transform: 'translate(-50%, -50%)',
              fontFamily: 'var(--font-lector)',
              fontSize: '13px',
              letterSpacing: '0.03em',
              whiteSpace: 'nowrap',
              color: cursorActive ? 'rgba(64,64,64,0.85)' : 'rgba(64,64,64,0.2)',
              transition: shouldReduceMotion ? 'none' : 'color 150ms ease-out',
            }}
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={shouldReduceMotion ? {} : { opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            {currentIdx + 1} of {total}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preload adjacent items */}
      {currentIdx > 0 && (() => {
        const b = getFirstMediaBlock(items[currentIdx - 1].contentBlocks);
        return b?.src ? <img src={b.src} alt="" aria-hidden style={{ display: 'none' }} /> : null;
      })()}
      {currentIdx < total - 1 && (() => {
        const b = getFirstMediaBlock(items[currentIdx + 1].contentBlocks);
        return b?.src ? <img src={b.src} alt="" aria-hidden style={{ display: 'none' }} /> : null;
      })()}
    </div>
  );
}
