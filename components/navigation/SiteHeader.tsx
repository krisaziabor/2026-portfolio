'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { label: 'Work', href: '/' },
  { label: 'Academy', href: '/academy' },
  { label: 'Photo', href: '/photo' },
  { label: 'Colophon', href: '/colophon' },
];

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-50 flex flex-col sm:flex-row sm:items-baseline sm:justify-between font-[family-name:var(--font-lector)] px-6 pt-5 pb-4 md:px-[72px] md:pt-9 md:pb-6"
      style={{
        backgroundColor: '#F8F8F8',
        fontSize: '15px',
        letterSpacing: '-0.01em',
        lineHeight: '1.4',
      }}
    >
      <Link
        href="/"
        className="transition-opacity duration-200 hover:opacity-50 mb-2 sm:mb-0"
        style={{ color: '#000' }}
      >
        Kristopher Aziabor
      </Link>
      <nav className="flex items-baseline gap-4">
        {navLinks.map((link) => {
          const isActive =
            link.href === '/'
              ? pathname === '/' || pathname.startsWith('/work')
              : pathname === link.href || pathname.startsWith(link.href + '/');
          return (
            <Link
              key={link.href}
              href={link.href}
              className="transition-opacity duration-200 hover:opacity-50"
              style={{ color: isActive ? 'rgba(0, 0, 0, 0.35)' : '#000' }}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
