import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { getCaseStudy, getNextCaseStudy } from '@/content/case-studies';
import { isUnlocked } from '@/lib/case-study-auth';
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

  const cookieStore = await cookies();
  const unlockedCookie = cookieStore.get('unlocked_case_studies')?.value ?? '';
  const isUnlockedStudy = isUnlocked(slug, unlockedCookie);

  return (
    <CaseStudyLayout
      caseStudy={caseStudy}
      nextCaseStudy={nextCaseStudy}
      isUnlocked={isUnlockedStudy}
    />
  );
}
