'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NavigationCard from '@/components/navigation/NavigationCard';
import { CaseStudyTitleCard } from '@/components/case-study/CaseStudyTitleCard';
import { CaseStudyNavCard } from '@/components/case-study/CaseStudyNavCard';
import { DiptychSequence } from '@/components/diptych/DiptychSequence';
import type { CaseStudy } from '@/types/case-study';

interface CaseStudyLayoutProps {
  caseStudy: CaseStudy;
  nextCaseStudy: { slug: string; title: string; vimeoId: string } | null;
}

const SCROLL_DEBOUNCE_MS = 400;

/** Returns map of section name -> index of first diptych in that section */
function getSectionToFirstIndex(diptychs: { section: string }[]): Map<string, number> {
  const map = new Map<string, number>();
  diptychs.forEach((d, i) => {
    if (!map.has(d.section)) map.set(d.section, i);
  });
  return map;
}

export function CaseStudyLayout({ caseStudy, nextCaseStudy }: CaseStudyLayoutProps) {
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const [viewMode, setViewMode] = useState<'title' | 'diptych'>('title');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [diptychProgress, setDiptychProgress] = useState({ index: 0, section: '', total: caseStudy.diptychs.length });
  const lastScrollTimeRef = useRef(0);

  const sectionToFirstIndex = getSectionToFirstIndex(caseStudy.diptychs);

  const onCurrentDiptychChange = useCallback(
    (info: { index: number; section: string; total: number }) => {
      setDiptychProgress({ index: info.index, section: info.section, total: info.total });
    },
    []
  );

  const handleGoToSection = useCallback(
    (section: string) => {
      const idx = sectionToFirstIndex.get(section);
      if (idx !== undefined) setCurrentIndex(idx);
    },
    [sectionToFirstIndex]
  );

  // Scroll down on title view → enter diptych mode
  useEffect(() => {
    if (viewMode !== 'title' || caseStudy.diptychs.length === 0) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY <= 0) return;

      const now = Date.now();
      if (now - lastScrollTimeRef.current < SCROLL_DEBOUNCE_MS) {
        e.preventDefault();
        return;
      }

      lastScrollTimeRef.current = now;
      e.preventDefault();
      setViewMode('diptych');
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [viewMode, caseStudy.diptychs.length]);

  useEffect(() => {
    if (viewMode === 'diptych') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [viewMode]);

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ backgroundColor: '#F8F8F8' }}>
      <AnimatePresence mode="wait">
        {viewMode === 'title' ? (
          <motion.div
            key="title"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex items-center justify-center min-h-screen py-12 px-8 pb-32"
          >
            <div
              className="flex flex-col items-center w-full"
              style={{ maxWidth: 'clamp(600px, 62.5%, 1200px)', gap: '32px', paddingBottom: '30px' }}
            >
              <motion.div
                className="flex flex-col w-full"
                style={{ gap: '32px' }}
                animate={{ y: isNavExpanded ? -96 : 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
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

                <div className="flex justify-center w-full">
                  <div style={{ width: 250 }}>
                    <CaseStudyNavCard title={caseStudy.title} isInDiptychMode={false} />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="diptych"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute inset-0 flex flex-col"
          >
            <div className="flex-1 min-h-0">
              <DiptychSequence
                diptychs={caseStudy.diptychs}
                nextCaseStudy={nextCaseStudy}
                currentIndex={currentIndex}
                onIndexChange={setCurrentIndex}
                onCurrentDiptychChange={onCurrentDiptychChange}
                onScrollUpFromFirst={() => setViewMode('title')}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Case Study Nav Card - fixed when in diptych mode (shows progress, expandable) */}
      {viewMode === 'diptych' && (
        <motion.div
          layout
          className="fixed left-1/2 -translate-x-1/2 flex justify-center z-10"
          style={{
            bottom: isNavExpanded ? 'calc(2rem + 96px)' : 'calc(2rem + 80px)',
            width: 'max-content',
          }}
          transition={{ layout: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
        >
          <CaseStudyNavCard
            title={caseStudy.title}
            isInDiptychMode
            currentIndex={currentIndex}
            totalDiptychs={caseStudy.diptychs.length}
            currentSection={diptychProgress.section}
            sections={caseStudy.sections}
            hasNextCaseStudy={!!nextCaseStudy}
            onSectionSelect={handleGoToSection}
          />
        </motion.div>
      )}

      {/* Sticky Navigation Card - same position as colophon and home */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-8 pointer-events-none">
        <div className="pointer-events-auto">
          <NavigationCard onExpandedChange={setIsNavExpanded} />
        </div>
      </div>
    </div>
  );
}
