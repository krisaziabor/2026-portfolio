'use client';

interface CaseStudyNavCardProps {
  title: string;
}

export function CaseStudyNavCard({ title }: CaseStudyNavCardProps) {
  return (
    <div
      className="bg-white rounded-sm border border-[#F0F0F0] px-8 py-6"
      style={{
        borderRadius: '4px',
        width: '100%',
      }}
    >
      <div className="flex items-end justify-between gap-6">
        {/* Left side - Title */}
        <div className="text-base leading-tight tracking-[-0.01em] flex-shrink" style={{ color: '#000000' }}>
          {title}
        </div>

        {/* Right side - Scroll to continue */}
        <div 
          className="text-base leading-tight tracking-[-0.01em] flex-shrink-0" 
          style={{ color: 'rgba(0, 0, 0, 0.5)', whiteSpace: 'nowrap' }}
        >
          Scroll to continue
        </div>
      </div>
    </div>
  );
}
