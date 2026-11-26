import { describe, expect, it } from 'vitest';
import { parseHTML, Event as LinkeDOMEvent } from 'linkedom';
import {
  getNextPillIndex,
  initRescueController,
  initTranslatorController,
} from '../src/utils/reference-controllers';
import type { RescueItem } from '../src/utils/reference';
import type { TranslatorEntry } from '../src/data/translator';

function dispatchDOMEvent(el: EventTarget, type: string) {
  el.dispatchEvent(new LinkeDOMEvent(type) as unknown as Event);
}

function sendKey(el: HTMLElement, key: string) {
  const event = new LinkeDOMEvent('keydown', { bubbles: true, cancelable: true });
  (event as unknown as { key: string }).key = key;
  el.dispatchEvent(event as unknown as Event);
}

const MOCK_TRANSLATOR_ENTRIES: TranslatorEntry[] = [
  {
    id: 'trans-scratch',
    publisher: 'Scratch Area',
    word: 'Margin space',
    category: 'canvas-text',
    ribbonPath: 'View tab',
    tip: 'Word has no free scratch canvas.',
    lessonSlug: '01-how-text-flows',
    lessonTitle: 'Text Flow',
  },
  {
    id: 'trans-anchor',
    publisher: 'Free floating object',
    word: 'Anchored object',
    category: 'pictures-shapes',
    ribbonPath: 'Picture Format tab',
    tip: 'All floating items anchor to a paragraph.',
    lessonSlug: '05-anchors-and-positioning',
    lessonTitle: 'Anchors',
  },
  {
    id: 'trans-master',
    publisher: 'Master Page',
    word: 'Header & Footer',
    category: 'tables-print',
    ribbonPath: 'Insert → Header',
    tip: 'Backgrounds go in headers.',
    lessonSlug: '13-headers-footers-pages',
    lessonTitle: 'Headers & Footers',
  },
];

const MOCK_RESCUE_ITEMS: RescueItem[] = [
  {
    id: 'snag-1',
    symptom: 'My picture jumped to the next page!',
    category: 'images-anchors',
    cause: "Word pictures anchor to paragraphs, causing jumping picture effect.",
    fixSteps: ['Select picture', 'Switch to Fix position on page'],
    ribbonPath: 'Picture Format → Position',
    tip: 'Lock anchor',
    lessonSlug: '05-anchors-and-positioning',
    lessonTitle: 'Anchors',
  },
  {
    id: 'snag-2',
    symptom: 'Picture Format tab disappeared!',
    category: 'objects-layering',
    cause: 'Word uses contextual Ribbon tabs.',
    fixSteps: ['Click the object', 'Look at Ribbon header'],
    ribbonPath: 'Click object → Picture Format tab',
    tip: 'Use selection pane',
    lessonSlug: '03-finding-the-controls',
    lessonTitle: 'Finding Controls',
  },
  {
    id: 'snag-3',
    symptom: 'Extra blank page will not delete!',
    category: 'layout-margins',
    cause: 'Trailing paragraph after table.',
    fixSteps: ['Show ¶', 'Reduce font size to 1pt'],
    ribbonPath: 'Home → Font size',
    tip: 'Zero margins',
    lessonSlug: '13-headers-footers-pages',
    lessonTitle: 'Pages',
  },
];

function createTranslatorDOM(): Document {
  const html = `
    <!DOCTYPE html>
    <html>
      <body>
        <div id="filter-status" aria-live="polite"></div>
        <input type="search" id="translator-search" />
        <div class="category-pills" role="radiogroup">
          <button type="button" class="pill-btn is-active" data-category="all" role="radio" aria-checked="true" tabindex="0">All</button>
          <button type="button" class="pill-btn" data-category="canvas-text" role="radio" aria-checked="false" tabindex="-1">Canvas</button>
          <button type="button" class="pill-btn" data-category="pictures-shapes" role="radio" aria-checked="false" tabindex="-1">Images</button>
          <button type="button" class="pill-btn" data-category="tables-print" role="radio" aria-checked="false" tabindex="-1">Pages</button>
        </div>
        <button type="button" id="reset-filters-btn">Reset</button>
        <div id="translator-empty" hidden>No results</div>
        <table id="translator-table">
          <tbody>
            <tr class="translator-row" data-id="trans-scratch" data-category="canvas-text"><td>Scratch</td></tr>
            <tr class="translator-row" data-id="trans-anchor" data-category="pictures-shapes"><td>Anchor</td></tr>
            <tr class="translator-row" data-id="trans-master" data-category="tables-print"><td>Master</td></tr>
          </tbody>
        </table>
      </body>
    </html>
  `;
  const { document } = parseHTML(html);
  return document as unknown as Document;
}

