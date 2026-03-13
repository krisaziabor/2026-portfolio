import SiteHeader from '@/components/navigation/SiteHeader';
import PhotoPageClient from '@/components/photo/PhotoPageClient';
import type { Photo } from '@/lib/photos';

interface PhotoPageWrapperProps {
  photos: Photo[];
}

export default function PhotoPageWrapper({ photos }: PhotoPageWrapperProps) {
  return (
    <>
      <main className="min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
        <SiteHeader />
        <PhotoPageClient photos={photos} isNavExpanded={false} />
      </main>
    </>
  );
}
