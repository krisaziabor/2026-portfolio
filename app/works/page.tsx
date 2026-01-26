'use client';

import NavigationCard from '@/components/navigation/NavigationCard';

export default function Works() {
  return (
    <>
      <main className="min-h-screen p-8">
        <h1 className="text-content mb-4">Works</h1>
        <p className="text-metadata">Case studies listing will go here.</p>
      </main>

      {/* Sticky Navigation Card */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-8 pointer-events-none">
        <div className="pointer-events-auto">
          <NavigationCard />
        </div>
      </div>
    </>
  );
}
