import { AcademyItem } from '@/lib/content';
import AcademyList from '@/components/academy/AcademyList';
import SiteHeader from '@/components/navigation/SiteHeader';

interface AcademyPageClientProps {
  items: AcademyItem[];
}

export default function AcademyPageClient({ items }: AcademyPageClientProps) {
  return (
    <div className="min-h-screen relative overflow-x-hidden academy-page" style={{ backgroundColor: '#F8F8F8' }}>
      <SiteHeader />
      <div className="flex items-center justify-center py-12 px-8">
        <div className="flex flex-col items-center w-full" style={{ maxWidth: 'clamp(600px, 62.5%, 1200px)', gap: '32px', paddingBottom: '30px' }}>
          <AcademyList items={items} isNavExpanded={false} />
        </div>
      </div>
    </div>
  );
}
