'use client';

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

// Dynamically import to avoid SSR issues with sessionStorage
const EntryAnimation = dynamic(() => import('./EntryAnimation'), {
  ssr: false,
  loading: () => null, // Show nothing while loading
});

interface EntryAnimationWrapperProps {
  children: ReactNode;
}

export default function EntryAnimationWrapper({ children }: EntryAnimationWrapperProps) {
  return <EntryAnimation>{children}</EntryAnimation>;
}
