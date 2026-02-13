import type { CaseStudy } from '@/types/case-study';
import { sea12 } from './sea12';
import { fidelity } from './fidelity';
import { kensho } from './kensho';

export const caseStudies: CaseStudy[] = [sea12, fidelity, kensho].sort(
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
