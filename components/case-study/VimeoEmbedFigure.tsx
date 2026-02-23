'use client';

import { useRef, useState } from 'react';
import { VideoSettingsControls, type VideoSettingsControlsHandle } from './VideoSettingsControls';
import { VideoOverlay } from './VideoOverlay';

interface VimeoEmbedFigureProps {
  vimeoId: string;
  hasAudio: boolean;
  posterTime?: number;
  caption: string;
  showVideoSettings?: boolean;
  /** When set, video is 75% width/height centered with this color filling the rest. */
  backgroundColor?: string;
  figureStyle: React.CSSProperties;
  captionStyle: React.CSSProperties;
}

export function VimeoEmbedFigure({
  vimeoId,
  hasAudio,
  posterTime,
  caption,
  showVideoSettings = false,
  backgroundColor,
  figureStyle,
  captionStyle,
}: VimeoEmbedFigureProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const videoControlsRef = useRef<VideoSettingsControlsHandle | null>(null);
  const [iframeReady, setIframeReady] = useState(false);
  const [videoPaused, setVideoPaused] = useState(true);

  const embedParams = new URLSearchParams({
    ...(hasAudio ? { muted: '0' } : { background: '1', autoplay: '1', loop: '1', muted: '1' }),
    ...(posterTime != null && hasAudio ? { t: String(posterTime) } : {}),
    ...(showVideoSettings ? { controls: '0' } : {}),
  });
  const embedUrl = `https://player.vimeo.com/video/${vimeoId}?${embedParams}`;

  const containerStyle: React.CSSProperties = {
    aspectRatio: '16 / 9',
    ...(backgroundColor != null ? { backgroundColor } : {}),
  };
  const videoWrapperStyle: React.CSSProperties =
    backgroundColor != null
      ? {
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '75%',
          height: '75%',
        }
      : { position: 'absolute', inset: 0 };

  return (
    <figure className="block my-0" style={figureStyle}>
      <div className="relative w-full" style={containerStyle}>
        <div style={videoWrapperStyle}>
          <iframe
            ref={iframeRef}
            src={embedUrl}
            title={caption}
            className="absolute inset-0 w-full h-full"
            allow={hasAudio ? 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope' : 'autoplay; fullscreen; picture-in-picture'}
            allowFullScreen
            onLoad={() => setIframeReady(true)}
          />
        </div>
        {showVideoSettings ? (
          <VideoOverlay paused={videoPaused} onToggle={() => videoControlsRef.current?.togglePlayPause()} />
        ) : null}
      </div>
      {(caption || showVideoSettings) ? (
        <figcaption className="max-w-full md:max-w-[50%]" style={captionStyle}>
          {caption}
          {showVideoSettings ? (
            <VideoSettingsControls
              ref={videoControlsRef}
              iframeRef={iframeRef}
              hasAudio={hasAudio}
              iframeReady={iframeReady}
              onPausedChange={setVideoPaused}
            />
          ) : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
