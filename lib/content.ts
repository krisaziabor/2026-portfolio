import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content');

export interface CaseStudy {
  slug: string;
  title: string;
  client: string;
  protected: boolean;
  sequence: number;
  content: string;
  url: string;
}

export interface Academy {
  slug: string;
  title: string;
  type: 'experiment' | 'tool' | 'exploration';
  sequence: number;
  content: string;
  url: string;
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
      content,
      url: `/works/${slug}`,
    };
  } catch {
    return null;
  }
}

export function getAllAcademy(): Academy[] {
  const files = getContentFiles('academy');
  const academy = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, '');
    const fullPath = path.join(contentDirectory, 'academy', filename);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title,
      type: data.type,
      sequence: data.sequence,
      content,
      url: `/academy/${slug}`,
    };
  });

  return academy.sort((a, b) => a.sequence - b.sequence);
}

export function getAcademyBySlug(slug: string): Academy | null {
  try {
    const fullPath = path.join(contentDirectory, 'academy', `${slug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title,
      type: data.type,
      sequence: data.sequence,
      content,
      url: `/academy/${slug}`,
    };
  } catch {
    return null;
  }
}
