export type Gen3Media =
  | {
      type: 'vimeo';
      vimeoId: string;
      /** Native video dimensions — the media box matches this ratio exactly so no letterbox bars appear. */
      width: number;
      height: number;
      /** Thumbnail width on desktop (px). */
      thumbWidth: number;
      /** Shown behind the iframe while it loads. */
      background: string;
    }
  | {
      type: 'image';
      src: string;
      alt: string;
      width: number;
      height: number;
      thumbWidth: number;
      background: string;
    };

export type Gen3Item = {
  id: string;
  title: string;
  /** Optional external link for the title. */
  href?: string;
  date?: string;
  /** Paragraphs. Line breaks within a paragraph are preserved (`\n`);
      `[label](url)` renders as an external link. */
  description: string[];
  media: Gen3Media;
};

export const gen3Items: Gen3Item[] = [
  {
    id: 'kanon',
    title: 'Kanon',
    date: 'January to May 2026',
    description: [
      'Kanon seeks to bring people together by pushing the work we create, the media we consume, and the theory we treasure into one space where everything can be connected through solely voice.',
      'Thesis for Computing and the Arts at Yale University.\nNominated for the Yale College Council Innovation Award.\nAdvised by Vamba Bility and Marynel Vázquez.',
    ],
    media: {
      type: 'vimeo',
      vimeoId: '1188257845',
      width: 1920,
      height: 1440,
      thumbWidth: 168,
      background: '#121212',
    },
  },
  {
    id: 'sp-global',
    title: 'S&P Global (Kensho)',
    href: 'https://www.spglobal.com',
    date: 'September to December 2025',
    description: [
      "AI-generated financial reports are only useful if users trust what's in them. While interning at [Kensho](https://kensho.com), I designed citation and data attribution systems across two financial products that let users trace every claim and calculation back to its source.",
      'Led 2 workshops on AI design tools, including one for an audience of 100 S&P Global designers. In addition, I represented Kensho on an AI design panel alongside 2 senior designers with a combined 20+ years of experience.',
    ],
    media: {
      type: 'vimeo',
      vimeoId: '1173121514',
      width: 1920,
      height: 1442,
      thumbWidth: 168,
      background: '#ECEEEE',
    },
  },
  {
    id: 'design-at-yale',
    title: 'Design at Yale',
    href: 'https://designatyale.com',
    date: 'September 2024 to May 2026',
    description: [
      "After being rejected my second year, I re-applied and successfully joined Yale's only design studio. Became club's first Black president a year later. Led studio's client relationships, community engagement, and managed cohort of 22 studio designers.",
      "During my tenure, I led the brand redesign of Yale's largest CS club as well as the website for Sea12, a startup that went on to secure multi-million dollar backing from firms like Caffeinated Capital, Haystack Ventures & SV Angel.",
    ],
    media: {
      type: 'image',
      src: '/gen3/design-at-yale.png',
      alt: 'Design at Yale logo',
      width: 1,
      height: 1,
      thumbWidth: 80,
      background: '#FFFFFF',
    },
  },
];
