import { describe, expect, it } from 'vitest';
import { parseHTML, Event as LinkeDOMEvent } from 'linkedom';
import {
  getNextRadioIndex,
  initWrapSimulator,
  initAnchorSimulator,
  initAlignSimulator,
  initBoxMarginSimulator,
} from '../src/utils/simulator-controllers';
import {
  getAlignStatus,
  getWrapStatus,
} from '../src/utils/simulators';

function sendKey(el: HTMLElement, key: string) {
  const event = new LinkeDOMEvent('keydown', { bubbles: true, cancelable: true });
  (event as any).key = key;
  el.dispatchEvent(event as unknown as Event);
}

describe('Simulator Production Controllers DOM Tests', () => {
  describe('getNextRadioIndex', () => {
    it('handles forward arrow keys with cyclic wrapping', () => {
      expect(getNextRadioIndex('ArrowRight', 0, 3)).toBe(1);
      expect(getNextRadioIndex('ArrowRight', 2, 3)).toBe(0);
      expect(getNextRadioIndex('ArrowDown', 1, 3)).toBe(2);
    });

    it('handles backward arrow keys with cyclic wrapping', () => {
      expect(getNextRadioIndex('ArrowLeft', 0, 3)).toBe(2);
      expect(getNextRadioIndex('ArrowLeft', 2, 3)).toBe(1);
      expect(getNextRadioIndex('ArrowUp', 0, 3)).toBe(2);
    });

    it('returns -1 for non-arrow keys', () => {
      expect(getNextRadioIndex('Enter', 0, 3)).toBe(-1);
      expect(getNextRadioIndex('Tab', 0, 3)).toBe(-1);
    });
  });
  describe('initWrapSimulator', () => {
    function setupWrapDOM() {
      const html = `
        <div class="wrap-simulator card" data-wrap-simulator>
          <div class="wrap-toolbar">
            <button class="btn-wrap-mode is-active" data-mode="square" aria-pressed="true">Square</button>
            <button class="btn-wrap-mode" data-mode="tight" aria-pressed="false">Tight</button>
            <button class="btn-wrap-mode" data-mode="top-bottom" aria-pressed="false">Top and Bottom</button>
            <button class="btn-wrap-mode" data-mode="inline" aria-pressed="false">In Line</button>
          </div>
          <div class="mode-feedback">
            <span class="badge" data-wrap-badge>Square</span>
            <span class="anchor-status-pill" data-wrap-anchor-pill>
              <span data-wrap-anchor-desc>Anchor icon next to paragraph</span>
            </span>
            <p data-wrap-recommendation><strong>Recommendation: </strong>Default recommendation</p>
          </div>
          <div class="mock-word-page wrap-square astro-test123" data-wrap-preview-page>
            <div class="sim-object-anchor" data-sim-object-anchor></div>
            <strong data-wrap-inline-callout>Square</strong>
          </div>
          <div class="visually-hidden" role="status" aria-live="polite" data-wrap-live-status>
            Square wrap selected.
          </div>
        </div>
      `;
      const { document } = parseHTML(html);
      const container = document.querySelector<HTMLElement>('[data-wrap-simulator]')!;
      initWrapSimulator(container);

      const buttons = container.querySelectorAll<HTMLButtonElement>('.btn-wrap-mode');
      const previewPage = container.querySelector<HTMLElement>('[data-wrap-preview-page]')!;
      const wrapBadge = container.querySelector<HTMLElement>('[data-wrap-badge]')!;
      const anchorDesc = container.querySelector<HTMLElement>('[data-wrap-anchor-desc]')!;
      const anchorPill = container.querySelector<HTMLElement>('[data-wrap-anchor-pill]')!;
      const recommendation = container.querySelector<HTMLElement>('[data-wrap-recommendation]')!;
      const liveStatus = container.querySelector<HTMLElement>('[data-wrap-live-status]')!;
      const inlineCallout = container.querySelector<HTMLElement>('[data-wrap-inline-callout]')!;
      const simAnchor = container.querySelector<HTMLElement>('[data-sim-object-anchor]')!;

      return { container, buttons, previewPage, wrapBadge, anchorDesc, anchorPill, recommendation, liveStatus, inlineCallout, simAnchor };
    }

    it('updates active state, classes, badge, recommendations, and live status on click', () => {
      const { buttons, previewPage, wrapBadge, recommendation, liveStatus, inlineCallout, anchorPill, simAnchor } = setupWrapDOM();
      const tightBtn = buttons[1];

      tightBtn.click();

      expect(tightBtn.classList.contains('is-active')).toBe(true);
      expect(tightBtn.getAttribute('aria-pressed')).toBe('true');
      expect(buttons[0].classList.contains('is-active')).toBe(false);
      expect(buttons[0].getAttribute('aria-pressed')).toBe('false');

      expect(previewPage.classList.contains('wrap-tight')).toBe(true);
      expect(previewPage.classList.contains('wrap-square')).toBe(false);
      expect(previewPage.classList.contains('mock-word-page')).toBe(true);
      expect(previewPage.classList.contains('astro-test123')).toBe(true);
      expect(wrapBadge.textContent).toBe('Tight');
      expect(inlineCallout.textContent).toBe('Tight');
      expect(recommendation.textContent).toContain('Ideal for transparent PNGs');
      expect(anchorPill.style.opacity).toBe('1');
      expect(simAnchor.style.display).toBe('flex');
      expect(liveStatus.textContent).toBe(getWrapStatus('tight'));

      // Also click In Line (has no floating anchor)
      const inlineBtn = buttons[3];
      inlineBtn.click();
      expect(inlineBtn.classList.contains('is-active')).toBe(true);
      expect(previewPage.classList.contains('wrap-inline')).toBe(true);
      expect(previewPage.classList.contains('wrap-tight')).toBe(false);
      expect(previewPage.classList.contains('astro-test123')).toBe(true);
      expect(anchorPill.style.opacity).toBe('0.5');
      expect(simAnchor.style.display).toBe('none');

      // Click back to Square (preserves host/astro classes and restores wrap-square)
      const squareBtn = buttons[0];
      squareBtn.click();
      expect(squareBtn.classList.contains('is-active')).toBe(true);
      expect(previewPage.classList.contains('wrap-square')).toBe(true);
      expect(previewPage.classList.contains('wrap-inline')).toBe(false);
      expect(previewPage.classList.contains('astro-test123')).toBe(true);
    });
  });

  describe('initAnchorSimulator', () => {
    function setupAnchorDOM() {
      const html = `
        <div class="anchor-simulator card" data-anchor-simulator>
          <div role="radiogroup" aria-label="Anchor Mode">
            <button class="btn-anchor-mode is-active" data-btn-mode-move data-mode="move-with-text" aria-checked="true" tabindex="0">Move with text</button>
            <button class="btn-anchor-mode" data-btn-mode-fix data-mode="fix-position" aria-checked="false" tabindex="-1">Fix position</button>
          </div>
          <button data-btn-add-paragraph>Add Paragraph</button>
          <button data-btn-reset-anchor>Reset</button>
          <span data-anchor-summary-text>Initial</span>
          <span data-anchor-para-count>0 / 3 added</span>
          <div class="stream-container" data-stream-container></div>
          <div class="floating-photo" data-floating-photo>
            <span data-photo-mode-tag>Moving with text</span>
          </div>
          <div class="visually-hidden" role="status" aria-live="polite" data-anchor-live-status></div>
        </div>
      `;
      const { document } = parseHTML(html);
      const root = document.querySelector<HTMLElement>('[data-anchor-simulator]')!;
      initAnchorSimulator(root);

      const btnMove = root.querySelector<HTMLButtonElement>('[data-btn-mode-move]')!;
      const btnFix = root.querySelector<HTMLButtonElement>('[data-btn-mode-fix]')!;
      const btnAdd = root.querySelector<HTMLButtonElement>('[data-btn-add-paragraph]')!;
      const btnReset = root.querySelector<HTMLButtonElement>('[data-btn-reset-anchor]')!;
      const streamContainer = root.querySelector<HTMLDivElement>('[data-stream-container]')!;
      const floatingPhoto = root.querySelector<HTMLDivElement>('[data-floating-photo]')!;
      const photoModeTag = root.querySelector<HTMLSpanElement>('[data-photo-mode-tag]')!;
      const summaryText = root.querySelector<HTMLSpanElement>('[data-anchor-summary-text]')!;
      const paraCountBadge = root.querySelector<HTMLSpanElement>('[data-anchor-para-count]')!;
      const liveStatus = root.querySelector<HTMLDivElement>('[data-anchor-live-status]')!;

      return { root, btnMove, btnFix, btnAdd, btnReset, streamContainer, floatingPhoto, photoModeTag, summaryText, paraCountBadge, liveStatus };
    }

    it('handles paragraph insertions up to 3 and disables add button', () => {
      const dom = setupAnchorDOM();

      dom.btnAdd.click();
      expect(dom.streamContainer.children.length).toBe(1);
      expect(dom.paraCountBadge.textContent).toBe('1 / 3 added');
      expect(dom.summaryText.textContent).toContain('Move with text');

      dom.btnAdd.click();
      dom.btnAdd.click();
      expect(dom.streamContainer.children.length).toBe(3);
      expect(dom.btnAdd.disabled).toBe(true);
      expect(dom.liveStatus.textContent).toContain('Photo shifted down by 3 paragraph(s)');
    });

    it('switches modes via click and keyboard arrow navigation', () => {
      const dom = setupAnchorDOM();

      // Direct click mode switch
      dom.btnFix.click();
      expect(dom.btnFix.getAttribute('aria-checked')).toBe('true');
      expect(dom.btnMove.getAttribute('aria-checked')).toBe('false');

      dom.btnMove.click();
      expect(dom.btnMove.getAttribute('aria-checked')).toBe('true');

      // Keyboard arrow navigation
      sendKey(dom.btnMove, 'ArrowRight');
      expect(dom.btnFix.getAttribute('aria-checked')).toBe('true');
      expect(dom.btnMove.getAttribute('aria-checked')).toBe('false');
      expect(dom.photoModeTag.textContent).toBe('Pinned to page');
      expect(dom.summaryText.textContent).toContain('Fix position on page');

      sendKey(dom.btnFix, 'ArrowLeft');
      expect(dom.btnMove.getAttribute('aria-checked')).toBe('true');
      expect(dom.btnFix.getAttribute('aria-checked')).toBe('false');
      expect(dom.photoModeTag.textContent).toBe('Moving with text');

      // ArrowDown and ArrowUp navigation
      sendKey(dom.btnMove, 'ArrowDown');
      expect(dom.btnFix.getAttribute('aria-checked')).toBe('true');
      sendKey(dom.btnFix, 'ArrowUp');
      expect(dom.btnMove.getAttribute('aria-checked')).toBe('true');

      // Ignored key event (e.g. Enter)
      sendKey(dom.btnMove, 'Enter');
      expect(dom.btnMove.getAttribute('aria-checked')).toBe('true');
    });

    it('resets state when reset button is clicked', () => {
      const dom = setupAnchorDOM();

      dom.btnAdd.click();
      dom.btnAdd.click();
      expect(dom.streamContainer.children.length).toBe(2);

      dom.btnReset.click();
      expect(dom.streamContainer.children.length).toBe(0);
      expect(dom.btnAdd.disabled).toBe(false);
      expect(dom.paraCountBadge.textContent).toBe('0 / 3 added');
    });
  });

  describe('initAlignSimulator', () => {
    function setupAlignDOM() {
      const html = `
        <div class="align-simulator card" data-align-simulator>
          <div role="radiogroup" aria-label="Alignment Reference">
            <button class="btn-target is-active" data-target="margin" aria-checked="true" tabindex="0">Margin</button>
            <button class="btn-target" data-target="page" aria-checked="false" tabindex="-1">Page</button>
            <button class="btn-target" data-target="selected" aria-checked="false" tabindex="-1">Selected</button>
          </div>
          <div class="action-bar">
            <button class="btn-align-action" data-action="left">Align Left</button>
            <button class="btn-align-action" data-action="center">Align Center</button>
            <button class="btn-align-action" data-action="right">Align Right</button>
            <button class="btn-align-action" data-action="top">Align Top</button>
            <button class="btn-align-action" data-action="distribute">Distribute</button>
            <button class="btn-align-action" data-action="reset">Reset</button>
          </div>
          <div class="align-canvas">
            <div class="smart-guide-line" data-smart-guide style="display: none;"></div>
            <div class="canvas-item" data-align-item="box-1" style="left: 6.25%; top: 17.5%;"></div>
            <div class="canvas-item" data-align-item="box-2" style="left: 40.625%; top: 37.5%;"></div>
            <div class="canvas-item" data-align-item="box-3" style="left: 68.75%; top: 12.5%;"></div>
          </div>
          <div data-align-status-text>Initial</div>
          <div class="visually-hidden" role="status" aria-live="polite" data-align-live-status>Initial</div>
        </div>
      `;
      const { document } = parseHTML(html);
      const root = document.querySelector<HTMLElement>('[data-align-simulator]')!;
      initAlignSimulator(root);

      const targetBtns = root.querySelectorAll<HTMLButtonElement>('.btn-target');
      const actionBtns = root.querySelectorAll<HTMLButtonElement>('.btn-align-action');
      const smartGuide = root.querySelector<HTMLDivElement>('[data-smart-guide]')!;
      const statusText = root.querySelector<HTMLDivElement>('[data-align-status-text]')!;
      const liveStatus = root.querySelector<HTMLDivElement>('[data-align-live-status]')!;
      const item1 = root.querySelector<HTMLDivElement>('[data-align-item="box-1"]')!;
      const item2 = root.querySelector<HTMLDivElement>('[data-align-item="box-2"]')!;

      return { root, targetBtns, actionBtns, smartGuide, statusText, liveStatus, item1, item2 };
    }

    it('aligns items to margin boundaries using percentage coordinates', () => {
      const dom = setupAlignDOM();
      const leftBtn = dom.actionBtns[0];

      leftBtn.click();
      // Margin left is 40px -> 40/320 = 12.5%
      expect(dom.item1.style.left).toBe('12.5%');
      expect(dom.item2.style.left).toBe('12.5%');
      expect(dom.smartGuide.style.display).toBe('block');
      expect(dom.smartGuide.style.left).toBe('12.5%');
      expect(dom.liveStatus.textContent).toBe(getAlignStatus('left', 'margin'));

      // Test top alignment (exercises vertical smart guide)
      const topBtn = dom.actionBtns[3];
      topBtn.click();
      expect(dom.smartGuide.style.display).toBe('block');
      expect(dom.smartGuide.style.height).toBe('2px');

      // Test center alignment (hides smart guide)
      const centerBtn = dom.actionBtns[1];
      centerBtn.click();
      expect(dom.smartGuide.style.display).toBe('none');

      // Test right alignment
      const rightBtn = dom.actionBtns[2];
      rightBtn.click();
      expect(dom.liveStatus.textContent).toBe(getAlignStatus('right', 'margin'));

      // Test distribute and reset
      const distBtn = dom.actionBtns[4];
      distBtn.click();
      const resetBtn = dom.actionBtns[5];
      resetBtn.click();
    });

    it('navigates targets with keyboard arrows and aligns to page boundaries', () => {
      const dom = setupAlignDOM();

      // Navigate to 'page' via arrow key
      sendKey(dom.targetBtns[0], 'ArrowRight');
      expect(dom.targetBtns[1].classList.contains('is-active')).toBe(true);
      expect(dom.targetBtns[1].getAttribute('aria-checked')).toBe('true');

      // Navigate with ArrowDown and ArrowUp
      sendKey(dom.targetBtns[1], 'ArrowDown');
      expect(dom.targetBtns[2].classList.contains('is-active')).toBe(true);
      sendKey(dom.targetBtns[2], 'ArrowUp');
      expect(dom.targetBtns[1].classList.contains('is-active')).toBe(true);
      sendKey(dom.targetBtns[1], 'ArrowLeft');
      expect(dom.targetBtns[0].classList.contains('is-active')).toBe(true);

      // Ignored key event
      sendKey(dom.targetBtns[0], 'Enter');
      expect(dom.targetBtns[0].classList.contains('is-active')).toBe(true);

      // Switch to selected objects
      dom.targetBtns[2].click();
      dom.actionBtns[0].click();
      expect(dom.liveStatus.textContent).toBe(getAlignStatus('left', 'selected'));
    });
  });

  describe('initBoxMarginSimulator', () => {
    function setupBoxDOM() {
      const html = `
        <div class="box-margin-simulator card" data-box-margin-simulator>
          <div role="radiogroup" aria-label="Margin Preset">
            <button class="btn-box-opt btn-margin is-active" data-margin="default" aria-pressed="true">Default</button>
            <button class="btn-box-opt btn-margin" data-margin="tight" aria-pressed="false">Zero Margins</button>
          </div>
          <div role="radiogroup" aria-label="Fill Color">
            <button class="btn-box-opt btn-fill is-active" data-fill="white" aria-pressed="true">White</button>
            <button class="btn-box-opt btn-fill" data-fill="none" aria-pressed="false">No Fill</button>
          </div>
          <div role="radiogroup" aria-label="Border Outline">
            <button class="btn-box-opt btn-outline is-active" data-outline="black" aria-pressed="true">Black</button>
            <button class="btn-box-opt btn-outline" data-outline="none" aria-pressed="false">No Outline</button>
          </div>
          <div class="preview-text-box" data-preview-text-box style="padding: 0.75rem;"></div>
          <div class="visually-hidden" role="status" aria-live="polite" data-box-live-status>Initial</div>
        </div>
      `;
      const { document } = parseHTML(html);
      const root = document.querySelector<HTMLElement>('[data-box-margin-simulator]')!;
      initBoxMarginSimulator(root);

      const textBox = root.querySelector<HTMLDivElement>('[data-preview-text-box]')!;
      const liveStatus = root.querySelector<HTMLDivElement>('[data-box-live-status]')!;
      const marginTightBtn = root.querySelectorAll<HTMLButtonElement>('.btn-margin')[1];
      const fillNoneBtn = root.querySelectorAll<HTMLButtonElement>('.btn-fill')[1];
      const outlineNoneBtn = root.querySelectorAll<HTMLButtonElement>('.btn-outline')[1];

      return { root, textBox, liveStatus, marginTightBtn, fillNoneBtn, outlineNoneBtn };
    }

    it('updates text box preview styles and live announcements on preset selection', () => {
      const dom = setupBoxDOM();

      dom.marginTightBtn.click();
      expect(dom.textBox.style.padding).toBe('0');
      expect(dom.liveStatus.textContent).toContain('0 cm (Publisher style)');

      dom.fillNoneBtn.click();
      expect(dom.textBox.style.backgroundColor).toBe('transparent');
      expect(dom.liveStatus.textContent).toContain('No Fill (Transparent)');

      dom.outlineNoneBtn.click();
      expect(dom.textBox.style.border).toBe('1px dashed transparent');
      expect(dom.liveStatus.textContent).toContain('No Outline');
    });

    it('supports keyboard navigation within button radio groups', () => {
      const dom = setupBoxDOM();
      const marginDefaultBtn = dom.root.querySelectorAll<HTMLButtonElement>('.btn-margin')[0];
      const marginTightBtn = dom.root.querySelectorAll<HTMLButtonElement>('.btn-margin')[1];

      sendKey(marginDefaultBtn, 'ArrowRight');
      expect(dom.textBox.style.padding).toBe('0');
      expect(dom.liveStatus.textContent).toContain('0 cm (Publisher style)');

      sendKey(marginTightBtn, 'ArrowLeft');
      expect(dom.textBox.style.padding).toBe('0.75rem');

      sendKey(marginDefaultBtn, 'ArrowDown');
      expect(dom.textBox.style.padding).toBe('0');

      sendKey(marginTightBtn, 'ArrowUp');
      expect(dom.textBox.style.padding).toBe('0.75rem');

      const fillWhiteBtn = dom.root.querySelectorAll<HTMLButtonElement>('.btn-fill')[0];
      const fillNoneBtn = dom.root.querySelectorAll<HTMLButtonElement>('.btn-fill')[1];
      sendKey(fillWhiteBtn, 'ArrowRight');
      expect(dom.textBox.style.backgroundColor).toBe('transparent');
      sendKey(fillNoneBtn, 'ArrowLeft');
      expect(dom.textBox.style.backgroundColor).not.toBe('transparent');

      const outlineBlackBtn = dom.root.querySelectorAll<HTMLButtonElement>('.btn-outline')[0];
      const outlineNoneBtn = dom.root.querySelectorAll<HTMLButtonElement>('.btn-outline')[1];
      sendKey(outlineBlackBtn, 'ArrowDown');
      expect(dom.textBox.style.border).toBe('1px dashed transparent');
      sendKey(outlineNoneBtn, 'ArrowUp');
      expect(dom.textBox.style.border).not.toBe('1px dashed transparent');

      // Ignored key event
      sendKey(marginDefaultBtn, 'Enter');
    });
  });

  describe('graceful handling of minimal/missing DOM elements', () => {
    it('handles minimal wrap simulator markup without crashing', () => {
      const { document } = parseHTML('<div data-wrap-simulator><button class="btn-wrap-mode" data-mode="square"></button></div>');
      const root = document.querySelector<HTMLElement>('[data-wrap-simulator]')!;
      initWrapSimulator(root);
      root.querySelector<HTMLButtonElement>('.btn-wrap-mode')!.click();
    });

    it('handles minimal anchor simulator markup without crashing', () => {
      const { document } = parseHTML('<div data-anchor-simulator><button data-btn-add-paragraph></button><button data-btn-reset-anchor></button></div>');
      const root = document.querySelector<HTMLElement>('[data-anchor-simulator]')!;
      initAnchorSimulator(root);
      root.querySelector<HTMLButtonElement>('[data-btn-add-paragraph]')!.click();
      root.querySelector<HTMLButtonElement>('[data-btn-reset-anchor]')!.click();
    });

    it('handles minimal align simulator markup without crashing', () => {
      const { document } = parseHTML('<div data-align-simulator><button class="btn-align-action" data-action="left"></button></div>');
      const root = document.querySelector<HTMLElement>('[data-align-simulator]')!;
      initAlignSimulator(root);
      root.querySelector<HTMLButtonElement>('.btn-align-action')!.click();
    });

    it('handles minimal box margin simulator markup without crashing', () => {
      const { document } = parseHTML('<div data-box-margin-simulator><button class="btn-margin" data-margin="tight"></button></div>');
      const root = document.querySelector<HTMLElement>('[data-box-margin-simulator]')!;
      initBoxMarginSimulator(root);
      root.querySelector<HTMLButtonElement>('.btn-margin')!.click();
    });
  });
});
