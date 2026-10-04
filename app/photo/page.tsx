import type { Metadata } from 'next';
import PhotoPageWrapper from '@/components/photo/PhotoPageWrapper';
import { getPhotos } from '@/lib/photos';

export const metadata: Metadata = {
  title: 'Photo — Kristopher Aziabor',
};

export default function PhotoPage() {
  const photos = getPhotos();

  return <PhotoPageWrapper photos={photos} />;
}
