/**
 * Client-side controllers and DOM wiring for interactive simulators.
 * Extracted into testable, reusable functions to allow headless DOM integration
 * testing without relying on unexecuted client script blocks.
 */

import {
  addParagraph,
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
  INITIAL_BOX_STATE,
  resetAnchorState,
  setAnchorMode,
  type AlignAction,
  type AlignItem,
  type AlignTarget,
  type AnchorState,
  type BoxMarginState,
  type FillPresetId,
  type MarginPresetId,
  type OutlinePresetId,
} from './simulators';

export function getNextRadioIndex(key: string, currentIndex: number, total: number): number {
  if (key === 'ArrowRight' || key === 'ArrowDown') {
    return (currentIndex + 1) % total;
  }
  if (key === 'ArrowLeft' || key === 'ArrowUp') {
    return (currentIndex - 1 + total) % total;
  }
  return -1;
}

export function initWrapSimulator(container: HTMLElement): void {
  const doc = container.ownerDocument;
  const buttons = container.querySelectorAll<HTMLButtonElement>('.btn-wrap-mode');
  const previewPage = container.querySelector<HTMLElement>('[data-wrap-preview-page], .mock-word-page');
  const wrapBadge = container.querySelector<HTMLElement>('[data-wrap-badge]');
  const anchorDesc = container.querySelector<HTMLElement>('[data-wrap-anchor-desc]');
  const anchorPill = container.querySelector<HTMLElement>('[data-wrap-anchor-pill]');
  const recommendation = container.querySelector<HTMLElement>('[data-wrap-recommendation]');
  const liveStatus = container.querySelector<HTMLElement>('[data-wrap-live-status]');
  const inlineCallout = container.querySelector<HTMLElement>('[data-wrap-inline-callout]');
  const simAnchor = container.querySelector<HTMLElement>('[data-sim-object-anchor]');

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const modeId = btn.getAttribute('data-mode') || 'square';
      const config = getWrapMode(modeId);

      // Update button states
      buttons.forEach((b) => {
        const isActive = b === btn;
        b.classList.toggle('is-active', isActive);
        b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });

      // Update preview container class while preserving scoped Astro/host classes
      if (previewPage) {
        const toRemove = Array.from(previewPage.classList).filter((c) => c.startsWith('wrap-'));
        previewPage.classList.remove(...toRemove);
        previewPage.classList.add(`wrap-${config.id}`);
      }

      // Update feedback
      if (wrapBadge) wrapBadge.textContent = config.label;
      if (anchorDesc) anchorDesc.textContent = config.anchorLabel;
      if (recommendation) {
        const recStrong = doc.createElement('strong');
        recStrong.textContent = 'Recommendation: ';
        recommendation.replaceChildren(recStrong, doc.createTextNode(config.recommendation));
      }
      if (inlineCallout) inlineCallout.textContent = config.label;

      // Toggle anchor visibility
      if (anchorPill) {
        anchorPill.style.opacity = config.hasAnchor ? '1' : '0.5';
      }
      if (simAnchor) {
        simAnchor.style.display = config.hasAnchor ? 'flex' : 'none';
      }

      // Update live region for assistive tech
      if (liveStatus) {
        liveStatus.textContent = getWrapStatus(config.id);
      }
    });
  });
}

