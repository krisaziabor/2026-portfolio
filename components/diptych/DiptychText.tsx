import ReactMarkdown from 'react-markdown';

interface DiptychTextProps {
  content: string;
  sectionLabel?: string;
}

export function DiptychText({ content, sectionLabel }: DiptychTextProps) {
  return (
    <div className="flex flex-col">
      {sectionLabel && sectionLabel !== 'Overview' && (
        <p className="text-metadata text-sm mb-[var(--space-2)]">{sectionLabel}</p>
      )}
      <div className="prose prose-sm max-w-none [&_a]:text-black [&_a]:no-underline [&_a:hover]:text-[#8B6B5A] [&_a]:transition-colors [&_a]:duration-150">
        <ReactMarkdown
          components={{
            a: ({ href, children }) => (
              <a href={href}>
                {children}
              </a>
            ),
            h2: ({ children }) => (
              <h2 className="text-content text-xl font-normal mb-[var(--space-2)]">
                {children}
              </h2>
            ),
            p: ({ children }) => (
              <p className="text-content text-base leading-[var(--leading-body)] mb-[var(--space-2)] last:mb-0">
                {children}
              </p>
            ),
            strong: ({ children }) => (
              <strong className="font-bold text-content">{children}</strong>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
