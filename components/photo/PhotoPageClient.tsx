'use client';

import type { Photo } from '@/lib/photos';
import { PHOTO_LAYOUT_COMPONENTS } from './layouts';

/** The photo page ships the "Strip" layout. The other layouts in ./layouts.tsx
    were explorations and are kept there for reference. */
const Layout = PHOTO_LAYOUT_COMPONENTS.Strip;

export default function PhotoPageClient({
  photos,
  shouldReduceMotion,
}: {
  photos: Photo[];
  shouldReduceMotion: boolean;
}) {
  if (photos.length === 0) return null;
  return <Layout photos={photos} shouldReduceMotion={shouldReduceMotion} />;
}
