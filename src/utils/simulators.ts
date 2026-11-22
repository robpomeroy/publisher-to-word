/**
 * Pure state transitions, coordinate math, and status generators for
 * interactive Word layout simulators and UI hotspot schematics.
 */

/* ==========================================================================
   1. Hotspot Map Definitions
   ========================================================================== */

export interface Hotspot {
  id: string;
  number: number;
  title: string;
  badge: string;
  xPercent: number;
  yPercent: number;
  summary: string;
  tip: string;
  ribbonRoute?: string[];
}

export const HOTSPOTS: Hotspot[] = [
  {
    id: "hotspot-ribbon",
    number: 1,
    title: "Contextual Ribbon Tab",
    badge: "Picture Format / Shape Format",
    xPercent: 62,
    yPercent: 14,
    summary:
      "A coloured tab (gold or amber) that appears on Word's top Ribbon only when a picture, shape, or text box is actively selected.",
    tip: "Houses Shape Fill, Shape Outline, Wrap Text, and precision alignment tools. If you click away, this tab vanishes instantly.",
    ribbonRoute: ["Select Object", "Picture Format or Shape Format", "Arrange or Shape Styles"],
  },
  {
    id: "hotspot-arch",
    number: 2,
    title: "Floating Layout Options Arch",
    badge: "Quick Access Arch",
    xPercent: 78,
    yPercent: 52,
    summary:
      "A small horseshoe-shaped arch button that floats just outside the top-right corner of any selected picture or frame.",
    tip: "Click this arch for one-click access to all 7 wrapping modes and the 'Fix position on page' toggle without searching the Ribbon.",
  },
  {
    id: "hotspot-context",
    number: 3,
    title: "Right-Click Context Menu",
    badge: "Format Shape / Picture",
    xPercent: 44,
    yPercent: 68,
    summary:
      "Right-clicking any object opens a shortcut menu with direct access to Wrap Text and the deep Format Shape side pane.",
    tip: "The Format Shape side pane is where you adjust internal margins (padding) down to exact centimetre measurements.",
  },
];

export function getHotspots(): Hotspot[] {
  return HOTSPOTS;
}

export function getHotspotById(id: string): Hotspot | undefined {
  return HOTSPOTS.find((h) => h.id === id);
}

/* ==========================================================================
   2. Wrap Simulator Logic
   ========================================================================== */

export type WrapModeId =
  | "inline"
  | "square"
  | "tight"
  | "through"
  | "top-bottom"
  | "behind"
  | "front";

export interface WrapModeConfig {
  id: WrapModeId;
  label: string;
  recommendation: string;
  hasAnchor: boolean;
  anchorLabel: string;
  description: string;
  cssWrapClass: string;
}

export const WRAP_MODES: Record<WrapModeId, WrapModeConfig> = {
  inline: {
    id: "inline",
    label: "In Line with Text",
    recommendation: "Word's default for pasted images. Acts like a giant character in the sentence.",
    hasAnchor: false,
    anchorLabel: "No anchor (flows directly inside paragraph text)",
    description: "The picture is treated as a letter in the line of text. Moving it requires cutting and pasting.",
    cssWrapClass: "wrap-inline",
  },
  square: {
    id: "square",
    label: "Square",
    recommendation: "Best for Publisher users. Text flows neatly in a rectangular boundary around the object.",
    hasAnchor: true,
    anchorLabel: "Anchor visible (pinned to nearest paragraph)",
    description: "Text wraps tightly in a neat rectangle around all four sides of the object frame.",
    cssWrapClass: "wrap-square",
  },
  tight: {
    id: "tight",
    label: "Tight",
    recommendation: "Ideal for transparent PNGs and irregular silhouettes.",
    hasAnchor: true,
    anchorLabel: "Anchor visible (pinned to nearest paragraph)",
    description: "Text hugs the actual contours and edges of the shape rather than a square bounding box.",
    cssWrapClass: "wrap-tight",
  },
  through: {
    id: "through",
    label: "Through",
    recommendation: "Advanced: allows text to flow inside hollow or transparent cavities.",
    hasAnchor: true,
    anchorLabel: "Anchor visible (pinned to nearest paragraph)",
    description: "Similar to Tight, but text also flows into white-space openings within the graphic boundary.",
    cssWrapClass: "wrap-through",
  },
  "top-bottom": {
    id: "top-bottom",
    label: "Top and Bottom",
    recommendation: "Clean editorial layout: stops text on either side and continues text underneath.",
    hasAnchor: true,
    anchorLabel: "Anchor visible (pinned to nearest paragraph)",
    description: "No text wraps alongside the object. Text stops above the object and resumes cleanly below it.",
    cssWrapClass: "wrap-top-bottom",
  },
  behind: {
    id: "behind",
    label: "Behind Text",
    recommendation: "Watch out: can trap pictures underneath text where they become tricky to click.",
    hasAnchor: true,
    anchorLabel: "Anchor visible (pinned to nearest paragraph)",
    description: "The object sits beneath text like a watermark. Text flows directly over the artwork.",
    cssWrapClass: "wrap-behind",
  },
  front: {
    id: "front",
    label: "In Front of Text",
    recommendation: "Floats completely free like a sticker, but obscures any text beneath it.",
    hasAnchor: true,
    anchorLabel: "Anchor visible (floating relative to page)",
    description: "The object floats on top of everything, obscuring the text underneath.",
    cssWrapClass: "wrap-front",
  },
};

