import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

export interface LessonMeta {
  slug: string;
  order: number;
  title: string;
  summary: string;
  module: number;
  isAvailable?: boolean;
}

export interface ModuleMeta {
  number: number;
  title: string;
  summary: string;
  lessons: LessonMeta[];
}

export interface AuthoredLessonData {
  title: string;
  summary: string;
  order?: number;
  module?: number;
}

export interface AuthoredLessonEntry {
  id: string;
  slug?: string;
  data: AuthoredLessonData;
}

export const MODULE_OUTLINES: ModuleMeta[] = [
  {
    number: 1,
    title: "The Big Shift: How Word Thinks",
    summary: "Understand the difference between Publisher's freeform canvas and Word's river of text, and turn on the hidden clues.",
    lessons: [
      {
        slug: "01-how-text-flows",
        order: 1,
        title: "", // Dynamically loaded from MDX frontmatter
        summary: "", // Dynamically loaded from MDX frontmatter
        module: 1,
        isAvailable: false
      },
      {
        slug: "02-show-hidden-clues",
        order: 2,
        title: "Turn On Your X-Ray Vision",
        summary: "The 3 stress-saving switches: Show/Hide ¶, Rulers, and Alignment Guides.",
        module: 1,
        isAvailable: false
      },
      {
        slug: "03-finding-the-controls",
        order: 3,
        title: "Where Did the Buttons Go?",
        summary: "Contextual Ribbon tabs, the floating Layout arch icon, and the Right-Click format pane.",
        module: 1,
        isAvailable: false
      }
    ]
  },
  {
    number: 2,
    title: "Placing Pictures & Text Boxes",
    summary: "Stop fighting Word when dropping in photos and text boxes. Learn the wrap and anchor settings that make things behave.",
    lessons: [
      {
        slug: "04-text-wrapping",
        order: 4,
        title: "Text Wrapping Options",
        summary: "Tour all 7 wrap styles: In Line with Text, Square, Tight, Top & Bottom, and In Front of Text.",
        module: 2,
        isAvailable: false
      },
      {
        slug: "05-anchors-and-positioning",
        order: 5,
        title: "Move with Text vs. Fix Position on Page",
        summary: "Demystifying the little anchor icon: how to keep an object pinned exactly where you placed it.",
        module: 2,
        isAvailable: false
      },
      {
        slug: "06-text-boxes-and-margins",
        order: 6,
        title: "Text Boxes & Internal Margins",
        summary: "Draw simple text boxes, adjust internal padding so text doesn't hit borders, and link overflowing boxes.",
        module: 2,
        isAvailable: false
      },
      {
        slug: "07-cropping-and-resizing",
        order: 7,
        title: "Resizing & Cropping Photos Cleanly",
        summary: "Corner handles, aspect ratios, Crop to Shape, and Crop Fill/Fit.",
        module: 2,
        isAvailable: false
      }
    ]
  },
  {
    number: 3,
    title: "Styling, Aligning & Organising",
    summary: "Give your pages polish with fills, clean line borders, smart alignment, and grouping.",
    lessons: [
      {
        slug: "08-borders-and-fills",
        order: 8,
        title: "Borders (Lines) & Fills",
        summary: "Shape Fill (No Fill for transparent boxes), Shape Outline, line thickness, and paragraph borders.",
        module: 3,
        isAvailable: false
      },
      {
        slug: "09-align-and-distribute",
        order: 9,
        title: "Align, Distribute & Smart Guides",
        summary: "Line objects up neatly without eyeballing it: Align to Page vs. Margin vs. Selected Objects.",
        module: 3,
        isAvailable: false
      },
      {
        slug: "10-grouping-and-layering",
        order: 10,
        title: "Grouping, Layering & the Selection Pane",
        summary: "Lock objects together, fix the 'Group is greyed out' trap, and find objects hidden behind text.",
        module: 3,
        isAvailable: false
      },
      {
        slug: "11-page-borders-and-setup",
        order: 11,
        title: "Page Borders & Page Setup",
        summary: "Set margins, orientation, and add page borders without your printer chopping off the bottom line.",
        module: 3,
        isAvailable: false
      }
    ]
  },
  {
    number: 4,
    title: "Publisher-Style Layouts Made Easy",
    summary: "Clever techniques to build newsletters, flyers, and multi-column designs with total peace of mind.",
    lessons: [
      {
        slug: "12-invisible-tables",
        order: 12,
        title: "The Secret Weapon: Invisible Tables",
        summary: "Why borderless tables are often the calmest way to arrange text and photos side-by-side.",
        module: 4,
        isAvailable: false
      },
      {
        slug: "13-headers-footers-pages",
        order: 13,
        title: "Replacing Master Pages (Headers, Footers & Sections)",
        summary: "Repeating logos, running headers, and section breaks for mixing columns and orientations.",
        module: 4,
        isAvailable: false
      },
      {
        slug: "14-printing-and-pdf",
        order: 14,
        title: "Printing & Saving Safely as PDF",
        summary: "Freeze your layout so it looks identical on any computer or printer.",
        module: 4,
        isAvailable: false
      }
    ]
  }
];

