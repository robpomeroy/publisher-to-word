import { describe, expect, it } from 'vitest';
import {
  INITIAL_ALIGN_ITEMS,
  INITIAL_ANCHOR_STATE,
  INITIAL_BOX_STATE,
  addParagraph,
  alignObjects,
  calculateAnchorOffset,
  calculatePhotoOffset,
  cloneItems,
  getAlignStatus,
  getAnchorStatus,
  getBoxMarginStatus,
  getBoxPreviewStyles,
  getHotspotById,
  getHotspots,
  getWrapMode,
  getWrapModes,
  getWrapStatus,
  resetAnchorState,
  setAnchorMode,
  type AlignAction,
  type AlignItem,
  type AnchorState,
  type BoxMarginState,
} from '../src/utils/simulators';

describe('Hotspot Map Logic', () => {
  it('returns all defined hotspots', () => {
    const list = getHotspots();
    expect(list).toHaveLength(3);
    expect(list.map((h) => h.id)).toEqual([
      'hotspot-ribbon',
      'hotspot-arch',
      'hotspot-context',
    ]);
  });

  it('retrieves hotspot by ID and handles missing IDs', () => {
    const ribbon = getHotspotById('hotspot-ribbon');
    expect(ribbon).toBeDefined();
    expect(ribbon?.number).toBe(1);
    expect(ribbon?.title).toBe('Contextual Ribbon Tab');

    const missing = getHotspotById('non-existent');
    expect(missing).toBeUndefined();
  });
});

describe('Wrap Simulator Logic', () => {
  it('returns all 7 Word wrap modes', () => {
    const modes = getWrapModes();
    expect(modes).toHaveLength(7);
    expect(modes.map((m) => m.id)).toEqual([
      'inline',
      'square',
      'tight',
      'through',
      'top-bottom',
      'behind',
      'front',
    ]);
  });

  it('correctly reports anchor status for inline vs floating modes', () => {
    const inline = getWrapMode('inline');
    expect(inline.hasAnchor).toBe(false);

    const square = getWrapMode('square');
    expect(square.hasAnchor).toBe(true);

    const fallback = getWrapMode('invalid-id');
    expect(fallback.id).toBe('square');
  });

  it('generates descriptive ARIA status announcements', () => {
    const inlineStatus = getWrapStatus('inline');
    expect(inlineStatus).toContain('In Line with Text');
    expect(inlineStatus).toContain('No anchor');

    const squareStatus = getWrapStatus('square');
    expect(squareStatus).toContain('Square text wrap');
    expect(squareStatus).toContain('Anchor visible');
  });
});

describe('Anchor Simulator Logic', () => {
  it('manages paragraph additions up to maximum of 3', () => {
    let state = resetAnchorState();
    expect(state).toEqual(INITIAL_ANCHOR_STATE);
    expect(state.addedParagraphs).toBe(0);

    state = addParagraph(state);
    expect(state.addedParagraphs).toBe(1);

    state = addParagraph(state);
    state = addParagraph(state);
    expect(state.addedParagraphs).toBe(3);

    // Caps at 3
    state = addParagraph(state);
    expect(state.addedParagraphs).toBe(3);
  });

  it('toggles anchor mode correctly', () => {
    let state: AnchorState = { mode: 'move-with-text', addedParagraphs: 1 };
    state = setAnchorMode(state, 'fix-position');
    expect(state.mode).toBe('fix-position');
    expect(state.addedParagraphs).toBe(1);
  });

  it('calculates photo vertical offsets based on anchor mode', () => {
    const moveState: AnchorState = { mode: 'move-with-text', addedParagraphs: 2 };
    expect(calculatePhotoOffset(moveState, 50)).toBe(100);

    const fixState: AnchorState = { mode: 'fix-position', addedParagraphs: 2 };
    expect(calculatePhotoOffset(fixState, 50)).toBe(0);
  });

  it('calculates anchor icon position attached to its paragraph', () => {
    const state: AnchorState = { mode: 'fix-position', addedParagraphs: 3 };
    expect(calculateAnchorOffset(state, 40)).toBe(120);
  });

  it('generates accessible status strings for both modes with 0 or >0 paragraphs', () => {
    const s1: AnchorState = { mode: 'move-with-text', addedParagraphs: 0 };
    expect(getAnchorStatus(s1)).toContain('Move with text');
    expect(getAnchorStatus(s1)).toContain('Photo is anchored to Paragraph 1');

    const s2: AnchorState = { mode: 'move-with-text', addedParagraphs: 2 };
    expect(getAnchorStatus(s2)).toContain('Photo shifted down by 2 paragraph(s)');

    const s3: AnchorState = { mode: 'fix-position', addedParagraphs: 0 };
    expect(getAnchorStatus(s3)).toContain('Fix position on page');
    expect(getAnchorStatus(s3)).toContain('Photo is pinned to the page');

    const s4: AnchorState = { mode: 'fix-position', addedParagraphs: 1 };
    expect(getAnchorStatus(s4)).toContain('Added 1 paragraph(s) above');
    expect(getAnchorStatus(s4)).toContain('photo remains pinned in place');
  });
});

