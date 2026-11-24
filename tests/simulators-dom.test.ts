import { describe, expect, it } from 'vitest';
import { parseHTML } from 'linkedom';
import {
  alignObjects,
  calculatePhotoOffset,
  cloneItems,
  getAlignStatus,
  getAnchorStatus,
  getBoxMarginStatus,
  getBoxPreviewStyles,
  getWrapMode,
  getWrapStatus,
  INITIAL_ALIGN_ITEMS,
  INITIAL_ANCHOR_STATE,
  INITIAL_BOX_STATE,
  type AlignAction,
  type AlignItem,
  type AlignTarget,
  type AnchorState,
  type BoxMarginState,
  type FillPresetId,
  type MarginPresetId,
  type OutlinePresetId,
} from '../src/utils/simulators';

describe('Simulator DOM Interactions & State Wiring', () => {
  describe('WrapSimulator DOM interactions', () => {
    function setupWrapSimulator() {
      const html = `
        <div class="wrap-simulator card" id="wrap-simulator" data-wrap-simulator>
          <div class="wrap-toolbar">
            <button class="btn-wrap-mode is-active" data-mode="square" aria-pressed="true">Square</button>
            <button class="btn-wrap-mode" data-mode="tight" aria-pressed="false">Tight</button>
            <button class="btn-wrap-mode" data-mode="top-bottom" aria-pressed="false">Top and Bottom</button>
          </div>
          <div class="mock-word-page wrap-square" id="wrap-preview-page">
            <span id="wrap-badge">Square</span>
            <span id="wrap-anchor-desc">Anchored to paragraph</span>
            <span id="wrap-anchor-pill" class="anchor-status-pill"></span>
            <div id="sim-object-anchor" class="sim-object-anchor"></div>
            <p id="wrap-recommendation"><strong>Recommendation: </strong>Default recommendation</p>
            <strong id="wrap-inline-callout">Square</strong>
          </div>
          <div class="visually-hidden" role="status" aria-live="polite" id="wrap-live-status">
            Square wrap selected.
          </div>
        </div>
      `;
      const { document } = parseHTML(html);
      const root = document.querySelector<HTMLElement>('[data-wrap-simulator]')!;
      const buttons = root.querySelectorAll<HTMLButtonElement>('.btn-wrap-mode');
      const previewPage = root.querySelector<HTMLElement>('#wrap-preview-page')!;
      const wrapBadge = root.querySelector<HTMLElement>('#wrap-badge')!;
      const anchorDesc = root.querySelector<HTMLElement>('#wrap-anchor-desc')!;
      const anchorPill = root.querySelector<HTMLElement>('#wrap-anchor-pill')!;
      const recommendation = root.querySelector<HTMLElement>('#wrap-recommendation')!;
      const liveStatus = root.querySelector<HTMLElement>('#wrap-live-status')!;
      const inlineCallout = root.querySelector<HTMLElement>('#wrap-inline-callout')!;
      const simAnchor = root.querySelector<HTMLElement>('#sim-object-anchor')!;

      function selectMode(btn: HTMLButtonElement) {
        const modeId = btn.getAttribute('data-mode')!;
        const config = getWrapMode(modeId);

        buttons.forEach((b) => {
          const isActive = b === btn;
          b.classList.toggle('is-active', isActive);
          b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });

        previewPage.className = `mock-word-page wrap-${config.id}`;
        wrapBadge.textContent = config.label;
        anchorDesc.textContent = config.anchorLabel;

        const recStrong = document.createElement('strong');
        recStrong.textContent = 'Recommendation: ';
        recommendation.replaceChildren(recStrong, document.createTextNode(config.recommendation));

        inlineCallout.textContent = config.label;
        anchorPill.style.opacity = config.hasAnchor ? '1' : '0.5';
        simAnchor.style.display = config.hasAnchor ? 'flex' : 'none';
        liveStatus.textContent = getWrapStatus(config.id);
      }

      return { root, buttons, previewPage, wrapBadge, anchorDesc, anchorPill, recommendation, liveStatus, inlineCallout, simAnchor, selectMode };
    }

    it('updates active state, preview classes, badge, and live region on mode change', () => {
      const { buttons, previewPage, wrapBadge, recommendation, liveStatus, selectMode } = setupWrapSimulator();
      const tightBtn = buttons[1];

      selectMode(tightBtn);

      expect(tightBtn.classList.contains('is-active')).toBe(true);
      expect(tightBtn.getAttribute('aria-pressed')).toBe('true');
      expect(buttons[0].classList.contains('is-active')).toBe(false);
      expect(buttons[0].getAttribute('aria-pressed')).toBe('false');

      expect(previewPage.className).toBe('mock-word-page wrap-tight');
      expect(wrapBadge.textContent).toBe('Tight');
      expect(recommendation.textContent).toContain('Ideal for transparent PNGs');
      expect(liveStatus.textContent).toBe(getWrapStatus('tight'));
      expect(liveStatus.classList.contains('visually-hidden')).toBe(true);
    });
  });

  describe('AnchorSimulator DOM interactions', () => {
    function setupAnchorSimulator() {
      const html = `
        <div class="anchor-simulator card" id="anchor-simulator" data-anchor-simulator>
          <div role="radiogroup" aria-label="Anchor Mode">
            <button id="btn-mode-move" data-mode="move-with-text" class="btn-mode is-active" aria-checked="true" tabindex="0">Move with text</button>
            <button id="btn-mode-fix" data-mode="fix-position" class="btn-mode" aria-checked="false" tabindex="-1">Fix position</button>
          </div>
          <button id="btn-add-paragraph">Add Paragraph</button>
          <button id="btn-reset-anchor">Reset</button>
          <span id="anchor-summary-text"></span>
          <span id="anchor-para-count">0 / 3 added</span>
          <div class="stream-container" id="stream-container"></div>
          <div class="floating-photo" id="floating-photo">
            <span id="photo-mode-tag">Moving with text</span>
          </div>
          <div class="visually-hidden" role="status" aria-live="polite" id="anchor-live-status"></div>
        </div>
      `;
      const { document } = parseHTML(html);
      const root = document.querySelector<HTMLElement>('[data-anchor-simulator]')!;
      let state: AnchorState = { ...INITIAL_ANCHOR_STATE };

      const btnMove = root.querySelector<HTMLButtonElement>('#btn-mode-move')!;
      const btnFix = root.querySelector<HTMLButtonElement>('#btn-mode-fix')!;
      const btnAdd = root.querySelector<HTMLButtonElement>('#btn-add-paragraph')!;
      const btnReset = root.querySelector<HTMLButtonElement>('#btn-reset-anchor')!;
      const streamContainer = root.querySelector<HTMLDivElement>('#stream-container')!;
      const floatingPhoto = root.querySelector<HTMLDivElement>('#floating-photo')!;
      const photoModeTag = root.querySelector<HTMLSpanElement>('#photo-mode-tag')!;
      const summaryText = root.querySelector<HTMLSpanElement>('#anchor-summary-text')!;
      const paraCountBadge = root.querySelector<HTMLSpanElement>('#anchor-para-count')!;
      const liveStatus = root.querySelector<HTMLDivElement>('#anchor-live-status')!;
      const modeBtns = [btnMove, btnFix];

      function syncModeButtons(mode: 'move-with-text' | 'fix-position') {
        modeBtns.forEach((b) => {
          const isSelected = b.getAttribute('data-mode') === mode;
          b.classList.toggle('is-active', isSelected);
          b.setAttribute('aria-checked', isSelected ? 'true' : 'false');
          b.setAttribute('tabindex', isSelected ? '0' : '-1');
        });
      }

      function render() {
        streamContainer.replaceChildren();
        for (let i = 1; i <= state.addedParagraphs; i++) {
          const p = document.createElement('p');
          p.className = 'mock-paragraph inserted-p';
          const pStrong = document.createElement('strong');
          pStrong.textContent = `[Added Paragraph ${i}]: `;
          p.replaceChildren(pStrong, document.createTextNode('New content inserted.'));
          streamContainer.appendChild(p);
        }

        const paraHeight = 40;
        const offsetPx = calculatePhotoOffset(state, paraHeight);
        floatingPhoto.style.transform = `translateY(${offsetPx}px)`;

        photoModeTag.textContent = state.mode === 'move-with-text' ? 'Moving with text' : 'Pinned to page';
        paraCountBadge.textContent = `${state.addedParagraphs} / 3 added`;

        const strong = document.createElement('strong');
        strong.textContent = state.mode === 'move-with-text' ? 'Move with text' : 'Fix position on page';
        summaryText.replaceChildren(document.createTextNode('Current mode: '), strong);

        btnAdd.disabled = state.addedParagraphs >= 3;
        liveStatus.textContent = getAnchorStatus(state);
      }

      return {
        root,
        btnMove,
        btnFix,
        btnAdd,
        btnReset,
        streamContainer,
        floatingPhoto,
        photoModeTag,
        summaryText,
        paraCountBadge,
        liveStatus,
        getState: () => state,
        setState: (s: AnchorState) => {
          state = s;
          syncModeButtons(state.mode);
          render();
        },
        addPara: () => {
          if (state.addedParagraphs < 3) {
            state = { ...state, addedParagraphs: state.addedParagraphs + 1 };
            render();
          }
        },
        reset: () => {
          state = { mode: 'move-with-text', addedParagraphs: 0 };
          syncModeButtons(state.mode);
          render();
        },
      };
    }

    it('adds paragraphs up to maximum of 3 and disables add button safely', () => {
      const sim = setupAnchorSimulator();

      sim.addPara();
      expect(sim.getState().addedParagraphs).toBe(1);
      expect(sim.streamContainer.children.length).toBe(1);
      expect(sim.paraCountBadge.textContent).toBe('1 / 3 added');
      expect(sim.floatingPhoto.style.transform).toBe('translateY(40px)');

      sim.addPara();
      sim.addPara();
      expect(sim.getState().addedParagraphs).toBe(3);
      expect(sim.btnAdd.disabled).toBe(true);
      expect(sim.floatingPhoto.style.transform).toBe('translateY(120px)');
      expect(sim.liveStatus.textContent).toContain('Photo shifted down by 3 paragraph(s)');
    });

    it('pins photo in fix-position mode when paragraphs are added', () => {
      const sim = setupAnchorSimulator();

      sim.setState({ mode: 'fix-position', addedParagraphs: 0 });
      expect(sim.btnFix.getAttribute('aria-checked')).toBe('true');
      expect(sim.btnMove.getAttribute('aria-checked')).toBe('false');

      sim.addPara();
      expect(sim.floatingPhoto.style.transform).toBe('translateY(0px)');
      expect(sim.photoModeTag.textContent).toBe('Pinned to page');
    });

    it('resets added paragraphs and restores button state on reset', () => {
      const sim = setupAnchorSimulator();

      sim.addPara();
      sim.addPara();
      sim.reset();

      expect(sim.getState().addedParagraphs).toBe(0);
      expect(sim.streamContainer.children.length).toBe(0);
      expect(sim.btnAdd.disabled).toBe(false);
      expect(sim.floatingPhoto.style.transform).toBe('translateY(0px)');
    });
  });

  describe('AlignSimulator DOM interactions', () => {
    function setupAlignSimulator() {
      const html = `
        <div class="align-simulator card" id="align-simulator" data-align-simulator>
          <div role="radiogroup" aria-label="Alignment Reference">
            <button class="btn-target is-active" data-target="margin" aria-checked="true" tabindex="0">Margin</button>
            <button class="btn-target" data-target="page" aria-checked="false" tabindex="-1">Page</button>
            <button class="btn-target" data-target="selected" aria-checked="false" tabindex="-1">Selected</button>
          </div>
          <div class="action-bar">
            <button class="btn-align-action" data-action="left">Align Left</button>
            <button class="btn-align-action" data-action="center">Align Center</button>
            <button class="btn-align-action" data-action="right">Align Right</button>
            <button class="btn-align-action" data-action="reset">Reset</button>
          </div>
          <div class="align-canvas">
            <div class="smart-guide-line" id="smart-guide-line" style="display: none;"></div>
            <div class="canvas-item" id="align-item-box-1" style="left: 6.25%; top: 17.5%;"></div>
            <div class="canvas-item" id="align-item-box-2" style="left: 40.625%; top: 37.5%;"></div>
            <div class="canvas-item" id="align-item-box-3" style="left: 68.75%; top: 12.5%;"></div>
          </div>
          <div id="align-status-text">Initial</div>
          <div class="visually-hidden" role="status" aria-live="polite" id="align-live-status">Initial</div>
        </div>
      `;
      const { document } = parseHTML(html);
      const root = document.querySelector<HTMLElement>('[data-align-simulator]')!;
      let currentTarget: AlignTarget = 'margin';
      let items: AlignItem[] = cloneItems(INITIAL_ALIGN_ITEMS);

      const targetBtns = root.querySelectorAll<HTMLButtonElement>('.btn-target');
      const smartGuide = root.querySelector<HTMLDivElement>('#smart-guide-line')!;
      const statusText = root.querySelector<HTMLDivElement>('#align-status-text')!;
      const liveStatus = root.querySelector<HTMLDivElement>('#align-live-status')!;

      function renderObjects(action: AlignAction) {
        items.forEach((item) => {
          const el = root.querySelector<HTMLDivElement>(`#align-item-${item.id}`);
          if (el) {
            el.style.left = `${(item.x / 320) * 100}%`;
            el.style.top = `${(item.y / 200) * 100}%`;
          }
        });

        if (action === 'left') {
          smartGuide.style.display = 'block';
          smartGuide.style.left = `${(items[0].x / 320) * 100}%`;
        } else {
          smartGuide.style.display = 'none';
        }

        const desc = getAlignStatus(action, currentTarget);
        statusText.textContent = desc;
        liveStatus.textContent = desc;
      }

      function executeAction(action: AlignAction) {
        items = alignObjects(items, action, currentTarget);
        renderObjects(action);
      }

      function setTarget(target: AlignTarget) {
        currentTarget = target;
        targetBtns.forEach((b) => {
          const isSelected = b.getAttribute('data-target') === target;
          b.classList.toggle('is-active', isSelected);
          b.setAttribute('aria-checked', isSelected ? 'true' : 'false');
          b.setAttribute('tabindex', isSelected ? '0' : '-1');
        });
      }

      return { root, targetBtns, smartGuide, statusText, liveStatus, executeAction, setTarget, getItems: () => items };
    }

    it('positions items using responsive percentage coordinates on align left', () => {
      const sim = setupAlignSimulator();

      sim.executeAction('left');
      const item1 = sim.root.querySelector<HTMLDivElement>('#align-item-box-1')!;
      const item2 = sim.root.querySelector<HTMLDivElement>('#align-item-box-2')!;

      // With target 'margin', margin.left is 40px -> 40/320 = 12.5%
      expect(item1.style.left).toBe('12.5%');
      expect(item2.style.left).toBe('12.5%');
      expect(sim.smartGuide.style.display).toBe('block');
      expect(sim.smartGuide.style.left).toBe('12.5%');
      expect(sim.liveStatus.textContent).toBe(getAlignStatus('left', 'margin'));
    });

    it('switches targets and aligns to page boundaries properly', () => {
      const sim = setupAlignSimulator();

      sim.setTarget('page');
      sim.executeAction('left');
      const item1 = sim.root.querySelector<HTMLDivElement>('#align-item-box-1')!;

      // With target 'page', page.left is 0px -> 0%
      expect(item1.style.left).toBe('0%');
      expect(sim.liveStatus.textContent).toBe(getAlignStatus('left', 'page'));
    });
  });

  describe('BoxMarginSimulator DOM interactions', () => {
    function setupBoxMarginSimulator() {
      const html = `
        <div class="box-margin-simulator card" id="box-margin-simulator" data-box-margin-simulator>
          <div role="radiogroup" aria-label="Margin Preset">
            <button class="btn-margin is-active" data-margin="normal" aria-checked="true">Normal</button>
            <button class="btn-margin" data-margin="none" aria-checked="false">None (Publisher style)</button>
          </div>
          <div role="radiogroup" aria-label="Fill Color">
            <button class="btn-fill is-active" data-fill="subtle" aria-checked="true">Subtle</button>
            <button class="btn-fill" data-fill="none" aria-checked="false">No Fill</button>
          </div>
          <div role="radiogroup" aria-label="Border Outline">
            <button class="btn-outline is-active" data-outline="subtle" aria-checked="true">Subtle</button>
            <button class="btn-outline" data-outline="none" aria-checked="false">No Outline</button>
          </div>
          <div id="preview-text-box" style="padding: 0.75rem 1rem;"></div>
          <div class="visually-hidden" role="status" aria-live="polite" id="box-live-status">Initial</div>
        </div>
      `;
      const { document } = parseHTML(html);
      const root = document.querySelector<HTMLElement>('[data-box-margin-simulator]')!;
      let state: BoxMarginState = { ...INITIAL_BOX_STATE };

      const textBox = root.querySelector<HTMLDivElement>('#preview-text-box')!;
      const liveStatus = root.querySelector<HTMLDivElement>('#box-live-status')!;
      const marginBtns = root.querySelectorAll<HTMLButtonElement>('.btn-margin');
      const fillBtns = root.querySelectorAll<HTMLButtonElement>('.btn-fill');
      const outlineBtns = root.querySelectorAll<HTMLButtonElement>('.btn-outline');

      function update() {
        const styles = getBoxPreviewStyles(state);
        textBox.style.padding = styles.padding;
        textBox.style.backgroundColor = styles.backgroundColor;
        textBox.style.border = styles.border;
        liveStatus.textContent = getBoxMarginStatus(state);
      }

      function setMargin(margin: MarginPresetId) {
        state = { ...state, margin };
        marginBtns.forEach((b) => {
          const isSelected = b.getAttribute('data-margin') === margin;
          b.classList.toggle('is-active', isSelected);
          b.setAttribute('aria-checked', isSelected ? 'true' : 'false');
        });
        update();
      }

      function setFill(fill: FillPresetId) {
        state = { ...state, fill };
        fillBtns.forEach((b) => {
          const isSelected = b.getAttribute('data-fill') === fill;
          b.classList.toggle('is-active', isSelected);
          b.setAttribute('aria-checked', isSelected ? 'true' : 'false');
        });
        update();
      }

      function setOutline(outline: OutlinePresetId) {
        state = { ...state, outline };
        outlineBtns.forEach((b) => {
          const isSelected = b.getAttribute('data-outline') === outline;
          b.classList.toggle('is-active', isSelected);
          b.setAttribute('aria-checked', isSelected ? 'true' : 'false');
        });
        update();
      }

      return { root, textBox, liveStatus, setMargin, setFill, setOutline, getState: () => state };
    }

    it('updates text box preview styles and status live announcement', () => {
      const sim = setupBoxMarginSimulator();

      sim.setMargin('tight');
      expect(sim.textBox.style.padding).toBe('0');
      expect(sim.liveStatus.textContent).toContain('0 cm (Publisher style)');

      sim.setFill('none');
      expect(sim.textBox.style.backgroundColor).toBe('transparent');
      expect(sim.liveStatus.textContent).toContain('No Fill (Transparent)');

      sim.setOutline('none');
      expect(sim.textBox.style.border).toBe('1px dashed transparent');
      expect(sim.liveStatus.textContent).toContain('No Outline');
    });
  });
});
