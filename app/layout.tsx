import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import '@/styles/globals.css';
import { AgentationWrapper } from '@/components/AgentationWrapper';
import { AcademyImagePreloader } from '@/components/AcademyImagePreloader';
import { getAllAcademyItems } from '@/lib/content';

export const viewport: Viewport = {
  themeColor: '#F8F8F8',
  viewportFit: 'cover',
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
  // Preload the first academy display unit's images so they're cached
  // before the user navigates to /academy.
  const academyItems = getAllAcademyItems();
  const firstItem = academyItems[0];
  const firstUnitSrcs: string[] = [];
  if (firstItem) {
    const unitItems = firstItem.group
      ? academyItems.filter(i => i.group === firstItem.group && !i.showSolo)
      : [firstItem];
    for (const item of unitItems) {
      const block = item.contentBlocks.find(
        b => (b.type === 'image' || b.type === 'photo') && b.src
      );
      if (block?.src) firstUnitSrcs.push(block.src);
    }
  }

  return (
    <html lang="en">
      <body>
        {children}
        <AcademyImagePreloader srcs={firstUnitSrcs} />
        <AgentationWrapper />
        <Analytics />
      </body>
    </html>
  );
}
