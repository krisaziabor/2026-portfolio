import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import '@/styles/globals.css';
import { AgentationWrapper } from '@/components/AgentationWrapper';

export const viewport: Viewport = {
  themeColor: '#F8F8F8',
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.krisaziabor.com'),
  title: 'Kristopher Aziabor',
  description: 'Making new things feel familiar and familiar things feel new. Kristopher Aziabor, design engineer.',
  // Icons come from app/favicon.ico, app/icon.png and app/apple-icon.png (file conventions)
  openGraph: {
    title: 'Kristopher Aziabor',
    description: 'Making new things feel familiar and familiar things feel new. Kristopher Aziabor, design engineer.',
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
        <Analytics />
      </body>
    </html>
  );
}
