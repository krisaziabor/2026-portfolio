'use client';

import { useEffect, useRef } from 'react';

interface AcademyVideoProps {
  src: string;
  alt: string;
  caption?: string;
}

export default function AcademyVideo({ src, alt, caption }: AcademyVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {
              // Autoplay failed, likely due to browser policies
            });
          } else {
            video.pause();
          }
        });
      },
      {
        threshold: 0.5, // Trigger when 50% of video is visible
      }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="relative w-full">
      <video
        ref={videoRef}
        src={src}
        aria-label={alt}
        muted
        loop
        playsInline
        className="w-full h-auto"
      />
      {caption && (
        <p className="text-metadata text-sm mt-[var(--space-2)]">
          {caption}
        </p>
      )}
    </div>
  );
}
