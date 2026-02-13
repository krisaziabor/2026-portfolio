'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import NavigationCard from '@/components/navigation/NavigationCard';
import { caseStudies as contentCaseStudies } from '@/content/case-studies';

const teaserPlaceholders: Record<string, { videoSrc: string; videoAlt: string; caption: string }> = {
  sea12: {
    videoSrc: '/academy/ColorPractice.mp4',
    videoAlt: 'Sea12 teaser video placeholder',
    caption: 'Teaser video placeholder for Sea12.',
  },
  fidelity: {
    videoSrc: '/academy/Neojazz.mp4',
    videoAlt: 'Fidelity teaser video placeholder',
    caption: 'Teaser video placeholder for Fidelity.',
  },
  kensho: {
    videoSrc: '/academy/Chesnutt.mp4',
    videoAlt: 'Kensho teaser video placeholder',
    caption: 'Teaser video placeholder for Kensho.',
  },
};

const caseStudies = contentCaseStudies.map((cs) => ({
  slug: cs.slug,
  title: cs.title,
  ...teaserPlaceholders[cs.slug],
}));

export default function Home() {
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeStudy = caseStudies[activeIndex];

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ backgroundColor: '#F8F8F8' }}>
      <div className="flex items-center justify-center min-h-screen py-12 px-8 pb-32">
        <div
          className="flex flex-col items-center w-full"
          style={{ maxWidth: 'clamp(600px, 62.5%, 1200px)', gap: '32px', paddingBottom: '30px' }}
        >
          <motion.div
            className="bg-white grid w-full grid-cols-1 md:grid-cols-[40%_60%] h-auto md:h-[728px]"
            style={{
              borderRadius: '4px',
              border: '1px solid #dbd8d8',
              backgroundColor: '#FCFCFC',
              overflow: 'hidden',
              minWidth: 0,
            }}
            animate={{
              y: isNavExpanded ? -96 : 0,
            }}
            transition={{
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {/* Left column - Case study titles */}
            <div
              className="flex flex-col font-[family-name:var(--font-lector)] lector-font order-2 md:order-1 md:h-full border-t border-[#EBEBEB] md:border-t-0 md:border-r"
              style={{
                fontSize: '15px',
                padding: '16px 24px 16px 20px',
                justifyContent: 'space-between',
                minWidth: 0,
                overflow: 'auto',
              }}
            >
              <div className="flex flex-col" style={{ gap: '12px' }}>
                {caseStudies.map((study, index) => {
                  const isActive = index === activeIndex;

                  return (
                    <Link
                      key={study.slug}
                      href={`/work/${study.slug}`}
                      className="flex items-center gap-2 text-left transition-opacity duration-300 hover:opacity-80"
                      style={{ color: isActive ? '#000000' : 'rgba(0, 0, 0, 0.5)' }}
                      aria-current={isActive}
                      onMouseEnter={() => setActiveIndex(index)}
                      onFocus={() => setActiveIndex(index)}
                    >
                      <span style={{ color: isActive ? '#946851' : 'transparent' }}>→</span>
                      <span>{study.title}</span>
                    </Link>
                  );
                })}
              </div>

              <div style={{ color: 'rgba(0, 0, 0, 0.5)', fontSize: '13px' }}>
                <p>Work index — teaser placeholders.</p>
              </div>
            </div>

            {/* Right column - Teaser video */}
            <div
              className="flex items-center justify-center order-1 md:order-2"
              style={{ padding: '28px', minWidth: 0, overflow: 'hidden' }}
            >
              {activeStudy && (
                <div className="flex flex-col" style={{ width: '100%', maxWidth: '90%', maxHeight: '90%' }}>
                  <div
                    className="w-full"
                    style={{
                      aspectRatio: '16 / 9',
                      borderRadius: '4px',
                      border: '1px solid #E6E6E6',
                      overflow: 'hidden',
                    }}
                  >
                    <video
                      key={activeStudy.slug}
                      src={activeStudy.videoSrc}
                      aria-label={activeStudy.videoAlt}
                      muted
                      loop
                      autoPlay
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-metadata text-sm mt-[var(--space-2)]">{activeStudy.caption}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Sticky Navigation Card */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-8 pointer-events-none">
        <div className="pointer-events-auto">
          <NavigationCard onExpandedChange={setIsNavExpanded} />
        </div>
      </div>
    </div>
  );
}
