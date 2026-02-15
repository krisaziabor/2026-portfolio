import type { CaseStudy } from "@/types/case-study";

export const sea12: CaseStudy = {
  slug: "sea12",
  title: "Sea12",
  client: "Sea12",
  isProtected: false,
  sequence: 2,
  summary: "Re-introducing the world to *Sea12*",
  tags: [],
  sections: ["Overview", "Context", "Strategy", "Designs", "Reflections"],
  metadata: [
    { key: "Timeline", value: "April to June 2025" },
    { key: "Role", value: "Lead Designer & Engineer, Project Manager" },
    { key: "Team", value: "Asya Tarabar & Aditya Das" },
    { key: "Stack", value: "Figma, Sanity, Next.js, Cursor, Claude Code" },
  ],
  titleCardBackgroundColor: "#EEE8E1",
  lede: `
No longer just a collective of university students, Sea12 became a disrupting force in the tech industry, creating powerful, tailor-made automation software. 

From April to June, I led a team of 3 designers to design and build their new visual identity and website, cementing their reintroduction to the world. 

  `.trim(),
  skipLink: { label: "Skip to designs", targetSection: "Designs" },
  diptychs: [
    {
      id: "sea12-01",
      section: "Overview",
      ratio: "50-50",
      alignment: "top",
      text: {
        content: `
Lorem ipsum
        `.trim(),
      },
      media: {
        type: "video",
        vimeoId: "1164167790",
        hasAudio: false,
        aspectRatio: "16/9",
      },
    },

    {
      id: "my-case-study-02",
      section: "Context",
      ratio: "30-70",
      alignment: "bottom",
      text: {
        content: `
Sea12 wants to belong with the big leagues and needs a website and brand highlighting how professional and forward-thinking they are. 

They wanted to their image to be driven predominantly by the strength of their offerings, with experimental elements sprinkled across their visual identity.
        `.trim(),
      },
      media: {
        type: "image",
        src: "Sea12-2.jpg",
        alt: "Sea12's previous website",
        aspectRatio: "16/9",
      },
    },
    {
      id: "my-case-study-03",
      section: "Strategy",
      ratio: "30-70",
      alignment: "bottom",
      text: {
        content: `
Using IBM as a central piece of inspiration, we started with low-fidelity wireframes with varying structures for the site content. The client enjoyed the side-by-side dynamic of the first two, and we went from there.
        `.trim(),
      },
      media: {
        type: "image",
        src: "Sea12-3.jpg",
        alt: "Low-fidelity wireframes exploring varying layouts",
        aspectRatio: "16/9",
      },
    },
    {
      id: "my-case-study-04",
      section: "Strategy",
      ratio: "30-70",
      alignment: "bottom",
      text: {
        content: `
At this stage, Charles also brought up his desire to include a floating particle visual across the brand. We spent this time of experimentation figuring out how it could exist on the site.
        `.trim(),
      },
      media: {
        type: "video",
        vimeoId: "0",
        hasAudio: false,
        aspectRatio: "16/9",
      },
    },
    {
      id: "my-case-study-05",
      section: "Strategy",
      ratio: "30-70",
      alignment: "bottom",
      text: {
        content: `
We understood that the particle should play a central role in the user’s first impression of the site. To add visual dimensions, we placed the animated graphic in the same space as the text with reduced opacity.
        `.trim(),
      },
      media: {
        type: "image",
        src: "Sea12-5.jpg",
        alt: "Landing page design featuring particle and serif font",
        aspectRatio: "16/9",
      },
    },
    {
      id: "my-case-study-06",
      section: "Strategy",
      ratio: "30-70",
      alignment: "bottom",
      text: {
        content: `
To best understand what direction Charles & the Sea12 team wanted, we ignored many of the rules of design. We chose color combinations that broke accessibility rules, place visuals on top of text that threatened legibility, and didn’t look back.

By doing this we were able to get a sense of what extremes they liked and thus, which ones we could tastefully play with later.
        `.trim(),
      },
      media: {
        type: "image",
        src: "Sea12-6.jpg",
        alt: "High-fidelity landing page wireframes, all embracing “jarring design”",
        aspectRatio: "16/9",
      },
    },
    {
      id: "my-case-study-07",
      section: "Strategy",
      ratio: "30-70",
      alignment: "bottom",
      text: {
        content: `
We also proposed using a serif font as the primary Sea12 typeface, as very few tech companies use serifs and it would emphasize that Sea12 is a disturbing force in the industry.  

After a few meetings of pitching, it was clear that the client liked the idea but didn’t love it. We sadly had to leave the concept behind.

With the typeface (Favorit by Dinamo Typefaces) choice finalized, our designs were sealed.
        `.trim(),
      },
      media: {
        type: "image",
        src: "Sea12-7.jpg",
        alt: "Landing page design featuring serif font",
        aspectRatio: "16/9",
      },
    },
    {
      id: "my-case-study-08",
      section: "Designs",
      ratio: "30-70",
      alignment: "bottom",
      text: {
        content: `
 
        `.trim(),
      },
      media: {
        type: "image",
        src: "Sea12-8.jpg",
        alt: "Sea12's new landing page",
        aspectRatio: "16/9",
      },
    },
    {
      id: "my-case-study-09",
      section: "Designs",
      ratio: "30-70",
      alignment: "bottom",
      text: {
        content: `
 
        `.trim(),
      },
      media: {
        type: "image",
        src: "Sea12-9.jpg",
        alt: "A Sea12 case study page",
        aspectRatio: "16/9",
      },
    },
    {
      id: "my-case-study-10",
      section: "Designs",
      ratio: "30-70",
      alignment: "bottom",
      text: {
        content: `
 
        `.trim(),
      },
      media: {
        type: "image",
        src: "Sea12-10.jpg",
        alt: "Sea12's new page showcasing all case studies.",
        aspectRatio: "16/9",
      },
    },
    {
      id: "my-case-study-11",
      section: "Designs",
      ratio: "30-70",
      alignment: "bottom",
      text: {
        content: `
 
        `.trim(),
      },
      media: {
        type: "image",
        src: "Sea12-11.jpg",
        alt: "Branding colors for Sea12",
        aspectRatio: "16/9",
      },
    },
    {
      id: "my-case-study-12",
      section: "Designs",
      ratio: "30-70",
      alignment: "top",
      text: {
        content: `
 
        `.trim(),
      },
      media: {
        type: "video",
        vimeoId: "0",
        hasAudio: false,
        aspectRatio: "16/9",
      },
    },
    {
      id: "my-case-study-13",
      section: "Designs",
      ratio: "50-50",
      alignment: "top",
      text: {
        content: `
 
        `.trim(),
      },
      media: {
        type: "image",
        src: "Sea12-13.jpg",
        alt: "Careers page for Sea12's new website",
        aspectRatio: "16/9",
      },
    },
    {
      id: "my-case-study-14",
      section: "Designs",
      ratio: "50-50",
      alignment: "top",
      text: {
        content: `
 
        `.trim(),
      },
      media: {
        type: "video",
        vimeoId: "0",
        hasAudio: false,
        aspectRatio: "16/9",
      },
    },
    {
      id: "my-case-study-15",
      section: "Reflections",
      ratio: "70-30",
      alignment: "bottom",
      text: {
        content: `
Launched during their pre-seed round, Sea12's new brand work proved instrumental in securing their multi-million dollar valuation and backing by firms including Caffeinated Capital, Haystack Ventures & SV Angel.

Taking sole ownership of designing several pages, leading most communication with the client and coding 90% of the site was not easy, but it was an incredibly rewarding experience in the end.
        `.trim(),
      },
      media: {
        type: "image",
        src: "/placeholder.png",
        alt: "Image",
        aspectRatio: "16/9",
      },
    },
  ],
  nextCaseStudySlug: "constellating",
};
