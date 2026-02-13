'use client';

import Link from 'next/link';

interface EndTeaserProps {
  nextTitle: string;
  nextSlug: string;
  vimeoId: string;
}

export function EndTeaser({ nextTitle, nextSlug, vimeoId }: EndTeaserProps) {
  const embedUrl = `https://player.vimeo.com/video/${vimeoId}?background=1&autoplay=1&loop=1&muted=1`;

  return (
    <div className="grid grid-cols-[1fr_1fr] gap-[var(--space-6)] p-[var(--space-6)]">
      <div className="flex flex-col justify-center">
        <h2 className="text-content text-xl font-normal mb-[var(--space-2)]">
          The Next Case Study
        </h2>
        <p className="text-content text-base leading-[var(--leading-body)] mb-[var(--space-2)]">
          {nextTitle}
        </p>
        <Link
          href={`/work/${nextSlug}`}
          className="text-interactive text-base leading-[var(--leading-body)] hover:opacity-70 transition-opacity duration-[var(--duration-default)]"
        >
          View {nextTitle} →
        </Link>
      </div>
      <div
        className="relative w-full min-h-0"
        style={{ aspectRatio: '16 / 9' }}
      >
        <iframe
          src={embedUrl}
          title={`Teaser for ${nextTitle}`}
          className="absolute inset-0 w-full h-full border-0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
