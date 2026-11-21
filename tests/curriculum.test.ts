import { describe, it, expect } from 'vitest';
import {
  CURRICULUM,
  ALL_LESSONS,
  getLessonBySlug,
  getAdjacentLessons,
  buildCurriculum,
  getCurriculum
} from '../src/data/curriculum';

describe('Curriculum Data and Helpers (src/data/curriculum.ts)', () => {
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

  it('should dynamically derive Lesson 1 title, summary, and isAvailable from authored content', () => {
    const lesson1 = getLessonBySlug('01-how-text-flows');
    expect(lesson1).toBeDefined();
    expect(lesson1?.order).toBe(1);
    expect(lesson1?.isAvailable).toBe(true);
    expect(lesson1?.title).toContain('How Text Flows in Word');
    expect(lesson1?.summary).toContain('pressing Enter');

    // Unauthored lesson 2 remains unavailable
    const lesson2 = getLessonBySlug('02-show-hidden-clues');
    expect(lesson2).toBeDefined();
    expect(lesson2?.isAvailable).toBe(false);
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
