import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content');

export interface DiptychMedia {
  type: 'image' | 'video';
  src: string;
  alt: string;
  hasAudio: boolean;
  posterTime?: number;
}

export interface Diptych {
  text: string;
  media: DiptychMedia;
  ratio: '50-50' | '40-60' | '60-40';
  alignment: 'top' | 'center' | 'bottom';
}

export interface CaseStudy {
  slug: string;
  title: string;
  client: string;
  protected: boolean;
  sequence: number;
  summary: string;
  tags: string[];
  diptychs: Diptych[];
  content: string;
  url: string;
}

export interface AcademyContentBlock {
  type: 'image' | 'video' | 'text';
  src?: string;
  content?: string;
  alt?: string;
  caption?: string;
}

export interface AcademyItem {
  title: string;
  row: number;
  width: string;
  link?: string;
  contentBlocks: AcademyContentBlock[];
}

function getContentFiles(dir: string): string[] {
  const fullPath = path.join(contentDirectory, dir);
  if (!fs.existsSync(fullPath)) {
    return [];
  }
  return fs.readdirSync(fullPath).filter((file) => file.endsWith('.mdx'));
}

export function getAllCaseStudies(): CaseStudy[] {
  const files = getContentFiles('case-studies');
  const caseStudies = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, '');
    const fullPath = path.join(contentDirectory, 'case-studies', filename);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title,
      client: data.client,
      protected: data.protected || false,
      sequence: data.sequence,
      summary: data.summary || '',
      tags: data.tags || [],
      diptychs: data.diptychs || [],
      content,
      url: `/works/${slug}`,
    };
  });

  return caseStudies.sort((a, b) => a.sequence - b.sequence);
}

export function getCaseStudyBySlug(slug: string): CaseStudy | null {
  try {
    const fullPath = path.join(contentDirectory, 'case-studies', `${slug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title,
      client: data.client,
      protected: data.protected || false,
      sequence: data.sequence,
      summary: data.summary || '',
      tags: data.tags || [],
      diptychs: data.diptychs || [],
      content,
      url: `/works/${slug}`,
    };
  } catch {
    return null;
  }
}

export function getAllAcademyItems(): AcademyItem[] {
  try {
    const fullPath = path.join(contentDirectory, 'academy', 'index.mdx');
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Split by --- delimiters and filter out empty sections
    const sections = fileContents.split(/^---$/m).filter(section => section.trim());

    const items = sections.map((section) => {
      const { data } = matter(`---\n${section.trim()}\n---`);

      // Prefix src paths with /academy/
      const contentBlocks = (data.contentBlocks || []).map((block: AcademyContentBlock) => ({
        ...block,
        src: block.src ? `/academy/${block.src}` : undefined,
      }));

      return {
        title: data.title,
        row: data.row,
        width: data.width,
        link: data.link,
        contentBlocks,
      };
    });

    // Sort by row number, maintaining order within each row
    return items.sort((a, b) => a.row - b.row);
  } catch {
    return [];
  }
}
