import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';
import { AgentationWrapper } from '@/components/AgentationWrapper';

export const viewport: Viewport = {
  themeColor: '#F8F8F8',
};

export const metadata: Metadata = {
  title: 'Kristopher Aziabor',
  description: 'Making new things feel familiar and familiar things feel new. Kristopher Aziabor, design engineer.',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'Kristopher Aziabor',
    description: 'Making new things feel familiar and familiar things feel new.Kristopher Aziabor, design engineer.',
    images: [{ url: '/opengraph-image.png' }],
  },
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
