import PhotoPageWrapper from '@/components/photo/PhotoPageWrapper';
import { getPhotos } from '@/lib/photos';

export default function PhotoPage() {
  const photos = getPhotos();

  return <PhotoPageWrapper photos={photos} />;
}
