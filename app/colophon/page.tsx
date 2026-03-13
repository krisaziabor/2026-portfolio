import Image from 'next/image';
import SiteHeader from '@/components/navigation/SiteHeader';

const externalLinks = [
  { label: 'LinkedIn', href: 'https://linkedin.com/in/krisaziabor' },
  { label: 'Email', href: 'mailto:kris.aziabor@yale.edu' },
  { label: 'Resume', href: '/resume.pdf' },
];

export default function Colophon() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F8F8F8' }}>
      <SiteHeader />

      {/* Spacer pushes content toward bottom on larger screens */}
      <div className="flex-1 min-h-[32px]" />

      {/* Content — links, bio, portrait all tightly grouped */}
      <div
        className="font-[family-name:var(--font-lector)] px-6 pb-12 md:px-[72px] md:pb-20"
        style={{
          fontSize: '15px',
          letterSpacing: '-0.01em',
          lineHeight: '1.4',
          color: '#000',
        }}
      >
        {/* Links */}
        <div className="flex items-baseline flex-wrap" style={{ gap: '20px', marginBottom: '16px' }}>
          {externalLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="transition-colors duration-200 hover:text-[#8B6B5A]"
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Bio */}
        <div className="flex flex-col" style={{ maxWidth: '520px', gap: '16px', marginBottom: '48px' }}>
          <p>
            I am in my final semester studying Computer Science and Fine Arts at Yale and led the
            university&apos;s design community &amp; studio, forming &amp; overseeing the largest
            ever designer cohort in{' '}
            <a
              href="https://designatyale.com"
              className="transition-colors duration-200 hover:text-[#8B6B5A]"
              target="_blank"
              rel="noopener noreferrer"
            >
              Design at Yale
            </a>
            &apos;s history.
          </p>
          <p>
            I&apos;ve previously interned as a designer and engineer at companies including{' '}
            <a
              href="https://kensho.com"
              className="transition-colors duration-200 hover:text-[#8B6B5A]"
              target="_blank"
              rel="noopener noreferrer"
            >
              Kensho
            </a>
            ,{' '}
            <a
              href="https://spglobal.com"
              className="transition-colors duration-200 hover:text-[#8B6B5A]"
              target="_blank"
              rel="noopener noreferrer"
            >
              S&amp;P Global
            </a>
            , and{' '}
            <a
              href="https://fidelity.com"
              className="transition-colors duration-200 hover:text-[#8B6B5A]"
              target="_blank"
              rel="noopener noreferrer"
            >
              Fidelity Investments
            </a>
            .
          </p>
          <p>
            Away from my computer, you&apos;ll probably find me supporting Arsenal, playing
            pickleball and tennis, taking photos, writing, and listening to R&amp;B.
          </p>
        </div>

        {/* Portrait + metadata — stacked on mobile, side by side on desktop */}
        <div className="flex flex-col md:flex-row md:items-end" style={{ gap: '24px' }}>
          <div className="relative w-full md:w-[525px] md:shrink-0">
            <Image
              src="/KristopherAziaborPortrait.jpeg"
              alt="Portrait of Kristopher Aziabor"
              width={525}
              height={700}
              className="object-cover w-full h-auto"
            />
          </div>

          <div
            className="flex flex-col"
            style={{ color: '#6B6B6B', gap: '0px', paddingBottom: '4px' }}
          >
            <p>Last updated March 2026</p>
            <p>Type in Lector by Forgotten Shapes</p>
            <p>Built with Next.js and Cursor</p>
            <p>Image taken by Nico Prescott, Cynthia Lin, &amp; Mona Chen</p>
          </div>
        </div>
      </div>
    </div>
  );
}
