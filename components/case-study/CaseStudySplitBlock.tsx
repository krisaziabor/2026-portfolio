'use client';

import ReactMarkdown from 'react-markdown';
import { useRef, useState, type ReactNode } from 'react';
import type { CaseStudySplitBlock as SplitBlockProps } from '@/types/case-study';
import { VideoSettingsControls, type VideoSettingsControlsHandle } from './VideoSettingsControls';
import { VideoOverlay } from './VideoOverlay';

function getHeadingText(children: ReactNode): string {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) return children.map(getHeadingText).join('');
  return '';
}

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

const proseClasses =
  'prose prose-sm max-w-none font-[family-name:var(--font-lector)] lector-font [&_a]:text-interactive [&_a]:no-underline [&_a:hover]:opacity-70 [&_a]:transition-opacity [&_a]:duration-[var(--duration-default)] [&_p]:mb-[var(--space-2)] [&_p]:last-child:mb-0 [&_p]:max-w-full [&_h2]:mt-[var(--space-2)] [&_h2]:mb-[var(--space-2)] [&_h2]:font-normal [&_ul]:my-[var(--space-2)] [&_li]:mb-1';

export function CaseStudySplitBlock({ block }: { block: SplitBlockProps }) {
  const { side, media, content } = block;
  const isMediaLeft = side === 'left';
  const videoIframeRef = useRef<HTMLIFrameElement | null>(null);
  const videoControlsRef = useRef<VideoSettingsControlsHandle | null>(null);
  const [videoIframeReady, setVideoIframeReady] = useState(false);
  const [videoPaused, setVideoPaused] = useState(true);

  const captionStyle = {
    fontFamily: 'var(--font-lector)',
    fontStyle: 'italic' as const,
    fontSize: '13px',
    lineHeight: 'var(--leading-body)',
    letterSpacing: 'var(--tracking-body)',
    color: 'var(--color-metadata)',
    paddingTop: 'var(--space-1)',
  };

  const mediaNode = (
    <figure className="min-w-0 flex flex-col" style={{ margin: 0 }}>
      {media.type === 'image' ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={media.src}
            alt={media.alt ?? ''}
            className="w-full h-auto object-contain block"
            style={{ display: 'block' }}
          />
          {media.alt ? (
            <figcaption style={captionStyle}>{media.alt}</figcaption>
          ) : null}
        </>
      ) : (
        <>
          <div
            className="relative w-full"
            style={{
              aspectRatio: '16 / 9',
              ...(media.backgroundColor != null ? { backgroundColor: media.backgroundColor } : {}),
            }}
          >
            {(() => {
              const hasAudio = media.hasAudio ?? false;
              const embedParams = new URLSearchParams({
                ...(hasAudio ? { muted: '0' } : { background: '1', autoplay: '1', loop: '1', muted: '1' }),
                ...(media.posterTime != null && hasAudio ? { t: String(media.posterTime) } : {}),
                ...(media.showVideoSettings ? { controls: '0' } : {}),
              });
              const embedUrl = `https://player.vimeo.com/video/${media.vimeoId}?${embedParams}`;
              const videoInnerStyle =
                media.backgroundColor != null
                  ? {
                      position: 'absolute' as const,
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '75%',
                      height: '75%',
                    }
                  : { position: 'absolute' as const, inset: 0 };
              return (
                <>
                  <div style={videoInnerStyle}>
                    <iframe
                      ref={videoIframeRef}
                      src={embedUrl}
                      title={media.alt ?? ''}
                      className="absolute inset-0 w-full h-full"
                      allow={hasAudio ? 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope' : 'autoplay; fullscreen; picture-in-picture'}
                      allowFullScreen
                      onLoad={() => setVideoIframeReady(true)}
                    />
                  </div>
                  {media.showVideoSettings ? (
                    <VideoOverlay paused={videoPaused} onToggle={() => videoControlsRef.current?.togglePlayPause()} />
                  ) : null}
                </>
              );
            })()}
          </div>
          {(media.alt || media.showVideoSettings) ? (
            <figcaption style={captionStyle}>
              {media.alt}
              {media.showVideoSettings ? (
                <VideoSettingsControls
                  ref={videoControlsRef}
                  iframeRef={videoIframeRef}
                  hasAudio={media.hasAudio ?? false}
                  iframeReady={videoIframeReady}
                  onPausedChange={setVideoPaused}
                />
              ) : null}
            </figcaption>
          ) : null}
        </>
      )}
    </figure>
  );

  const textNode = (
    <div
      className={`min-w-0 flex items-center ${proseClasses}`}
      style={{
        fontSize: '15px',
        lineHeight: 'var(--leading-body)',
        letterSpacing: 'var(--tracking-body)',
        color: 'var(--color-content)',
      }}
    >
      <div className="w-full">
        <ReactMarkdown
          components={{
            h2: ({ children }) => {
              const text = getHeadingText(children);
              const id = slugifyHeading(text) || 'section';
              return (
                <h2 id={id} className="scroll-mt-6" style={{ color: 'var(--color-metadata)' }}>
                  {children}
                </h2>
              );
            },
            a: ({ href, children }) => (
              <a href={href} style={{ color: 'var(--color-interactive)' }}>
                {children}
              </a>
            ),
            strong: ({ children }) => (
              <strong className="font-normal">{children}</strong>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );

  return (
    <div
      className="grid items-center my-[var(--space-4)] w-full"
      style={{
        gridTemplateColumns: '1fr 1fr',
        gap: 'var(--space-3)',
      }}
    >
      {isMediaLeft ? (
        <>
          {mediaNode}
          {textNode}
        </>
      ) : (
        <>
          {textNode}
          {mediaNode}
        </>
      )}
    </div>
  );
}
