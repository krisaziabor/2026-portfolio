import ReactMarkdown from 'react-markdown';

interface DiptychTextProps {
  content: string;
  sectionLabel?: string;
}

export function DiptychText({ content, sectionLabel }: DiptychTextProps) {
  return (
    <div className="flex flex-col h-full">
      {sectionLabel && (
        <p className="text-metadata text-sm mb-[var(--space-2)]">{sectionLabel}</p>
      )}
      <div className="prose prose-sm max-w-none flex-1 [&_a]:text-interactive [&_a]:no-underline [&_a:hover]:opacity-70 [&_a]:transition-opacity [&_a]:duration-[var(--duration-default)]">
        <ReactMarkdown
          components={{
            a: ({ href, children }) => (
              <a href={href} className="text-interactive">
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
              <strong className="font-normal text-content">{children}</strong>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
