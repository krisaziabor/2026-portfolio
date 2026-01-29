'use client';

import { useState } from 'react';
import { AcademyItem } from '@/lib/content';
import AcademyList from '@/components/academy/AcademyList';
import NavigationCard from '@/components/navigation/NavigationCard';

interface AcademyPageClientProps {
  items: AcademyItem[];
}

export default function AcademyPageClient({ items }: AcademyPageClientProps) {
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  return (
    <div className="min-h-screen relative overflow-x-hidden academy-page" style={{ backgroundColor: '#F8F8F8' }}>
      <div className="flex items-center justify-center min-h-screen py-12 px-8 pb-32">
        <div className="flex flex-col items-center w-full" style={{ maxWidth: 'clamp(600px, 62.5%, 1200px)', gap: '32px', paddingBottom: '30px' }}>
          <AcademyList items={items} isNavExpanded={isNavExpanded} />
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
