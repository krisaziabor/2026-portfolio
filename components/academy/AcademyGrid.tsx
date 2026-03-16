'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { AcademyItem, AcademyContentBlock } from '@/lib/content';

const EASE: [number, number, number, number] = [0.19, 1, 0.22, 1];
const GAP = 'var(--space-3)';
const DIVIDER = '#dbd8d8';

// ─── Data model ──────────────────────────────────────────────────────────────

type SoloUnit  = { kind: 'solo';  item: AcademyItem; originalIdx: number };
type GroupUnit = { kind: 'group'; items: AcademyItem[]; originalIndices: number[]; groupId: string; label: string };
type RenderUnit = SoloUnit | GroupUnit;

function buildRenderUnits(items: AcademyItem[]): RenderUnit[] {
  const seen = new Set<string>();
  const units: RenderUnit[] = [];

  items.forEach((item, idx) => {
    if (!item.group) {
      units.push({ kind: 'solo', item, originalIdx: idx });
      return;
    }
    if (seen.has(item.group)) return;
    seen.add(item.group);

    const members: { item: AcademyItem; idx: number }[] = [];
    items.forEach((it, i) => { if (it.group === item.group) members.push({ item: it, idx: i }); });

    units.push({
      kind: 'group',
      items: members.map(m => m.item),
      originalIndices: members.map(m => m.idx),
      groupId: item.group,
      label: members.find(m => m.item.groupLabel)?.item.groupLabel ?? item.group,
    });
  });

  return units;
}

function groupClasses(size: number): { wrapper: string; inner: string } {
  if (size >= 3) return {
    wrapper: 'col-span-1 sm:col-span-2 lg:col-span-3',
    inner:   'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  };
  return {
    wrapper: 'col-span-1 sm:col-span-2',
    inner:   'grid grid-cols-1 sm:grid-cols-2',
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseItalics(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /\*([^*]+)\*/g;
  let lastIndex = 0;
  let match;
  let keyCounter = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    parts.push(<em key={`italic-${keyCounter++}`}>{match[1]}</em>);
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts.length > 0 ? parts : [text];
}

function getFirstMediaBlock(blocks: AcademyContentBlock[]): AcademyContentBlock | null {
  return blocks.find(b => b.type === 'image' || b.type === 'photo' || b.type === 'video') ?? null;
}

// ─── Video sub-components ────────────────────────────────────────────────────

function GridVideo({ src, alt }: { src: string; alt: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { video.currentTime = 0; video.play().catch(() => {}); }
        else video.pause();
      }),
      { threshold: 0.25 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [src]);

  return (
    <video
      ref={videoRef} src={src} muted loop playsInline
      style={{ width: '100%', height: 'auto', maxHeight: '300px', objectFit: 'contain', display: 'block' }}
      aria-label={alt}
    />
  );
}

function GridVimeo({ vimeoId, title }: { vimeoId: string; title: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef    = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const iframe    = iframeRef.current;
    if (!container || !iframe) return;

    const send = (method: string, value?: number) =>
      iframe.contentWindow?.postMessage(
        JSON.stringify(value !== undefined ? { method, value } : { method }),
        'https://player.vimeo.com'
      );

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { send('seekTo', 0); send('play'); }
        else send('pause');
      }),
      { threshold: 0.25 }
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, [vimeoId]);

  return (
    <div ref={containerRef} style={{ position: 'relative', aspectRatio: '16 / 9', overflow: 'hidden' }}>
      <iframe
        ref={iframeRef}
        src={`https://player.vimeo.com/video/${vimeoId}?background=1`}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
        allow="autoplay; fullscreen; picture-in-picture"
        title={title}
      />
    </div>
  );
}

// ─── Cell ─────────────────────────────────────────────────────────────────────

interface CellProps {
  item: AcademyItem;
  originalIdx: number;
  delayIdx: number;
  /** Opacity for solo cells; group cells' opacity is controlled by their wrapper. */
  opacity: number;
  isInGroup: boolean;
  onMouseEnter: () => void;
  shouldReduceMotion: boolean;
}

