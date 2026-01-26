import { getAllAcademyItems } from '@/lib/content';
import AcademyCard from '@/components/academy/AcademyCard';
import NavigationCard from '@/components/navigation/NavigationCard';
import { PageShell } from '@/components/ui/PageShell';

export default function Academy() {
  const items = getAllAcademyItems();

  // Base height for all cards (uniform baseline)
  const baseHeight = 500; // Increased to accommodate image and text
  // Max height variation - cards can be slightly taller but not much more
  const maxHeightVariation = 100; // Max 100px taller than base
  
  // Calculate height - uniform for most, slightly taller for 100% width
  const getHeightForItem = (item: typeof items[0]): number => {
    const widthPercent = parseFloat(item.width.replace('%', ''));
    // 100% width cards can be taller
    if (widthPercent === 100) {
      return baseHeight + maxHeightVariation;
    }
    // All other cards use uniform height with slight variation based on content
    return baseHeight;
  };

  // Map width to grid column span
  // 100% width spans 2 columns (full width), everything else spans 1 column (pairs)
  const getGridColumnSpan = (width: string): number => {
    const widthPercent = parseFloat(width.replace('%', ''));
    if (widthPercent === 100) {
      return 2; // Full width
    }
    return 1; // Half width (pairs)
  };

  return (
    <>
      <PageShell maxWidth="92rem">
        <div 
          className="grid gap-[var(--space-4)]"
          style={{
            gridTemplateColumns: 'repeat(2, 1fr)',
            gridAutoFlow: 'dense',
            alignItems: 'start',
          }}
        >
          {items.map((item, index) => {
            const cardHeight = getHeightForItem(item);
            const columnSpan = getGridColumnSpan(item.width);
            return (
              <div
                key={index}
                style={{
                  gridColumn: `span ${columnSpan}`,
                  height: 'fit-content',
                }}
              >
                <AcademyCard 
                  item={item} 
                  height={cardHeight}
                />
              </div>
            );
          })}
        </div>
      </PageShell>

      {/* Sticky Navigation Card */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-8 pointer-events-none">
        <div className="pointer-events-auto">
          <NavigationCard />
        </div>
      </div>
    </>
  );
}
