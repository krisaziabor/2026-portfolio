<<<<<<< HEAD
import HomeClient from '@/components/home/HomeClient';
import { getPhotos } from '@/lib/photos';
=======
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import SiteHeader from '@/components/navigation/SiteHeader';
import { caseStudies } from '@/content/case-studies';
import type { CaseStudyHeroMedia, CaseStudyLandingMedia } from '@/types/case-study';
import {
  vimeoCoverEmbedParams,
  vimeoCoverIframeSize,
  vimeoPlayerSrc,
} from '@/lib/vimeo-embed';

const CARD_ASPECT_RATIO = 4 / 3;

const MotionLink = motion.create(Link);

// ease-out-expo for cinematic entrances
const EASE = [0.19, 1, 0.22, 1] as const;
const DURATION = 0.85;

function renderWithMarkdown(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /\*([^*]+)\*/g;
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    parts.push(<em key={match.index}>{match[1]}</em>);
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts.length > 0 ? parts : text;
}

function HeroMedia({
  media,
  /** When true and media is video, iframe uses pointer-events: none and a click overlay so the page scrolls; click activates the video. */
  videoScrollPassthrough = false,
  videoActivated = false,
  onVideoActivate,
  onImageLoad,
}: {
  media: CaseStudyHeroMedia | CaseStudyLandingMedia;
  videoScrollPassthrough?: boolean;
  videoActivated?: boolean;
  onVideoActivate?: () => void;
  onImageLoad?: () => void;
}) {
  if (media.type === 'image') {
    return (
      <Image
        src={media.src}
        alt={media.alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 48vw"
        onLoad={onImageLoad}
      />
    );
  }
  if (media.type === 'video' && media.vimeoId) {
    const hasAudio = media.hasAudio ?? false;
    const embedUrl = vimeoPlayerSrc(
      media.vimeoId,
      vimeoCoverEmbedParams({ hasAudio })
    );
    const iframeSize = vimeoCoverIframeSize(CARD_ASPECT_RATIO);
    const allowScroll = videoScrollPassthrough && !videoActivated;
    return (
      <>
        <iframe
          src={embedUrl}
          title={media.alt}
          width={iframeSize.width}
          height={iframeSize.height}
          className="absolute inset-0 w-full h-full border-0"
          style={{ pointerEvents: allowScroll ? 'none' : 'auto' }}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
        {allowScroll && onVideoActivate && (
          <button
            type="button"
            className="absolute inset-0 w-full h-full cursor-pointer"
            style={{ zIndex: 1 }}
            onClick={onVideoActivate}
            aria-label="Interact with video"
          />
        )}
      </>
    );
  }
  return null;
}
>>>>>>> origin/main

export default function Home() {
  return <HomeClient photos={getPhotos()} />;
}
