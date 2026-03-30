import type { CaseStudy } from "@/types/case-study";

const base = "/work/kensho";

export const kensho: CaseStudy = {
  slug: "kensho",
  title: "Kensho",
  client: "Kensho",
  isProtected: true,
  sequence: 1,
  summary: "Substantiating AI at *Kensho* & *S&P Global*",
  tags: [],
  metadata: [
    { key: "Timeline", value: "September to December 2025" },
    { key: "Company", value: "Kensho, S&P Global" },
    { key: "Role", value: "Product Design Intern (part-time)" },
  ],
  intro: `
AI-generated financial reports are only useful if users trust what's in them. At Kensho, I designed citation and data attribution systems across two financial products that let users trace every claim and calculation back to its source.
  `,
  passwordIntro: `
  This case study reveals designs for Kensho products that the company wishes to keep private. If you are a recruiter, please access the portfolio via the link in my resume.
  `,
  heroBackgroundColor: "#ECEEEE",
  heroMedia: {
    type: "video",
    vimeoId: "1173131650",
    alt: "Kensho's cover image",
  },
  landingMedia: {
    type: "video",
    vimeoId: "1173121514",
    alt: "Kensho's cover image",
  },
  skipToSection: "designs",
  nextCaseStudySlug: "sea12",
  teaserVimeoId: "1160310782",
  body: [
    {
      type: "markdown",
      content: `
## Context

*Notes:*
*This case study contains confidential work I made at Kensho that the company wishes to keep private. Please do not distribute the password, special work URL, or share this case study without permission.*

*To differentiate between the two products, I will use blue background colors for Project X and gray for Grounding POC.*

### Project X

![Project X's report editor page at the start of my internship](${base}/ProjectX-Before.png)
      `.trim(),
    },
    {
      type: "markdown",
      content: `A tool for research analysts, *Project X* is a financial report writing tool that allows users to input sources and collaborate on the working process with Agent X, a powerful AI agent backed with resources such as S&P data. Agent X can write report text, bring in outside sources, and cite text from them.`,
    },
    {
      type: "question",
      content: `How can users quickly and thoroughly verify that Agent X's content is accurate?`,
    },
    {
      type: "markdown",
      content: `
### Grounding POC

*Grounding POC* is an interface showcasing the capabilities of Grounding API, a software tool that takes natural language prompts and finds relevant S&P data and determines what types of data visualizations are necessary.

![Grounding POC's interface at the start of my internship](${base}/Grounding-Before.png)
      `.trim(),
    },
    {
      type: "markdown",
      content: `Grounding's interface surfaces a lot of information: financial figures, data tables, derived calculations. At the start of my internship, none of it had a clear trail back to where it came from. The density of the output actually made the trust problem worse: the more data users saw, the harder it was to know which numbers came directly from a source and which the agent had calculated on its own.`,
    },
    {
      type: "question",
      content: `How do we present users with the power to trace everything back to its source without it becoming overbearing?`,
    },
    {
      type: "markdown",
      content: `
## Design Process

Early on, I defaulted to what I knew: a conventional footnote system where every citation gets a unique number, even if the same source and excerpt appear multiple times. It's how essays work. And as a senior writing papers alongside this internship, the convention felt almost too natural to question. But a different logic surfaced after talks with teammates; in a report tool, users aren't reading linearly. They're scanning, jumping between sections, cross-referencing. A citation number should _identify_ a source, not mark a position in a sequence. That shift shaped everything that followed: leaning on familiar metaphors, but knowing when to break from them.
## Designs

While the final designs differed across products, I solved the central problems of each using the same three practices: 1) introducing a citation system, 2) expanding the visibility and depth of source information, and 3) granting users new powers with sources.

### Citations

![The citation system inside Grounding POC](/vimeo/1172450238?showVideoSettings=true&fullBleedBackgroundColor=#ECEEEE)

Grounding POC's citations focus on two different types of ways the agent uses data: direct mentions and summaries/derived calculations. Direct mentions vary from quotes to a series of numbers extracted from a source.

![Each citation has its own origin and type of data it references, which is displayed as an excerpt within each card.](${base}/GroundingCitations.png)

Every citation carries its origin and an excerpt of the data it references: enough for a user to verify at a glance without ever leaving the conversation.

![Derived calculation citations show the original data points and the final figure.](${base}/GroundingCitationsDerived.png)

When the agent derives a new value from raw data, the citation lets users reconstruct the math; not just see the answer, but trace how it got there.

![The citation system inside Project X](/vimeo/1172499471?showVideoSettings=true&fullBleedBackgroundColor=#004A5D)

As for Project X, the citation system is built around the report writing process. Source title previews are replaced with numbers, reminiscent of a conventional footnote system (with one key twist).

When the same source and excerpt appear across multiple sections, they share a citation number. Identifiers, not footnotes; users always know when they're looking at something they've already verified.

![Users can quickly scan all appearances of a citation through the source side panel.](/vimeo/1172513169?showVideoSettings=true&fullBleedBackgroundColor=#004A5D)

*A design I was still cooking on in my final days*: Grounding's excerpts often trace back to external pages rather than an in-app source view. So verification needs a different mechanism: press a citation, and the excerpt copies to your clipboard automatically. Navigate to the source, paste, search. Three steps to confirmation; no hunting through a page trying to remember what you read.

![For citations with quote excerpts, pressing on the citation not only opens the source page but copies the excerpt to the clipboard, giving the user the ability to quickly locate the relevant text in the source.](/vimeo/1172452116?showVideoSettings=true&fullBleedBackgroundColor=#ECEEEE)

### Granting users new powers with sources

![Users can now mention sources and specific sections in their prompts to Agent X](/vimeo/1172566947?showVideoSettings=true&fullBleedBackgroundColor=%004253)

Users can reference specific sources and sections directly in their prompts; vague requests become pointed ones. More control over what Agent X produces, less guessing on both sides.

### Expanding source visibility

The redesigned source panel surfaces what users previously had to dig for: source type, origin, and whether Agent X introduced it or a human did.

![I redesigned the source side panel to give users much more information about sources at a glance](${base}/ProjectX_SidePanelComparison.png)

![In addition to the Agent X indicator, I introduced a number of badges indicating the type of source.](${base}/ProjectX_SourceBadges.png)

Source badges let users distinguish between database pulls, news articles, and uploaded documents. No clicking required.

![The past status bar in Grounding POC](${base}/Grounding-TableBefore.png)

*One more thing I was still cooking on*: In the current interface, all retrieved data loads behind a single collapsed bar; users see nothing until the process is complete. 

I wanted to open that up: show each query as it happens, let users watch the agent work step by step. A table for Nvidia's debt, then Apple's, then Microsoft's; each one appearing in sequence rather than all at once. The transparency is the point; even if users never expand a single table, knowing the process is visible changes how the output feels.

![The expanded source visibility inside Grounding POC](/vimeo/1172448470?showVideoSettings=true&fullBleedBackgroundColor=#EEF0F0)

## Reflections

My team at Kensho and mentors at S&P threw me into the deep end in the best way possible. In my first formal design internship, I led two workshops on experimentation with AI design tools, sat on a panel with 2 senior designers, pitched my ideas to devs, PMs, and fellow designers, interviewed users on behalf of the whole product team, and got to work on features and design systems both in teams and on my own.

![Shoutout Fiona for leading this Kensho workshop with me](/vimeo/1178542447?showVideoSettings=true&backgroundColor=#F6F6F6)

### Potential metrics

While I was not able to see all my designs land in front of users before my internship ended, there are a few key metrics I would use to measure success:

*Citation interaction rate*: What percentage of users actually click on citation cards? A low rate could mean the system is too subtle, or it could mean users trust the output enough not to check. Both readings demand different responses.

*Source page dwell time*: When users click through to a full source, how long do they stay? Quick visits suggest spot-checking; extended sessions suggest the source page is becoming a working surface. That distinction shapes whether a lighter-weight popover belongs in the system.

*Expand rate on data retrieval steps*: How often are users expanding the "Finding Nvidia's debt to equity ratio" card to see the underlying table? Do users value that level of transparency? In this case, even if the rate is low, I think having the functionality still evokes a level of detail and thoughtfulness in the eyes of the user.

### There's beauty in cross-pollinating

I am incredibly grateful that I got the opportunity to work on two products at the same time, as I was able to embrace their differences to improve both sets of designs.

User testing for Project X revealed that people want fast, low-friction ways to cross-check AI-sourced content. That insight carried directly into Grounding — where excerpts often trace back to external pages rather than an in-app source view, I designed a clipboard-copy interaction that lets users verify with a simple paste and search. A solution born from one product's constraints, applied to the other's.

### Gratitude

To Ginny, Emiri, Adam, Davyd, Fiona, Ulyana, Billy,
thank you for a wonderful few months <3
      `.trim(),
    },
  ],
};
