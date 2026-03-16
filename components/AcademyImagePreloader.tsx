'use client';

import { useEffect } from 'react';

export function AcademyImagePreloader({ srcs }: { srcs: string[] }) {
  useEffect(() => {
    srcs.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  // srcs is derived from static content — safe to exclude from deps
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
