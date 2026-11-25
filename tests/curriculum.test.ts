import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, it, expect, vi } from 'vitest';
import {
  CURRICULUM,
  ALL_LESSONS,
  getLessonBySlug,
  getAdjacentLessons,
  buildCurriculum,
  getCurriculum,
  parseFrontmatter,
  loadAuthoredLessonsFromDisk
} from '../src/data/curriculum';

describe('Curriculum Data and Helpers (src/data/curriculum.ts)', () => {
  describe('parseFrontmatter', () => {
    it('correctly parses YAML frontmatter containing single quotes and contractions', () => {
      const content = `---
title: "Why Word's Layout Doesn't Behave Like a Canvas"
summary: "Draw simple text boxes, adjust padding so text doesn't overflow borders..."
module: 2
order: 6
---
# Body content
`;
      const result = parseFrontmatter(content);
      expect(result.title).toBe("Why Word's Layout Doesn't Behave Like a Canvas");
      expect(result.summary).toBe("Draw simple text boxes, adjust padding so text doesn't overflow borders...");
      expect(result.module).toBe(2);
      expect(result.order).toBe(6);
    });

    it('returns empty object when frontmatter fence is missing', () => {
      expect(parseFrontmatter('# No frontmatter here')).toEqual({});
    });

    it('returns empty object when YAML syntax is malformed', () => {
      const badContent = `---
title: [unclosed array
---
`;
      expect(parseFrontmatter(badContent)).toEqual({});
    });
  });

  describe('loadAuthoredLessonsFromDisk', () => {
    it('returns empty array when lessons directory does not exist', () => {
      const lessons = loadAuthoredLessonsFromDisk('/non/existent/directory');
      expect(lessons).toEqual([]);
    });

    it('loads and parses authored lessons with fallbacks for missing properties', () => {
      const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'curriculum-test-'));
      fs.writeFileSync(
        path.join(tempDir, '06-text-boxes.mdx'),
        `---
title: "Text Boxes & Padding"
summary: "Ensure text doesn't overflow"
---
`
      );
      fs.writeFileSync(path.join(tempDir, 'ignore.txt'), 'Not a lesson');

      const lessons = loadAuthoredLessonsFromDisk(tempDir);
      expect(lessons).toHaveLength(1);
      expect(lessons[0].slug).toBe('06-text-boxes');
      expect(lessons[0].data.title).toBe('Text Boxes & Padding');
      expect(lessons[0].data.summary).toBe("Ensure text doesn't overflow");
      expect(lessons[0].data.module).toBe(1); // default fallback
      expect(lessons[0].data.order).toBe(1); // default fallback

      fs.rmSync(tempDir, { recursive: true, force: true });
    });

    it('catches and handles filesystem errors gracefully', () => {
      const spy = vi.spyOn(fs, 'readdirSync').mockImplementation(() => {
        throw new Error('EACCES: permission denied');
      });

      const result = loadAuthoredLessonsFromDisk();
      expect(result).toEqual([]);

      spy.mockRestore();
    });
  });

  describe('Curriculum Outlines and Navigation', () => {
    it('should define exactly 4 modules', () => {
      expect(CURRICULUM).toHaveLength(4);
      expect(getCurriculum()).toHaveLength(4);
      expect(CURRICULUM.map(m => m.number)).toEqual([1, 2, 3, 4]);
    });

    it('should define exactly 14 total lessons in ALL_LESSONS', () => {
      expect(ALL_LESSONS).toHaveLength(14);
      expect(ALL_LESSONS[0].slug).toBe('01-how-text-flows');
      expect(ALL_LESSONS[13].slug).toBe('14-printing-and-pdf');
    });

    it('should dynamically derive all 14 lessons from authored content on disk', () => {
      const lesson1 = getLessonBySlug('01-how-text-flows');
      expect(lesson1).toBeDefined();
      expect(lesson1?.order).toBe(1);
      expect(lesson1?.isAvailable).toBe(true);
      expect(lesson1?.title).toContain('How Text Flows in Word');
      expect(lesson1?.summary).toContain('pressing Enter');

      // All 14 lessons are now authored and available
      expect(ALL_LESSONS.every(l => l.isAvailable)).toBe(true);

      const lesson14 = getLessonBySlug('14-printing-and-pdf');
      expect(lesson14).toBeDefined();
      expect(lesson14?.isAvailable).toBe(true);
      expect(lesson14?.title).toContain('Printing');
    });

    it('should allow buildCurriculum to dynamically enrich unauthored stubs when authored data is provided', () => {
      const customAuthored = [
        {
          id: '02-show-hidden-clues.mdx',
          slug: '02-show-hidden-clues',
          data: {
            title: 'Dynamic Lesson 2 Title',
            summary: 'Dynamic Lesson 2 Summary',
            module: 1,
            order: 2
          }
        }
      ];

      const enriched = buildCurriculum(customAuthored);
      const mod1Lessons = enriched[0].lessons;
      const enrichedLesson2 = mod1Lessons.find(l => l.slug === '02-show-hidden-clues');

      expect(enrichedLesson2?.isAvailable).toBe(true);
      expect(enrichedLesson2?.title).toBe('Dynamic Lesson 2 Title');
      expect(enrichedLesson2?.summary).toBe('Dynamic Lesson 2 Summary');

      // Unauthored lesson 3 remains isAvailable: false
      const lesson3 = mod1Lessons.find(l => l.slug === '03-finding-the-controls');
      expect(lesson3?.isAvailable).toBe(false);
    });

    it('should support querying lesson metadata with custom authored input', () => {
      const custom = [
        {
          id: '01-how-text-flows.mdx',
          slug: '01-how-text-flows',
          data: {
            title: 'Custom Title',
            summary: 'Custom Summary',
            module: 1,
            order: 1
          }
        }
      ];
      const lesson = getLessonBySlug('01-how-text-flows', custom);
      expect(lesson?.title).toBe('Custom Title');

      const adj = getAdjacentLessons('01-how-text-flows', custom);
      expect(adj.next?.slug).toBe('02-show-hidden-clues');
    });

    it('should return undefined for a non-existent slug in getLessonBySlug', () => {
      const notFound = getLessonBySlug('non-existent-lesson');
      expect(notFound).toBeUndefined();
    });

    it('should return undefined prev for the first lesson and correct next lesson', () => {
      const { prev, next } = getAdjacentLessons('01-how-text-flows');
      expect(prev).toBeUndefined();
      expect(next).toBeDefined();
      expect(next?.slug).toBe('02-show-hidden-clues');
    });

    it('should return correct prev and next for an intermediate lesson', () => {
      const { prev, next } = getAdjacentLessons('02-show-hidden-clues');
      expect(prev).toBeDefined();
      expect(prev?.slug).toBe('01-how-text-flows');
      expect(next).toBeDefined();
      expect(next?.slug).toBe('03-finding-the-controls');
    });

    it('should return correct prev and undefined next for the final lesson', () => {
      const { prev, next } = getAdjacentLessons('14-printing-and-pdf');
      expect(prev).toBeDefined();
      expect(prev?.slug).toBe('13-headers-footers-pages');
      expect(next).toBeUndefined();
    });

    it('should return undefined prev and next for a non-existent slug in getAdjacentLessons', () => {
      const { prev, next } = getAdjacentLessons('invalid-slug');
      expect(prev).toBeUndefined();
      expect(next).toBeUndefined();
    });
  });
});
