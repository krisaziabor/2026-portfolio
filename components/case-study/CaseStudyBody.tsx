'use client';

import ReactMarkdown from 'react-markdown';
import type { ReactNode, ComponentPropsWithoutRef } from 'react';
import type { CaseStudy, CaseStudyBodyBlock } from '@/types/case-study';
import { CaseStudySplitBlock } from './CaseStudySplitBlock';
import { VimeoEmbedFigure } from './VimeoEmbedFigure';

interface CaseStudyBodyProps {
  caseStudy: CaseStudy;
}

function normalizeBody(body: string | CaseStudyBodyBlock[]): CaseStudyBodyBlock[] {
  return typeof body === 'string' ? [{ type: 'markdown', content: body }] : body;
}

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

function getHeadingText(children: ReactNode): string {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) return children.map(getHeadingText).join('');
  return '';
}

/* Horizontal padding of the case study content area (must match CaseStudyLayout) for full-bleed breakout */
const CONTENT_PADDING_LEFT = 20;
const CONTENT_PADDING_RIGHT = 24;

const proseClasses =
  'prose prose-sm max-w-none font-[family-name:var(--font-lector)] lector-font [&_a]:text-interactive [&_a]:no-underline [&_a:hover]:opacity-70 [&_a]:transition-opacity [&_a]:duration-[var(--duration-default)] [&_p]:mb-[var(--space-2)] [&_p:last-child]:mb-0 [&_p]:max-w-[50%] [&_p:has(>figure)]:max-w-none [&_p:has(>figure)]:w-full [&_h2]:mt-[var(--space-6)] [&_h2]:mb-[var(--space-2)] [&_h2]:font-normal [&_h2]:max-w-[50%] [&_ul]:my-[var(--space-2)] [&_ul]:max-w-[50%] [&_li]:mb-1';

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
  h3: ({ children }: { children?: ReactNode }) => {
    const text = getHeadingText(children);
    const id = slugifyHeading(text) || 'section';
    return (
      <h3 id={id} className="scroll-mt-6 italic mb-[var(--space-2)]" style={{ color: 'var(--color-metadata)' }}>
        {children}
      </h3>
    );
  },
  a: ({ href, children }: { href?: string; children?: ReactNode }) => (
    <a href={href} style={{ color: 'var(--color-interactive)' }}>
      {children}
    </a>
  ),
  strong: ({ children }: { children?: ReactNode }) => (
    <strong className="font-normal">{children}</strong>
  ),
  img: (props: ComponentPropsWithoutRef<'img'>) => {
    const srcStr = typeof props.src === 'string' ? props.src : null;
    const caption = props.alt ?? '';
    const fullBleedStyle = {
      marginLeft: -CONTENT_PADDING_LEFT,
      marginRight: -CONTENT_PADDING_RIGHT,
      width: `calc(100% + ${CONTENT_PADDING_LEFT + CONTENT_PADDING_RIGHT}px)`,
      marginTop: 'var(--space-4)',
      marginBottom: 0,
    } as const;
    const captionStyle = {
      fontFamily: 'var(--font-lector)',
      fontStyle: 'italic',
      fontSize: '13px',
      lineHeight: 'var(--leading-body)',
      letterSpacing: 'var(--tracking-body)',
      color: 'var(--color-metadata)',
      paddingTop: 'var(--space-1)',
      paddingBottom: 'var(--space-4)',
      paddingLeft: CONTENT_PADDING_LEFT,
      paddingRight: CONTENT_PADDING_RIGHT,
    } as const;

    // Check if src is a Vimeo video. Use path-style /vimeo/VIDEO_ID (sanitizer-safe) or legacy vimeo:VIDEO_ID
    const vimeoMatch =
      srcStr?.match(/^\/vimeo\/(\d+)(?:\?(.+))?$/) ?? srcStr?.match(/^vimeo:(\d+)(?:\?(.+))?$/);
    if (vimeoMatch) {
      const vimeoId = vimeoMatch[1];
      const params = vimeoMatch[2] ? new URLSearchParams(vimeoMatch[2]) : null;
      const hasAudio = params?.get('hasAudio') === 'true';
      const posterTime = params?.get('posterTime') ? Number(params.get('posterTime')) : undefined;
      const showVideoSettings = params?.get('showVideoSettings') === 'true';
      const backgroundColor = params?.get('backgroundColor') ?? undefined;

      return (
        <VimeoEmbedFigure
          vimeoId={vimeoId}
          hasAudio={hasAudio}
          posterTime={posterTime}
          caption={caption}
          showVideoSettings={showVideoSettings}
          backgroundColor={backgroundColor}
          figureStyle={fullBleedStyle}
          captionStyle={captionStyle}
        />
      );
    }

    // Regular image
    if (!srcStr) return null;
    return (
      <figure className="block my-0" style={fullBleedStyle}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={srcStr}
          alt={caption}
          className="block w-full h-auto"
          style={{ display: 'block', verticalAlign: 'middle' }}
        />
        {caption ? (
          <figcaption className="max-w-full md:max-w-[50%]" style={captionStyle}>{caption}</figcaption>
        ) : null}
      </figure>
    );
  },
};

export function CaseStudyBody({ caseStudy }: CaseStudyBodyProps) {
  const blocks = normalizeBody(caseStudy.body);

  return (
    <div
      className={proseClasses}
      style={{
        fontSize: '15px',
        lineHeight: 'var(--leading-body)',
        letterSpacing: 'var(--tracking-body)',
        color: 'var(--color-content)',
      }}
    >
      {blocks.map((block, index) =>
        block.type === 'markdown' ? (
          <ReactMarkdown key={index} components={markdownComponents}>
            {block.content}
          </ReactMarkdown>
        ) : (
          <CaseStudySplitBlock key={index} block={block} />
        )
      )}
    </div>
  );
}
