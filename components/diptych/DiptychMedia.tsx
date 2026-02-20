'use client';

import Image from 'next/image';
import type { DiptychMedia } from '@/types/case-study';
import { resolveCaseStudyImageSrc } from '@/lib/case-study-assets';

/** Normalize aspect ratio string (e.g. "16/9") for CSS aspect-ratio. */
function toAspectRatioCss(value: string | undefined): string | undefined {
  if (!value || typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed.replace('/', ' / ') : undefined;
}

interface DiptychMediaProps {
  media: DiptychMedia;
  /** When set, image src is resolved to /work/{caseStudySlug}/{src} for short names. */
  caseStudySlug?: string;
}

export function DiptychMediaRenderer({ media, caseStudySlug }: DiptychMediaProps) {
  if (media.type === 'image') {
    const resolvedSrc =
      caseStudySlug != null
        ? resolveCaseStudyImageSrc(caseStudySlug, media.src ?? '')
        : media.src ?? '';
    const isValid = resolvedSrc && (resolvedSrc.startsWith('/') || resolvedSrc.startsWith('http'));
    const aspectRatioCss = toAspectRatioCss(media.aspectRatio);
    // Wrapper fills the media cell; inner (when aspectRatio set) is the largest box with that ratio that fits, so the image maximizes without cropping.
    const innerStyle = aspectRatioCss
      ? { aspectRatio: aspectRatioCss, width: '100%' as const, height: '100%' as const, maxWidth: '100%', maxHeight: '100%' }
      : undefined;
    return (
      <div className="relative w-full h-full min-h-0 flex items-center justify-center">
        <div
          className="relative w-full h-full min-h-0"
          style={innerStyle}
        >
          {isValid ? (
            <Image
              src={resolvedSrc}
              alt={media.alt}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="absolute inset-0 bg-[#E5E5E5]" aria-hidden />
          )}
        </div>
      </div>
    );
  }

  if (media.type === 'video') {
    const isBackground = !media.hasAudio;
    const embedParams = isBackground
      ? 'background=1&autoplay=1&loop=1&muted=1'
      : '';

    const embedUrl = `https://player.vimeo.com/video/${media.vimeoId}?${embedParams}`;
    const aspectRatioCss = toAspectRatioCss(media.aspectRatio) ?? '16 / 9';

    return (
      <div
        className="relative w-full h-full min-h-0 flex items-center justify-center"
        style={{ width: '100%', height: '100%', maxWidth: '100%', maxHeight: '100%', aspectRatio: aspectRatioCss }}
      >
        <iframe
          src={embedUrl}
          title="Video"
          className="absolute inset-0 w-full h-full border-0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return null;
}
