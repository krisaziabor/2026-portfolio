import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import { caseStudies } from '@/content/case-studies';
import { COOKIE_NAME, COOKIE_PATH, mergeUnlockedSlugs } from '@/lib/case-study-auth';

const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

function isValidToken(provided: string, expected: string): boolean {
  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);
  if (providedBuffer.length !== expectedBuffer.length) return false;
  return timingSafeEqual(providedBuffer, expectedBuffer);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const expectedToken = process.env.RECRUITER_ACCESS_TOKEN;

  if (!expectedToken || !isValidToken(token, expectedToken)) {
    return NextResponse.redirect(new URL('/', request.url), { status: 307 });
  }

  const protectedSlugs = caseStudies
    .filter((study) => study.isProtected)
    .map((study) => study.slug);

  const cookieStore = await cookies();
  const current = cookieStore.get(COOKIE_NAME)?.value ?? '';
  const nextValue = mergeUnlockedSlugs(current, protectedSlugs);

  const nextPath = request.nextUrl.searchParams.get('next');
  const safeNextPath =
    nextPath && nextPath.startsWith('/') && !nextPath.startsWith('//')
      ? nextPath
      : '/';

  const response = NextResponse.redirect(new URL(safeNextPath, request.url), { status: 307 });
  response.cookies.set(COOKIE_NAME, nextValue, {
    path: COOKIE_PATH,
    httpOnly: true,
    sameSite: 'lax',
    maxAge: MAX_AGE_SECONDS,
  });

  return response;
}
