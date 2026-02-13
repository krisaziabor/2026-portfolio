'use client';

import ReactMarkdown from 'react-markdown';
import type { CaseStudy } from '@/types/case-study';
import { DiptychMediaRenderer } from '@/components/diptych/DiptychMedia';

interface CaseStudyTitleCardProps {
  caseStudy: CaseStudy;
}

export function CaseStudyTitleCard({ caseStudy }: CaseStudyTitleCardProps) {
  const hasMedia = caseStudy.diptychs.length > 0 && caseStudy.diptychs[0]?.media;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[40%_60%] w-full min-h-0 md:min-h-[728px]">
      {/* Right Column - Media: first on mobile (order-1), second on desktop (md:order-2) */}
      <div
        className="flex items-center justify-center order-1 md:order-2 border-b border-[#EBEBEB] md:border-b-0"
        style={{
          padding: '20px',
          minWidth: 0,
          overflow: 'hidden',
          backgroundColor: caseStudy.titleCardBackgroundColor || 'transparent',
        }}
      >
        {hasMedia ? (
          <div className="relative w-full min-h-0" style={{ aspectRatio: '16 / 9' }}>
            <DiptychMediaRenderer media={caseStudy.diptychs[0].media} />
          </div>
        ) : (
          <div className="relative w-full min-h-0" style={{ aspectRatio: '16 / 9' }} />
        )}
      </div>

      {/* Left Column - Text Content: second on mobile (order-2), first on desktop (md:order-1) */}
      <div
        className="flex flex-col font-[family-name:var(--font-lector)] lector-font md:border-r border-[#EBEBEB] order-2 md:order-1"
        style={{
          fontSize: '15px',
          padding: '16px 24px 16px 20px',
          justifyContent: 'space-between',
          minWidth: 0,
          overflow: 'hidden',
        }}
      >
        {/* Metadata at top */}
        {caseStudy.metadata && caseStudy.metadata.length > 0 && (
          <div className="flex flex-col" style={{ gap: '0px' }}>
            {caseStudy.metadata.map((item, index) => (
              <p key={index} className="text-base">
                <span style={{ fontWeight: 'normal', color: 'rgba(0, 0, 0, 0.5)' }}>{item.key}</span>{' '}
                <span style={{ color: '#000000' }}>{item.value}</span>
              </p>
            ))}
          </div>
        )}

        {/* Lede, SkipLink, and Summary stacked at bottom */}
        <div className="flex flex-col" style={{ color: '#000000', gap: '24px', marginTop: '32px' }}>
          {/* Lede */}
          {caseStudy.lede && (
            <div className="prose prose-sm max-w-none [&_a]:text-interactive [&_a]:no-underline [&_a:hover]:opacity-70 [&_a]:transition-opacity [&_a]:duration-[var(--duration-default)]">
              <ReactMarkdown
                components={{
                  a: ({ href, children }) => (
                    <a href={href} className="text-interactive" style={{ color: '#8B6B5A' }}>
                      {children}
                    </a>
                  ),
                  p: ({ children }) => (
                    <p className="text-content text-base leading-[var(--leading-body)] mb-[var(--space-2)] last:mb-0">
                      {children}
                    </p>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-normal text-content">{children}</strong>
                  ),
                }}
              >
                {caseStudy.lede}
              </ReactMarkdown>
            </div>
          )}

          {/* SkipLink */}
          {caseStudy.skipLink && (
            <a
              href={`#${caseStudy.skipLink.targetSection.toLowerCase()}`}
              className="hover:opacity-80 transition-opacity text-base"
              style={{ color: '#8B6B5A' }}
            >
              {caseStudy.skipLink.label} →
            </a>
          )}

          {/* Full-title */}
          {caseStudy.summary && (
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown
                components={{
                  p: ({ children }) => (
                    <p className="text-base leading-[var(--leading-body)]" style={{ color: 'rgba(0, 0, 0, 0.5)' }}>
                      {children}
                    </p>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-normal" style={{ color: 'rgba(0, 0, 0, 0.5)' }}>{children}</strong>
                  ),
                }}
              >
                {caseStudy.summary}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
