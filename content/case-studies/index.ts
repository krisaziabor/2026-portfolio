import type { CaseStudy } from '@/types/case-study';
import { sea12 } from './sea12';
import { kensho } from './kensho';
import { linkus } from './linkus';
import { kanon } from './kanon';

export const caseStudies: CaseStudy[] = [kensho, kanon, sea12, linkus].sort(
  (a, b) => a.sequence - b.sequence
);

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((cs) => cs.slug === slug);
}

export function getNextCaseStudy(currentSlug: string): CaseStudy | null {
  const current = getCaseStudy(currentSlug);
  if (!current?.nextCaseStudySlug) return null;
  const next = getCaseStudy(current.nextCaseStudySlug);
  return next ?? null;
}
