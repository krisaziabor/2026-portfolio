'use client';

import Image from 'next/image';
import type { DiptychMedia } from '@/types/case-study';

function isValidImageSrc(src: string | undefined): boolean {
  if (!src || typeof src !== 'string' || src.trim() === '') return false;
  const s = src.trim();
  if (s.startsWith('/')) return true;
  try {
    new URL(s);
    return true;
  } catch {
    return false;
  }
}

interface DiptychMediaProps {
  media: DiptychMedia;
}

export function DiptychMediaRenderer({ media }: DiptychMediaProps) {
  if (media.type === 'image') {
    return (
      <div className="relative w-full h-full min-h-0 flex items-center justify-center">
        {isValidImageSrc(media.src) ? (
          <Image
            src={media.src!}
            alt={media.alt}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="absolute inset-0 bg-[#E5E5E5]" aria-hidden />
        )}
      </div>
    );
  }

  if (media.type === 'video') {
    const isBackground = !media.hasAudio;
    const embedParams = isBackground
      ? 'background=1&autoplay=1&loop=1&muted=1'
      : '';

    const embedUrl = `https://player.vimeo.com/video/${media.vimeoId}?${embedParams}`;

    return (
      <div
        className="relative w-full h-full min-h-0"
        style={{ aspectRatio: '16 / 9' }}
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