export function initAnchorSimulator(root: HTMLElement): void {
  const doc = root.ownerDocument;
  let state: AnchorState = {
    mode: 'move-with-text',
    addedParagraphs: 0,
  };

  const btnMove = root.querySelector<HTMLButtonElement>('[data-btn-mode-move]');
  const btnFix = root.querySelector<HTMLButtonElement>('[data-btn-mode-fix]');
  const btnAdd = root.querySelector<HTMLButtonElement>('[data-btn-add-paragraph]');
  const btnReset = root.querySelector<HTMLButtonElement>('[data-btn-reset-anchor]');
  const streamContainer = root.querySelector<HTMLDivElement>('[data-stream-container]');
  const floatingPhoto = root.querySelector<HTMLDivElement>('[data-floating-photo]');
  const photoModeTag = root.querySelector<HTMLSpanElement>('[data-photo-mode-tag]');
  const summaryText = root.querySelector<HTMLSpanElement>('[data-anchor-summary-text]');
  const paraCountBadge = root.querySelector<HTMLSpanElement>('[data-anchor-para-count]');
  const liveStatus = root.querySelector<HTMLDivElement>('[data-anchor-live-status]');

  const modeBtns = [btnMove, btnFix].filter((b): b is HTMLButtonElement => Boolean(b));

  function syncModeButtons(mode: 'move-with-text' | 'fix-position') {
    modeBtns.forEach((b) => {
      const isSelected = b.getAttribute('data-mode') === mode;
      b.classList.toggle('is-active', isSelected);
      b.setAttribute('aria-checked', isSelected ? 'true' : 'false');
      b.setAttribute('tabindex', isSelected ? '0' : '-1');
    });
  }

  function render() {
    // Render added paragraphs
    if (streamContainer) {
      streamContainer.replaceChildren();
      for (let i = 1; i <= state.addedParagraphs; i++) {
        const p = doc.createElement('p');
        p.className = 'mock-paragraph inserted-p';
        const pStrong = doc.createElement('strong');
        pStrong.textContent = `[Added Paragraph ${i}]: `;
        p.replaceChildren(
          pStrong,
          doc.createTextNode('New content inserted above the host paragraph pushes the stream forward.')
        );
        streamContainer.appendChild(p);
      }
    }

    // Position floating photo based on actual measured displacement of stream container
    if (floatingPhoto) {
      const paraHeight =
        state.addedParagraphs > 0 && streamContainer
          ? (streamContainer as HTMLElement).offsetHeight / state.addedParagraphs
          : 0;
      const offsetPx = calculatePhotoOffset(state, paraHeight);
      floatingPhoto.style.transform = `translateY(${offsetPx}px)`;
    }

    if (photoModeTag) {
      photoModeTag.textContent =
        state.mode === 'move-with-text' ? 'Moving with text' : 'Pinned to page';
    }

    // Update counters & summaries
    if (paraCountBadge) {
      paraCountBadge.textContent = `${state.addedParagraphs} / 3 added`;
    }

    if (summaryText) {
      const strong = doc.createElement('strong');
      if (state.mode === 'move-with-text') {
        strong.textContent = 'Move with text';
        summaryText.replaceChildren(
          doc.createTextNode('Current mode: '),
          strong,
          doc.createTextNode('. Photo shifts down with paragraph stream.')
        );
      } else {
        strong.textContent = 'Fix position on page';
        summaryText.replaceChildren(
          doc.createTextNode('Current mode: '),
          strong,
          doc.createTextNode('. Text flows past while photo remains pinned.')
        );
      }
    }

    if (btnAdd) {
      btnAdd.disabled = state.addedParagraphs >= 3;
    }

    if (liveStatus) {
      liveStatus.textContent = getAnchorStatus(state);
    }
  }

  function setMode(mode: 'move-with-text' | 'fix-position', focusBtn?: HTMLButtonElement) {
    state = setAnchorMode(state, mode);
    syncModeButtons(mode);
    if (focusBtn) focusBtn.focus();
    render();
  }

  modeBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      const m = btn.getAttribute('data-mode') as 'move-with-text' | 'fix-position';
      setMode(m, btn);
    });
    btn.addEventListener('keydown', (e) => {
      const nextIndex = getNextRadioIndex(e.key, index, modeBtns.length);
      if (nextIndex >= 0) {
        e.preventDefault();
        const nextBtn = modeBtns[nextIndex];
        const m = nextBtn.getAttribute('data-mode') as 'move-with-text' | 'fix-position';
        setMode(m, nextBtn);
      }
    });
  });

  btnAdd?.addEventListener('click', () => {
    state = addParagraph(state);
    render();
  });

  btnReset?.addEventListener('click', () => {
    state = resetAnchorState();
    syncModeButtons(state.mode);
    render();
  });
}