describe('Box Margin Simulator Logic', () => {
  it('generates style objects from state', () => {
    const defaultStyles = getBoxPreviewStyles(INITIAL_BOX_STATE);
    expect(defaultStyles.padding).toBe('0.75rem');
    expect(defaultStyles.backgroundColor).toBe('#FFFFFF');
    expect(defaultStyles.border).toBe('1px solid #1E293B');

    const customState: BoxMarginState = {
      margin: 'tight',
      fill: 'none',
      outline: 'teal',
    };
    const customStyles = getBoxPreviewStyles(customState);
    expect(customStyles.padding).toBe('0');
    expect(customStyles.backgroundColor).toBe('transparent');
    expect(customStyles.border).toBe('2px solid #0F766E');

    // Fallbacks for invalid IDs
    const fallbackStyles = getBoxPreviewStyles({
      margin: 'unknown' as any,
      fill: 'unknown' as any,
      outline: 'unknown' as any,
    });
    expect(fallbackStyles.padding).toBe('0.75rem');
    expect(fallbackStyles.backgroundColor).toBe('#FFFFFF');
    expect(fallbackStyles.border).toBe('1px solid #1E293B');
  });

  it('generates descriptive box status string', () => {
    const status = getBoxMarginStatus(INITIAL_BOX_STATE);
    expect(status).toContain('0.25 cm');
    expect(status).toContain('White Fill');
    expect(status).toContain('1pt Slate Outline');
  });
});

