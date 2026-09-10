/**
 * Vimeo cover/hero embeds.
 *
 * Auto quality starts on a low ABR rung (often 240p/360p) so the first
 * seconds look soft, then ramps up. Cover videos are first-paint media,
 * so we ask for HD immediately and keep a 720p floor.
 *
 * Iframe width/height attributes also matter: without them the browser
 * default is 300×150, and Vimeo keys initial thumbnail + rendition off
 * that size even when CSS later stretches the player.
 */

export const VIMEO_COVER_QUALITY = {
  initial_quality: '1080p',
  min_quality: '720p',
} as const;

const VIMEO_COVER_PIXEL_WIDTH = 1920;

export function vimeoCoverIframeSize(aspectRatio = 16 / 9): {
  width: number;
  height: number;
} {
  return {
    width: VIMEO_COVER_PIXEL_WIDTH,
    height: Math.round(VIMEO_COVER_PIXEL_WIDTH / aspectRatio),
  };
}

export function vimeoCoverEmbedParams({
  hasAudio = false,
  posterTime,
  extra,
}: {
  hasAudio?: boolean;
  posterTime?: number;
  extra?: Record<string, string>;
} = {}): URLSearchParams {
  return new URLSearchParams({
    ...(hasAudio
      ? {}
      : {
          background: '1',
          autoplay: '1',
          loop: '1',
          muted: '1',
          playsinline: '1',
        }),
    ...VIMEO_COVER_QUALITY,
    ...(posterTime != null && hasAudio ? { t: String(posterTime) } : {}),
    ...extra,
  });
}

export function vimeoPlayerSrc(vimeoId: string, params: URLSearchParams): string {
  return `https://player.vimeo.com/video/${vimeoId}?${params}`;
}
