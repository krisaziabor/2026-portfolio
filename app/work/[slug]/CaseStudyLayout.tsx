'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import NavigationCard from '@/components/navigation/NavigationCard';
import { CaseStudyTitleCard } from '@/components/case-study/CaseStudyTitleCard';
import { CaseStudyNavCard } from '@/components/case-study/CaseStudyNavCard';
import type { CaseStudy } from '@/types/case-study';

interface CaseStudyLayoutProps {
  caseStudy: CaseStudy;
  nextCaseStudy: { slug: string; title: string; vimeoId: string } | null;
}

export function CaseStudyLayout({ caseStudy, nextCaseStudy }: CaseStudyLayoutProps) {
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  // NavigationCard is approximately 300px wide when collapsed
  // Case study nav card should be 80-85% of that (~250px)
  const caseStudyNavCardWidth = '250px';

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ backgroundColor: '#F8F8F8' }}>
      <div className="flex items-center justify-center min-h-screen py-12 px-8 pb-32">
        <div
          className="flex flex-col items-center w-full"
          style={{ maxWidth: 'clamp(600px, 62.5%, 1200px)', gap: '32px', paddingBottom: '30px' }}
        >
          {/* Main card and case study nav card - both move up when nav expands */}
          <motion.div
            className="flex flex-col w-full"
            style={{ gap: '32px' }}
            animate={{
              y: isNavExpanded ? -96 : 0,
            }}
            transition={{
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {/* Main Title Card */}
            <div
              className="bg-white w-full overflow-hidden"
              style={{
                borderRadius: '4px',
                border: '1px solid #dbd8d8',
                backgroundColor: '#FCFCFC',
                minWidth: 0,
              }}
            >
              <CaseStudyTitleCard caseStudy={caseStudy} />
            </div>

            {/* Case Study Nav Card */}
            <div className="flex justify-center w-full">
              <div style={{ width: caseStudyNavCardWidth }}>
                <CaseStudyNavCard title={caseStudy.title} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Sticky Navigation Card - same position as colophon and home */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-8 pointer-events-none">
        <div className="pointer-events-auto">
          <NavigationCard onExpandedChange={setIsNavExpanded} />
        </div>
      </div>
    </div>
  );
}
