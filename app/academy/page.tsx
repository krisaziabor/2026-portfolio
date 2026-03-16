import { getAllAcademyItems } from '@/lib/content';
import AcademyIndexLayout from '@/components/academy/AcademyIndexLayout';

export default function Academy() {
  const items = getAllAcademyItems();
  return <AcademyIndexLayout items={items} />;
}
