'use client';

import { useState } from 'react';
import NavigationCard from '@/components/navigation/NavigationCard';
import PhotoPageClient from '@/components/photo/PhotoPageClient';
import type { Photo } from '@/lib/photos';

interface PhotoPageWrapperProps {
  photos: Photo[];
}

export default function PhotoPageWrapper({ photos }: PhotoPageWrapperProps) {
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  return (
    <>
      <main
        className="min-h-screen"
        style={{ backgroundColor: '#FFFFFF' }}
      >
        <PhotoPageClient photos={photos} isNavExpanded={isNavExpanded} />
      </main>

      {/* Sticky Navigation Card - unchanged from other pages */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-8 pointer-events-none">
        <div className="pointer-events-auto">
          <NavigationCard onExpandedChange={setIsNavExpanded} />
        </div>
      </div>
    </>
  );
}