export function initAlignSimulator(root: HTMLElement): void {
  let currentTarget: AlignTarget = 'margin';
  let items: AlignItem[] = cloneItems(INITIAL_ALIGN_ITEMS);

  const targetBtns = root.querySelectorAll<HTMLButtonElement>('.btn-target');
  const actionBtns = root.querySelectorAll<HTMLButtonElement>('.btn-align-action');
  const smartGuide = root.querySelector<HTMLDivElement>('[data-smart-guide]');
  const statusText = root.querySelector<HTMLSpanElement>('[data-align-status-text]');
  const liveStatus = root.querySelector<HTMLDivElement>('[data-align-live-status]');

  function renderObjects(action: AlignAction) {
    items.forEach((item) => {
      const el = root.querySelector<HTMLDivElement>(`[data-align-item="${item.id}"]`);
      if (el) {
        el.style.left = `${(item.x / 320) * 100}%`;
        el.style.top = `${(item.y / 200) * 100}%`;
      }
    });

    // Smart alignment guide indication
    if (smartGuide) {
      if (action === 'left') {
        smartGuide.style.display = 'block';
        smartGuide.style.left = `${(items[0].x / 320) * 100}%`;
        smartGuide.style.top = '0';
        smartGuide.style.width = '2px';
        smartGuide.style.height = '100%';
      } else if (action === 'top') {
        smartGuide.style.display = 'block';
        smartGuide.style.left = '0';
        smartGuide.style.top = `${(items[0].y / 200) * 100}%`;
        smartGuide.style.width = '100%';
        smartGuide.style.height = '2px';
      } else {
        smartGuide.style.display = 'none';
      }
    }

    // Update readable status
    const desc = getAlignStatus(action, currentTarget);
    if (statusText) statusText.textContent = desc;
    if (liveStatus) liveStatus.textContent = desc;
  }

  function selectTarget(btn: HTMLButtonElement) {
    const t = btn.getAttribute('data-target') as AlignTarget;
    currentTarget = t;
    targetBtns.forEach((b) => {
      const isActive = b === btn;
      b.classList.toggle('is-active', isActive);
      b.setAttribute('aria-checked', isActive ? 'true' : 'false');
      b.setAttribute('tabindex', isActive ? '0' : '-1');
    });
    btn.focus();
  }

  targetBtns.forEach((btn, idx) => {
    btn.addEventListener('click', () => selectTarget(btn));
    btn.addEventListener('keydown', (e) => {
      const nextIdx = getNextRadioIndex(e.key, idx, targetBtns.length);
      if (nextIdx >= 0) {
        e.preventDefault();
        selectTarget(targetBtns[nextIdx]);
      }
    });
  });

  actionBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const action = (btn.getAttribute('data-action') as AlignAction) || 'reset';
      items = alignObjects(items, action, currentTarget);
      renderObjects(action);
    });
  });
}

export function initBoxMarginSimulator(root: HTMLElement): void {
  let state: BoxMarginState = { ...INITIAL_BOX_STATE };

  const marginBtns = root.querySelectorAll<HTMLButtonElement>('.btn-margin');
  const fillBtns = root.querySelectorAll<HTMLButtonElement>('.btn-fill');
  const outlineBtns = root.querySelectorAll<HTMLButtonElement>('.btn-outline');
  const textBox = root.querySelector<HTMLDivElement>('[data-preview-text-box]');
  const liveStatus = root.querySelector<HTMLDivElement>('[data-box-live-status]');

  function update() {
    // Apply styles to preview
    if (textBox) {
      const styles = getBoxPreviewStyles(state);
      textBox.style.padding = styles.padding;
      textBox.style.backgroundColor = styles.backgroundColor;
      textBox.style.border = styles.border;
    }

    // Update assistive technology announcement
    if (liveStatus) {
      liveStatus.textContent = getBoxMarginStatus(state);
    }
  }

  function handleRadioGroup(
    buttons: NodeListOf<HTMLButtonElement>,
    onSelect: (btn: HTMLButtonElement) => void
  ) {
    buttons.forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => {
          const isActive = b === btn;
          b.classList.toggle('is-active', isActive);
          b.setAttribute('aria-checked', isActive ? 'true' : 'false');
          b.setAttribute('tabindex', isActive ? '0' : '-1');
        });
        onSelect(btn);
        update();
      });

      btn.addEventListener('keydown', (e) => {
        const nextIdx = getNextRadioIndex(e.key, idx, buttons.length);
        if (nextIdx >= 0) {
          e.preventDefault();
          const nextBtn = buttons[nextIdx];
          nextBtn.focus();
          nextBtn.click();
        }
      });
    });
  }

  handleRadioGroup(marginBtns, (btn) => {
    state.margin = (btn.getAttribute('data-margin') as MarginPresetId) || state.margin;
  });

  handleRadioGroup(fillBtns, (btn) => {
    state.fill = (btn.getAttribute('data-fill') as FillPresetId) || state.fill;
  });

  handleRadioGroup(outlineBtns, (btn) => {
    state.outline = (btn.getAttribute('data-outline') as OutlinePresetId) || state.outline;
  });
}
