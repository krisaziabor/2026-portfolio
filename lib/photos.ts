import fs from 'fs';
import path from 'path';

export interface Photo {
  index: number;
  title: string;
  year?: number;
  src: string;
}

interface PhotoJsonEntry {
  index?: number;
  title?: string;
  year?: number;
  src?: string;
}

const contentDirectory = path.join(process.cwd(), 'content');
const photosJsonPath = path.join(contentDirectory, 'photos.json');

const normalizePhotoSrc = (src: string): string => {
  if (!src) return '';
  if (src.startsWith('http://') || src.startsWith('https://')) return src;
  // Normalize /photos/ to /photo/ to match public folder structure
  if (src.startsWith('/photos/')) return src.replace('/photos/', '/photo/');
  if (src.startsWith('/')) return src;
  return `/photo/${src}`;
};

export function getPhotos(): Photo[] {
  try {
    const fileContents = fs.readFileSync(photosJsonPath, 'utf8');
    const entries: PhotoJsonEntry[] = JSON.parse(fileContents);
    return entries
      .map((entry, i) => {
        const title = typeof entry.title === 'string' ? entry.title : '';
        const src = typeof entry.src === 'string' ? normalizePhotoSrc(entry.src) : '';
        const index = typeof entry.index === 'number' ? entry.index : i + 1;

        return {
          index,
          title,
          year: typeof entry.year === 'number' ? entry.year : undefined,
          src,
        };
      })
      .filter((photo) => photo.title && photo.src)
      .sort((a, b) => a.index - b.index);
  } catch {
    return [];
  }
}

export function getPhotoByIndex(index: number): Photo | undefined {
  return getPhotos().find((photo) => photo.index === index);
}
