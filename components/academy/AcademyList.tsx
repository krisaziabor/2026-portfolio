'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AcademyItem } from '@/lib/content';
import Image from 'next/image';
import AcademyVideo from './AcademyVideo';

interface AcademyListProps {
  items: AcademyItem[];
  isNavExpanded?: boolean;
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
    parts.push(
      <em key={`italic-${keyCounter++}`} className="whitespace-normal">
        {match[1]}
      </em>
    );
    lastIndex = regex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

export default function AcademyList({ items, isNavExpanded = false }: AcademyListProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = items[activeIndex];

  return (
    <motion.div 
      className="bg-white grid w-full grid-cols-1 md:grid-cols-[32%_68%] h-auto md:min-h-[728px]" 
      style={{ 
        borderRadius: '4px', 
        border: '1px solid #dbd8d8', 
        backgroundColor: '#FCFCFC',
        overflow: 'hidden',
        minWidth: 0
      }}
      animate={{
        y: isNavExpanded ? -96 : 0, // Push up when nav expands (expanded height ~72px + gap ~24px)
      }}
      transition={{
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {/* Left column - Titles list */}
      <div 
        className="flex flex-col order-2 md:order-1 md:h-full border-t border-[#EBEBEB] md:border-t-0 md:border-r"
        style={{
          padding: '16px 32px 16px 20px',
          minWidth: 0,
          overflow: 'auto',
          fontSize: '15px'
        }}
      >
        {items.map((item, index) => {
          const hasLink = !!item.link;
          const isActive = index === activeIndex;

          return (
            <div
              key={index}
              className="py-2"
            >
              {hasLink ? (
                <a
                  href={item.link!.startsWith('http') ? item.link! : `https://${item.link!}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-start whitespace-normal transition-colors duration-[var(--duration-default)] ${
                    isActive ? 'text-interactive' : 'text-content hover:text-interactive'
                  }`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={(e) => {
                    if (index !== activeIndex) {
                      e.preventDefault();
                      setActiveIndex(index);
                    }
                  }}
                >
                  <span className="min-w-0 flex-1 whitespace-normal">
                    {parseItalics(item.title)}
                  </span>
                </a>
              ) : (
                <div 
                  className={`text-content whitespace-normal transition-opacity duration-500 ease-in-out hover:opacity-50 ${
                    isActive ? 'opacity-50' : ''
                  }`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => setActiveIndex(index)}
                >
                  {parseItalics(item.title)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Right column - Media display */}
      <div 
        className="flex items-center justify-center order-1 md:order-2 min-h-0" 
        style={{ 
          padding: '28px', 
          minWidth: 0, 
          overflow: 'hidden',
          height: '100%',
        }}
      >
        {activeItem && (
          <div className="flex items-center justify-center w-full h-full" style={{ maxWidth: '100%', maxHeight: '100%' }}>
            {activeItem.contentBlocks.map((block, blockIndex) => (
              <div key={blockIndex} className="w-full h-full flex items-center justify-center min-h-0" style={{ maxWidth: '100%', maxHeight: '100%' }}>
                {block.type === 'image' && block.src && (
                  <div className="relative w-full h-full flex items-center justify-center" style={{ maxWidth: '100%', maxHeight: '100%' }}>
                    <Image
                      src={block.src}
                      alt={block.alt || ''}
                      width={1200}
                      height={800}
                      className="object-contain"
                      style={{ maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto' }}
                    />
                    {block.caption && (
                      <p className="text-metadata text-sm mt-[var(--space-2)]">
                        {block.caption}
                      </p>
                    )}
                  </div>
                )}

                {block.type === 'video' && (block.vimeoId || block.src) && (
                  <div className="w-full h-full flex items-center justify-center min-h-0" style={{ maxWidth: '100%', maxHeight: '100%' }}>
                    <div className="w-full h-full flex items-center justify-center min-h-0">
                      <AcademyVideo
                        vimeoId={block.vimeoId}
                        src={block.src}
                        alt={block.alt || ''}
                        caption={block.caption}
                      />
                    </div>
                  </div>
                )}

                {block.type === 'photo' && block.src && (
                  <div className="relative w-full h-full flex items-center justify-center" style={{ maxWidth: '100%', maxHeight: '100%' }}>
                    <Image
                      src={block.src}
                      alt={block.alt || ''}
                      width={1200}
                      height={800}
                      className="object-contain"
                      style={{ maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto' }}
                    />
                    {block.caption && (
                      <p className="text-metadata text-sm mt-[var(--space-2)]">
                        {block.caption}
                      </p>
                    )}
                  </div>
                )}

                {block.type === 'text' && block.content && (
                  <p className="text-content text-base leading-[var(--leading-body)]">
                    {block.content}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
