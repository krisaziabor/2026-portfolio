/**
 * Resolves a case study image src to the full path under public.
 * Content uses short names (e.g. "Sea12-2.png"); this returns /work/{slug}/{src}.
 * If src is already absolute (starts with /) or a full URL, it is returned unchanged.
 */
export function resolveCaseStudyImageSrc(slug: string, src: string): string {
  if (!src || typeof src !== 'string') return src;
  const s = src.trim();
  if (s.startsWith('/')) return s;
  try {
    new URL(s);
    return s;
  } catch {
    // Relative to public/work/{slug}/
    return `/work/${slug}/${s}`;
  }
}
