import type { Metadata } from 'next';
import '@/styles/globals.css';
import { AgentationWrapper } from '@/components/AgentationWrapper';

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
        {children}
        <AgentationWrapper />
      </body>
    </html>
  );
}
