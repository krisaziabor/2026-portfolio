import type { Metadata } from 'next';
import '@/styles/globals.css';
import localFont from 'next/font/local';

const lectorFont = localFont({
  src: '../public/fonts/LectorRegular.woff2',
  display: 'swap',
  variable: '--font-lector',
  weight: '400',
  style: 'normal',
});

const lectorFontBold = localFont({
  src: '../public/fonts/LectorBold.woff2',
  display: 'swap',
  variable: '--font-lector-bold',
  weight: '700',
  style: 'normal',
});

const lectorFontItalic = localFont({
  src: '../public/fonts/LectorItalic.woff2',
  display: 'swap',
  variable: '--font-lector-italic',
  weight: '400',
  style: 'italic',
});

export const metadata: Metadata = {
  title: 'Kristopher Aziabor',
  description: 'A machine for reading design and development work',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${lectorFont.variable} ${lectorFontBold.variable} ${lectorFontItalic.variable}`}>{children}</body>
    </html>
  );
}
