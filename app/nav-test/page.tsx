import NavigationCard from '@/components/navigation/NavigationCard';

export default function NavTestPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="absolute left-8 top-8">
        <h1 className="mb-2 text-2xl">Navigation Card Test</h1>
        <p className="text-sm text-[#6B6B6B]">
          Click anywhere on the card to toggle between collapsed and expanded states.
        </p>
      </div>
      <div className="flex min-h-screen items-end justify-center pb-32">
        <NavigationCard currentPage={{ label: 'Photo', href: '/photo' }} />
      </div>
    </div>
  );
}
