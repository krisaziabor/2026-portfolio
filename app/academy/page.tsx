import { getAllAcademyItems } from '@/lib/content';
import AcademyPageClient from '@/components/academy/AcademyPageClient';

export default function Academy() {
  const items = getAllAcademyItems();

  return <AcademyPageClient items={items} />;
}
