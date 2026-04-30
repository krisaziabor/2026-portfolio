import type { CaseStudy } from "@/types/case-study";

const base = "/work/kanon";

export const kanon: CaseStudy = {
  slug: "kanon",
  title: "Kanon",
  client: "Kanon",
  isProtected: false,
  sequence: 1,
  summary: "*Kanon*: oral traditions on the web",
  tags: [],
  metadata: [
    { key: "Timeline", value: "January to May 2026" },
    { key: "Advisors", value: "Vamba Bility, Marynel Vázquez" },
    { key: "Stack", value: "Next.js, Firebase, D3.js" },
  ],
  intro: `
Kanon seeks to bring people together by pushing the work we create, the media we consume, and the theory we treasure into one space where everything can be connected through solely voice.`,
  heroBackgroundColor: "#121212",
  heroMedia: {
    type: "video",
    vimeoId: "1188256211",
    alt: "Kensho's cover image",
  },
  landingMedia: {
    type: "video",
    vimeoId: "1188257845",
    alt: "Kensho's cover image",
  },
  nextCaseStudySlug: "sea12",
  teaserVimeoId: "1188257845",
  body: [
    {
      type: "markdown",
      content: `
## Philosophy

Social media platforms optimize for viral reach and algorithmic engagement, minimizing the possibility of intimate knowledge-sharing within close communities. Influential apps like Instagram and TikTok strip content of personal context and make any act of communication or sharing a performance that can be tracked and compared through likes, views, and followers.

![The home page of Kanon](${base}/HomePage.png)

I propose an alternative. Kanon enables small, isolated communities to build collective knowledge archives through manual curation of media and text. In addition, every element is connected to an audio recording from the user, pushing oral traditions to the center of the experience. 

Kanon was built by balancing friction and automation, empowering users to add metadata quickly and spent their time listening to and recording rich audio narratives.

## Design

Each piece of content is called a *record* and has media, metadata, and an audio narrative. 

![A "record" in Kanon is a piece of content a user adds to the library](${base}/RecordCard.png)

![Viewing connected records while listening to the user’s narrative. Any connection can be responded to and saved for later.](${base}/ConnectionCard.png)

The *connection* viewing interface is split between previews of each record and the audio player. ElevenLabs's SDK (Speech to Text) takes each word and ties it to a timestamp in the recording, serving as the foundation for a beautiful listening experience.

![Every method of engaging with a record is revolved around voice, including making connections between a combination of records.](/vimeo/1188243367?showVideoSettings=true&fullBleedBackgroundColor=#121212) 

To balance the friction-filled communication experiences, I created a collection of metadata & media fetching scripts tailored to users’ most popular media web sources.

![From an DOI scholarly article link to a Youtube Short, Kanon will find the key metadata](/vimeo/1188251567?showVideoSettings=true&fullBleedBackgroundColor=#121212)

If outside the scope and data quality is low, Claude Haiku API fills in the gaps.

![Central Kanon thesis](/vimeo/1188253598?showVideoSettings=true&fullBleedBackgroundColor=#121212)

Kanon is live to my community of friends and family. Public launch and full case study soon.

*A social network, library, installation, book, and practice.
In partial fulfillment of the requirements for the degree of Bachelor of Arts in Computing and the Arts at Yale University.*

      `.trim(),
    },
  ],
};
