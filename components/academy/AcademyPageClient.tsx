import { AcademyItem } from '@/lib/content';
import AcademyGrid from '@/components/academy/AcademyGrid';
import SiteHeader from '@/components/navigation/SiteHeader';

interface AcademyPageClientProps {
  items: AcademyItem[];
}

export default function AcademyPageClient({ items }: AcademyPageClientProps) {
  return (
    <div className="min-h-screen relative overflow-x-hidden academy-page" style={{ backgroundColor: '#F8F8F8' }}>
      <SiteHeader />
      <div
        className="px-6 sm:px-8 lg:px-12"
        style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-8)', maxWidth: '1400px', margin: '0 auto' }}
      >
        <AcademyGrid items={items} />
      </div>
    </div>
  );
}
