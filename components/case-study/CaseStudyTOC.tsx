'use client';

import { useState, useEffect, useMemo } from 'react';
import type { CaseStudy, CaseStudyBodyBlock } from '@/types/case-study';

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

function extractH2s(body: string | CaseStudyBodyBlock[]): { text: string; id: string }[] {
  const blocks =
    typeof body === 'string' ? [{ type: 'markdown' as const, content: body }] : body;
  const headings: { text: string; id: string }[] = [];

  for (const block of blocks) {
    if (block.type === 'markdown') {
      for (const line of block.content.split('\n')) {
        const match = line.match(/^## (.+)$/);
        if (match) {
          const text = match[1].trim();
          headings.push({ text, id: slugifyHeading(text) || 'section' });
        }
      }
    }
  }

  return headings;
}

interface CaseStudyTOCProps {
  caseStudy: CaseStudy;
  scrollContainerId: string;
}

export function CaseStudyTOC({ caseStudy, scrollContainerId }: CaseStudyTOCProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const headings = useMemo(() => extractH2s(caseStudy.body), [caseStudy.body]);

  useEffect(() => {
    if (headings.length === 0) return;
    const scrollRoot = document.getElementById(scrollContainerId);
    if (!scrollRoot) return;

    const handleScroll = () => {
      const rootRect = scrollRoot.getBoundingClientRect();
      const threshold = rootRect.top + scrollRoot.clientHeight * 0.25;

      let active: string | null = null;
      for (const { id } of headings) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= threshold) {
          active = id;
        }
      }
      setActiveId(active);
    };

    scrollRoot.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => scrollRoot.removeEventListener('scroll', handleScroll);
  }, [headings, scrollContainerId]);

  return (
    <nav
      className="flex flex-col font-[family-name:var(--font-lector)]"
      style={{ gap: '8px' }}
    >
      {/* Lede — always first, active when above all H2s */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          const scrollRoot = document.getElementById(scrollContainerId);
          if (scrollRoot) scrollRoot.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="transition-colors duration-200"
        style={{
          fontSize: '15px',
          letterSpacing: '-0.01em',
          lineHeight: '1.4',
          color: activeId === null ? 'var(--color-content)' : 'var(--color-metadata)',
        }}
      >
        Lede
      </a>

      {headings.map(({ text, id }) => (
        <a
          key={id}
          href={`#${id}`}
          onClick={(e) => {
            e.preventDefault();
            document
              .getElementById(id)
              ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className="transition-colors duration-200"
          style={{
            fontSize: '15px',
            letterSpacing: '-0.01em',
            lineHeight: '1.4',
            color: activeId === id ? 'var(--color-content)' : 'var(--color-metadata)',
          }}
        >
          {text}
        </a>
      ))}
    </nav>
  );
}
