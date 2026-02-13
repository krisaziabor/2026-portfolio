'use client';

import type { Diptych as DiptychType, CaseStudySection } from '@/types/case-study';
import { DiptychText } from './DiptychText';
import { DiptychMediaRenderer } from './DiptychMedia';

interface DiptychProps {
  diptych: DiptychType;
  isFirstInSection: boolean;
}

const RATIO_GRID: Record<string, string> = {
  '30-70': 'grid-cols-[3fr_7fr]',
  '40-60': 'grid-cols-[4fr_6fr]',
  '50-50': 'grid-cols-[1fr_1fr]',
  '60-40': 'grid-cols-[6fr_4fr]',
  '70-30': 'grid-cols-[7fr_3fr]',
};

const ALIGNMENT_CLASSES: Record<string, string> = {
  top: 'items-start',
  center: 'items-center',
  bottom: 'items-end',
};

export function Diptych({ diptych, isFirstInSection }: DiptychProps) {
  const gridClass = RATIO_GRID[diptych.ratio] ?? RATIO_GRID['50-50'];
  const alignmentClass = ALIGNMENT_CLASSES[diptych.alignment] ?? ALIGNMENT_CLASSES['top'];

  return (
    <div
      className={`grid ${gridClass} gap-[var(--space-6)] min-h-0 flex-1`}
      style={{ gap: 'var(--space-6)' }}
    >
      <div
        className={`flex flex-col justify-center ${alignmentClass} min-h-0 overflow-auto`}
      >
        <DiptychText
          content={diptych.text.content}
          sectionLabel={isFirstInSection ? diptych.section : undefined}
        />
      </div>
      <div
        className={`flex flex-col justify-center ${alignmentClass} min-h-0 overflow-hidden`}
      >
        <DiptychMediaRenderer media={diptych.media} />
      </div>
    </div>
  );
}
