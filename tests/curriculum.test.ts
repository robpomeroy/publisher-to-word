import { describe, it, expect } from 'vitest';
import { CURRICULUM, ALL_LESSONS, getLessonBySlug, getAdjacentLessons } from '../src/data/curriculum';

describe('Curriculum Data and Helpers', () => {
  it('should define exactly 4 modules', () => {
    expect(CURRICULUM).toHaveLength(4);
    expect(CURRICULUM.map(m => m.number)).toEqual([1, 2, 3, 4]);
  });

  it('should define exactly 14 total lessons in ALL_LESSONS', () => {
    expect(ALL_LESSONS).toHaveLength(14);
    expect(ALL_LESSONS[0].slug).toBe('01-how-text-flows');
    expect(ALL_LESSONS[13].slug).toBe('14-printing-and-pdf');
  });

  it('should retrieve a lesson by slug correctly', () => {
    const lesson = getLessonBySlug('01-how-text-flows');
    expect(lesson).toBeDefined();
    expect(lesson?.order).toBe(1);
    expect(lesson?.title).toContain('How Text Flows in Word');

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

  it('should return undefined prev and next for a non-existent slug', () => {
    const { prev, next } = getAdjacentLessons('invalid-slug');
    expect(prev).toBeUndefined();
    expect(next).toBeUndefined();
  });
});
