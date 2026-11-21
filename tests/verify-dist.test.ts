import { describe, it, expect } from 'vitest';

export function validateHeadingSequence(headings: number[]): boolean {
  let prevLevel = 0;
  for (const level of headings) {
    if (prevLevel > 0 && level > prevLevel + 1) {
      return false;
    }
    prevLevel = level;
  }
  return true;
}

export function matchAltAttribute(attrs: string): boolean {
  return /(?:^|\s)alt=["']/i.test(attrs);
}

export function resolveAnchorMatch(ids: Set<string>, anchorPart: string): boolean {
  let decodedAnchor = anchorPart;
  try {
    decodedAnchor = decodeURIComponent(anchorPart);
  } catch {
    // fallback
  }
  return ids.has(anchorPart) || ids.has(decodedAnchor);
}

describe('verify-dist Invariant Logic', () => {
  it('validates sequential heading levels and rejects skipped levels', () => {
    expect(validateHeadingSequence([1, 2, 3, 2, 3, 4])).toBe(true);
    expect(validateHeadingSequence([1, 2, 2, 3])).toBe(true);
    expect(validateHeadingSequence([1, 3])).toBe(false); // skipped h2
    expect(validateHeadingSequence([1, 2, 4])).toBe(false); // skipped h3
  });

  it('matches valid alt attributes but rejects data-alt', () => {
    expect(matchAltAttribute('src="/img.png" alt="Description"')).toBe(true);
    expect(matchAltAttribute('alt="" src="/decorative.svg"')).toBe(true);
    expect(matchAltAttribute('src="/img.png" data-alt="Hidden"')).toBe(false);
  });

  it('matches both raw and percent-decoded anchor IDs', () => {
    const ids = new Set(['section-1', 'café', 'about-us']);
    expect(resolveAnchorMatch(ids, 'section-1')).toBe(true);
    expect(resolveAnchorMatch(ids, 'caf%C3%A9')).toBe(true); // percent-encoded 'café'
    expect(resolveAnchorMatch(ids, 'café')).toBe(true);
    expect(resolveAnchorMatch(ids, 'missing')).toBe(false);
  });
});
