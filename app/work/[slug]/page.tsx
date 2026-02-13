import { notFound } from 'next/navigation';
import { getCaseStudy, getNextCaseStudy } from '@/content/case-studies';
import { CaseStudyLayout } from './CaseStudyLayout';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const caseStudy = getCaseStudy(slug);
  if (!caseStudy) return { title: 'Case Study' };
  return {
    title: `${caseStudy.title} | Kristopher Aziabor`,
    description: caseStudy.summary,
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const caseStudy = getCaseStudy(slug);
  if (!caseStudy) notFound();

  const nextCaseStudy = getNextCaseStudy(slug);
  const nextCaseStudyForTeaser = nextCaseStudy
    ? {
        slug: nextCaseStudy.slug,
        title: nextCaseStudy.title,
        vimeoId: nextCaseStudy.teaserVimeoId ?? '000000000',
      }
    : null;

  return (
    <CaseStudyLayout
      caseStudy={caseStudy}
      nextCaseStudy={nextCaseStudyForTeaser}
    />
  );
}
