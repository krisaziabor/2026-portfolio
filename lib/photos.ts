import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Photo {
  index: number;
  title: string;
  src: string;
}

interface PhotoEntry {
  title?: string;
  src?: string;
}

const contentDirectory = path.join(process.cwd(), 'content');
const photosMdxPath = path.join(contentDirectory, 'photos.mdx');

const normalizePhotoSrc = (src: string): string => {
  if (!src) {
    return '';
  }
  if (src.startsWith('/') || src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }
  return `/photos/${src}`;
};

const readPhotoEntries = (): PhotoEntry[] => {
  const fileContents = fs.readFileSync(photosMdxPath, 'utf8');
  const { data } = matter(fileContents);
  return Array.isArray(data.photos) ? (data.photos as PhotoEntry[]) : [];
};

export function getPhotos(): Photo[] {
  try {
    const entries = readPhotoEntries();
    return entries
      .map((entry, index) => {
        const title = typeof entry.title === 'string' ? entry.title : '';
        const src = typeof entry.src === 'string' ? normalizePhotoSrc(entry.src) : '';

        return {
          index: index + 1,
          title,
          src,
        };
      })
      .filter((photo) => photo.title && photo.src);
  } catch {
    return [];
  }
}

export function getPhotoByIndex(index: number): Photo | undefined {
  return getPhotos().find((photo) => photo.index === index);
}
