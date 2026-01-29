'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import NavigationCard from '@/components/navigation/NavigationCard';

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
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ backgroundColor: '#F8F8F8' }}>
      <div className="flex items-center justify-center min-h-screen py-12 px-8 pb-32">
        <div className="flex flex-col items-center w-full" style={{ maxWidth: 'clamp(600px, 62.5%, 1200px)', gap: '32px', paddingBottom: '30px' }}>
        <motion.div 
          className="bg-white grid w-full grid-cols-1 md:grid-cols-[43%_57%] h-auto md:min-h-[728px]" 
          style={{ 
            borderRadius: '4px', 
            border: '1px solid #dbd8d8', 
            backgroundColor: '#FCFCFC',
            overflow: 'hidden',
            minWidth: 0
          }}
          animate={{
            y: isNavExpanded ? -96 : 0, // Push up when nav expands (expanded height ~72px + gap ~24px)
          }}
          transition={{
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {/* Right Column - appears first on mobile */}
          <div className="flex items-center justify-center order-1 md:order-2" style={{ padding: '28px', minWidth: 0, overflow: 'hidden' }}>
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

          {/* Left Column - appears second on mobile */}
          <div
            className="flex flex-col font-[family-name:var(--font-lector)] lector-font order-2 md:order-1 md:h-full border-t border-[#EBEBEB] md:border-t-0 md:border-r"
            style={{
              fontSize: '15px',
              padding: '16px 24px 16px 20px',
              justifyContent: 'space-between',
              minWidth: 0,
              overflow: 'hidden'
            }}
          >
            {/* External Links */}
            <div className="flex flex-col" style={{ gap: '0px' }}>
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
            <div className="flex flex-col" style={{ color: '#000000', gap: '24px', marginTop: '32px', marginBottom: '32px' }}>
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
            <div className="flex flex-col" style={{ fontSize: '15px', color: 'rgba(0, 0, 0, 0.5)', gap: '0px' }}>
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
        </motion.div>
        </div>
      </div>

      {/* Sticky Navigation Card */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-8 pointer-events-none">
        <div className="pointer-events-auto">
          <NavigationCard 
            currentPage={{ label: 'Colophon', href: '/colophon' }}
            onExpandedChange={setIsNavExpanded}
          />
        </div>
      </div>
    </div>
  );
}
