'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface NavLink {
  label: string;
  href: string;
}

// Define all pages with their priority (lower number = higher priority)
const allPages: NavLink[] = [
  { label: 'Work', href: '/works' },      // Priority 1 (highest)
  { label: 'Academy', href: '/academy' }, // Priority 2
  { label: 'Photo', href: '/photo' },     // Priority 3
  { label: 'Colophon', href: '/colophon' }, // Priority 4 (lowest)
];

interface NavigationCardProps {
  currentPage: { label: string; href: string };
  onExpandedChange?: (isExpanded: boolean) => void;
}

export default function NavigationCard({ currentPage, onExpandedChange }: NavigationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [navWidth, setNavWidth] = useState<number | null>(null);
  const widthMeasureRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Order links by priority: other pages first (by priority), then current page at bottom
  const orderedNavLinks = useMemo(() => {
    const otherPages = allPages.filter(page => page.href !== currentPage.href);
    // Other pages are already in priority order, then add current page at the end
    return [...otherPages, currentPage];
  }, [currentPage]);

  // Measure width of expanded state
  useEffect(() => {
    if (widthMeasureRef.current) {
      const width = widthMeasureRef.current.offsetWidth;
      setNavWidth(width);
    }
  }, []);

  // Handle click outside to collapse
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  // Notify parent of expansion state changes
  useEffect(() => {
    onExpandedChange?.(isExpanded);
  }, [isExpanded, onExpandedChange]);

  // Calculate collapse timing (no stagger, almost instantaneous collapse)
  const expandStaggerDelay = 0.1; // Delay between each item for expand
  const expandDuration = 0.4; // Duration for expand
  
  const collapseStaggerDelay = 0; // No stagger - all items disappear simultaneously
  const collapseDuration = 0.05; // Almost instantaneous duration for collapse
  const totalCollapseTime = collapseDuration; // Just the duration since no stagger

  return (
    <motion.div
      ref={cardRef}
      onClick={() => setIsExpanded(!isExpanded)}
      className="relative cursor-pointer select-none overflow-hidden rounded-sm border border-[#F0F0F0] bg-white"
      layout
      transition={{
        duration: isExpanded ? expandDuration : totalCollapseTime, // Match collapse timing when collapsing
        ease: isExpanded ? [0.22, 1, 0.36, 1] : [0.4, 0, 0.2, 1], // Smoother ease-out for collapse
      }}
    >
      <motion.div 
        className="px-8 py-5"
        layout
        transition={{
          duration: isExpanded ? expandDuration : totalCollapseTime,
          ease: isExpanded ? [0.22, 1, 0.36, 1] : [0.4, 0, 0.2, 1], // Smoother ease-out for collapse
        }}
      >
        <div className="flex items-end justify-between gap-12">
          {/* Left side - Name (bottom-left aligned) */}
          <div className="text-base leading-tight tracking-[-0.01em]">
            Kristopher Aziabor
          </div>

          {/* Right side - Navigation (right-aligned, stacked vertically) */}
          <div className="relative flex flex-col items-end gap-3 text-base leading-tight tracking-[-0.01em]">
            {/* Hidden container to measure expanded width */}
            <div
              ref={widthMeasureRef}
              className="invisible absolute flex flex-col items-end gap-3"
              style={{
                top: 0,
                right: 0,
              }}
            >
              {orderedNavLinks.map((link) => (
                <div key={link.label} className="text-base leading-tight tracking-[-0.01em]">
                  {link.label}
                </div>
              ))}
            </div>

            {/* Visible links - only render what should be visible */}
            <motion.div
              className="flex flex-col items-end gap-3"
              layout
              style={{
                minWidth: navWidth ? `${navWidth}px` : undefined,
              }}
              transition={{
                duration: isExpanded ? expandDuration : totalCollapseTime,
                ease: isExpanded ? [0.22, 1, 0.36, 1] : [0.4, 0, 0.2, 1], // Smoother ease-out for collapse
              }}
            >
              <AnimatePresence>
                {orderedNavLinks.map((link, index) => {
                  const isCurrentPage = link.href === currentPage.href;
                  const isVisible = isExpanded || isCurrentPage;
                  const currentPageIndex = orderedNavLinks.findIndex((l) => l.href === currentPage.href);

                  if (!isVisible) return null;

                  // Calculate animation delays
                  const shouldAnimate = !isCurrentPage;
                  
                  // Expanding: bottom-to-top (items closer to bottom animate first)
                  const distanceFromBottom = currentPageIndex - index - 1;
                  const expandDelay = shouldAnimate ? distanceFromBottom * expandStaggerDelay : 0;
                  
                  // Collapsing: all items disappear simultaneously (no stagger)
                  const collapseDelay = 0;

                  return (
                    <motion.div
                      key={link.label}
                      initial={isCurrentPage ? false : { opacity: 0, y: -10 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        transition: {
                          delay: expandDelay,
                          duration: expandDuration,
                          ease: [0.22, 1, 0.36, 1],
                        },
                      }}
                      exit={{
                        opacity: 0,
                        y: -10,
                        transition: {
                          delay: collapseDelay,
                          duration: collapseDuration, // Almost instantaneous duration for collapse
                          ease: 'easeOut',
                        },
                      }}
                    >
                      <Link
                        href={link.href}
                        className="transition-opacity duration-500 ease-in-out hover:opacity-50"
                        style={{
                          color: '#000000',
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