export function parseFrontmatter(fileContent: string): Record<string, unknown> {
  const match = fileContent.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  try {
    const parsed = YAML.parse(match[1]);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

export function loadAuthoredLessonsFromDisk(lessonsDir: string = path.resolve('src/content/lessons')): AuthoredLessonEntry[] {
  try {
    if (!fs.existsSync(lessonsDir)) return [];
    const files = fs.readdirSync(lessonsDir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
    return files.map(file => {
      const content = fs.readFileSync(path.join(lessonsDir, file), 'utf-8');
      const slug = file.replace(/\.mdx?$/, '');
      const frontmatter = parseFrontmatter(content);
      const title = typeof frontmatter.title === 'string' ? frontmatter.title.trim() : '';
      const summary = typeof frontmatter.summary === 'string' ? frontmatter.summary.trim() : '';
      const moduleNum = typeof frontmatter.module === 'number' ? frontmatter.module : 1;
      const orderNum = typeof frontmatter.order === 'number' ? frontmatter.order : 1;

      return {
        id: file,
        slug,
        data: {
          title,
          summary,
          module: moduleNum,
          order: orderNum
        }
      };
    });
  } catch {
    return [];
  }
}

export function buildCurriculum(authoredLessons: AuthoredLessonEntry[] = []): ModuleMeta[] {
  const authoredMap = new Map<string, AuthoredLessonData>();
  for (const item of authoredLessons) {
    const slug = (item.slug || item.id || '').replace(/\.mdx?$/, '');
    if (slug) authoredMap.set(slug, item.data);
  }

  return MODULE_OUTLINES.map(mod => ({
    ...mod,
    lessons: mod.lessons.map(stub => {
      const authored = authoredMap.get(stub.slug);
      if (authored) {
        return {
          slug: stub.slug,
          order: authored.order ?? stub.order,
          title: authored.title,
          summary: authored.summary,
          module: authored.module ?? stub.module,
          isAvailable: true
        };
      }
      return {
        ...stub,
        isAvailable: false
      };
    })
  }));
}

export function getCurriculum(authoredLessons?: AuthoredLessonEntry[]): ModuleMeta[] {
  const lessons = authoredLessons ?? loadAuthoredLessonsFromDisk();
  return buildCurriculum(lessons);
}

export const CURRICULUM: ModuleMeta[] = getCurriculum();
export const ALL_LESSONS: LessonMeta[] = CURRICULUM.flatMap(m => m.lessons);

export function getLessonBySlug(slug: string, authoredLessons?: AuthoredLessonEntry[]): LessonMeta | undefined {
  const curriculum = authoredLessons ? buildCurriculum(authoredLessons) : CURRICULUM;
  return curriculum.flatMap(m => m.lessons).find(l => l.slug === slug);
}

export function getAdjacentLessons(currentSlug: string, authoredLessons?: AuthoredLessonEntry[]) {
  const all = authoredLessons ? buildCurriculum(authoredLessons).flatMap(m => m.lessons) : ALL_LESSONS;
  const index = all.findIndex(l => l.slug === currentSlug);
  return {
    prev: index > 0 ? all[index - 1] : undefined,
    next: index >= 0 && index < all.length - 1 ? all[index + 1] : undefined
  };
}
