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

export const CURRICULUM: ModuleMeta[] = [
  {
    number: 1,
    title: "The Big Shift: How Word Thinks",
    summary: "Understand the difference between Publisher's freeform canvas and Word's river of text, and turn on the hidden clues.",
    lessons: [
      {
        slug: "01-how-text-flows",
        order: 1,
        title: "How Text Flows in Word (The River vs. Pinboard)",
        summary: "Why pressing Enter moves everything down, and the crucial difference between Enter, Shift+Enter, and Page Break.",
        module: 1,
        isAvailable: true
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

export const ALL_LESSONS = CURRICULUM.flatMap(m => m.lessons);

export function getLessonBySlug(slug: string): LessonMeta | undefined {
  return ALL_LESSONS.find(l => l.slug === slug);
}

export function getAdjacentLessons(currentSlug: string) {
  const index = ALL_LESSONS.findIndex(l => l.slug === currentSlug);
  return {
    prev: index > 0 ? ALL_LESSONS[index - 1] : undefined,
    next: index >= 0 && index < ALL_LESSONS.length - 1 ? ALL_LESSONS[index + 1] : undefined
  };
}