export const WRAP_MODE_LIST: WrapModeConfig[] = Object.values(WRAP_MODES);

export function getWrapModes(): WrapModeConfig[] {
  return WRAP_MODE_LIST;
}

export function getWrapMode(id: string): WrapModeConfig {
  const mode = WRAP_MODES[id as WrapModeId];
  return mode || WRAP_MODES.square;
}

export function getWrapStatus(modeId: string): string {
  const mode = getWrapMode(modeId);
  return `Selected ${mode.label} text wrap. ${mode.recommendation} ${mode.anchorLabel}.`;
}

/* ==========================================================================
   3. Anchor Simulator Logic
   ========================================================================== */

export type AnchorMode = "move-with-text" | "fix-position";

export interface AnchorState {
  mode: AnchorMode;
  addedParagraphs: number; // 0 to 3
}

export const INITIAL_ANCHOR_STATE: AnchorState = {
  mode: "move-with-text",
  addedParagraphs: 0,
};

export function addParagraph(state: AnchorState): AnchorState {
  if (state.addedParagraphs >= 3) return state;
  return {
    ...state,
    addedParagraphs: state.addedParagraphs + 1,
  };
}

export function resetAnchorState(): AnchorState {
  return { ...INITIAL_ANCHOR_STATE };
}

export function setAnchorMode(state: AnchorState, mode: AnchorMode): AnchorState {
  return {
    ...state,
    mode,
  };
}

export function calculatePhotoOffset(state: AnchorState, paragraphHeight = 44): number {
  if (state.mode === "fix-position") {
    // Pinned to page: vertical coordinate stays fixed at initial baseline
    return 0;
  }
  // Move with text: pushes down with each added paragraph
  return state.addedParagraphs * paragraphHeight;
}

export function calculateAnchorOffset(state: AnchorState, paragraphHeight = 44): number {
  // The blue anchor icon always remains attached to its host paragraph,
  // which is pushed down when paragraphs are inserted above it.
  return state.addedParagraphs * paragraphHeight;
}

export function getAnchorStatus(state: AnchorState): string {
  const modeLabel =
    state.mode === "move-with-text"
      ? "Move with text (Word default)"
      : "Fix position on page (Publisher style)";
  const shiftDesc =
    state.mode === "move-with-text"
      ? state.addedParagraphs > 0
        ? `Photo shifted down by ${state.addedParagraphs} paragraph(s) along with the river of text.`
        : "Photo is anchored to Paragraph 1 and will travel when text is added."
      : state.addedParagraphs > 0
        ? `Added ${state.addedParagraphs} paragraph(s) above. Text flows past while photo remains pinned in place.`
        : "Photo is pinned to the page. Text will flow past without moving the photo.";

  return `Current mode: ${modeLabel}. ${shiftDesc}`;
}

/* ==========================================================================
   4. Box Margin & Border Simulator Logic
   ========================================================================== */

export type MarginPresetId = "tight" | "default" | "roomy" | "generous";
export type FillPresetId = "white" | "tint" | "none";
export type OutlinePresetId = "black" | "teal" | "none";

