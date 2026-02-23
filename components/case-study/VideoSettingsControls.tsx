'use client';

import { useRef, useEffect, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import Player from '@vimeo/player';

const MUTED_PREFERENCE_KEY = 'case-study-video-muted';

function getPreferMuted(): boolean {
  if (typeof window === 'undefined') return true;
  return sessionStorage.getItem(MUTED_PREFERENCE_KEY) !== 'false';
}

function setPreferMuted(muted: boolean): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(MUTED_PREFERENCE_KEY, muted ? 'true' : 'false');
}

function formatMMSS(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export interface VideoSettingsControlsHandle {
  togglePlayPause: () => void;
}

interface VideoSettingsControlsProps {
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  hasAudio: boolean;
  iframeReady?: boolean;
  onPausedChange?: (paused: boolean) => void;
}

export const VideoSettingsControls = forwardRef<VideoSettingsControlsHandle, VideoSettingsControlsProps>(
  function VideoSettingsControls({ iframeRef, hasAudio, iframeReady = true, onPausedChange }, ref) {
  const playerRef = useRef<Player | null>(null);
  const viewportPlayTriggeredAt = useRef<number>(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [paused, setPaused] = useState(true);
  const [muted, setMuted] = useState(true);

  const setPausedAndNotify = useCallback((value: boolean) => {
    setPaused(value);
    onPausedChange?.(value);
  }, [onPausedChange]);

  const togglePlayPause = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    if (paused) {
      setPausedAndNotify(false);
      p.play().catch(() => setPausedAndNotify(true));
    } else {
      setPausedAndNotify(true);
      p.pause().catch(() => setPausedAndNotify(false));
    }
  }, [paused, setPausedAndNotify]);

  useImperativeHandle(ref, () => ({ togglePlayPause }), [togglePlayPause]);

  useEffect(() => {
    if (!iframeReady) return;
    const iframe = iframeRef.current;
    if (!iframe) return;

    const player = new Player(iframe);
    playerRef.current = player;

    const onTimeUpdate = (data: { seconds: number }) => setCurrentTime(data.seconds);
    const onDurationChange = (data: { duration: number }) => setDuration(data.duration);
    const onPlay = () => setPausedAndNotify(false);
    const onPause = () => {
      const justTriggeredPlay = Date.now() - viewportPlayTriggeredAt.current < 2000;
      if (justTriggeredPlay) {
        player.play().catch(() => setPausedAndNotify(true));
      } else {
        setPausedAndNotify(true);
      }
    };
    const onVolumeChange = (data: { muted: boolean }) => setMuted(data.muted);

    player.on('timeupdate', onTimeUpdate);
    player.on('durationchange', onDurationChange);
    player.on('play', onPlay);
    player.on('pause', onPause);
    player.on('volumechange', onVolumeChange);

    player.getDuration().then(setDuration).catch(() => {});
    player.getCurrentTime().then(setCurrentTime).catch(() => {});
    player.getPaused().then((p) => { setPaused(p); onPausedChange?.(p); }).catch(() => {});

    const preferMuted = hasAudio ? getPreferMuted() : true;
    setMuted(preferMuted);
    player.setMuted(preferMuted).catch(() => {});

    player.setLoop(true);

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        viewportPlayTriggeredAt.current = Date.now();
        setPausedAndNotify(false);
        player.play().catch(() => setPausedAndNotify(true));
      },
      { threshold: 1 }
    );
    observer.observe(iframe);

    return () => {
      observer.disconnect();
      player.off('timeupdate', onTimeUpdate);
      player.off('durationchange', onDurationChange);
      player.off('play', onPlay);
      player.off('pause', onPause);
      player.off('volumechange', onVolumeChange);
      playerRef.current = null;
    };
  }, [iframeRef, iframeReady, hasAudio, onPausedChange]);

  const handleRestart = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    p.setCurrentTime(0).then(() => p.play().catch(() => {})).catch(() => {});
  }, []);

  const handleMuteUnmute = useCallback(() => {
    const newMuted = !muted;
    setMuted(newMuted);
    setPreferMuted(newMuted);
    playerRef.current?.setMuted(newMuted).catch(() => {});
  }, [muted]);

  const controlsStyle = {
    fontFamily: 'var(--font-lector)',
    fontSize: '15px',
    lineHeight: 'var(--leading-body)',
    letterSpacing: 'var(--tracking-body)',
    color: 'var(--color-metadata)',
    paddingTop: 'var(--space-1)',
  } as const;

  return (
    <div style={controlsStyle} className="font-normal not-italic">
      <div style={{ marginBottom: 'var(--space-1)' }}>
        {formatMMSS(currentTime)} of {formatMMSS(duration)}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)', alignItems: 'center' }}>
        <button
          type="button"
          onClick={togglePlayPause}
          style={{ color: 'var(--color-content)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit' }}
          className="hover:opacity-70 transition-opacity"
        >
          {paused ? 'Play' : 'Pause'}
        </button>
        <button
          type="button"
          onClick={handleRestart}
          style={{ color: 'var(--color-content)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit' }}
          className="hover:opacity-70 transition-opacity"
        >
          Restart
        </button>
        {hasAudio && (
          <button
            type="button"
            onClick={handleMuteUnmute}
            style={{ color: 'var(--color-content)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit' }}
            className="hover:opacity-70 transition-opacity"
          >
            {muted ? 'Unmute' : 'Mute'}
          </button>
        )}
      </div>
    </div>
  );
});
