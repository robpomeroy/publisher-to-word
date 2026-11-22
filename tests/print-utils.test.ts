import { describe, it, expect, vi } from 'vitest';
import { parseHTML } from 'linkedom';
import {
  initPrintTrigger,
  expandDetailsForPrint,
  restoreDetailsAfterPrint,
  initPrintDetailsExpansion
} from '../src/utils/print';

describe('Print Utilities (src/utils/print.ts)', () => {
  describe('initPrintTrigger', () => {
    it('calls printFn when clicking a [data-print-trigger] element or its child', () => {
      const { window: mockWindow, document } = parseHTML(`
        <div>
          <button id="print-btn" data-print-trigger><span>Print Page</span></button>
          <button id="other-btn">Normal Button</button>
        </div>
      `);

      const printFn = vi.fn();
      const cleanup = initPrintTrigger(document, printFn);

      const span = document.querySelector('button#print-btn span') as unknown as HTMLElement;
      const clickEvent = new (mockWindow as unknown as { Event: typeof Event }).Event('click', { bubbles: true });
      span.dispatchEvent(clickEvent);
      expect(printFn).toHaveBeenCalledTimes(1);

      const other = document.querySelector('#other-btn') as unknown as HTMLElement;
      other.dispatchEvent(new (mockWindow as unknown as { Event: typeof Event }).Event('click', { bubbles: true }));
      expect(printFn).toHaveBeenCalledTimes(1);

      cleanup();
      span.dispatchEvent(new (mockWindow as unknown as { Event: typeof Event }).Event('click', { bubbles: true }));
      expect(printFn).toHaveBeenCalledTimes(1); // Not called after cleanup
    });
  });

  describe('expandDetailsForPrint & restoreDetailsAfterPrint', () => {
    it('temporarily expands closed disclosure details and restores them', () => {
      const { document } = parseHTML(`
        <div>
          <details id="d1" class="disclosure"><summary>One</summary><p>A</p></details>
          <details id="d2" class="disclosure" open><summary>Two</summary><p>B</p></details>
          <details id="d3"><summary>Three (non-disclosure)</summary><p>C</p></details>
        </div>
      `);

      const d1 = document.querySelector('#d1') as unknown as HTMLDetailsElement;
      const d2 = document.querySelector('#d2') as unknown as HTMLDetailsElement;
      const d3 = document.querySelector('#d3') as unknown as HTMLDetailsElement;

      expect(d1.hasAttribute('open')).toBe(false);
      expect(d2.hasAttribute('open')).toBe(true);

      const opened = expandDetailsForPrint(document);
      expect(opened).toHaveLength(1);
      expect(opened[0]).toBe(d1);
      expect(d1.hasAttribute('open')).toBe(true);
      expect(d2.hasAttribute('open')).toBe(true);
      expect(d3.hasAttribute('open')).toBe(false);

      restoreDetailsAfterPrint(opened);
      expect(d1.hasAttribute('open')).toBe(false);
      expect(d2.hasAttribute('open')).toBe(true);
    });
  });

  describe('initPrintDetailsExpansion', () => {
    it('binds beforeprint and afterprint lifecycle events on window', () => {
      const { window: mockWindow, document } = parseHTML(`
        <details id="d1" class="disclosure"><summary>Q</summary><p>Ans</p></details>
      `);

      const d1 = document.querySelector('#d1') as unknown as HTMLDetailsElement;
      const cleanup = initPrintDetailsExpansion(mockWindow as unknown as Window, document);

      expect(d1.hasAttribute('open')).toBe(false);

      mockWindow.dispatchEvent(new (mockWindow as unknown as { Event: typeof Event }).Event('beforeprint'));
      expect(d1.hasAttribute('open')).toBe(true);

      mockWindow.dispatchEvent(new (mockWindow as unknown as { Event: typeof Event }).Event('afterprint'));
      expect(d1.hasAttribute('open')).toBe(false);

      cleanup();
    });
  });
});