export interface MarginPreset {
  id: MarginPresetId;
  label: string;
  metricLabel: string;
  paddingRem: string;
  description: string;
}

export interface FillPreset {
  id: FillPresetId;
  label: string;
  cssColor: string;
  description: string;
}

export interface OutlinePreset {
  id: OutlinePresetId;
  label: string;
  cssBorder: string;
  description: string;
}

export interface BoxMarginState {
  margin: MarginPresetId;
  fill: FillPresetId;
  outline: OutlinePresetId;
}

export const MARGIN_PRESETS: Record<MarginPresetId, MarginPreset> = {
  tight: {
    id: "tight",
    label: "Zero Margins",
    metricLabel: "0 cm (Publisher style)",
    paddingRem: "0.25rem",
    description: "Text hugs the outer boundaries tightly, identical to Microsoft Publisher default frames.",
  },
  default: {
    id: "default",
    label: "Word Default",
    metricLabel: "0.25 cm (0.1 inch)",
    paddingRem: "0.75rem",
    description: "Word's standard internal padding. Leaves breathing space around the interior text.",
  },
  roomy: {
    id: "roomy",
    label: "Comfortable",
    metricLabel: "0.5 cm",
    paddingRem: "1.25rem",
    description: "Spacious margin suitable for highlighted quote callouts and sidebar features.",
  },
  generous: {
    id: "generous",
    label: "Generous",
    metricLabel: "1.0 cm",
    paddingRem: "1.75rem",
    description: "Ample luxury padding for presentation cards and hero announcements.",
  },
};

export const FILL_PRESETS: Record<FillPresetId, FillPreset> = {
  white: {
    id: "white",
    label: "White Fill",
    cssColor: "#FFFFFF",
    description: "Solid opaque white background obscures any underlying elements.",
  },
  tint: {
    id: "tint",
    label: "Amber Tint",
    cssColor: "#FFFBEB",
    description: "Warm paper tint highlights callout notes and editorial tips.",
  },
  none: {
    id: "none",
    label: "No Fill (Transparent)",
    cssColor: "transparent",
    description: "Completely transparent. Ideal when placing floating text over background photos.",
  },
};

export const OUTLINE_PRESETS: Record<OutlinePresetId, OutlinePreset> = {
  black: {
    id: "black",
    label: "1pt Slate Outline",
    cssBorder: "1px solid #1E293B",
    description: "Standard neat border boundary around the box.",
  },
  teal: {
    id: "teal",
    label: "2pt Teal Outline",
    cssBorder: "2px solid #0F766E",
    description: "Distinctive Publisher-accent border highlighting key summaries.",
  },
  none: {
    id: "none",
    label: "No Outline (Borderless)",
    cssBorder: "1px dashed transparent",
    description: "Removes outer border for an invisible framing box that blends into the page.",
  },
};

export const INITIAL_BOX_STATE: BoxMarginState = {
  margin: "default",
  fill: "white",
  outline: "black",
};

export function getBoxPreviewStyles(state: BoxMarginState): {
  padding: string;
  backgroundColor: string;
  border: string;
} {
  const marginConfig = MARGIN_PRESETS[state.margin] || MARGIN_PRESETS.default;
  const fillConfig = FILL_PRESETS[state.fill] || FILL_PRESETS.white;
  const outlineConfig = OUTLINE_PRESETS[state.outline] || OUTLINE_PRESETS.black;

  return {
    padding: marginConfig.paddingRem,
    backgroundColor: fillConfig.cssColor,
    border: outlineConfig.cssBorder,
  };
}

export function getBoxMarginStatus(state: BoxMarginState): string {
  const marginConfig = MARGIN_PRESETS[state.margin] || MARGIN_PRESETS.default;
  const fillConfig = FILL_PRESETS[state.fill] || FILL_PRESETS.white;
  const outlineConfig = OUTLINE_PRESETS[state.outline] || OUTLINE_PRESETS.black;

  return `Text box styled with ${marginConfig.metricLabel} internal padding, ${fillConfig.label}, and ${outlineConfig.label}.`;
}

/* ==========================================================================
   5. Align & Distribute Simulator Logic
   ========================================================================== */

export type AlignTarget = "margin" | "page" | "selected";
export type AlignAction =
  | "left"
  | "center"
  | "right"
  | "top"
  | "distribute"
  | "reset";

