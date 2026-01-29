import NavigationCard from '@/components/navigation/NavigationCard';
import { getPhotos } from '@/lib/photos';

export default function Photo() {
  const photos = getPhotos();

  return (
    <>
      <main className="min-h-screen p-8">
        <div className="flex flex-col gap-12 pb-32">
          <div>
            <h1 className="text-content mb-2">Photo</h1>
          </div>

          <div className="flex flex-col gap-12">
            {photos.map((photo) => (
              <figure key={`${photo.index}-${photo.src}`} className="flex flex-col gap-4">
                <figcaption className="text-metadata">{photo.title}</figcaption>
                <img
                  src={photo.src}
                  alt={photo.title}
                  className="w-full h-auto"
                  loading={photo.index === 1 ? 'eager' : 'lazy'}
                />
              </figure>
            ))}
          </div>
        </div>
      </main>

      {/* Sticky Navigation Card */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-8 pointer-events-none">
        <div className="pointer-events-auto">
          <NavigationCard />
        </div>
      </div>
    </>
  );
}
