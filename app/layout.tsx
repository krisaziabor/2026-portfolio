import type { Metadata } from 'next';
import '@/styles/globals.css';
import { AgentationWrapper } from '@/components/AgentationWrapper';
import EntryAnimationWrapper from '@/components/entry/EntryAnimationWrapper';

export const metadata: Metadata = {
  title: 'Kristopher Aziabor',
  description: 'A machine for reading design and development work',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <EntryAnimationWrapper>
          {children}
        </EntryAnimationWrapper>
        <AgentationWrapper />
      </body>
    </html>
  );
}