export interface AlignItem {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Bounds {
  left: number;
  right: number;
  top: number;
  bottom: number;
  width: number;
  height: number;
}

export const CANVAS_BOUNDS: Bounds = {
  left: 0,
  right: 320,
  top: 0,
  bottom: 200,
  width: 320,
  height: 200,
};

export const MARGIN_BOUNDS: Bounds = {
  left: 40,
  right: 280,
  top: 30,
  bottom: 170,
  width: 240,
  height: 140,
};

export const INITIAL_ALIGN_ITEMS: AlignItem[] = [
  { id: "box-1", name: "Photo Card", x: 20, y: 35, width: 60, height: 45 },
  { id: "box-2", name: "Quote Box", x: 130, y: 75, width: 65, height: 50 },
  { id: "box-3", name: "Badge Pill", x: 220, y: 25, width: 55, height: 40 },
];

export function cloneItems(items: AlignItem[]): AlignItem[] {
  return items.map((item) => ({ ...item }));
}

export function alignObjects(
  items: AlignItem[],
  action: AlignAction,
  target: AlignTarget
): AlignItem[] {
  if (items.length === 0 || action === "reset") {
    return cloneItems(INITIAL_ALIGN_ITEMS);
  }

  const updated = cloneItems(items);
  const bounds = target === "page" ? CANVAS_BOUNDS : MARGIN_BOUNDS;

  if (action === "left") {
    const targetX = target === "selected" ? Math.min(...updated.map((i) => i.x)) : bounds.left;
    return updated.map((item) => ({ ...item, x: targetX }));
  }

  if (action === "center") {
    if (target === "selected") {
      const minX = Math.min(...updated.map((i) => i.x));
      const maxX = Math.max(...updated.map((i) => i.x + i.width));
      const groupCenterX = minX + (maxX - minX) / 2;
      return updated.map((item) => ({
        ...item,
        x: Math.round(groupCenterX - item.width / 2),
      }));
    }
    const centerLine = bounds.left + bounds.width / 2;
    return updated.map((item) => ({
      ...item,
      x: Math.round(centerLine - item.width / 2),
    }));
  }

  if (action === "right") {
    const targetRight =
      target === "selected" ? Math.max(...updated.map((i) => i.x + i.width)) : bounds.right;
    return updated.map((item) => ({ ...item, x: targetRight - item.width }));
  }

  if (action === "top") {
    const targetTop = target === "selected" ? Math.min(...updated.map((i) => i.y)) : bounds.top;
    return updated.map((item) => ({ ...item, y: targetTop }));
  }

  if (action === "distribute") {
    if (updated.length < 3) return updated;
    // Sort items by current X position
    const sorted = [...updated].sort((a, b) => a.x - b.x);

    let startX: number;
    let endX: number;

    if (target === "selected") {
      startX = sorted[0].x;
      endX = sorted[sorted.length - 1].x + sorted[sorted.length - 1].width;
    } else {
      startX = bounds.left;
      endX = bounds.right;
    }

    const totalObjectWidth = sorted.reduce((sum, item) => sum + item.width, 0);
    const availableSpace = endX - startX - totalObjectWidth;
    const gap = Math.max(0, availableSpace / (sorted.length - 1));

    let currentX = startX;
    return sorted.map((item, idx) => {
      const newX = idx === 0 ? startX : Math.round(currentX);
      currentX += item.width + gap;
      return { ...item, x: newX };
    });
  }

  return updated;
}

export function getAlignStatus(action: AlignAction, target: AlignTarget): string {
  const targetLabel =
    target === "margin"
      ? "page margins"
      : target === "page"
        ? "entire page edge"
        : "selected objects";

  switch (action) {
    case "left":
      return `Aligned objects to the left of ${targetLabel}.`;
    case "center":
      return `Centred objects horizontally relative to ${targetLabel}.`;
    case "right":
      return `Aligned objects to the right of ${targetLabel}.`;
    case "top":
      return `Aligned objects along the top of ${targetLabel}.`;
    case "distribute":
      return `Distributed objects with equal horizontal spacing across ${targetLabel}.`;
    case "reset":
      return "Reset objects to scattered positions.";
    default:
      return "Updated object alignments.";
  }
}