function createRescueDOM(): Document {
  const html = `
    <!DOCTYPE html>
    <html>
      <body>
        <div id="filter-status" aria-live="polite"></div>
        <input type="search" id="rescue-search" />
        <div class="category-pills" role="radiogroup">
          <button type="button" class="pill-btn is-active" data-category="all" role="radio" aria-checked="true" tabindex="0">All</button>
          <button type="button" class="pill-btn" data-category="images-anchors" role="radio" aria-checked="false" tabindex="-1">Images</button>
          <button type="button" class="pill-btn" data-category="objects-layering" role="radio" aria-checked="false" tabindex="-1">Objects</button>
          <button type="button" class="pill-btn" data-category="layout-margins" role="radio" aria-checked="false" tabindex="-1">Margins</button>
        </div>
        <button type="button" id="toggle-all-btn" aria-expanded="false"><span id="toggle-all-text">Expand All</span></button>
        <button type="button" id="reset-filters-btn">Reset</button>
        <div id="rescue-empty" hidden>No snags found</div>
        <div class="rescue-stack">
          <details id="snag-1" class="rescue-card" data-id="snag-1" data-category="images-anchors">
            <summary>Snag 1</summary>
            <div>Details 1</div>
          </details>
          <details id="snag-2" class="rescue-card" data-id="snag-2" data-category="objects-layering">
            <summary>Snag 2</summary>
            <div>Details 2</div>
          </details>
          <details id="snag-3" class="rescue-card" data-id="snag-3" data-category="layout-margins">
            <summary>Snag 3</summary>
            <div>Details 3</div>
          </details>
        </div>
      </body>
    </html>
  `;
  const { document } = parseHTML(html);
  return document as unknown as Document;
}

