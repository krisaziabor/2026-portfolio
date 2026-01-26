'use client';

import React from 'react';
import { AcademyItem } from '@/lib/content';
import AcademyVideo from './AcademyVideo';
import Image from 'next/image';

interface AcademyCardProps {
  item: AcademyItem;
  height: number;
}

// Helper function to parse markdown-style italics (*text*)
function parseItalics(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /\*([^*]+)\*/g;
  let lastIndex = 0;
  let match;
  let keyCounter = 0;

  while ((match = regex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    // Add italicized text
    parts.push(<em key={`italic-${keyCounter++}`}>{match[1]}</em>);
    lastIndex = regex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

export default function AcademyCard({ item, height }: AcademyCardProps) {
  return (
    <div className="w-full flex">
      <div
        className="bg-background flex flex-col w-full"
        style={{
          border: '0.5225px solid #DBD8D8',
          borderRadius: '2px',
          minHeight: `${height}px`,
          height: 'auto',
        }}
      >
        {/* Media area with padding */}
        <div className="p-[var(--space-6)] flex flex-col flex-1 items-center justify-center" style={{ minHeight: 0, flexShrink: 1 }}>
          {item.contentBlocks.map((block, index) => (
            <div key={index} className="w-full flex items-center justify-center">
              {block.type === 'image' && block.src && (
                <div className="relative w-full flex items-center justify-center" style={{ width: '85%', maxHeight: 'calc(100% - 60px)' }}>
                  <Image
                    src={block.src}
                    alt={block.alt || ''}
                    width={1200}
                    height={800}
                    className="w-full h-auto object-contain"
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  />
                  {block.caption && (
                    <p className="text-metadata text-sm mt-[var(--space-2)]">
                      {block.caption}
                    </p>
                  )}
                </div>
              )}

              {block.type === 'video' && block.src && (
                <div className="w-full flex items-center justify-center" style={{ width: '85%' }}>
                  <AcademyVideo src={block.src} alt={block.alt || ''} caption={block.caption} />
                </div>
              )}

              {block.type === 'text' && block.content && (
                <p className="text-content text-base leading-[var(--leading-body)]">{block.content}</p>
              )}
            </div>
          ))}
        </div>

        {/* Title and optional link - positioned at bottom left with reduced padding */}
        <div className="pr-[var(--space-6)] pl-[var(--space-2)] pb-[var(--space-2)] pt-[var(--space-2)] flex-shrink-0">
          <div className="flex items-start gap-1">
            <h2 className="text-content text-base leading-[var(--leading-body)]">
              {parseItalics(item.title)}
            </h2>
            {item.link && (
              <a
                href={item.link.startsWith('http') ? item.link : `https://${item.link}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-interactive hover:opacity-70 transition-opacity duration-[var(--duration-default)] text-sm"
              >
                ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
