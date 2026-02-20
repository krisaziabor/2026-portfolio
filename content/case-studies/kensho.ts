import type { CaseStudy } from '@/types/case-study';

export const kensho: CaseStudy = {
  slug: 'kensho',
  title: 'Kensho',
  client: 'Kensho',
  isProtected: true,
  sequence: 3,
  summary: 'Building user trust in AI at *Kensho & S&P Global*',
  tags: [],
  metadata: [
    { key: 'Timeline', value: 'September to December 2025' },
    { key: 'Company', value: 'Kensho Technologies, S&P Global' },
    { key: 'Role', value: 'Product Design Intern (part-time)' },
    { key: 'Stack', value: 'Figma (Design, Jam, Make)' },
  ],
  nextCaseStudySlug: 'sea12',
  teaserVimeoId: '1160310782',
  body: `
While I began my senior year at Yale, I joined Kensho part-time as a product design intern.

During the fall, I designed features instilling trust in AI-generated content for Kensho's users across two products: Corsa, a financial report generation tool and Grounding POC, a mock interface showcasing the capabilities of the firms' new powerful API.

*Content in progress.*
`.trim(),
};
