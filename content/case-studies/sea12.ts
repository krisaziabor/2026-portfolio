import type { CaseStudy } from '@/types/case-study';

export const sea12: CaseStudy = {
  slug: 'sea12',
  title: 'Sea12',
  client: 'Sea12',
  isProtected: false,
  sequence: 2,
  summary: 'Re-introducing the world to *Sea12*',
  tags: [],
  sections: ['Overview', 'Context', 'Strategy', 'Designs', 'Reflections'],
  metadata: [
    { key: 'Timeline', value: 'April to June 2025' },
    { key: 'Role', value: 'Lead Designer & Engineer, Project Manager' },
    { key: 'Team', value: 'Asya Tarabar & Aditya Das' },
    { key: 'Stack', value: 'Figma, Sanity, Next.js, Cursor, Claude Code' }
  ],
  titleCardBackgroundColor: '#EEE8E1',
  lede: `
No longer just a collective of university students, Sea12 became a disrupting force in the tech industry, creating powerful, tailor-made automation software. 

From April to June, I led a team of 3 designers to design and build their new visual identity and website, cementing their reintroduction to the world. 

  `.trim(),
  skipLink: { label: 'Skip to designs', targetSection: 'Designs' },
  diptychs: [
    {
      id: 'sea12-01',
      section: 'Overview',
      ratio: '50-50',
      alignment: 'top',
      text: {
        content: `
Lorem ipsum
        `.trim(),
      },
      media: { type: 'video', vimeoId: '1164167790', hasAudio: false, aspectRatio: '16/9' },
    },
    {
      id: 'sea12-02',
      section: 'Overview',
      ratio: '50-50',
      alignment: 'top',
      text: {
        content: `
Lorem ipsum 2
        `.trim(),
      },
      media: { type: 'image', src: '/placeholder.png', alt: 'Image', aspectRatio: '16/9' },
    }
  ],
  nextCaseStudySlug: 'constellating',
};
