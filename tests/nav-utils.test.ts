import { describe, it, expect, vi } from 'vitest';
import { parseHTML } from 'linkedom';
import { isCurrent, measureNavFits, applyNavLayout } from '../src/utils/nav';

describe('Navigation Utilities (src/utils/nav.ts)', () => {
  describe('isCurrent', () => {
    it('matches root route correctly', () => {
      expect(isCurrent('/', '/')).toBe(true);
      expect(isCurrent('/lessons', '/')).toBe(false);
    });

    it('matches exact subpath', () => {
      expect(isCurrent('/start-here', '/start-here')).toBe(true);
      expect(isCurrent('/lessons', '/lessons')).toBe(true);
    });

    it('matches nested child routes with slash boundary', () => {
      expect(isCurrent('/lessons/01-how-text-flows', '/lessons')).toBe(true);
      expect(isCurrent('/lessons/01-how-text-flows/subpage', '/lessons')).toBe(true);
    });

    it('does not match sibling routes with common string prefix', () => {
      expect(isCurrent('/lessons-archived', '/lessons')).toBe(false);
      expect(isCurrent('/start-here-v2', '/start-here')).toBe(false);
    });
  });

  describe('measureNavFits', () => {
    it('restores is-wide to true when contents fit inline', () => {
      const { document } = parseHTML('<header class="site-header"><div class="header-inner"></div></header>');
      const header = document.querySelector('header') as unknown as HTMLElement;
      const inner = document.querySelector('.header-inner') as unknown as HTMLElement;

      // Mock clientWidth >= scrollWidth
      Object.defineProperty(inner, 'clientWidth', { value: 800, configurable: true });
      Object.defineProperty(inner, 'scrollWidth', { value: 500, configurable: true });

      const fits = measureNavFits(header, inner);
      expect(fits).toBe(true);
      expect(header.classList.contains('is-measuring')).toBe(false);
      expect(header.classList.contains('is-wide')).toBe(true);
    });

    it('removes is-wide when contents do not fit inline (prevents stuck is-wide regression)', () => {
      const { document } = parseHTML('<header class="site-header is-wide"><div class="header-inner"></div></header>');
      const header = document.querySelector('header') as unknown as HTMLElement;
      const inner = document.querySelector('.header-inner') as unknown as HTMLElement;

      // Mock scrollWidth > clientWidth (narrow viewport)
      Object.defineProperty(inner, 'clientWidth', { value: 400, configurable: true });
      Object.defineProperty(inner, 'scrollWidth', { value: 600, configurable: true });

      const fits = measureNavFits(header, inner);
      expect(fits).toBe(false);
      expect(header.classList.contains('is-measuring')).toBe(false);
      expect(header.classList.contains('is-wide')).toBe(false);
    });
  });

  describe('applyNavLayout', () => {
    it('sets is-wide and removes popover attribute when fitting inline', () => {
      const { document } = parseHTML(`
        <header class="site-header">
          <button class="menu-button" aria-expanded="true">Menu</button>
          <ul id="site-menu" popover="auto"></ul>
        </header>
      `);
      const header = document.querySelector('header') as unknown as HTMLElement;
      const menu = document.querySelector('#site-menu') as unknown as HTMLElement;
      const menuBtn = document.querySelector('.menu-button') as unknown as HTMLElement;

      const hidePopover = vi.fn();
      menu.hidePopover = hidePopover;
      menu.matches = (sel: string) => sel === ':popover-open';

      applyNavLayout({ header, menu, menuBtn }, true);

      expect(header.classList.contains('is-wide')).toBe(true);
      expect(menu.hasAttribute('popover')).toBe(false);
      expect(menuBtn.hasAttribute('aria-expanded')).toBe(false);
      expect(hidePopover).toHaveBeenCalled();
    });

    it('safely catches errors if hidePopover throws or if menuBtn is omitted', () => {
      const { document } = parseHTML(`
        <header class="site-header">
          <ul id="site-menu" popover="auto"></ul>
        </header>
      `);
      const header = document.querySelector('header') as unknown as HTMLElement;
      const menu = document.querySelector('#site-menu') as unknown as HTMLElement;

      menu.hidePopover = () => {
        throw new Error('Already closed');
      };
      menu.matches = () => true;

      expect(() => applyNavLayout({ header, menu }, true)).not.toThrow();
      expect(header.classList.contains('is-wide')).toBe(true);
      expect(menu.hasAttribute('popover')).toBe(false);
    });

    it('sets popover="auto" and removes is-wide on narrow viewports', () => {
      const { document } = parseHTML(`
        <header class="site-header is-wide">
          <ul id="site-menu"></ul>
        </header>
      `);
      const header = document.querySelector('header') as unknown as HTMLElement;
      const menu = document.querySelector('#site-menu') as unknown as HTMLElement;

      applyNavLayout({ header, menu }, false);

      expect(header.classList.contains('is-wide')).toBe(false);
      expect(menu.getAttribute('popover')).toBe('auto');
    });
  });
});
