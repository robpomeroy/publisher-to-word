import { describe, it, expect } from 'vitest';
import { resolvePlausibleScriptUrl, initPlausible } from '../src/utils/analytics';

describe('Plausible Analytics URL Resolver (src/utils/analytics.ts)', () => {
  const validUrl = 'https://plausible.pomeroy.me/js/pa-Avxj0OcKG6D1xBRdah_uI.js';

  it('returns null when not in production mode', () => {
    expect(resolvePlausibleScriptUrl(validUrl, false)).toBeNull();
    expect(resolvePlausibleScriptUrl(validUrl)).toBeNull();
  });

  it('returns null when URL is undefined, empty, or whitespace', () => {
    expect(resolvePlausibleScriptUrl(undefined, true)).toBeNull();
    expect(resolvePlausibleScriptUrl('', true)).toBeNull();
    expect(resolvePlausibleScriptUrl('   ', true)).toBeNull();
  });

  it('returns null for malformed URLs or non-HTTPS protocols', () => {
    expect(resolvePlausibleScriptUrl('not-a-url', true)).toBeNull();
    expect(resolvePlausibleScriptUrl('http://plausible.example.com/js/script.js', true)).toBeNull();
    expect(resolvePlausibleScriptUrl('javascript:alert(1)', true)).toBeNull();
  });

  it('returns normalised HTTPS URL in production mode', () => {
    expect(resolvePlausibleScriptUrl(validUrl, true)).toBe(validUrl);
    expect(resolvePlausibleScriptUrl(`  ${validUrl}  `, true)).toBe(validUrl);
  });
});

describe('Plausible Analytics CSP-Safe Initialiser (src/utils/analytics.ts)', () => {
  it('does nothing when window is undefined', () => {
    expect(() => initPlausible(undefined)).not.toThrow();
  });

  it('initialises window.plausible function and plausible.q queue', () => {
    const mockWindow: {
      plausible?: {
        (...args: unknown[]): void;
        q?: unknown[];
        o?: unknown;
      };
    } = {};

    initPlausible(mockWindow);

    expect(typeof mockWindow.plausible).toBe('function');
    expect(Array.isArray(mockWindow.plausible?.q)).toBe(true);

    mockWindow.plausible!('pageview', { path: '/test' });
    expect(mockWindow.plausible?.q).toHaveLength(1);
    expect(mockWindow.plausible?.q?.[0]).toEqual(['pageview', { path: '/test' }]);
  });

  it('is idempotent when called multiple times on existing plausible object', () => {
    const mockWindow: {
      plausible?: {
        (...args: unknown[]): void;
        q?: unknown[];
      };
    } = {};

    initPlausible(mockWindow);
    mockWindow.plausible!('customEvent');

    initPlausible(mockWindow);
    expect(mockWindow.plausible?.q).toHaveLength(1);
  });
});
