/**
 * Map academy video filenames (from content/academy/index.mdx) to Vimeo video IDs.
 * Add each video's Vimeo ID here (the numeric ID from the video URL, e.g. 123456789).
 * Videos are embedded with autoplay, loop, mute, and no player controls (background mode).
 */
export const ACADEMY_VIDEO_VIMEO_IDS: Record<string, string> = {
  'Hillhouse.mp4': '1160310741',
  'ColorPractice.mp4': '1160310724',
  'Chesnutt.mp4': '1160310714',
  'YVA.mp4': '1160310782',
  'Neojazz.mp4': '1160310772',
  'JasmineRoss.mp4': '1160310757',
};

export function getVimeoIdForAcademyVideo(filename: string): string | undefined {
  const id = ACADEMY_VIDEO_VIMEO_IDS[filename];
  return id && id.trim() ? id : undefined;
}