describe('Align Simulator Logic', () => {
  const testItems: AlignItem[] = [
    { id: 'item-1', name: 'Item 1', x: 20, y: 30, width: 40, height: 40 },
    { id: 'item-2', name: 'Item 2', x: 100, y: 60, width: 50, height: 50 },
    { id: 'item-3', name: 'Item 3', x: 200, y: 40, width: 60, height: 40 },
  ];

  it('clones items without mutating original array', () => {
    const cloned = cloneItems(testItems);
    expect(cloned).toEqual(testItems);
    expect(cloned[0]).not.toBe(testItems[0]);
  });

  it('handles empty items and reset action', () => {
    expect(alignObjects([], 'left', 'margin')).toEqual(INITIAL_ALIGN_ITEMS);
    expect(alignObjects(testItems, 'reset', 'margin')).toEqual(INITIAL_ALIGN_ITEMS);
  });

  it('aligns left to margin, page, and selected', () => {
    const marginResult = alignObjects(testItems, 'left', 'margin');
    expect(marginResult.every((i) => i.x === 40)).toBe(true);

    const pageResult = alignObjects(testItems, 'left', 'page');
    expect(pageResult.every((i) => i.x === 0)).toBe(true);

    const selectedResult = alignObjects(testItems, 'left', 'selected');
    expect(selectedResult.every((i) => i.x === 20)).toBe(true);
  });

  it('aligns centre to margin, page, and selected', () => {
    const marginResult = alignObjects(testItems, 'center', 'margin');
    // Margin center = 40 + 240 / 2 = 160. Item 1 width 40 -> x = 160 - 20 = 140
    expect(marginResult[0].x).toBe(140);

    const pageResult = alignObjects(testItems, 'center', 'page');
    // Page center = 0 + 320 / 2 = 160. Item 2 width 50 -> x = 160 - 25 = 135
    expect(pageResult[1].x).toBe(135);

    const selectedResult = alignObjects(testItems, 'center', 'selected');
    // Selected bounding box: minX = 20, maxX = 200 + 60 = 260. center = 140.
    // Item 1 width 40 -> x = 140 - 20 = 120
    expect(selectedResult[0].x).toBe(120);
  });

  it('aligns right to margin, page, and selected', () => {
    const marginResult = alignObjects(testItems, 'right', 'margin');
    // Margin right = 280. Item 1 width 40 -> x = 240
    expect(marginResult[0].x).toBe(240);

    const pageResult = alignObjects(testItems, 'right', 'page');
    // Page right = 320. Item 1 width 40 -> x = 280
    expect(pageResult[0].x).toBe(280);

    const selectedResult = alignObjects(testItems, 'right', 'selected');
    // Selected max right = 260. Item 1 width 40 -> x = 220
    expect(selectedResult[0].x).toBe(220);
  });

  it('aligns top to margin, page, and selected', () => {
    const marginResult = alignObjects(testItems, 'top', 'margin');
    expect(marginResult.every((i) => i.y === 30)).toBe(true);

    const pageResult = alignObjects(testItems, 'top', 'page');
    expect(pageResult.every((i) => i.y === 0)).toBe(true);

    const selectedResult = alignObjects(testItems, 'top', 'selected');
    expect(selectedResult.every((i) => i.y === 30)).toBe(true);
  });

  it('distributes items horizontally with equal spacing', () => {
    const distributed = alignObjects(testItems, 'distribute', 'margin');
    expect(distributed[0].x).toBe(40); // bounds.left
    expect(distributed[2].x + distributed[2].width).toBe(280); // bounds.right

    const distributedSelected = alignObjects(testItems, 'distribute', 'selected');
    expect(distributedSelected[0].x).toBe(20);

    // Overlapping distribution (span is smaller than total items width)
    const tightItems: AlignItem[] = [
      { id: 't1', name: 'T1', x: 260, y: 10, width: 60, height: 40 },
      { id: 't2', name: 'T2', x: 255, y: 10, width: 65, height: 40 },
      { id: 't3', name: 'T3', x: 265, y: 10, width: 55, height: 40 },
    ];
    const distributedTight = alignObjects(tightItems, 'distribute', 'selected');
    expect(distributedTight[0].x).toBe(255);
    expect(distributedTight[2].x + distributedTight[2].width).toBe(320);
    // Does not overflow beyond 320
    expect(distributedTight.every(i => i.x + i.width <= 320)).toBe(true);

    // Returns early when items < 3
    const twoItems = testItems.slice(0, 2);
    expect(alignObjects(twoItems, 'distribute', 'margin')).toEqual(twoItems);
  });

  it('returns unchanged items on unrecognized action', () => {
    const unchanged = alignObjects(testItems, 'invalid-action' as AlignAction, 'margin');
    expect(unchanged).toEqual(testItems);
  });

  it('generates descriptive align status messages for all actions', () => {
    expect(getAlignStatus('left', 'margin')).toContain('left of page margins');
    expect(getAlignStatus('center', 'page')).toContain('Centred objects horizontally relative to entire page edge');
    expect(getAlignStatus('right', 'selected')).toContain('right of selected objects');
    expect(getAlignStatus('top', 'margin')).toContain('top of page margins');
    expect(getAlignStatus('distribute', 'page')).toContain('equal horizontal spacing across entire page edge');
    expect(getAlignStatus('reset', 'margin')).toContain('Reset objects to scattered positions');
    expect(getAlignStatus('unknown' as AlignAction, 'margin')).toBe('Updated object alignments.');
  });
});
