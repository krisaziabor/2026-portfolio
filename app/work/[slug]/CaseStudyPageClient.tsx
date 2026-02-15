'use client';

import { useCallback, useEffect, useState } from 'react';
import type { CaseStudy } from '@/types/case-study';
import { DiptychSequence } from '@/components/diptych/DiptychSequence';

interface CaseStudyPageClientProps {
  caseStudy: CaseStudy;
  nextCaseStudy: { slug: string; title: string; vimeoId: string } | null;
}

export function CaseStudyPageClient({
  caseStudy,
  nextCaseStudy,
}: CaseStudyPageClientProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const onCurrentDiptychChange = useCallback(
    (_info: { index: number; section: string; total: number }) => {
      // Could be used to update info card or breadcrumb
    },
    []
  );

  return (
    <DiptychSequence
      diptychs={caseStudy.diptychs}
      nextCaseStudy={nextCaseStudy}
      currentIndex={currentIndex}
      onIndexChange={setCurrentIndex}
      onCurrentDiptychChange={onCurrentDiptychChange}
    />
  );
}
