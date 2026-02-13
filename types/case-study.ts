// Media can be an image, a silent video (autoplay loop), or a video with meaningful audio (user-controlled)
export type DiptychMedia =
  | {
      type: 'image';
      src: string;
      alt: string;
      aspectRatio?: string; // e.g. "16/9", "1/1"
    }
  | {
      type: 'video';
      vimeoId: string;
      hasAudio: false;
      aspectRatio?: string;
      posterTime?: number; // Seconds for poster/thumbnail frame
    }
  | {
      type: 'video';
      vimeoId: string;
      hasAudio: true;
      aspectRatio?: string;
      posterTime?: number;
    };

export type DiptychRatio = '30-70' | '40-60' | '50-50' | '60-40' | '70-30';
// First number = left panel (text) width, second = right panel (media) width
// Use '30-70' for final designs that need space
// Use '70-30' for text-heavy explanations
// Use '50-50' as default balanced split

export type DiptychAlignment = 'top' | 'center' | 'bottom';
// Vertical alignment of content within each panel

// Sections organize diptychs into navigable chapters. Each case study defines its own section names.
export type CaseStudySection = string;

export interface Diptych {
  id: string; // Unique identifier, e.g. "sea12-01"
  section: CaseStudySection; // Which section this belongs to
  ratio: DiptychRatio; // Left/right width split
  alignment: DiptychAlignment; // Vertical alignment
  text: {
    content: string; // Markdown string for the left panel
    // First diptych of each section shows section name at top of left panel
    // in faded gray. This is derived from the `section` field — don't add
    // a separate flag. Just check if this is the first diptych in its section.
  };
  media: DiptychMedia;
}

export interface CaseStudyMetadataItem {
  key: string;
  value: string;
}

export interface CaseStudySkipLink {
  label: string;
  targetSection: string;
}

export interface CaseStudy {
  slug: string;
  title: string;
  client: string;
  isProtected: boolean;
  sequence: number;
  summary: string; // One-line description for navigation cards
  tags: string[];
  sections: CaseStudySection[];
  diptychs: Diptych[];
  nextCaseStudySlug?: string;
  teaserVimeoId?: string;
  /** Custom key-value pairs (e.g. role, timeline, team) */
  metadata?: CaseStudyMetadataItem[];
  /** Introductory body text on the title card, markdown */
  lede?: string;
  /** Short subtitle with light markdown support */
  tagline?: string;
  /** Optional skip link: label + target section name */
  skipLink?: CaseStudySkipLink;
  /** Optional background color for the right side of the title card (e.g., "#000000", "rgba(0,0,0,0.1)") */
  titleCardBackgroundColor?: string;
}