function AcademyCell({ item, originalIdx, delayIdx, opacity, isInGroup, onMouseEnter, shouldReduceMotion }: CellProps) {
  const mediaBlock = getFirstMediaBlock(item.contentBlocks);
  const href = item.link
    ? (item.link.startsWith('http') ? item.link : `https://${item.link}`)
    : undefined;

  const media = mediaBlock ? (
    // No fixed height — natural aspect ratio up to 300px cap.
    // object-fit: contain so nothing is cropped; letterbox space shows #f5f5f5 background.
    <div style={{ lineHeight: 0, backgroundColor: '#f5f5f5' }}>
      {(mediaBlock.type === 'image' || mediaBlock.type === 'photo') && mediaBlock.src && (
        href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
            <Image
              src={mediaBlock.src} alt={mediaBlock.alt || item.title}
              width={800} height={600}
              style={{ width: '100%', height: 'auto', maxHeight: '300px', objectFit: 'contain', display: 'block' }}
            />
          </a>
        ) : (
          <Image
            src={mediaBlock.src} alt={mediaBlock.alt || item.title}
            width={800} height={600}
            style={{ width: '100%', height: 'auto', maxHeight: '300px', objectFit: 'contain', display: 'block' }}
          />
        )
      )}

      {mediaBlock.type === 'video' && mediaBlock.vimeoId && (
        href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
            <GridVimeo vimeoId={mediaBlock.vimeoId} title={mediaBlock.alt || item.title} />
          </a>
        ) : (
          <GridVimeo vimeoId={mediaBlock.vimeoId} title={mediaBlock.alt || item.title} />
        )
      )}

      {mediaBlock.type === 'video' && !mediaBlock.vimeoId && mediaBlock.src && (
        href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
            <GridVideo src={mediaBlock.src} alt={mediaBlock.alt || item.title} />
          </a>
        ) : (
          <GridVideo src={mediaBlock.src} alt={mediaBlock.alt || item.title} />
        )
      )}
    </div>
  ) : null;

  return (
    <motion.div
      key={originalIdx}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: EASE, delay: shouldReduceMotion ? 0 : Math.min(delayIdx * 0.05, 0.3) }}
    >
      <div
        onMouseEnter={onMouseEnter}
        style={{
          // Solo cells carry their own border and opacity.
          // Group cells are borderless — the wrapper provides the card border.
          border: isInGroup ? 'none' : `1px solid ${DIVIDER}`,
          opacity: isInGroup ? 1 : opacity,
          transition: isInGroup ? undefined : 'opacity 300ms ease-out',
          backgroundColor: 'white',
          cursor: href ? 'pointer' : undefined,
        }}
      >
        {media}

        <div style={{ padding: '10px 12px', lineHeight: 'var(--leading-body)' }}>
          {href ? (
            <a href={href} target="_blank" rel="noopener noreferrer"
              style={{ display: 'block', fontSize: '15px', color: 'var(--color-interactive)', letterSpacing: 'var(--tracking-body)', lineHeight: 'var(--leading-body)', whiteSpace: 'normal' }}>
              {parseItalics(item.title)}
            </a>
          ) : (
            <span style={{ display: 'block', fontSize: '15px', color: 'var(--color-content)', letterSpacing: 'var(--tracking-body)', lineHeight: 'var(--leading-body)' }}>
              {parseItalics(item.title)}
            </span>
          )}
          {item.date && (
            <span style={{ display: 'block', fontSize: '13px', color: 'var(--color-metadata)', letterSpacing: 'var(--tracking-body)', marginTop: '2px' }}>
              {item.date}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main grid ────────────────────────────────────────────────────────────────

export default function AcademyGrid({ items }: { items: AcademyItem[] }) {
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);
  const [hoveredSolo,  setHoveredSolo]  = useState<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const isHovering = hoveredSolo !== null || hoveredGroup !== null;
  const units = buildRenderUnits(items);

  function getCellOpacity(idx: number, item: AcademyItem): number {
    if (!isHovering) return 1;
    if (hoveredSolo  !== null) return idx === hoveredSolo ? 1 : 0.4;
    if (hoveredGroup !== null) return item.group === hoveredGroup ? 1 : 0.4;
    return 1;
  }

  function handleCellEnter(idx: number, item: AcademyItem) {
    if (item.group) { setHoveredGroup(item.group); setHoveredSolo(null);  }
    else            { setHoveredSolo(idx);          setHoveredGroup(null); }
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full"
      style={{ gap: GAP }}
      onMouseLeave={() => { setHoveredSolo(null); setHoveredGroup(null); }}
    >
      {units.map((unit, unitIdx) => {

        // ── Solo ────────────────────────────────────────────────────────────
        if (unit.kind === 'solo') {
          return (
            <AcademyCell
              key={unit.originalIdx}
              item={unit.item}
              originalIdx={unit.originalIdx}
              delayIdx={unitIdx}
              opacity={getCellOpacity(unit.originalIdx, unit.item)}
              isInGroup={false}
              onMouseEnter={() => handleCellEnter(unit.originalIdx, unit.item)}
              shouldReduceMotion={shouldReduceMotion ?? false}
            />
          );
        }

        // ── Group card ──────────────────────────────────────────────────────
        const { wrapper, inner } = groupClasses(unit.items.length);
        // All group items share the same opacity — compute once from first item.
        const groupOpacity = getCellOpacity(unit.originalIndices[0], unit.items[0]);
        const isGroupActive = hoveredGroup === unit.groupId;

        return (
          // outer: entrance animation only — always resolves to opacity 1
          <motion.div
            key={unit.groupId}
            className={`${wrapper} academy-group-wrapper`}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE, delay: shouldReduceMotion ? 0 : Math.min(unitIdx * 0.05, 0.3) }}
          >
            {/* inner: hover opacity + card border — uses CSS transition for 300ms hover response */}
            <div style={{
              border: `1px solid ${DIVIDER}`,
              boxShadow: isGroupActive ? 'inset 3px 0 0 var(--color-interactive)' : 'none',
              opacity: groupOpacity,
              transition: 'opacity 300ms ease-out, box-shadow 300ms ease-out',
            }}>
              {/* Cells side-by-side; 1px gap + background acts as divider lines */}
              <div className={inner} style={{ gap: '1px', backgroundColor: DIVIDER }}>
                {unit.items.map((item, i) => (
                  <AcademyCell
                    key={unit.originalIndices[i]}
                    item={item}
                    originalIdx={unit.originalIndices[i]}
                    delayIdx={unitIdx + i}
                    opacity={1}
                    isInGroup
                    onMouseEnter={() => handleCellEnter(unit.originalIndices[i], item)}
                    shouldReduceMotion={shouldReduceMotion ?? false}
                  />
                ))}
              </div>

              {/* Group label — inside the card, below the cells */}
              <div style={{
                padding: '10px 12px',
                borderTop: `1px solid ${DIVIDER}`,
                fontSize: '13px',
                color: 'var(--color-metadata)',
                letterSpacing: 'var(--tracking-body)',
              }}>
                {parseItalics(unit.label)}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
