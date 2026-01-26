import { ReactNode } from 'react';

interface PageShellProps {
  children: ReactNode;
  maxWidth?: 'default' | 'wide' | 'full' | string;
}

export function PageShell({ children, maxWidth = 'default' }: PageShellProps) {
  const maxWidthClasses = {
    default: 'max-w-5xl',
    wide: 'max-w-7xl',
    full: 'max-w-none',
  };

  const maxWidthStyle = typeof maxWidth === 'string' && !maxWidthClasses[maxWidth as keyof typeof maxWidthClasses]
    ? { maxWidth: maxWidth }
    : {};

  const maxWidthClass = typeof maxWidth === 'string' && maxWidthClasses[maxWidth as keyof typeof maxWidthClasses]
    ? maxWidthClasses[maxWidth as keyof typeof maxWidthClasses]
    : typeof maxWidth === 'string'
    ? ''
    : maxWidthClasses[maxWidth];

  return (
    <div className="min-h-screen">
      <div
        className={`mx-auto px-8 py-12 ${maxWidthClass}`}
        style={{
          paddingLeft: 'var(--space-8)',
          paddingRight: 'var(--space-8)',
          paddingTop: 'var(--space-8)',
          paddingBottom: 'var(--space-8)',
          ...maxWidthStyle,
        }}
      >
        {children}
      </div>
    </div>
  );
}
