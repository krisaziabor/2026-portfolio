import Image from 'next/image';
import Link from 'next/link';

const externalLinks = [
  { label: 'LinkedIn', href: 'https://linkedin.com/in/krisaziabor' },
  { label: 'Email', href: 'mailto:kris.aziabor@yale.edu' },
  { label: 'Resume', href: '/resume.pdf' },
];

const bio = [
  'I am a design engineer in love with tracing origins, elevating minimalism and embracing friction to create traditions of love and exploration.',

  'I study Computer Science and Fine Arts at Yale and lead the university\'s design community & studio, forming & overseeing the largest ever designer cohort in Design at Yale\'s history. I\'ve previously worked at Kensho, S&P Global, Fidelity Investments, and cyclio.',

  'If I\'m not designing, you\'ll probably find me supporting Arsenal (this year is our year), playing pickleball and tennis, taking photos, writing, and listening to R&B.',

  'Welcome to my home!'
];

const footer = {
  lastUpdated: 'January 2026',
  typeface: 'Lector by Forgotten Shapes',
  builtWith: 'Next.js (alongside Framer, Cursor & Claude)',
};

export default function Colophon() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="flex items-center justify-center min-h-screen py-12 px-8">
        <div className="flex flex-col items-center w-full" style={{ maxWidth: '60%', gap: '32px' }}>
        <div className="bg-white grid w-full" style={{ gridTemplateColumns: '43% 57%', height: '728px', borderRadius: '4px', border: '1px solid #dbd8d8', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
          {/* Left Column */}
          <div
            className="flex flex-col justify-between h-full font-[family-name:var(--font-lector)] lector-font"
            style={{
              fontSize: '15px',
              borderRight: '1px solid #EBEBEB',
              padding: '16px 24px 16px 20px'
            }}
          >
            {/* External Links */}
            <div className="flex flex-col" style={{ gap: '2px' }}>
              {externalLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="hover:opacity-80"
                  style={{ color: '#946851' }}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  {link.label} ↗
                </a>
              ))}
            </div>

            {/* Bio Paragraphs */}
            <div className="flex flex-col gap-6 my-8" style={{ color: '#000000' }}>
              <p>{bio[0]}</p>
              <p>
                I study Computer Science and Fine Arts at{' '}
                <a href="https://yale.edu" className="hover:opacity-80" style={{ color: '#946851' }} target="_blank" rel="noopener noreferrer">
                  Yale
                </a>{' '}
                and lead the university&apos;s design community & studio, forming & overseeing the largest ever designer cohort in{' '}
                <a href="https://designatyale.com" className="hover:opacity-80" style={{ color: '#946851' }} target="_blank" rel="noopener noreferrer">
                  Design at Yale&apos;s
                </a>{' '}
                history. I&apos;ve previously worked at{' '}
                <a href="https://kensho.com" className="hover:opacity-80" style={{ color: '#946851' }} target="_blank" rel="noopener noreferrer">
                  Kensho
                </a>
                ,{' '}
                <a href="https://spglobal.com" className="hover:opacity-80" style={{ color: '#946851' }} target="_blank" rel="noopener noreferrer">
                  S&P Global
                </a>
                ,{' '}
                <a href="https://fidelity.com" className="hover:opacity-80" style={{ color: '#946851' }} target="_blank" rel="noopener noreferrer">
                  Sea12
                </a>
                ,{' '}
                <a href="https://fidelity.com" className="hover:opacity-80" style={{ color: '#946851' }} target="_blank" rel="noopener noreferrer">
                  Fidelity Investments
                </a>
                , and{' '}
                <a href="https://cyclio.com" className="hover:opacity-80" style={{ color: '#946851' }} target="_blank" rel="noopener noreferrer">
                  cyclio
                </a>
                .
              </p>
              <p>{bio[2]}</p>
              <p>{bio[3]}</p>
            </div>

            {/* Footer Metadata */}
            <div className="flex flex-col gap-1" style={{ fontSize: '15px', color: 'rgba(0, 0, 0, 0.5)' }}>
              <p>Last updated {footer.lastUpdated}</p>
              <p>
                Type in{' '}
                <a
                  href="https://forgotten-shapes.com/lector?article=lector"
                  className="hover:opacity-80"
                  style={{ color: 'rgba(0, 0, 0, 0.5)' }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {footer.typeface} ↗
                </a>
              </p>
              <p>Built with {footer.builtWith}</p>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex items-center justify-center" style={{ padding: '28px' }}>
            <div className="relative aspect-[3/4]" style={{ width: '80%', height: '80%', maxWidth: '80%', maxHeight: '80%' }}>
              <Image
                src="/KristopherAziaborPortrait.jpeg"
                alt="Portrait of Kristopher Aziabor"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 60vw"
              />
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div
          className="flex justify-center items-center font-[family-name:var(--font-lector)] lector-font"
          style={{ gap: '100px' }}
        >
          <Link
            href="/"
            className="rounded border hover:opacity-80"
            style={{
              color: '#000000',
              borderColor: '#dbd8d8',
              padding: '20px 36px',
              backgroundColor: '#FFFFFF'
            }}
          >
            Kristopher Aziabor
          </Link>
          <Link
            href="/colophon"
            className="rounded border hover:opacity-80"
            style={{
              color: '#000000',
              borderColor: '#dbd8d8',
              padding: '20px 36px',
              backgroundColor: '#FFFFFF'
            }}
          >
            Colophon
          </Link>
        </div>
        </div>
      </div>
    </div>
  );
}
