'use client';

interface VideoOverlayProps {
  paused: boolean;
  onToggle: () => void;
}

export function VideoOverlay({ paused, onToggle }: VideoOverlayProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={paused ? 'Play video' : 'Pause video'}
      className="absolute inset-0 cursor-pointer"
      style={{
        background: 'rgba(255, 255, 255, 0.35)',
        opacity: paused ? 1 : 0,
        pointerEvents: 'auto',
        transition: 'opacity var(--duration-default) var(--easing-default)',
      }}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle();
        }
      }}
    />
  );
}
