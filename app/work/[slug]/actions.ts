'use server';

import { cookies } from 'next/headers';
import { getPasswordForSlug, COOKIE_NAME, COOKIE_PATH } from '@/lib/case-study-auth';

export async function verifyCaseStudyPassword(slug: string, submittedPassword: string): Promise<{ success: boolean }> {
  const expected = getPasswordForSlug(slug);
  if (expected === undefined) return { success: false };
  if (submittedPassword.trim() !== expected) return { success: false };

  const cookieStore = await cookies();
  const current = cookieStore.get(COOKIE_NAME)?.value ?? '';
  const slugs = current.split(',').map((s) => s.trim()).filter(Boolean);
  if (!slugs.includes(slug)) {
    slugs.push(slug);
    cookieStore.set(COOKIE_NAME, slugs.join(','), {
      path: COOKIE_PATH,
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }
  return { success: true };
}
