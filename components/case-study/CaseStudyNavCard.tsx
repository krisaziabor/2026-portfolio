'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CARD_PADDING_X = 32; // px-8
const CARD_PADDING_Y = 24; // px-6
const SECTION_GAP = 12;
const SECTION_LINE_HEIGHT = 22; // text-base with leading-tight
const TITLE_MESSAGE_GAP = 24; // Consistent gap between title and scroll message

// More cinematic timing
const EXPAND_DURATION = 0.6;
const EXPAND_EASE = [0.22, 1, 0.36, 1] as const;
const COLLAPSE_DURATION = 0.4;
const COLLAPSE_EASE = [0.4, 0, 0.2, 1] as const;
const EXPAND_STAGGER_DELAY = 0.08;
// When message disappears and title moves to center — quick but legible (not abrupt)
const MESSAGE_TO_CENTER_DURATION = 0.32;
const MESSAGE_EXIT_X = 16; // Subtle slide so it’s clear without feeling like it’s flying off

interface CaseStudyNavCardProps {
  title: string;
  /** When true, card is in fixed overlay (diptych mode) */
  isInDiptychMode?: boolean;
  /** Current diptych index (for scroll message logic) */
  currentIndex?: number;
  totalDiptychs?: number;
  /** Current section name (for expanded state highlighting) */
  currentSection?: string;
  /** Section names in order (for expanded state list) */
  sections?: string[];
  /** Whether there's a next case study (for "Scroll to next case study" message) */
  hasNextCaseStudy?: boolean;
  /** Called when user selects a section to jump to */
  onSectionSelect?: (section: string) => void;
}

