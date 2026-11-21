import { describe, it, expect } from 'vitest';

export function isCurrent(href: string, currentPath: string): boolean {
  if (href === '/') return currentPath === '/';
  return currentPath === href || currentPath.startsWith(`${href}/`);
}

describe('Navigation Active State (isCurrent)', () => {
  it('matches exact root path correctly', () => {
    expect(isCurrent('/', '/')).toBe(true);
    expect(isCurrent('/', '/lessons')).toBe(false);
  });

  it('matches section root paths', () => {
    expect(isCurrent('/lessons', '/lessons')).toBe(true);
    expect(isCurrent('/start-here', '/start-here')).toBe(true);
  });

  it('matches sub-routes with path segment boundary', () => {
    expect(isCurrent('/lessons', '/lessons/01-how-text-flows')).toBe(true);
    expect(isCurrent('/lessons', '/lessons/02-show-hidden-clues')).toBe(true);
  });

  it('does not falsely match routes sharing a prefix without path boundary', () => {
    expect(isCurrent('/lessons', '/lessons-archive')).toBe(false);
    expect(isCurrent('/lesson', '/lessons')).toBe(false);
    expect(isCurrent('/start', '/start-here')).toBe(false);
  });
});
