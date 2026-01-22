import { ReactNode } from 'react';

interface PageShellProps {
  children: ReactNode;
  maxWidth?: 'default' | 'wide' | 'full';
}

export function PageShell({ children, maxWidth = 'default' }: PageShellProps) {
  const maxWidthClasses = {
    default: 'max-w-5xl',
    wide: 'max-w-7xl',
    full: 'max-w-none',
  };

  return (
    <div className="min-h-screen">
      <div
        className={`mx-auto px-8 py-12 ${maxWidthClasses[maxWidth]}`}
        style={{
          paddingLeft: 'var(--space-8)',
          paddingRight: 'var(--space-8)',
          paddingTop: 'var(--space-8)',
          paddingBottom: 'var(--space-8)',
        }}
      >
        {children}
      </div>
    </div>
  );
}
