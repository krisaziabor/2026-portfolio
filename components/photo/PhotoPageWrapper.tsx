'use client';

import { motion } from 'framer-motion';
import SiteHeader from '@/components/navigation/SiteHeader';
import PhotoPageClient from '@/components/photo/PhotoPageClient';
import type { Photo } from '@/lib/photos';

interface PhotoPageWrapperProps {
  photos: Photo[];
}

export default function PhotoPageWrapper({ photos }: PhotoPageWrapperProps) {
  return (
    <motion.main
      className="photo-page h-screen flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{
        backgroundColor: '#141414',
        // Tiny light strip at the very top so Chromium-based
        // browsers sample a light background for toolbar tinting,
        // while the page still appears visually dark.
        backgroundImage:
          'linear-gradient(to bottom, #F8F8F8 0, #F8F8F8 2px, #141414 2px)',
        backgroundRepeat: 'no-repeat',
        // Override CSS custom properties so any theme-aware children
        // render correctly against this dark background, regardless of
        // which global theme is active.
        '--color-background': '#141414',
        '--color-content': '#e8e6e6',
        '--color-metadata': '#888888',
        '--color-interactive': '#8B6B5A',
      } as React.CSSProperties}
    >
      <SiteHeader />
      <PhotoPageClient photos={photos} />
    </motion.main>
  );
}
