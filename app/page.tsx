import Link from 'next/link';
import Image from 'next/image';
import SiteHeader from '@/components/navigation/SiteHeader';
import { caseStudies } from '@/content/case-studies';
import type { CaseStudyHeroMedia } from '@/types/case-study';

function renderWithMarkdown(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /\*([^*]+)\*/g;
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    parts.push(<em key={match.index}>{match[1]}</em>);
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts.length > 0 ? parts : text;
}

function HeroMedia({ media, backgroundColor }: { media: CaseStudyHeroMedia; backgroundColor: string }) {
  if (media.type === 'image') {
    return (
      <div className="relative w-full h-full" style={{ backgroundColor }}>
        <Image
          src={media.src}
          alt={media.alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 62.5vw"
        />
      </div>
    );
  }
  if (media.type === 'video' && media.vimeoId) {
    const hasAudio = media.hasAudio ?? false;
    const embedParams = new URLSearchParams({
      ...(hasAudio ? {} : { background: '1', autoplay: '1', loop: '1', muted: '1' }),
    });
    const embedUrl = `https://player.vimeo.com/video/${media.vimeoId}?${embedParams}`;
    return (
      <iframe
        src={embedUrl}
        title={media.alt}
        className="absolute inset-0 w-full h-full"
        style={{ backgroundColor }}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    );
  }
  return null;
}

export default function Home() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F8F8' }}>
      <SiteHeader />

      {/* Bio */}
      <div
        className="font-[family-name:var(--font-lector)] px-6 md:px-[72px]"
        style={{
          paddingTop: '72px',
          paddingBottom: '32px',
          maxWidth: '600px',
          fontSize: '15px',
          letterSpacing: '-0.01em',
          lineHeight: '1.4',
          color: '#000',
        }}
      >
        <p>
          <em>Making new things feel familiar and familiar things feel new,</em>
          <br />
          Kris is a design engineer tracing origins, elevating minimalism, and creating traditions of love and exploration.
        </p>
        <p style={{ marginTop: '24px' }}>
          CS &amp; Art at Yale, previously Product Design at Kensho &amp; S&amp;P Global
        </p>
      </div>

      {/* Case Studies — outer wrapper owns the padding; inner div owns the scroll */}
      <div className="px-6 md:px-[72px]" style={{ paddingTop: '24px', paddingBottom: '96px' }}>
        <div
          className="flex flex-col md:flex-row md:overflow-x-auto scrollbar-hide"
          style={{ gap: '32px', scrollSnapType: 'x mandatory' }}
        >
        {caseStudies.map((study) => (
          <Link
            key={study.slug}
            href={`/work/${study.slug}`}
            className="flex flex-col shrink-0 group w-full md:w-[50.625vw]"
            style={{ scrollSnapAlign: 'start' }}
          >
            <div
              className="relative w-full overflow-hidden"
              style={{
                aspectRatio: '3 / 2',
                backgroundColor: study.heroBackgroundColor ?? '#1a1a1a',
                borderRadius: '2px',
              }}
            >
              {study.heroMedia ? (
                <HeroMedia media={study.heroMedia} backgroundColor={study.heroBackgroundColor ?? '#1a1a1a'} />
              ) : null}
            </div>
            <p
              className="font-[family-name:var(--font-lector)] group-hover:opacity-50 transition-opacity duration-200"
              style={{
                marginTop: '12px',
                fontSize: '15px',
                letterSpacing: '-0.01em',
                lineHeight: '1.4',
                color: '#000',
              }}
            >
              {renderWithMarkdown(study.summary)}
            </p>
          </Link>
        ))}
        </div>
      </div>
    </div>
  );
}
