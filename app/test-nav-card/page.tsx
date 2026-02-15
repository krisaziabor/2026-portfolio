'use client';

import { useState, useEffect } from 'react';
import { CaseStudyNavCard } from '@/components/case-study/CaseStudyNavCard';

// Mock sections for Sea12
const SECTIONS = ['Overview', 'Context', 'Strategy', 'Designs', 'Reflections'];

export default function TestNavCardPage() {
  const [isInDiptychMode, setIsInDiptychMode] = useState(false);
  const [currentSection, setCurrentSection] = useState('Overview');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Simulate entering diptych mode on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      // Enter diptych mode after scrolling 300px
      if (scrollY > 300) {
        setIsInDiptychMode(true);
      } else {
        setIsInDiptychMode(false);
      }

      // Simulate section changes based on scroll position
      const sectionHeight = 400;
      const newIndex = Math.floor((scrollY - 300) / sectionHeight);
      const clampedIndex = Math.max(0, Math.min(SECTIONS.length - 1, newIndex));

      if (clampedIndex >= 0 && clampedIndex < SECTIONS.length) {
        setCurrentSection(SECTIONS[clampedIndex]);
        setCurrentIndex(clampedIndex);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSectionSelect = (section: string) => {
    console.log('Section selected:', section);
    const sectionIndex = SECTIONS.indexOf(section);
    if (sectionIndex !== -1) {
      setCurrentSection(section);
      setCurrentIndex(sectionIndex);
      // Scroll to approximate position for that section
      window.scrollTo({ top: 300 + sectionIndex * 400, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-[300vh] bg-white">
      {/* Nav card fixed on the right */}
      <div className="fixed top-8 right-8 z-50" style={{ width: 'max-content' }}>
        <CaseStudyNavCard
          title="Sea12"
          isInDiptychMode={isInDiptychMode}
          currentIndex={currentIndex}
          totalDiptychs={SECTIONS.length}
          currentSection={currentSection}
          sections={SECTIONS}
          hasNextCaseStudy={true}
          onSectionSelect={handleSectionSelect}
        />
      </div>

      {/* Scrollable content to test behavior */}
      <div className="max-w-4xl mx-auto px-8 pt-32">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Case Study Nav Card Test</h1>
          <p className="text-metadata mb-4">
            Scroll down to see the nav card transition into diptych mode and test the animations.
          </p>
          <p className="text-metadata">
            Current mode: <strong>{isInDiptychMode ? 'Diptych' : 'Initial'}</strong>
          </p>
          <p className="text-metadata">
            Current section: <strong>{currentSection}</strong>
          </p>
        </div>

        {/* Mock sections for scrolling */}
        {SECTIONS.map((section, idx) => (
          <div
            key={section}
            className="mb-24 p-8 border border-gray-200 rounded"
            style={{ minHeight: '400px' }}
          >
            <h2 className="text-2xl font-bold mb-4">{section}</h2>
            <p className="text-metadata mb-4">
              Section {idx + 1} of {SECTIONS.length}
            </p>
            <p className="text-base">
              This is mock content for the {section} section. Scroll down to see the nav card
              behavior change as you move through different sections of the case study.
            </p>
            <p className="text-base mt-4">
              When in diptych mode, click the nav card to expand it and see the section list
              with staggered animations.
            </p>
          </div>
        ))}

        <div className="mb-24 p-8 border border-gray-200 rounded">
          <h2 className="text-2xl font-bold mb-4">End of Case Study</h2>
          <p className="text-base">
            This is the end. In the last section, the card should show "Scroll to next case study"
            since hasNextCaseStudy is set to true.
          </p>
        </div>
      </div>
    </div>
  );
}
