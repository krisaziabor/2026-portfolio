import type { CaseStudy } from '@/types/case-study';

export const fidelity: CaseStudy = {
  slug: 'fidelity',
  title: 'Fidelity',
  client: 'Fidelity',
  isProtected: false,
  sequence: 2,
  summary: 'Investment platform experience design',
  tags: ['Finance', 'UX', 'Accessibility'],
  metadata: [
    { key: 'Timeline', value: '2023–2024' },
    { key: 'Role', value: 'Senior Designer' },
    { key: 'Team', value: '5 designers, 8 engineers' },
  ],
  nextCaseStudySlug: 'kensho',
  teaserVimeoId: '1160310714',
  body: `
Investment platform redesign focused on clarity and accessibility.

Understanding the needs of retail investors navigating complex financial products.

*Content in progress.*
`.trim(),
};