export function CaseStudyNavCard({
  title,
  isInDiptychMode = false,
  currentIndex = 0,
  totalDiptychs = 0,
  currentSection = '',
  sections = [],
  hasNextCaseStudy = false,
  onSectionSelect,
}: CaseStudyNavCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Click outside to collapse (match NavigationCard behavior)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded && isInDiptychMode) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded, isInDiptychMode]);

  const isFirstDiptych = currentIndex === 0;
  const isLastDiptych = totalDiptychs > 0 && currentIndex === totalDiptychs - 1;

  // Feature 1: Scroll message logic
  let scrollMessage: string | null = null;
  if (isInDiptychMode) {
    if (isFirstDiptych) {
      scrollMessage = 'Scroll to continue';
    } else if (isLastDiptych && hasNextCaseStudy) {
      scrollMessage = 'Scroll to next case study';
    }
  } else {
    scrollMessage = 'Scroll to continue';
  }

  const showCenteredTitle = isInDiptychMode && !isFirstDiptych && !isExpanded;
  const showScrollMessage = !isExpanded && scrollMessage;

  // Calculate card height based on state
  const collapsedHeight = CARD_PADDING_Y * 2 + SECTION_LINE_HEIGHT;
  // Expanded height: maintain bottom padding, sections stack fills the space
  const expandedHeight =
    CARD_PADDING_Y * 2 +
    sections.length * SECTION_LINE_HEIGHT +
    (sections.length - 1) * SECTION_GAP;

  return (
    <motion.div
      ref={cardRef}
      layout
      role="button"
      tabIndex={0}
      onClick={() => isInDiptychMode && setIsExpanded((prev) => !prev)}
      onKeyDown={(e) => {
        if (isInDiptychMode && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          setIsExpanded((prev) => !prev);
        }
      }}
      className="relative bg-white rounded-sm cursor-pointer select-none overflow-hidden"
      style={{
        borderRadius: '4px',
        border: '1px solid #F0F0F0',
        width: 'fit-content',
        minWidth: '250px',
        padding: `${CARD_PADDING_Y}px ${CARD_PADDING_X}px`,
      }}
      animate={{
        height: isExpanded && isInDiptychMode ? expandedHeight : collapsedHeight,
      }}
      transition={{
        duration: isExpanded ? EXPAND_DURATION : COLLAPSE_DURATION,
        ease: isExpanded ? EXPAND_EASE : COLLAPSE_EASE,
        height: {
          duration: isExpanded ? EXPAND_DURATION : COLLAPSE_DURATION,
          ease: isExpanded ? EXPAND_EASE : COLLAPSE_EASE,
        },
        // Faster when transitioning to centered-title-only (message disappeared)
        layout: {
          duration: showScrollMessage ? 0.5 : MESSAGE_TO_CENTER_DURATION,
          ease: EXPAND_EASE,
        },
      }}
    >
      {/* Content: in-flow when collapsed so card width fits content; absolute when expanded */}
      {!isExpanded || !isInDiptychMode ? (
        /* Collapsed: in flow so card grows to fit title + gap + message with same padding */
        <div
          className={`flex items-end ${
            showScrollMessage ? 'justify-start' : showCenteredTitle ? 'justify-center' : 'justify-start'
          }`}
          style={{
            gap: showScrollMessage ? `${TITLE_MESSAGE_GAP}px` : 0,
            minHeight: SECTION_LINE_HEIGHT,
          }}
        >
            <div
              className="text-base leading-tight tracking-[-0.01em] shrink-0"
              style={{
                color: '#000000',
                lineHeight: `${SECTION_LINE_HEIGHT}px`,
              }}
            >
              {title}
            </div>
          <AnimatePresence>
            {showScrollMessage && (
              <motion.div
                className="text-base leading-tight tracking-[-0.01em] shrink-0"
                style={{
                  color: 'rgba(0, 0, 0, 0.5)',
                  whiteSpace: 'nowrap',
                  lineHeight: `${SECTION_LINE_HEIGHT}px`,
                }}
                initial={{ opacity: 1, x: 0 }}
                exit={{
                  opacity: 0,
                  x: MESSAGE_EXIT_X,
                  position: 'absolute',
                  right: CARD_PADDING_X,
                  bottom: CARD_PADDING_Y, // Match content baseline so it doesn’t “fall” vertically
                  transition: {
                    duration: MESSAGE_TO_CENTER_DURATION,
                    ease: [0.32, 0.72, 0, 1],
                  },
                }}
              >
                {scrollMessage}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        /* Expanded: absolute so it fills the card (card already has padding) */
        <div
          className="absolute inset-0 flex flex-col"
          style={{
            padding: `${CARD_PADDING_Y}px ${CARD_PADDING_X}px`,
          }}
        >
          <motion.div
            key="expanded"
            className="flex min-h-0 flex-1 items-end justify-between gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: EXPAND_DURATION,
              ease: EXPAND_EASE,
            }}
          >
            {/* Title - same line height as sections for baseline alignment */}
            <div
              className="text-base leading-tight tracking-[-0.01em] shrink-0"
              style={{
                color: '#000000',
                lineHeight: `${SECTION_LINE_HEIGHT}px`,
              }}
            >
              {title}
            </div>

            {/* Sections stack - aligned to end so last item baseline matches title */}
            <div
              className="flex flex-col items-end shrink-0"
              style={{ gap: SECTION_GAP }}
            >
              {sections.map((section, index) => {
                const isCurrentSection = section === currentSection;
                const expandDelay = index * EXPAND_STAGGER_DELAY;
                return (
                  <motion.div
                    key={section}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: {
                        delay: expandDelay,
                        duration: EXPAND_DURATION,
                        ease: EXPAND_EASE,
                      },
                    }}
                    exit={{
                      opacity: 0,
                      y: -20,
                      transition: {
                        duration: COLLAPSE_DURATION,
                        ease: COLLAPSE_EASE,
                      },
                    }}
                    style={{ lineHeight: `${SECTION_LINE_HEIGHT}px` }}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSectionSelect?.(section);
                        setIsExpanded(false);
                      }}
                      className="text-base leading-tight tracking-[-0.01em] text-right transition-opacity hover:opacity-70 block w-full text-end border-0 bg-transparent p-0 m-0 cursor-pointer"
                      style={{
                        color: isCurrentSection ? 'rgba(0, 0, 0, 0.5)' : '#000000',
                        lineHeight: `${SECTION_LINE_HEIGHT}px`,
                      }}
                    >
                      {section}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
