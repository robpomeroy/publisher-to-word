import { describe, it, expect } from 'vitest';
import { TRANSLATOR_ENTRIES } from '../src/data/translator';
import { RESCUE_ITEMS } from '../src/data/rescue';
import {
  normaliseSearch,
  filterTranslatorEntries,
  filterRescueItems,
} from '../src/utils/reference';
import { ALL_LESSONS } from '../src/data/curriculum';

describe('Reference Tools Data & Filter Utilities', () => {
  const validLessonSlugs = new Set(ALL_LESSONS.map(l => l.slug));

  describe('normaliseSearch', () => {
    it('lowercases and trims text', () => {
      expect(normaliseSearch('  Text Box  ')).toBe('text box');
    });

    it('strips accents and diacritics', () => {
      expect(normaliseSearch('Crème Brûlée')).toBe('creme brulee');
    });
  });

  describe('Translator Data & Filters', () => {
    it('contains at least 22 structured translation entries', () => {
      expect(TRANSLATOR_ENTRIES.length).toBeGreaterThanOrEqual(22);
    });

    it('has unique IDs for every translation entry', () => {
      const ids = TRANSLATOR_ENTRIES.map(e => e.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('every entry links to an existing, valid lesson slug', () => {
      for (const entry of TRANSLATOR_ENTRIES) {
        expect(
          validLessonSlugs.has(entry.lessonSlug),
          `Entry "${entry.id}" has invalid lesson slug "${entry.lessonSlug}"`
        ).toBe(true);
      }
    });

    it('filters entries by category', () => {
      const canvasEntries = filterTranslatorEntries(
        TRANSLATOR_ENTRIES,
        '',
        'canvas-text'
      );
      expect(canvasEntries.length).toBeGreaterThan(0);
      expect(canvasEntries.every(e => e.category === 'canvas-text')).toBe(true);
    });

    it('filters entries by keyword search across fields', () => {
      const scratchMatches = filterTranslatorEntries(
        TRANSLATOR_ENTRIES,
        'scratch',
        'all'
      );
      expect(scratchMatches.length).toBeGreaterThanOrEqual(1);
      expect(scratchMatches[0].publisher.toLowerCase()).toContain('scratch');

      const anchorMatches = filterTranslatorEntries(
        TRANSLATOR_ENTRIES,
        'anchor',
        'all'
      );
      expect(anchorMatches.length).toBeGreaterThanOrEqual(1);
    });

    it('returns empty array when search query matches nothing', () => {
      const noMatches = filterTranslatorEntries(
        TRANSLATOR_ENTRIES,
        'nonexistenttermxyz123',
        'all'
      );
      expect(noMatches).toEqual([]);
    });

    it('respects both category filter and keyword simultaneously', () => {
      const filtered = filterTranslatorEntries(
        TRANSLATOR_ENTRIES,
        'crop',
        'pictures-shapes'
      );
      expect(filtered.length).toBeGreaterThan(0);
      expect(filtered.every(e => e.category === 'pictures-shapes')).toBe(true);

      const crossCategoryMismatch = filterTranslatorEntries(
        TRANSLATOR_ENTRIES,
        'scratch area',
        'tables-print'
      );
      expect(crossCategoryMismatch).toEqual([]);
    });
  });

  describe('Rescue Guide Data & Filters', () => {
    it('contains exactly 12 troubleshooting snags', () => {
      expect(RESCUE_ITEMS.length).toBe(12);
    });

    it('has sequential IDs snag-1 through snag-12', () => {
      const ids = RESCUE_ITEMS.map(item => item.id);
      for (let i = 1; i <= 12; i++) {
        expect(ids).toContain(`snag-${i}`);
      }
    });

    it('every rescue item links to an existing lesson slug', () => {
      for (const item of RESCUE_ITEMS) {
        expect(
          validLessonSlugs.has(item.lessonSlug),
          `Rescue snag "${item.id}" has invalid lesson slug "${item.lessonSlug}"`
        ).toBe(true);
      }
    });

    it('every item has actionable, non-empty fix steps', () => {
      for (const item of RESCUE_ITEMS) {
        expect(item.fixSteps.length).toBeGreaterThanOrEqual(2);
        for (const step of item.fixSteps) {
          expect(step.trim().length).toBeGreaterThan(10);
        }
      }
    });

    it('filters rescue items by category', () => {
      const imageItems = filterRescueItems(
        RESCUE_ITEMS,
        '',
        'images-anchors'
      );
      expect(imageItems.length).toBeGreaterThanOrEqual(3);
      expect(imageItems.every(item => item.category === 'images-anchors')).toBe(true);
    });

    it('filters rescue items by symptom or cause keyword', () => {
      const jumpedMatches = filterRescueItems(
        RESCUE_ITEMS,
        'jumped',
        'all'
      );
      expect(jumpedMatches.length).toBeGreaterThanOrEqual(1);
      expect(jumpedMatches[0].id).toBe('snag-1');

      const borderMatches = filterRescueItems(
        RESCUE_ITEMS,
        'cut off',
        'all'
      );
      expect(borderMatches.length).toBeGreaterThanOrEqual(1);
      expect(borderMatches[0].id).toBe('snag-7');
    });

    it('returns empty array when query does not match any snag', () => {
      const noMatches = filterRescueItems(
        RESCUE_ITEMS,
        'supercalifragilistic',
        'all'
      );
      expect(noMatches).toEqual([]);
    });
  });
});
