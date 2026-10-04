'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import PhotoPageClient from '@/components/photo/PhotoPageClient';
import { fadeUp } from '@/lib/entrance';
import type { Photo } from '@/lib/photos';

/* Same shell as the home page: light background, body font, 75% black text,
   and the shared "Slow Cinema" entrance (name → photo → navigation). */
export default function PhotoPageWrapper({ photos }: { photos: Photo[] }) {
  const shouldReduceMotion = useReducedMotion() ?? false;

  return (
    <main
      className="relative h-dvh overflow-hidden font-[family-name:var(--font-body)] [--page-x:24px] [--photo-top:64px] md:[--page-x:50px] md:[--photo-top:36px]"
      style={{
        backgroundColor: 'var(--color-background)',
        fontSize: '16px',
        letterSpacing: '-0.025em',
        lineHeight: '1.38',
        color: 'var(--color-content)',
      }}
    >
      <PhotoPageClient photos={photos} shouldReduceMotion={shouldReduceMotion} />

      {/* The name is the way home — right edge, centred like the bio on the home
          page (top-right on small screens, where the photo needs the width). */}
      <div className="absolute right-[var(--page-x)] top-6 z-10 md:top-1/2 md:-translate-y-1/2">
        <motion.div {...fadeUp(0, shouldReduceMotion)}>
          <Link
            href="/"
            className="text-[color:var(--color-emphasis)] hover:text-[color:var(--color-interactive)]"
          >
            Kristopher Aziabor
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
