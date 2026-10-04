import HomeClient from '@/components/home/HomeClient';
import { getPhotos } from '@/lib/photos';

export default function Home() {
  return <HomeClient photos={getPhotos()} />;
}
