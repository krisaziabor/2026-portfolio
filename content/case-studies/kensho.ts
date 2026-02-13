import type { CaseStudy } from '@/types/case-study';

export const kensho: CaseStudy = {
  slug: 'kensho',
  title: 'Kensho',
  client: 'Kensho',
  isProtected: true,
  sequence: 3,
  summary: 'Building user trust in AI at *Kensho & S&P Global*',
  tags: [],
  sections: ['Overview', 'Context', 'Strategy', 'Designs', 'Still cooking', 'Reflections'],
  metadata: [
    { key: 'Timeline', value: 'September to December 2025' },
    { key: 'Company', value: 'Kensho Technologies, S&P Global' },
    { key: 'Role', value: 'Product Design Intern (part-time)' },
    { key: 'Stack', value: 'Figma (Design, Jam, Make)'},
  ],
  titleCardBackgroundColor: '#D9D2C9',
  lede: `
While I began my senior year at Yale, I joined Kensho part-time as a product design intern.

During the fall, I designed features instilling trust in AI-generated content for Kensho's users across two products: Corsa, a financial report generation tool and Grounding POC, a mock interface showcasing the capabilities of the firms’ new powerful API.
  `.trim(),
  skipLink: { label: 'Skip to designs', targetSection: 'Designs' },
  diptychs: [
    {
      id: 'kensho-01',
      section: 'Overview',
      ratio: '50-50',
      alignment: 'center',
      text: {
        content: `
## TLDR

**Timeline:** 2023
**Role:** Lead Designer
**Team:** 3 designers, 4 engineers

Kensho needed a unified design system to scale their AI-powered research tools across multiple products.
        `.trim(),
      },
      media: {
        type: 'image',
        src: '/academy/OldeCommon.png',
        alt: 'Research platform interface',
      },
    },
    {
      id: 'kensho-02',
      section: 'Context',
      ratio: '40-60',
      alignment: 'top',
      text: {
        content: `
The challenge was creating interfaces that made complex financial data accessible without overwhelming users.
        `.trim(),
      },
      media: {
        type: 'video',
        vimeoId: '1160310782',
        hasAudio: false,
      },
    },
  ],
  nextCaseStudySlug: 'sea12',
  teaserVimeoId: '1160310782',
};
