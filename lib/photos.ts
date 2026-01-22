import photosData from '@/content/photos.json';

export interface Photo {
  index: number;
  title: string;
  src: string;
}

export function getPhotos(): Photo[] {
  return photosData as Photo[];
}

export function getPhotoByIndex(index: number): Photo | undefined {
  return photosData.find((photo) => photo.index === index) as Photo | undefined;
}
