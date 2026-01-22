import { PageShell } from '@/components/ui/PageShell';
import Image from 'next/image';

const externalLinks = [
  { label: 'LinkedIn', href: 'https://linkedin.com/in/krisaziabor' },
  { label: 'Email', href: 'mailto:kristopher.aziabor@yale.edu' },
  { label: 'Resume', href: '/resume.pdf' },
];

const bio = [
  'I am a design engineer in love with elevating minimalism and embracing friction to create traditions of love and exploration.',

  'I study Computer Science and Fine Arts at Yale and lead the university\'s design community & studio, forming & overseeing the largest ever designer cohort in Design at Yale\'s history. I\'ve previously worked at Kensho, S&P Global, Fidelity Investments, and cyclio.',

  'If I\'m not designing, you\'ll probably find me supporting Arsenal (this year is our year), playing pickleball and tennis, taking photos, writing, and listening to R&B.',

  'Welcome to my digital home! Thanks for stopping by <3'
];

const footer = {
  lastUpdated: 'January 2026',
  typeface: 'Lector by Forgotten Shapes',
  builtWith: 'Next.js',
};

export default function Colophon() {
  return (
    <PageShell maxWidth="wide">
      <div className="border border-gray-200 bg-white grid grid-cols-2 p-12">
        {/* Left Column */}
        <div className="flex flex-col justify-between h-full pr-8">
          {/* External Links */}
          <div className="flex flex-col gap-1">
            {externalLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-interactive hover:opacity-80"
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                {link.label} ↗
              </a>
            ))}
          </div>

          {/* Bio Paragraphs */}
          <div className="flex flex-col gap-6 my-8">
            <p>{bio[0]}</p>
            <p>
              I study Computer Science and Fine Arts at{' '}
              <a href="https://yale.edu" className="text-interactive hover:opacity-80" target="_blank" rel="noopener noreferrer">
                Yale
              </a>{' '}
              and lead the university&apos;s design community & studio, forming & overseeing the largest ever designer cohort in{' '}
              <a href="https://designatyale.com" className="text-interactive hover:opacity-80" target="_blank" rel="noopener noreferrer">
                Design at Yale&apos;s
              </a>{' '}
              history. I&apos;ve previously worked at{' '}
              <a href="https://kensho.com" className="text-interactive hover:opacity-80" target="_blank" rel="noopener noreferrer">
                Kensho
              </a>
              ,{' '}
              <a href="https://spglobal.com" className="text-interactive hover:opacity-80" target="_blank" rel="noopener noreferrer">
                S&P Global
              </a>
              ,{' '}
              <a href="https://fidelity.com" className="text-interactive hover:opacity-80" target="_blank" rel="noopener noreferrer">
                Fidelity Investments
              </a>
              , and{' '}
              <a href="https://cyclio.com" className="text-interactive hover:opacity-80" target="_blank" rel="noopener noreferrer">
                cyclio
              </a>
              .
            </p>
            <p>{bio[2]}</p>
            <p>{bio[3]}</p>
          </div>

          {/* Footer Metadata */}
          <div className="flex flex-col gap-1 text-metadata text-sm">
            <p>Last updated {footer.lastUpdated}</p>
            <p>Type in {footer.typeface}</p>
            <p>Built with {footer.builtWith}</p>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex items-center justify-center p-8">
          <div className="relative w-full aspect-[3/4] max-w-md">
            <Image
              src="/portrait-placeholder.svg"
              alt="Portrait of Kristopher Aziabor"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </PageShell>
  );
}
