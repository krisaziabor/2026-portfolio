import ReactMarkdown from 'react-markdown';
import type { ReactNode } from 'react';

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
  'prose prose-sm font-[family-name:var(--font-lector)] lector-font [&_a]:text-black [&_a:hover]:text-[#8B6B5A] [&_a]:transition-colors [&_a]:duration-150 [&_a]:no-underline [&_p]:mb-[var(--space-2)] [&_p:last-child]:mb-0 [&_p]:max-w-full [&_h2]:mt-[var(--space-2)] [&_h2]:mb-[var(--space-2)] [&_h2]:font-normal [&_ul]:my-[var(--space-2)] [&_ul]:max-w-full [&_li]:mb-1';

export function CaseStudyQuestionCallout({
  markdown,
  contentPaddingLeft,
  contentPaddingRight,
}: {
  markdown: string;
  contentPaddingLeft: number;
  contentPaddingRight: number;
}) {
  const commonTextStyles = {
    fontSize: '15px',
    lineHeight: 'var(--leading-body)',
    letterSpacing: 'var(--tracking-body)',
    color: 'var(--color-content)',
  } as const;

  const barWidthPx = 6;
  const calloutClasses =
    'relative my-[clamp(var(--space-6),6vw,var(--space-8))] px-0 py-[16px]';

  const fullBleedStyle = {
    marginLeft: -contentPaddingLeft,
    marginRight: -contentPaddingRight,
    width: `calc(100% + ${contentPaddingLeft + contentPaddingRight}px)`,
  } as const;

  const barStyle = {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: `${barWidthPx}px`,
    backgroundColor: 'var(--color-interactive)',
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
      <a href={href}>
        {children}
      </a>
    ),
    strong: ({ children }: { children?: ReactNode }) => (
      <strong className="font-bold">{children}</strong>
    ),
    em: ({ children }: { children?: ReactNode }) => <span>{children}</span>,
  };

  return (
    <div className="relative block my-0" style={fullBleedStyle}>
      <span aria-hidden="true" style={barStyle} />
      <div
        className="min-w-0"
        style={{
          paddingLeft: contentPaddingLeft,
          paddingRight: contentPaddingRight,
        }}
      >
        <div className={`${proseClasses} min-w-0 max-w-full md:max-w-[50%] md:[&_p]:max-w-full`} style={commonTextStyles}>
          <div className={calloutClasses}>
            <ReactMarkdown components={markdownComponents}>{markdown}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}

