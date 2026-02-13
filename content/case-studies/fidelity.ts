import type { CaseStudy } from '@/types/case-study';

export const fidelity: CaseStudy = {
  slug: 'fidelity',
  title: 'Fidelity',
  client: 'Fidelity',
  isProtected: false,
  sequence: 2,
  summary: 'Investment platform experience design',
  tags: ['Finance', 'UX', 'Accessibility'],
  sections: ['Overview', 'Context', 'Strategy', 'Designs', 'Reflections'],
  diptychs: [
    {
      id: 'fidelity-01',
      section: 'Overview',
      ratio: '50-50',
      alignment: 'top',
      text: {
        content: `
## TLDR

**Timeline:** 2023–2024
**Role:** Senior Designer
**Team:** 5 designers, 8 engineers

Investment platform redesign focused on clarity and accessibility.
        `.trim(),
      },
      media: {
        type: 'video',
        vimeoId: '1160310714',
        hasAudio: false,
      },
    },
    {
      id: 'fidelity-02',
      section: 'Context',
      ratio: '70-30',
      alignment: 'center',
      text: {
        content: `
Understanding the needs of retail investors navigating complex financial products.
        `.trim(),
      },
      media: {
        type: 'image',
        src: '/academy/BlackMountain.png',
        alt: 'Research insights',
      },
    },
  ],
  nextCaseStudySlug: 'kensho',
  teaserVimeoId: '1160310714',
};
