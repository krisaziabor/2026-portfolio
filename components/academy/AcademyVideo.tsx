'use client';

import { useEffect, useRef } from 'react';

interface AcademyVideoProps {
  /** Public file path (e.g. /academy/Hillhouse.mp4); used when vimeoId is not set */
  src?: string;
  /** Vimeo video ID; when set, uses Vimeo embed (autoplay, loop, mute, no controls) */
  vimeoId?: string;
  alt: string;
  caption?: string;
}

export default function AcademyVideo({ src, vimeoId, alt, caption }: AcademyVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || vimeoId) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [vimeoId, src]);

  const useVimeo = Boolean(vimeoId?.trim());

  if (useVimeo) {
    const embedUrl = `https://player.vimeo.com/video/${vimeoId}?background=1`;
    return (
      <div
        className="relative flex flex-col items-center justify-center min-w-0 min-h-0"
        style={{
          aspectRatio: '16 / 9',
          width: '100%',
          maxWidth: '100%',
          maxHeight: '100%',
        }}
      >
        <iframe
          src={embedUrl}
          title={alt}
          className="absolute inset-0 w-full h-full"
          style={{ border: 'none' }}
          allow="autoplay; fullscreen; picture-in-picture"
        />
        {caption && (
          <p className="text-metadata text-sm mt-[var(--space-2)] relative z-10">{caption}</p>
        )}
      </div>
    );
  }

  if (!src) return null;

  return (
    <div
      className="relative w-full h-full flex items-center justify-center"
      style={{ maxWidth: '100%', maxHeight: '100%' }}
    >
      <video
        ref={videoRef}
        src={src}
        aria-label={alt}
        muted
        loop
        playsInline
        className="object-contain"
        style={{ maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto' }}
      />
      {caption && (
        <p className="text-metadata text-sm mt-[var(--space-2)]">{caption}</p>
      )}
    </div>
  );
}
