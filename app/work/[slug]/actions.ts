'use server';

import { cookies } from 'next/headers';
import { getPasswordForSlug, COOKIE_NAME, COOKIE_PATH, mergeUnlockedSlugs } from '@/lib/case-study-auth';

export async function verifyCaseStudyPassword(slug: string, submittedPassword: string): Promise<{ success: boolean }> {
  const expected = getPasswordForSlug(slug);
  if (expected === undefined) return { success: false };
  if (submittedPassword.trim() !== expected) return { success: false };

  const cookieStore = await cookies();
  const current = cookieStore.get(COOKIE_NAME)?.value ?? '';
  const nextValue = mergeUnlockedSlugs(current, [slug]);
  if (nextValue !== current) {
    cookieStore.set(COOKIE_NAME, nextValue, {
      path: COOKIE_PATH,
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }
  return { success: true };
}
