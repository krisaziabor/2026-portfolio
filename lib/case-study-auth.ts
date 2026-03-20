/**
 * Server-only helpers for password-protected case studies.
 * Passwords are read from env: CASE_STUDY_PASSWORD_<SLUG> (slug uppercased, hyphens → underscores).
 */

const COOKIE_NAME = 'unlocked_case_studies';
const COOKIE_PATH = '/work';

/** Env key for a case study password, e.g. kensho → CASE_STUDY_PASSWORD_KENSHO */
function envKeyForSlug(slug: string): string {
  return `CASE_STUDY_PASSWORD_${slug.toUpperCase().replace(/-/g, '_')}`;
}

/** Returns the configured password for a slug, or undefined if not set. Server-only. */
export function getPasswordForSlug(slug: string): string | undefined {
  const key = envKeyForSlug(slug);
  const value = process.env[key];
  return value === undefined || value === '' ? undefined : value;
}

/** Parses the unlocked_case_studies cookie value and returns whether the slug is unlocked. */
export function isUnlocked(slug: string, cookieValue: string): boolean {
  if (!cookieValue || !slug) return false;
  const slugs = cookieValue.split(',').map((s) => s.trim()).filter(Boolean);
  return slugs.includes(slug);
}

/** Deduplicates and serializes unlocked slugs for cookie storage. */
export function mergeUnlockedSlugs(cookieValue: string, nextSlugs: string[]): string {
  const existing = cookieValue.split(',').map((s) => s.trim()).filter(Boolean);
  const merged = new Set([...existing, ...nextSlugs.filter(Boolean)]);
  return Array.from(merged).join(',');
}

export { COOKIE_NAME, COOKIE_PATH };
