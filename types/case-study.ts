// Legacy types kept for case-study-builder tool and any remaining diptych UI.
export type DiptychMedia =
  | {
      type: 'image';
      src: string;
      alt: string;
      aspectRatio?: string;
    }
  | {
      type: 'video';
      vimeoId: string;
      hasAudio: false;
      alt?: string;
      aspectRatio?: string;
      posterTime?: number;
    }
  | {
      type: 'video';
      vimeoId: string;
      hasAudio: true;
      alt?: string;
      aspectRatio?: string;
      posterTime?: number;
    };

export type DiptychRatio = '30-70' | '40-60' | '50-50' | '60-40' | '70-30' | '100-0' | '0-100';
export type DiptychAlignment = 'top' | 'center' | 'bottom';

export interface Diptych {
  id: string;
  section: string;
  ratio: DiptychRatio;
  alignment: DiptychAlignment;
  textMaxWidthPercent?: number;
  mediaBackgroundColor?: string;
  text: { content: string };
  media: DiptychMedia;
}

export interface CaseStudyMetadataItem {
  key: string;
  value: string;
}

/** Optional hero media (image or video) shown at top of case study. */
export type CaseStudyHeroMedia =
  | {
      type: 'image';
      src: string;
      alt: string;
    }
  | {
      type: 'video';
      alt: string;
      /** Vimeo ID. If hasAudio is false, autoplay/muted/loop. */
      vimeoId: string;
      hasAudio?: boolean;
      posterTime?: number;
    };

/** Optional browser-window chrome shown above hero media (e.g. site name + nav). */
export interface CaseStudyHeroChrome {
  siteName: string;
  navItems: string[];
}

/** Media for split block: image or Vimeo video. */
export type CaseStudySplitMedia =
  | {
      type: 'image';
      src: string;
      alt?: string;
    }
  | {
      type: 'video';
      vimeoId: string;
      alt?: string;
      /** If false, autoplay/muted/loop. If true, shows controls. */
      hasAudio?: boolean;
      /** Poster time in seconds for videos with audio. */
      posterTime?: number;
      /** If true, show minimalist timestamp and Play/Pause, Restart, Mute/Unmute below caption. */
      showVideoSettings?: boolean;
      /** When set, video is 75% width/height centered with this color filling the rest. */
      backgroundColor?: string;
      /**
       * When true, the video uses the full 16:9 container with no 75% inset,
       * even when backgroundColor is set. Useful for tightly cropped source
       * videos where you want to maximize visible content.
       */
      maximizeVideo?: boolean;
    };

/** Block with media on one side (50%) and markdown text on the other (50%), vertically centered. */
export interface CaseStudySplitBlock {
  type: 'split';
  /** Which side the media is on. */
  side: 'left' | 'right';
  /** Image or video media. */
  media: CaseStudySplitMedia;
  /** Markdown content for the text side. */
  content: string;
}

/** Block with markdown text on both sides (50/50 columns). */
export interface CaseStudyTextSplitBlock {
  type: 'text-split';
  /** Markdown content for the left column. */
  left: string;
  /** Markdown content for the right column. */
  right: string;
}

/** Emphasized question callout (terracotta left bar) rendered in normal flow. */
export interface CaseStudyQuestionBlock {
  type: 'question';
  /** Markdown content for the question text. */
  content: string;
}

/** Body block: markdown segment, media split, or text-only split block. */
export type CaseStudyBodyBlock =
  | { type: 'markdown'; content: string }
  | CaseStudySplitBlock
  | CaseStudyTextSplitBlock
  | CaseStudyQuestionBlock;

export interface CaseStudy {
  slug: string;
  title: string;
  client: string;
  isProtected: boolean;
  sequence: number;
  summary: string;
  tags: string[];
  /** Custom key-value pairs (e.g. role, timeline, team) */
  metadata?: CaseStudyMetadataItem[];
  /** Short intro for two-column hero (left column). If omitted, summary/body can be used. */
  intro?: string;
  /** Shown below intro when isProtected: explains why the case study is gated and how to get access. */
  passwordIntro?: string;
  /** Hero media block at top (image or video in dark container). */
  heroMedia?: CaseStudyHeroMedia;
  /** Background color for hero/cover area (e.g. #1a1a1a). Defaults to dark gray if omitted. */
  heroBackgroundColor?: string;
  /** Optional browser-style bar above hero media. */
  heroChrome?: CaseStudyHeroChrome;
  /** Full case study content as markdown (legacy) or array of blocks (markdown + split). */
  body: string | CaseStudyBodyBlock[];
  /** Anchor label for skip link (e.g. "designs"). Links to first H2 matching this. */
  skipToSection?: string;
  nextCaseStudySlug?: string;
  teaserVimeoId?: string;
}
