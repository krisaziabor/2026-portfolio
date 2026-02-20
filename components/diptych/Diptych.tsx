'use client';

import type { Diptych as DiptychType } from '@/types/case-study';
import { DiptychText } from './DiptychText';
import { DiptychMediaRenderer } from './DiptychMedia';

interface DiptychProps {
  diptych: DiptychType;
  isFirstInSection: boolean;
  /** Background color for the media panel (matches intro card). */
  titleCardBackgroundColor?: string;
  /** When set, diptych image src is resolved to /work/{caseStudySlug}/{src}. */
  caseStudySlug?: string;
}

const RATIO_GRID: Record<string, string> = {
  '30-70': 'grid-cols-[3fr_7fr]',
  '40-60': 'grid-cols-[4fr_6fr]',
  '50-50': 'grid-cols-[1fr_1fr]',
  '60-40': 'grid-cols-[6fr_4fr]',
  '70-30': 'grid-cols-[7fr_3fr]',
  '100-0': 'grid-cols-[1fr]',
  '0-100': 'grid-cols-[1fr]',
};

const ALIGNMENT_CLASSES: Record<string, string> = {
  top: 'items-start',
  center: 'items-center',
  bottom: 'items-end',
};

function getMediaAlt(media: DiptychType['media']): string {
  if (media.type === 'image') return media.alt ?? '';
  if (media.type === 'video') return media.alt ?? '';
  return '';
}

function isDesignSection(section: string): boolean {
  const s = section.toLowerCase();
  return s === 'design' || s === 'designs';
}

export function Diptych({ diptych, isFirstInSection, titleCardBackgroundColor, caseStudySlug }: DiptychProps) {
  const gridClass = RATIO_GRID[diptych.ratio] ?? RATIO_GRID['50-50'];
  const alignmentClass = ALIGNMENT_CLASSES[diptych.alignment] ?? ALIGNMENT_CLASSES['top'];
  const isFullWidthText = diptych.ratio === '100-0';
  const isFullWidthMedia = diptych.ratio === '0-100';
  const textMaxWidthPercent = diptych.textMaxWidthPercent;

  const mediaAlt = getMediaAlt(diptych.media);
  const showCaption =
    !isFullWidthMedia &&
    mediaAlt.length > 0 &&
    !isDesignSection(diptych.section);

  return (
    <div
      className={`grid ${gridClass} w-full flex-1 min-h-0`}
      style={{ gap: 0 }}
    >
      {/* Left: text — hidden when ratio is 0-100 */}
      {!isFullWidthMedia && (
        <div
          className={`flex flex-col justify-end ${textMaxWidthPercent != null ? 'items-start' : alignmentClass} min-h-0 overflow-auto font-[family-name:var(--font-lector)] lector-font md:border-r border-[#EBEBEB] order-2 md:order-1`}
          style={{
            fontSize: '15px',
            padding: '16px 24px 16px 20px',
            minWidth: 0,
          }}
        >
          <div
            className="flex flex-col w-full"
            style={
              textMaxWidthPercent != null
                ? { maxWidth: `${textMaxWidthPercent}%` }
                : undefined
            }
          >
            <DiptychText
              content={diptych.text.content}
              sectionLabel={isFirstInSection ? diptych.section : undefined}
            />
            {showCaption && (
              <p
                className="mt-3 shrink-0"
                style={{
                  fontSize: '8pt',
                  color: 'var(--color-metadata)',
                }}
              >
                {mediaAlt}
              </p>
            )}
          </div>
        </div>
      )}
      {/* Right: media — hidden when ratio is 100-0 */}
      {!isFullWidthText && (
        <div
          className={`flex flex-col justify-center ${alignmentClass} min-h-0 overflow-hidden order-1 md:order-2 border-b border-[#EBEBEB] md:border-b-0`}
          style={{
            padding: '20px',
            minWidth: 0,
            backgroundColor: diptych.mediaBackgroundColor ?? '#DEDEDE',
          }}
        >
          <div className="relative w-full flex-1 min-h-0">
            <DiptychMediaRenderer media={diptych.media} caseStudySlug={caseStudySlug} />
          </div>
        </div>
      )}
    </div>
  );
}
