import type { CaseStudy } from '@/types/case-study';

const base = '/work/kensho';

export const kensho: CaseStudy = {
  slug: 'kensho',
  title: 'Kensho',
  client: 'Kensho',
  isProtected: true,
  sequence: 1,
  summary: 'Building user trust in AI at *Kensho & S&P Global*',
  tags: [],
  metadata: [
    { key: 'Timeline', value: 'September to December 2025' },
    { key: 'Company', value: 'Kensho Technologies, S&P Global' },
    { key: 'Role', value: 'Product Design Intern (part-time)' },
    { key: 'Stack', value: 'Figma (Design, Jam, Make)' },
  ],
  intro: `
During the fall of my senior year at Yale, I joined Kensho as a part-time product design intern. 

I designed features instilling trust in AI generated financial insights for Kensho's users across two products—Corsa, a financial report generation tool and Grounding POC, a mock interface showcasing the capabilities of their powerful API.
  `,
  passwordIntro: `
  This case study reveals designs for Kensho products that the company wishes to keep private. To respect their policy, my designs are password-protected. Please [contact me](mailto:kris.aziabor@yale.edu) if you would like access.
  `,
  heroBackgroundColor: '#004253',
  heroMedia: {
    type: 'image',
    src: `${base}/TempKenshoCover.png`,
    alt: "Kensho's cover image",
  },
  skipToSection: 'designs',
  nextCaseStudySlug: 'sea12',
  teaserVimeoId: '1160310782',
  body: [
    {
      type: 'markdown',
      content: `
## Context

*Note: To differentiate between the two products, I will use blue background colors for Corsa and gray for Grounding POC.*

### Corsa, or Project X

![Corsa's report editor page at the start of my internship](${base}/ProjectX-Before.png)
      `.trim(),
    },
    {
      type: 'text-split',
      left: `A tool for research analysts, *Corsa*—named Project X during my internship— is a financial report writing tool that allows users to input sources and collaborate on the working process with Agent X, a powerful AI agent backed with resources such as S&P data. Agent X can write report text, bring in outside sources, and cite text from them.`,
      right: `*How can users quickly—and if needed, thoroughly—verify that Agent X's content is trustworthy?*`,
    },
    {
      type: 'markdown',
      content: `
### Grounding POC

*Grounding POC* is a interface showcasing the capabilities of Grounding API, a software tool that takes natural language prompts and finds relevant S&P data and determines what types of data visualizations are necessary.

![Grounding POC's interface at the start of my internship](${base}/Grounding-Before.png)
      `.trim(),
    },
    {
      type: 'text-split',
      left: `The Grounding POC interface is rich with numbers and text, all tied to sources.`,
      right: `*How do we present users with the power to trace everything back to its source without it becoming overbearing & sacrificing clarity and ease of use?*`,
    },
    {
      type: 'text-split',
      left: `The citation methods used in generalized chat interfaces are too simplistic for our users.
Specifically, Grounding’s text response treats data in two ways: direct mentions & summaries/derived calculations.`,
      right: `*How do we account and display Grounding Agent’s two processes clearly and distinctly?*`,
    },
    {
      type: 'markdown',
      content: `
## Design Process

A little talk about design process of research, discussion of scope with devs, sketching and talking big picture theory with other designers, wireframing, and pitching to both design and dev teams.

## Designs

I solved my Kensho product problems through introducing a) a citation system, b) expanding the visibility and depth of source information, and c) granting users new powers with sources.

### Citation System

![The citation system inside Grounding POC](/vimeo/1172450238?showVideoSettings=true)

Grounding POC's citations focus on two different types of ways the agent uses data: direct mentions and summaries/derived calculations. Direct mentions vary from quotes to a series of numbers extracted from a source.

![Each citation has its own origin and type of data it references, which is displayed as an excerpt within each card.](${base}/GroundingCitations.png)

With derived calculations, the agent uses data points it has collected to calculate new values. For users who want to verify the accuracy of the calculations, they can click on the citation to see the original data points and the final figure.

![Derived calculation citations show the original data points and the final figure.](${base}/GroundingCitationsDerived.png)

As for Project X, the citation system is revolved around the report writing process. Source title previews are replaced with numbers, reminiscent of a conventional footnote system.

![The citation system inside Project X](/vimeo/1172499471?showVideoSettings=true)

When a source and a specific excerpt are cited multiple times, the citations share the same numbers to avoid redundancy.

![Users can quickly scan all appearances of a citation through the source side panel.](/vimeo/1172513169?showVideoSettings=true)

![Still cooking: For citations with quote excerpts, pressing on the citation not only opens the source page but copies the excerpt to the clipboard, giving the user the ability to quickly locate the relevant text in the source.](/vimeo/1172452116?showVideoSettings=true)

### Expanding source visibility

![I redesigned the source side panel to give users much more information about sources at a glance, including if Agent X introduced it into the report.](${base}/ProjectX_SidePanelComparison.png)

![In addition to the Agent X indicator, I introduced a number of badges indicating the type of source.](${base}/ProjectX_SourceBadges.png)

![The expanded source visibility inside Grounding POC](/vimeo/1172448470?showVideoSettings=true)

### Granting Users New Powers with Sources

![The expanded source visibility inside Grounding POC](/vimeo/1172566947?showVideoSettings=true)

## Reflections

A little bit about the success (getting features approved and shipped for 2 products and some failures) how this internship was a great learning experience and how I grew as a designer. Maybe a line abt my 2 workshops and how those helped me with my design process.
      `.trim(),
    },
  ],
};