describe('Reference Tools DOM Integration Controllers (src/utils/reference-controllers.ts)', () => {
  describe('getNextPillIndex', () => {
    it('handles cyclic arrow key navigation', () => {
      expect(getNextPillIndex('ArrowRight', 0, 4)).toBe(1);
      expect(getNextPillIndex('ArrowRight', 3, 4)).toBe(0);
      expect(getNextPillIndex('ArrowDown', 1, 4)).toBe(2);
      expect(getNextPillIndex('ArrowLeft', 0, 4)).toBe(3);
      expect(getNextPillIndex('ArrowUp', 2, 4)).toBe(1);
    });

    it('handles Home and End keys', () => {
      expect(getNextPillIndex('Home', 2, 4)).toBe(0);
      expect(getNextPillIndex('End', 1, 4)).toBe(3);
    });

    it('returns -1 for unsupported keys or empty lists', () => {
      expect(getNextPillIndex('Tab', 0, 4)).toBe(-1);
      expect(getNextPillIndex('Enter', 0, 4)).toBe(-1);
      expect(getNextPillIndex('ArrowRight', 0, 0)).toBe(-1);
    });
  });

  describe('Translator Controller DOM Wiring', () => {
    it('returns null if no elements exist', () => {
      const { document } = parseHTML('<div></div>');
      const ctrl = initTranslatorController(document as unknown as Document);
      expect(ctrl).toBeNull();
    });

    it('filters rows by search input and updates status', () => {
      const doc = createTranslatorDOM();
      const ctrl = initTranslatorController(doc, { entries: MOCK_TRANSLATOR_ENTRIES });
      expect(ctrl).not.toBeNull();

      const searchInput = doc.querySelector<HTMLInputElement>('#translator-search')!;
      const filterStatus = doc.querySelector<HTMLElement>('#filter-status')!;
      const rows = doc.querySelectorAll<HTMLTableRowElement>('.translator-row');

      searchInput.value = 'scratch';
      dispatchDOMEvent(searchInput, 'input');

      expect(ctrl?.getCurrentQuery()).toBe('scratch');
      expect(rows[0].hidden).toBe(false);
      expect(rows[1].hidden).toBe(true);
      expect(rows[2].hidden).toBe(true);
      expect(filterStatus.textContent).toContain('Showing 1 of 3');
    });

    it('displays empty state and hides table when query matches nothing', () => {
      const doc = createTranslatorDOM();
      initTranslatorController(doc, { entries: MOCK_TRANSLATOR_ENTRIES });

      const searchInput = doc.querySelector<HTMLInputElement>('#translator-search')!;
      const emptyState = doc.querySelector<HTMLElement>('#translator-empty')!;
      const table = doc.querySelector<HTMLTableElement>('#translator-table')!;

      searchInput.value = 'nonexistentxyz';
      dispatchDOMEvent(searchInput, 'input');

      expect(emptyState.hidden).toBe(false);
      expect(table.style.display).toBe('none');
    });

    it('filters rows by category pill click and updates radio attributes', () => {
      const doc = createTranslatorDOM();
      const ctrl = initTranslatorController(doc, { entries: MOCK_TRANSLATOR_ENTRIES });

      const pills = doc.querySelectorAll<HTMLButtonElement>('.pill-btn');
      const rows = doc.querySelectorAll<HTMLTableRowElement>('.translator-row');

      pills[2].click(); // pictures-shapes

      expect(ctrl?.getCurrentCategory()).toBe('pictures-shapes');
      expect(pills[2].classList.contains('is-active')).toBe(true);
      expect(pills[2].getAttribute('aria-checked')).toBe('true');
      expect(pills[2].getAttribute('tabindex')).toBe('0');
      expect(pills[0].classList.contains('is-active')).toBe(false);
      expect(pills[0].getAttribute('tabindex')).toBe('-1');

      expect(rows[0].hidden).toBe(true);
      expect(rows[1].hidden).toBe(false);
      expect(rows[2].hidden).toBe(true);
    });

    it('navigates category pills using arrow keys', () => {
      const doc = createTranslatorDOM();
      initTranslatorController(doc, { entries: MOCK_TRANSLATOR_ENTRIES });

      const container = doc.querySelector<HTMLElement>('.category-pills')!;
      const pills = doc.querySelectorAll<HTMLButtonElement>('.pill-btn');

      expect(pills[0].getAttribute('tabindex')).toBe('0');
      sendKey(container, 'ArrowRight');

      expect(pills[1].classList.contains('is-active')).toBe(true);
      expect(pills[1].getAttribute('tabindex')).toBe('0');

      // Keydown when no pill has tabindex 0 is ignored
      pills.forEach(p => p.setAttribute('tabindex', '-1'));
      sendKey(container, 'ArrowRight');
    });

    it('resets query, category and input on reset button click', () => {
      const doc = createTranslatorDOM();
      const ctrl = initTranslatorController(doc, { entries: MOCK_TRANSLATOR_ENTRIES });

      const searchInput = doc.querySelector<HTMLInputElement>('#translator-search')!;
      const resetBtn = doc.querySelector<HTMLButtonElement>('#reset-filters-btn')!;
      const pills = doc.querySelectorAll<HTMLButtonElement>('.pill-btn');
      const rows = doc.querySelectorAll<HTMLTableRowElement>('.translator-row');

      searchInput.value = 'anchor';
      dispatchDOMEvent(searchInput, 'input');
      pills[2].click();

      expect(rows[0].hidden).toBe(true);

      resetBtn.click();

      expect(ctrl?.getCurrentQuery()).toBe('');
      expect(ctrl?.getCurrentCategory()).toBe('all');
      expect(searchInput.value).toBe('');
      expect(pills[0].classList.contains('is-active')).toBe(true);
      expect(rows[0].hidden).toBe(false);
      expect(rows[1].hidden).toBe(false);
      expect(rows[2].hidden).toBe(false);

      ctrl?.destroy();
    });
  });

  describe('Rescue Controller DOM Wiring', () => {
    it('returns null if no elements exist', () => {
      const { document } = parseHTML('<div></div>');
      const ctrl = initRescueController(document as unknown as Document);
      expect(ctrl).toBeNull();
    });

    it('filters cards by search input and updates status', () => {
      const doc = createRescueDOM();
      const ctrl = initRescueController(doc, { items: MOCK_RESCUE_ITEMS, onHashChange: false });
      expect(ctrl).not.toBeNull();

      const searchInput = doc.querySelector<HTMLInputElement>('#rescue-search')!;
      const cards = doc.querySelectorAll<HTMLDetailsElement>('.rescue-card');
      const filterStatus = doc.querySelector<HTMLElement>('#filter-status')!;

      searchInput.value = 'jumping picture';
      dispatchDOMEvent(searchInput, 'input');

      expect(ctrl?.getCurrentQuery()).toBe('jumping picture');
      expect(cards[0].hidden).toBe(false);
      expect(cards[1].hidden).toBe(true);
      expect(cards[2].hidden).toBe(true);
      expect(filterStatus.textContent).toContain('Showing 1 of 3');
    });

    it('toggles Expand All and Collapse All', () => {
      const doc = createRescueDOM();
      initRescueController(doc, { items: MOCK_RESCUE_ITEMS, onHashChange: false });

      const toggleAllBtn = doc.querySelector<HTMLButtonElement>('#toggle-all-btn')!;
      const toggleAllText = doc.querySelector<HTMLElement>('#toggle-all-text')!;
      const cards = doc.querySelectorAll<HTMLDetailsElement>('.rescue-card');

      expect(toggleAllText.textContent).toBe('Expand All');
      expect(toggleAllBtn.getAttribute('aria-expanded')).toBe('false');

      // Click Expand All
      toggleAllBtn.click();
      expect(cards[0].open).toBe(true);
      expect(cards[1].open).toBe(true);
      expect(cards[2].open).toBe(true);
      expect(toggleAllText.textContent).toBe('Collapse All');
      expect(toggleAllBtn.getAttribute('aria-expanded')).toBe('true');

      // Click Collapse All
      toggleAllBtn.click();
      expect(cards[0].open).toBe(false);
      expect(cards[1].open).toBe(false);
      expect(cards[2].open).toBe(false);
      expect(toggleAllText.textContent).toBe('Expand All');

      // Manually opening all cards updates toggle button via toggle event
      cards.forEach(c => {
        c.open = true;
        dispatchDOMEvent(c, 'toggle');
      });
      expect(toggleAllText.textContent).toBe('Collapse All');
    });

    it('disables toggle button when all cards are filtered out', () => {
      const doc = createRescueDOM();
      initRescueController(doc, { items: MOCK_RESCUE_ITEMS, onHashChange: false });

      const searchInput = doc.querySelector<HTMLInputElement>('#rescue-search')!;
      const toggleAllBtn = doc.querySelector<HTMLButtonElement>('#toggle-all-btn')!;
      const emptyState = doc.querySelector<HTMLElement>('#rescue-empty')!;

      searchInput.value = 'nomatchxyz';
      dispatchDOMEvent(searchInput, 'input');

      expect(emptyState.hidden).toBe(false);
      expect(toggleAllBtn.disabled).toBe(true);
    });

    it('filters cards by category pill click and keyboard', () => {
      const doc = createRescueDOM();
      const ctrl = initRescueController(doc, { items: MOCK_RESCUE_ITEMS, onHashChange: false });

      const pillsContainer = doc.querySelector<HTMLElement>('.category-pills')!;
      const pills = doc.querySelectorAll<HTMLButtonElement>('.pill-btn');
      const cards = doc.querySelectorAll<HTMLDetailsElement>('.rescue-card');

      pills[1].click(); // images-anchors
      expect(ctrl?.getCurrentCategory()).toBe('images-anchors');
      expect(cards[0].hidden).toBe(false);
      expect(cards[1].hidden).toBe(true);

      // Arrow navigation
      sendKey(pillsContainer, 'ArrowRight');
      expect(ctrl?.getCurrentCategory()).toBe('objects-layering');
      expect(cards[0].hidden).toBe(true);
      expect(cards[1].hidden).toBe(false);
    });

    it('handles direct hash navigation and resets filters if target card was filtered', () => {
      const doc = createRescueDOM();
      const card2 = doc.querySelector<HTMLDetailsElement>('#snag-2')!;
      let scrolled = false;
      (card2 as unknown as { scrollIntoView: () => void }).scrollIntoView = () => {
        scrolled = true;
      };

      const ctrl = initRescueController(doc, {
        items: MOCK_RESCUE_ITEMS,
        onHashChange: true,
      });

      const pills = doc.querySelectorAll<HTMLButtonElement>('.pill-btn');
      const cards = doc.querySelectorAll<HTMLDetailsElement>('.rescue-card');

      // First set category to images-anchors (which excludes snag-2 and snag-3)
      pills[1].click();
      expect(cards[1].hidden).toBe(true);

      // Navigate to hash with leading # and custom scrollIntoView
      ctrl?.handleHashNavigation('#snag-2');

      expect(ctrl?.getCurrentCategory()).toBe('all');
      expect(cards[1].hidden).toBe(false);
      expect(cards[1].open).toBe(true);
      expect(pills[0].classList.contains('is-active')).toBe(true);
      expect(scrolled).toBe(true);

      // Non-existent hash does not crash or change state
      ctrl?.handleHashNavigation('#non-existent-hash');
      expect(ctrl?.getCurrentCategory()).toBe('all');

      // Test window hashchange event
      const win = (doc as unknown as { defaultView: EventTarget }).defaultView;
      (win as unknown as { location: { hash: string } }).location = { hash: '#snag-3' };
      dispatchDOMEvent(win, 'hashchange');
      expect(cards[2].open).toBe(true);

      ctrl?.destroy();
    });

    it('ignores keydown when no pill has tabindex 0', () => {
      const doc = createRescueDOM();
      initRescueController(doc, { items: MOCK_RESCUE_ITEMS, onHashChange: false });

      const container = doc.querySelector<HTMLElement>('.category-pills')!;
      const pills = doc.querySelectorAll<HTMLButtonElement>('.pill-btn');
      pills.forEach(p => p.setAttribute('tabindex', '-1'));

      sendKey(container, 'ArrowRight');
      // No crash, active remains unchanged
    });

    it('displays status text when all snags are shown', () => {
      const doc = createRescueDOM();
      const ctrl = initRescueController(doc, { items: MOCK_RESCUE_ITEMS, onHashChange: false });
      const filterStatus = doc.querySelector<HTMLElement>('#filter-status')!;

      ctrl?.applyFilter();
      expect(filterStatus.textContent).toContain('Showing all 3 troubleshooting snags.');
    });

    it('resets all filters when clicking reset button', () => {
      const doc = createRescueDOM();
      const ctrl = initRescueController(doc, { items: MOCK_RESCUE_ITEMS, onHashChange: false });

      const searchInput = doc.querySelector<HTMLInputElement>('#rescue-search')!;
      const resetBtn = doc.querySelector<HTMLButtonElement>('#reset-filters-btn')!;
      const pills = doc.querySelectorAll<HTMLButtonElement>('.pill-btn');
      const cards = doc.querySelectorAll<HTMLDetailsElement>('.rescue-card');

      searchInput.value = 'jump';
      dispatchDOMEvent(searchInput, 'input');
      pills[1].click();

      resetBtn.click();

      expect(ctrl?.getCurrentQuery()).toBe('');
      expect(ctrl?.getCurrentCategory()).toBe('all');
      expect(searchInput.value).toBe('');
      expect(pills[0].classList.contains('is-active')).toBe(true);
      expect(cards[0].hidden).toBe(false);
      expect(cards[1].hidden).toBe(false);
      expect(cards[2].hidden).toBe(false);

      ctrl?.destroy();
    });
  });
});
