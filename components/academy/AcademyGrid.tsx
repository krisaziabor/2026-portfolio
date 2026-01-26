'use client';

import { AcademyItem } from '@/lib/content';
import AcademyCard from './AcademyCard';

interface AcademyGridProps {
  items: AcademyItem[];
}

export default function AcademyGrid({ items }: AcademyGridProps) {
  // Base height for all cards (uniform baseline)
  const baseHeight = 500;
  // Max height variation - cards can be slightly taller but not much more
  const maxHeightVariation = 100;
  
  // Calculate height - uniform for most, slightly taller for 100% width
  const getHeightForItem = (item: AcademyItem): number => {
    const widthPercent = parseFloat(item.width.replace('%', ''));
    // 100% width cards can be taller
    if (widthPercent === 100) {
      return baseHeight + maxHeightVariation;
    }
    // All other cards use uniform height
    return baseHeight;
  };

  // Group items by row
  const rows = items.reduce((acc, item) => {
    if (!acc[item.row]) {
      acc[item.row] = [];
    }
    acc[item.row].push(item);
    return acc;
  }, {} as Record<number, AcademyItem[]>);

  const sortedRows = Object.entries(rows).sort(([a], [b]) => Number(a) - Number(b));

  return (
    <div className="flex flex-col gap-[var(--space-4)]">
      {sortedRows.map(([rowNumber, rowItems]) => (
        <div
          key={rowNumber}
          className="flex flex-col md:flex-row gap-[var(--space-4)] items-start"
        >
          {rowItems.map((item, index) => (
            <AcademyCard
              key={`${rowNumber}-${index}`}
              item={item}
              height={getHeightForItem(item)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
