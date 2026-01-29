'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EntryAnimationProps {
  children: React.ReactNode;
  onAnimationComplete?: () => void;
}

const ANIMATION_PHASES = {
  TEXT_DISPLAY: 800, // Show text for this duration
  TEXT_FADE: 600, // Text fades out
  COLOR_TRANSITION: 500, // Background color transitions
  CONTENT_REVEAL: 400, // Content fades in
} as const;

type AnimationPhase = 'text' | 'fadeText' | 'colorTransition' | 'revealContent' | 'complete';

export default function EntryAnimation({ children, onAnimationComplete }: EntryAnimationProps) {
  const [phase, setPhase] = useState<AnimationPhase>('text');
  const [shouldShow, setShouldShow] = useState<boolean | null>(null);
  const [showOverlay, setShowOverlay] = useState(true);

  // Check if this is a new session
  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    const hasSeenAnimation = sessionStorage.getItem('hasSeenEntryAnimation');
    
    if (hasSeenAnimation) {
      setShouldShow(false);
      setPhase('complete');
      setShowOverlay(false);
    } else {
      setShouldShow(true);
      // Mark as seen for this session
      sessionStorage.setItem('hasSeenEntryAnimation', 'true');
    }
  }, []);

  // Run animation sequence
  useEffect(() => {
    if (!shouldShow) return;

    const runSequence = async () => {
      // Phase 1: Text is displayed
      await new Promise(resolve => setTimeout(resolve, ANIMATION_PHASES.TEXT_DISPLAY));
      
      // Phase 2: Text fades out
      setPhase('fadeText');
      await new Promise(resolve => setTimeout(resolve, ANIMATION_PHASES.TEXT_FADE));
      
      // Phase 3: Color transitions
      setPhase('colorTransition');
      await new Promise(resolve => setTimeout(resolve, ANIMATION_PHASES.COLOR_TRANSITION));
      
      // Phase 4: Content reveals
      setPhase('revealContent');
      await new Promise(resolve => setTimeout(resolve, ANIMATION_PHASES.CONTENT_REVEAL));
      
      // Complete - hide overlay
      setShowOverlay(false);
      setPhase('complete');
      onAnimationComplete?.();
    };

    runSequence();
  }, [shouldShow, onAnimationComplete]);

  // Show nothing until we've checked sessionStorage
  if (shouldShow === null) {
    return null;
  }

  // If animation shouldn't show, render children immediately
  if (!shouldShow) {
    return <>{children}</>;
  }

  const isTextPhase = phase === 'text';
  const isColorTransitioning = phase === 'colorTransition' || phase === 'revealContent';
  const shouldShowContent = phase === 'revealContent' || phase === 'complete';

  return (
    <>
      {/* Entry animation overlay */}
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ backgroundColor: '#FFFFFF' }}
            animate={{
              backgroundColor: isColorTransitioning ? '#F8F8F8' : '#FFFFFF',
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: ANIMATION_PHASES.COLOR_TRANSITION / 1000,
              ease: 'easeOut',
            }}
          >
            {/* Text element */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: isTextPhase ? 1 : 0,
                y: isTextPhase ? 0 : -30,
                scale: isTextPhase ? 1 : 0.95,
              }}
              transition={{
                duration: isTextPhase 
                  ? 0.5 // Initial fade in
                  : ANIMATION_PHASES.TEXT_FADE / 1000, // Fade out
                ease: [0.22, 1, 0.36, 1], // Smooth ease-out
              }}
            >
              <h1
                className="text-content tracking-[-0.01em]"
                style={{
                  fontFamily: 'var(--font-lector)',
                  fontSize: 'clamp(24px, 4vw, 32px)',
                  fontWeight: 400,
                  lineHeight: 1.4,
                }}
              >
                Kristopher Aziabor
              </h1>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content (hidden during animation, then revealed) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: shouldShowContent ? 1 : 0,
        }}
        transition={{
          duration: ANIMATION_PHASES.CONTENT_REVEAL / 1000,
          ease: 'easeOut',
          delay: phase === 'revealContent' ? 0.1 : 0,
        }}
      >
        {children}
      </motion.div>
    </>
  );
}
