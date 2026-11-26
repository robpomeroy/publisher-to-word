import { describe, it, expect } from 'vitest';
import { resolvePlausibleScriptUrl } from '../src/utils/analytics';

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
