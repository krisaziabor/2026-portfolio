'use client';

import ReactMarkdown from 'react-markdown';
import type { ReactNode } from 'react';
import type { CaseStudyTextSplitBlock as TextSplitBlockProps } from '@/types/case-study';

function getHeadingText(children: ReactNode): string {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) return children.map(getHeadingText).join('');
  return '';
}

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

const proseClasses =
  'prose prose-sm max-w-none font-[family-name:var(--font-lector)] lector-font [&_a]:text-interactive [&_a]:no-underline [&_a:hover]:opacity-70 [&_a]:transition-opacity [&_a]:duration-[var(--duration-default)] [&_p]:mb-[var(--space-2)] [&_p:last-child]:mb-0 [&_p]:max-w-full [&_h2]:mt-[var(--space-2)] [&_h2]:mb-[var(--space-2)] [&_h2]:font-normal [&_ul]:my-[var(--space-2)] [&_ul]:max-w-full [&_li]:mb-1';

export function CaseStudyTextSplitBlock({ block }: { block: TextSplitBlockProps }) {
  const commonTextStyles = {
    fontSize: '15px',
    lineHeight: 'var(--leading-body)',
    letterSpacing: 'var(--tracking-body)',
    color: 'var(--color-content)',
  } as const;

  const markdownComponents = {
    h2: ({ children }: { children?: ReactNode }) => {
      const text = getHeadingText(children);
      const id = slugifyHeading(text) || 'section';
      return (
        <h2 id={id} className="scroll-mt-6" style={{ color: 'var(--color-metadata)' }}>
          {children}
        </h2>
      );
    },
    a: ({ href, children }: { href?: string; children?: ReactNode }) => (
      <a href={href} style={{ color: 'var(--color-interactive)' }}>
        {children}
      </a>
    ),
    strong: ({ children }: { children?: ReactNode }) => (
      <strong className="font-bold">{children}</strong>
    ),
  };

  return (
    <div
      className="grid items-start my-[var(--space-4)] w-full"
      style={{
        gridTemplateColumns: '1fr 1fr',
        gap: 'var(--space-3)',
      }}
    >
      <div className={`min-w-0 ${proseClasses}`} style={commonTextStyles}>
        <ReactMarkdown components={markdownComponents}>{block.left}</ReactMarkdown>
      </div>
      <div className={`min-w-0 ${proseClasses}`} style={commonTextStyles}>
        <ReactMarkdown components={markdownComponents}>{block.right}</ReactMarkdown>
      </div>
    </div>
  );
}

