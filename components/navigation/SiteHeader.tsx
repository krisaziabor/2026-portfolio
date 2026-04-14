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
  const isPhotoPage = pathname === '/photo';
  const isWorkPage = pathname === '/' || pathname.startsWith('/work');
  const isDarkPage = isPhotoPage || isWorkPage;

  const bgColor = isDarkPage ? '#141414' : '#F8F8F8';
  const textColor = isDarkPage ? 'rgba(232, 230, 230, 0.85)' : '#000';
  const activeColor = isDarkPage ? 'rgba(232, 230, 230, 0.35)' : 'rgba(0, 0, 0, 0.35)';

  return (
    <header
      className="sticky top-0 z-50 flex flex-col sm:flex-row sm:items-baseline sm:justify-between font-[family-name:var(--font-lector)] px-6 pt-5 pb-4 md:px-[72px] md:pt-9 md:pb-6"
      style={{
        backgroundColor: bgColor,
        fontSize: '15px',
        letterSpacing: '-0.01em',
        lineHeight: '1.4',
        transition: 'background-color 300ms ease-out, color 300ms ease-out',
        color: textColor,
      }}
    >
      <Link
        href="/"
        className="hover:opacity-50 mb-2 sm:mb-0"
        style={{ color: textColor, transition: 'color 300ms ease-out, opacity 200ms ease-out' }}
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
              className="hover:opacity-50"
              style={{ color: isActive ? activeColor : textColor, transition: 'color 300ms ease-out, opacity 200ms ease-out' }}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
