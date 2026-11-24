/**
 * Deterministic identifier generation for accessible component elements.
 * Generates URL/DOM-safe slugs and deterministic 32-bit hashes to avoid
 * non-deterministic Math.random() build artifacts.
 */

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash.toString(36);
}

export function generateDeterministicId(
  prefix: string,
  key: string,
  fallback: string = 'item'
): string {
  const slug = slugify(key) || fallback;
  const hash = hashString(key || fallback);
  return `${prefix}-${slug}-${hash}`;
}
