import type { CaseStudy } from '@/types/case-study';

const base = '/work/sea12';

export const sea12: CaseStudy = {
  slug: 'sea12',
  title: 'Sea12',
  client: 'Sea12',
  isProtected: false,
  sequence: 2,
  summary: 'Re-introducing the world to *Sea12*',
  tags: [],
  metadata: [
    { key: 'Timeline', value: 'April to June 2025' },
    { key: 'Role', value: 'Lead Designer & Engineer' },
    { key: 'Team', value: 'Asya Tarabar & Aditya Das' },
    { key: 'Stack', value: 'Figma, Sanity, Next.js, Claude Code' },
  ],
  intro: `No longer just a collective of university students, Sea12 became a disrupting force in the tech industry, creating powerful, tailor-made automation software.

From April to June, I led a team of 3 designers to design and build their new visual identity and website, cementing their reintroduction to the world.`,
  heroBackgroundColor: '#EEE8E1',
  heroMedia: {
    type: 'video',
    vimeoId: '1164167790',
    hasAudio: false,
    alt: "Sea12's new landing page",
  },
  skipToSection: 'designs',
  nextCaseStudySlug: 'constellating',
  body: [
    {
      type: 'markdown',
      content: `
## Context

![Sea12's previous website](${base}/Sea12-1.png)

Sea12's cofounder Charles came to me in late March wanting a new website and brand refresh. While their current identity had some good days, it now was outdated and didn't scream innovative.

They wanted to sit with the best and needed a website and brand highlighting how professional and forward-thinking they are. 

We were tasked with creating a brand driven predominantly by the strength of their talents while sprinkling experimental elements to emphasize their drive to think unconventionally.

## Strategy

Using IBM as a central piece of inspiration, we started with low-fidelity wireframes with varying structures for the site content. The client enjoyed the side-by-side dynamic that could showcase multiple products or case studies at once, and we went from there.

![Low-fidelity wireframes exploring varying layouts](${base}/Sea12-2.png)

To best understand what direction Charles & the Sea12 team wanted, we ignored many of the rules of design. We chose color combinations that broke accessibility rules, place visuals on top of text that threatened legibility, and didn't look back.

By doing this we were able to get a sense of what extremes they liked and thus, which ones we could tastefully play with later.

![Landing page wireframes, all embracing "jarring design"](${base}/Sea12-3.png)

`.trim(),
    },
    {
      type: 'split',
      side: 'right',
      media: {
        type: 'video',
        vimeoId: '1166526241',
        alt: "Particle by Seth Goldin (Yale ‘25) & optimized for performance by me",
        hasAudio: false,
      },
      content: `At this stage, Charles also brought up his desire to include a floating particle visual across the brand. We spent this time of experimentation figuring out how it could exist on the site.`,
    },
    {
      type: 'split',
      side: 'right',
      media: {
        type: 'image',
        src: `${base}/Sea12-4.png`,
        alt: "Landing page design featuring particle and serif font",
      },
      content: `We understood that the particle should play a central role in the user's first impression of the site. To add visual dimensions, we placed the animated graphic in the same space as the text with reduced opacity.`,
    },
    {
      type: 'split',
      side: 'right',
      media: {
        type: 'image',
        src: `${base}/Sea12-7.png`,
        alt: "Technology section mockup featuring serif font",
      },
      content: `We also proposed using a serif font as the primary Sea12 typeface,
as very few tech companies use serifs and it would emphasize that Sea12 is a disturbing force in the industry.  

After a few meetings of pitching, it was clear that the client liked the idea but didn’t love it. We sadly had to leave the concept behind.

With the typeface—[Favorit by Dinamo Typefaces](https://abcdinamo.com/typefaces/favorit)—finalized, 
our designs were sealed.`,
    },
    {
      type: 'markdown',
      content: `
## Designs

![Sea12's new landing page](${base}/Sea12-8.png)

![Page showcasing “Orchestrator” software](/vimeo/1166754629)

![Individual case study page](${base}/Sea12-CaseStudy.png)

![Page hosting all case studies](${base}/Sea12-CaseStudies.png)

![Industries section with hover effects on landing page](${base}/Sea12-Industries.png)

![Careers page](${base}/Sea12-Careers.png)

## Reflections

Launched during their pre-seed round, Sea12's new brand work proved instrumental in securing their multi-million dollar valuation and backing by firms including [Caffeinated Capital](https://www.caffeinated.com/), [Haystack Ventures](https://haystack.vc/) & [SV Angel](https://svangel.com/).

Taking sole ownership of designing several pages, leading most communication with the client and coding 90% of the site was not easy, but it was an incredibly rewarding experience in the end.
`.trim(),
    },
  ],
};
