export type TranslatorCategory =
  | 'all'
  | 'canvas-text'
  | 'pictures-shapes'
  | 'align-layer'
  | 'tables-print';

export interface TranslatorCategoryMeta {
  id: TranslatorCategory;
  label: string;
}

export interface TranslatorEntry {
  id: string;
  category: Exclude<TranslatorCategory, 'all'>;
  publisher: string;
  word: string;
  ribbonPath: string;
  altPath?: string;
  tip: string;
  lessonSlug: string;
  lessonTitle: string;
}

export const TRANSLATOR_CATEGORIES: TranslatorCategoryMeta[] = [
  { id: 'all', label: 'All Items' },
  { id: 'canvas-text', label: 'Canvas, Pages & Text' },
  { id: 'pictures-shapes', label: 'Pictures & Shapes' },
  { id: 'align-layer', label: 'Alignment & Layering' },
  { id: 'tables-print', label: 'Tables, Borders & PDF' },
];

export const TRANSLATOR_ENTRIES: TranslatorEntry[] = [
  // --- Category: Canvas, Pages & Text ---
  {
    id: 'scratch-area',
    category: 'canvas-text',
    publisher: 'Scratch Area (Grey pasteboard around page)',
    word: 'No direct pasteboard canvas. In Word, anything outside printable margins is deleted or invisible. Use a temporary trailing blank page at the end of the document, or use an invisible scratch table cell.',
    ribbonPath: 'Insert → Page Break (Ctrl + Enter)',
    altPath: 'Keep rough notes on a final temporary page',
    tip: 'Word is a river of text: objects must anchor to an active paragraph inside page boundaries.',
    lessonSlug: '01-how-text-flows',
    lessonTitle: 'Lesson 1: How Text Flows in Word',
  },
  {
    id: 'draw-text-box',
    category: 'canvas-text',
    publisher: 'Draw Text Box (Freeform container for every snippet)',
    word: 'Insert → Text Box → Draw Text Box. Word defaults to a solid white background and a 1pt black outline, which must be cleared.',
    ribbonPath: 'Insert → Text Box → Draw Text Box',
    altPath: 'Right-click border → Format Shape',
    tip: 'Always choose Draw Text Box at the bottom of the menu; ignore Word\'s cluttered sidebar templates.',
    lessonSlug: '06-text-boxes-and-margins',
    lessonTitle: 'Lesson 6: Text Boxes & Internal Margins',
  },
  {
    id: 'text-overflow',
    category: 'canvas-text',
    publisher: 'Text Box Overflow Linking (Autoflow to next box)',
    word: 'Create Link tool: select the overflowing box, click Create Link, then click an empty text box with the pouring pitcher cursor.',
    ribbonPath: 'Shape Format → Text → Create Link',
    altPath: 'Only works with completely empty destination text boxes',
    tip: 'The destination box must be drawn first and contain zero characters (not even a space or blank line).',
    lessonSlug: '06-text-boxes-and-margins',
    lessonTitle: 'Lesson 6: Text Boxes & Internal Margins',
  },
  {
    id: 'internal-margins',
    category: 'canvas-text',
    publisher: 'Text Box Internal Margins / Padding',
    word: 'Format Shape pane → Text Options → Text Box icon → Left, Right, Top, and Bottom margins.',
    ribbonPath: 'Shape Format → Shape Styles dialogue launcher',
    altPath: 'Right-click box border → Format Shape → Text Options',
    tip: 'Set margins to 0 cm for edge-to-edge text, or 0.25 cm to stop words touching borders.',
    lessonSlug: '06-text-boxes-and-margins',
    lessonTitle: 'Lesson 6: Text Boxes & Internal Margins',
  },
  {
    id: 'columns-and-guides',
    category: 'canvas-text',
    publisher: 'Layout Guides & Multi-Column Page Grids',
    word: 'Layout tab → Columns (for newspaper columns) or use a Continuous Section Break to mix 1-column banners with 2-column body text.',
    ribbonPath: 'Layout → Columns → Two / More Columns',
    altPath: 'Layout → Breaks → Continuous Section Break',
    tip: 'To place side-by-side content without columns jumping around, an Invisible Table is far easier.',
    lessonSlug: '11-page-borders-and-setup',
    lessonTitle: 'Lesson 11: Page Borders & Setup',
  },
  {
    id: 'master-pages',
    category: 'canvas-text',
    publisher: 'Master Pages (Repeating logos, headers, backgrounds)',
    word: 'Header & Footer layer (double-click top/bottom margin). Tick \'Different First Page\' to keep the cover clean.',
    ribbonPath: 'Insert → Header / Footer (or double-click margin)',
    altPath: 'Header & Footer tab → Different First Page',
    tip: 'Watermarks and background shapes placed inside the Header layer repeat automatically across every page in that section.',
    lessonSlug: '13-headers-footers-pages',
    lessonTitle: 'Lesson 13: Headers, Footers & Sections',
  },
  {
    id: 'booklet-setup',
    category: 'canvas-text',
    publisher: 'Booklet / Side-Fold Card Page Setup',
    word: 'Layout → Page Setup dialogue launcher → Multiple pages: Book fold. Word automatically arranges page imposition for printing.',
    ribbonPath: 'Layout → Page Setup launcher → Margins → Multiple pages',
    altPath: 'File → Print → Print on Both Sides (Flip on short edge)',
    tip: 'Page count must be a multiple of 4 (e.g. 4, 8, 12 pages) for folded booklet printing.',
    lessonSlug: '11-page-borders-and-setup',
    lessonTitle: 'Lesson 11: Page Borders & Setup',
  },

  // --- Category: Pictures & Shapes ---
  {
    id: 'picture-frame',
    category: 'pictures-shapes',
    publisher: 'Picture Frame (Empty box waiting for an image)',
    word: 'Insert a rectangular Shape as a placeholder, or insert directly: Insert → Pictures → This Device, then set Text Wrap to Square or In Front of Text.',
    ribbonPath: 'Insert → Pictures → This Device',
    altPath: 'Click the floating arch Layout Options icon beside the photo',
    tip: 'Word does not have empty image frames. Change Text Wrap immediately so the photo stops acting like a giant letter.',
    lessonSlug: '04-text-wrapping',
    lessonTitle: 'Lesson 4: Text Wrapping Options',
  },
  {
    id: 'crop-and-shape',
    category: 'pictures-shapes',
    publisher: 'Crop & Crop to Shape (Circles, rounded rectangles)',
    word: 'Picture Format → Crop drop-down arrow → Crop to Shape. Select any shape to instantly mask the photograph.',
    ribbonPath: 'Picture Format → Size → Crop → Crop to Shape',
    altPath: 'Right-click photo → Crop',
    tip: 'Use Aspect Ratio (1:1 Square) before cropping to an Oval to produce a perfect circular headshot.',
    lessonSlug: '07-cropping-and-resizing',
    lessonTitle: 'Lesson 7: Resizing & Cropping Photos Cleanly',
  },
  {
    id: 'crop-fill-fit',
    category: 'pictures-shapes',
    publisher: 'Zoom & Pan inside Picture Frame',
    word: 'Picture Format → Crop drop-down → Fill or Fit. Drag the photo inside the frame borders to pan, or drag black crop bars to adjust frame.',
    ribbonPath: 'Picture Format → Size → Crop → Fill / Fit',
    altPath: 'Right-click photo → Format Picture → Crop',
    tip: '\'Fill\' scales the picture so the entire frame is filled without letterboxing or squishing.',
    lessonSlug: '07-cropping-and-resizing',
    lessonTitle: 'Lesson 7: Resizing & Cropping Photos Cleanly',
  },
  {
    id: 'shape-outline',
    category: 'pictures-shapes',
    publisher: 'Shape Outline & Borderless Text Boxes (No Outline)',
    word: 'Shape Format → Shape Outline → No Outline. Hides the default black border on text boxes and callout shapes.',
    ribbonPath: 'Shape Format → Shape Styles → Shape Outline → No Outline',
    altPath: 'Right-click border → Outline colour picker',
    tip: 'Do not confuse Shape Outline with Paragraph Borders on the Home tab.',
    lessonSlug: '08-borders-and-fills',
    lessonTitle: 'Lesson 8: Borders (Lines) & Fills',
  },
  {
    id: 'shape-fill',
    category: 'pictures-shapes',
    publisher: 'Shape Fill, Eyedropper & Transparent Backgrounds',
    word: 'Shape Format → Shape Fill → No Fill (transparent) or Eyedropper to sample any colour on your page.',
    ribbonPath: 'Shape Format → Shape Styles → Shape Fill',
    altPath: 'Right-click border → Fill colour picker',
    tip: 'Setting No Fill allows background watermarks, tinted paper, or photos underneath to show through.',
    lessonSlug: '08-borders-and-fills',
    lessonTitle: 'Lesson 8: Borders (Lines) & Fills',
  },
  {
    id: 'drop-cap',
    category: 'pictures-shapes',
    publisher: 'Drop Cap (Large decorative initial letter)',
    word: 'Insert tab → Text group → Drop Cap → Dropped (or In Margin). Set Lines to drop via Drop Cap Options.',
    ribbonPath: 'Insert → Text → Drop Cap → Dropped',
    altPath: 'Insert → Drop Cap → Drop Cap Options',
    tip: 'Place cursor anywhere in the first paragraph before clicking Drop Cap.',
    lessonSlug: '06-text-boxes-and-margins',
    lessonTitle: 'Lesson 6: Text Boxes & Internal Margins',
  },

  // --- Category: Alignment & Layering ---
  {
    id: 'align-distribute',
    category: 'align-layer',
    publisher: 'Align & Distribute Objects Evenly',
    word: 'Select multiple items (Shift+Click) → Shape Format or Picture Format → Align → Align Left / Centre / Right, Distribute Horizontally / Vertically.',
    ribbonPath: 'Shape Format / Picture Format → Arrange → Align',
    altPath: 'Shift + Click multiple items, then right-click → Align',
    tip: 'Check whether \'Align to Page\' or \'Align Selected Objects\' is ticked before clicking an alignment tool.',
    lessonSlug: '09-align-and-distribute',
    lessonTitle: 'Lesson 9: Align, Distribute & Smart Guides',
  },
  {
    id: 'align-relative',
    category: 'align-layer',
    publisher: 'Align to Page vs. Align to Margin',
    word: 'Align menu → Tick \'Align to Page\' or \'Align to Margin\'. When ticked, objects centre relative to sheet edges or printable text boundaries.',
    ribbonPath: 'Shape Format → Align → Align to Page / Margin',
    altPath: 'Layout → Align → Align to Margin',
    tip: 'Selecting 2+ items switches Word\'s default to \'Align Selected Objects\'. Reset it to Align to Page if centering on the whole sheet.',
    lessonSlug: '09-align-and-distribute',
    lessonTitle: 'Lesson 9: Align, Distribute & Smart Guides',
  },
  {
    id: 'smart-guides',
    category: 'align-layer',
    publisher: 'Smart Alignment Guides (Green snapping lines)',
    word: 'Layout tab → Align drop-down → Tick \'Use Alignment Guides\'. Word displays green guidelines when shapes line up with margins or photos.',
    ribbonPath: 'Layout → Arrange → Align → Use Alignment Guides',
    altPath: 'Shape Format → Align → Use Alignment Guides',
    tip: 'If objects refuse to snap neatly, hold Alt while dragging to temporarily disable grid snapping.',
    lessonSlug: '02-show-hidden-clues',
    lessonTitle: 'Lesson 2: Turn On Your X-Ray Vision',
  },
  {
    id: 'micro-nudge',
    category: 'align-layer',
    publisher: 'Nudge object slightly with arrow keys',
    word: 'Select object and press Ctrl + Arrow Keys for 1-pixel micro-nudging.',
    ribbonPath: 'Keyboard shortcut',
    altPath: 'Holding Ctrl while pressing Arrow keys nudges by single points',
    tip: 'Regular Arrow keys move in larger increments; Ctrl + Arrow gives precise typographic control.',
    lessonSlug: '09-align-and-distribute',
    lessonTitle: 'Lesson 9: Align, Distribute & Smart Guides',
  },
  {
    id: 'group-objects',
    category: 'align-layer',
    publisher: 'Group / Ungroup Objects (Locking photos & captions)',
    word: 'Select multiple objects (Shift+Click) → Shape Format or Picture Format → Group (or Right-click → Group).',
    ribbonPath: 'Shape Format / Picture Format → Arrange → Group',
    altPath: 'Ctrl + Click items → Right-click → Group → Group',
    tip: 'Crucial Gotcha: Word greys out the Group button if any selected item is set to \'In Line with Text\'. Set all items to Square or In Front of Text first.',
    lessonSlug: '10-grouping-and-layering',
    lessonTitle: 'Lesson 10: Grouping, Layering & the Selection Pane',
  },
  {
    id: 'layer-order',
    category: 'align-layer',
    publisher: 'Bring to Front / Send to Back (Layering)',
    word: 'Bring Forward / Send Backward drop-down arrow → Bring to Front / Send to Back.',
    ribbonPath: 'Shape Format / Picture Format → Arrange → Bring Forward',
    altPath: 'Right-click object → Bring to Front / Send to Back',
    tip: 'To place an item behind text without trapping it, use the Selection Pane instead of blindly clicking.',
    lessonSlug: '10-grouping-and-layering',
    lessonTitle: 'Lesson 10: Grouping, Layering & the Selection Pane',
  },
  {
    id: 'selection-pane',
    category: 'align-layer',
    publisher: 'Selection Pane (Finding trapped layers behind text)',
    word: 'Home tab → Select (far right) → Selection Pane. Lists every object on the page for easy 1-click selection and visibility toggling.',
    ribbonPath: 'Home → Editing → Select → Selection Pane',
    altPath: 'Shape Format / Picture Format → Arrange → Selection Pane',
    tip: 'Click the little eye icon (👁️) in the pane to temporarily hide an object while editing text beneath it.',
    lessonSlug: '10-grouping-and-layering',
    lessonTitle: 'Lesson 10: Grouping, Layering & the Selection Pane',
  },

  // --- Category: Tables, Borders & Exporting ---
  {
    id: 'invisible-tables',
    category: 'tables-print',
    publisher: 'Borderless Layout Grid (Invisible Tables)',
    word: 'Insert a Table, then set Table Design → Borders → No Border. Turn on Table Layout → View Gridlines to edit with blue guide lines.',
    ribbonPath: 'Table Design → Borders → No Border',
    altPath: 'Table Layout → View Gridlines (displays non-printing dashed guides)',
    tip: 'Set Table Properties → Options → untick \'Automatically resize to fit contents\' to keep column widths completely stable.',
    lessonSlug: '12-invisible-tables',
    lessonTitle: 'Lesson 12: The Secret Weapon: Invisible Tables',
  },
  {
    id: 'page-borders',
    category: 'tables-print',
    publisher: 'Page Borders (Preventing cut-off bottom margins)',
    word: 'Design tab → Page Borders → click Options... (bottom right). Change \'Measure from: Edge of page\' to \'Measure from: Text\'.',
    ribbonPath: 'Design → Page Background → Page Borders → Options',
    altPath: 'Layout → Margins → Custom Margins',
    tip: 'Home desktop printers require 1.25 cm to 1.5 cm of bottom clearance; \'Measure from: Text\' keeps the border safely inside the printable area.',
    lessonSlug: '11-page-borders-and-setup',
    lessonTitle: 'Lesson 11: Page Borders & Setup',
  },
  {
    id: 'pdf-export',
    category: 'tables-print',
    publisher: 'Commercial Print & PDF Export (Freezing layouts)',
    word: 'File → Export → Create PDF/XPS Document, or File → Save a Copy → choose PDF (.pdf) from the file type drop-down.',
    ribbonPath: 'File → Export → Create PDF/XPS',
    altPath: 'File → Save a Copy → File Type: PDF (*.pdf)',
    tip: 'Never email raw .docx files for printing: font substitutions and different printer drivers cause text to reflow unpredictably. PDF locks every box in place.',
    lessonSlug: '14-printing-and-pdf',
    lessonTitle: 'Lesson 14: Printing & Saving Safely as PDF',
  },
];
