import { describe, expect, it } from 'vitest';
import { generateDeterministicId, hashString, slugify } from '../src/utils/id';

describe('Deterministic ID Utilities', () => {
  describe('slugify', () => {
    it('lowercases and replaces special characters and spaces with hyphens', () => {
      expect(slugify('Common Snag — Watch Out!')).toBe('common-snag-watch-out');
      expect(slugify('  Where to Find It?  ')).toBe('where-to-find-it');
      expect(slugify('Section #4: Advanced (Tips)')).toBe('section-4-advanced-tips');
    });

    it('handles empty strings and strings with only symbols', () => {
      expect(slugify('')).toBe('');
      expect(slugify('---***---')).toBe('');
    });
  });

  describe('hashString', () => {
    it('produces deterministic 32-bit hashes in base36', () => {
      const h1 = hashString('test-string');
      const h2 = hashString('test-string');
      expect(h1).toBe(h2);
      expect(typeof h1).toBe('string');
      expect(h1.length).toBeGreaterThan(0);
    });

    it('produces different hashes for different inputs', () => {
      expect(hashString('input-a')).not.toBe(hashString('input-b'));
    });

    it('handles empty string', () => {
      expect(hashString('')).toBe('0');
    });
  });

  describe('generateDeterministicId', () => {
    it('combines prefix, slug, and hash', () => {
      const id = generateDeterministicId('gotcha', 'Snag Point');
      expect(id).toMatch(/^gotcha-snag-point-[a-z0-9]+$/);
    });

    it('falls back when key slug is empty', () => {
      const id = generateDeterministicId('gotcha', '!!!', 'custom-fallback');
      expect(id).toMatch(/^gotcha-custom-fallback-[a-z0-9]+$/);
    });

    it('is completely deterministic across repeated invocations', () => {
      const first = generateDeterministicId('try-it', 'Quick Exercise');
      const second = generateDeterministicId('try-it', 'Quick Exercise');
      expect(first).toBe(second);
    });
  });
});
