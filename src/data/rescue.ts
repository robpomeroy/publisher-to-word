import type { RescueItem, RescueCategory } from '../utils/reference';

export interface RescueCategoryOption {
  id: RescueCategory;
  label: string;
}

export const RESCUE_CATEGORIES: RescueCategoryOption[] = [
  { id: 'all', label: 'All Snags' },
  { id: 'images-anchors', label: 'Images & Anchors' },
  { id: 'layout-margins', label: 'Layout & Margins' },
  { id: 'text-formatting', label: 'Text & Formatting' },
  { id: 'objects-layering', label: 'Objects & Layering' },
];

export const RESCUE_ITEMS: RescueItem[] = [
  {
    id: 'snag-1',
    symptom: 'My picture jumped to the next page when I typed above it!',
    category: 'images-anchors',
    cause:
      "Word pictures are anchored to a paragraph mark (¶), causing the classic 'jumping picture' effect. In Publisher, objects rest anywhere on the page canvas. In Word, typing above an anchored picture pushes the anchor paragraph downwards. Once the paragraph crosses the page margin, Word carries the picture with it to the next page.",
    fixSteps: [
      'Select the picture and click the floating Layout Options arch icon beside its top-right corner.',
      "Under 'Position', switch from 'Move with text' to 'Fix position on page'.",
      'Turn on Show/Hide ¶ on the Home tab so you can see the anchor icon (⚓) in the left margin.',
      'Drag the anchor icon up to a stable paragraph at the top of the intended page.'
    ],
    ribbonPath: 'Picture Format → Position → Fix Position on Page',
    altPath: 'Floating arch icon beside picture → Fix position on page',
    tip: 'Locking the anchor does not prevent text above from moving; it stops the anchor from jumping to another paragraph.',
    lessonSlug: '05-anchors-and-positioning',
    lessonTitle: 'Move with Text vs. Fix Position on Page',
    sandboxUrl: '/sandboxes/#anchor'
  },
  {
    id: 'snag-2',
    symptom: "The 'Picture Format' or 'Shape Format' tab disappeared from the top ribbon!",
    category: 'objects-layering',
    cause:
      'Unlike Publisher where drawing and object tools stay permanently available on toolbars, Word uses contextual Ribbon tabs. Word hides object formatting tools the moment your cursor leaves the object.',
    fixSteps: [
      'Click directly on the border or body of the picture, shape, or text box.',
      "Look at the far right of the top Ribbon header: the contextual 'Picture Format' or 'Shape Format' tab will appear highlighted.",
      'Click the tab to access wrap, alignment, borders, and crop tools.'
    ],
    ribbonPath: 'Click object → contextual Picture Format or Shape Format tab (far right)',
    altPath: 'Right-click object → Format Picture / Format Shape',
    tip: 'If clicking the object is tricky because it is behind text, open the Selection Pane from Home → Select.',
    lessonSlug: '03-finding-the-controls',
    lessonTitle: 'Where Did the Buttons Go?'
  },
  {
    id: 'snag-3',
    symptom: "The 'Group' button is greyed out and I can't click it!",
    category: 'objects-layering',
    cause:
      "Publisher groups anything on the page freely. Word strictly forbids grouping whenever even one of the selected objects is set to 'In Line with Text'. Inline objects belong to the text stream, while floating objects belong to the drawing canvas.",
    fixSteps: [
      'Select the first object and click its floating Layout Options arch icon.',
      "Change its text wrap setting from 'In Line with Text' to 'Square', 'Tight', or 'In Front of Text'.",
      'Repeat this step for every object you want to group.',
      'Hold Shift, click each object to multi-select them, go to Shape Format (or Picture Format) → Group → Group.'
    ],
    ribbonPath: 'Shape Format → Group → Group (or Arrange → Group)',
    altPath: 'Right-click selected objects → Group → Group',
    tip: 'All selected objects must have a floating wrap style (such as Square) applied before the Group button becomes active.',
    lessonSlug: '10-grouping-and-layering',
    lessonTitle: 'Grouping & Layering'
  },
  {
    id: 'snag-4',
    symptom: "I sent a picture 'Behind Text' and now I can't click or select it!",
    category: 'objects-layering',
    cause:
      'In Publisher, layering order is visible and selectable. In Word, when an object is placed behind text, clicking anywhere in the area activates the text editing layer above it rather than the graphic.',
    fixSteps: [
      'Go to the Home tab on the ribbon.',
      "At the far right of the ribbon, click 'Select' and choose 'Selection Pane...'.",
      'The Selection Pane opens on the right side of your document showing every object on the page.',
      "Click your picture's name in the list. Word immediately highlights the picture with resize handles so you can move, resize, or re-wrap it."
    ],
    ribbonPath: 'Home → Select → Selection Pane',
    altPath: 'Home → Select → Select Objects (draw a marquee around the picture)',
    tip: 'Keep the Selection Pane docked while working on complex multi-layered flyers.',
    lessonSlug: '10-grouping-and-layering',
    lessonTitle: 'Grouping & Layering'
  },
  {
    id: 'snag-5',
    symptom: 'My text box has an unwanted black border and a solid white background!',
    category: 'text-formatting',
    cause:
      'Publisher text boxes are transparent and borderless by default. Word text boxes arrive with a default 1 pt black outline and solid white fill, obscuring pictures or background colours behind them.',
    fixSteps: [
      'Click the outer border of the text box to select the container (ensure the border is solid, not dashed).',
      "On the top ribbon, click the 'Shape Format' tab.",
      "Click 'Shape Fill' and choose 'No Fill' from the palette.",
      "Click 'Shape Outline' and choose 'No Outline'."
    ],
    ribbonPath: 'Shape Format → Shape Fill (No Fill) & Shape Outline (No Outline)',
    altPath: 'Right-click border → Fill (No Fill) & Outline (No Outline)',
    tip: "To make this the standard, right-click the border of your styled box and select 'Set as Default Text Box'.",
    lessonSlug: '08-borders-and-fills',
    lessonTitle: 'Borders, Fills & Backgrounds'
  },
  {
    id: 'snag-6',
    symptom: 'My text is squished right up against the border of the text box!',
    category: 'text-formatting',
    cause:
      "Word applies internal text box padding (margins) that can differ between default templates, often pushing text awkwardly close to top and side borders or leaving uneven whitespace.",
    fixSteps: [
      "Right-click the boundary line of the text box and choose 'Format Shape...'.",
      "In the Format Shape pane that opens on the right, click the 'Text Options' header.",
      "Click the third small icon (Text Box icon with an 'A' inside).",
      'Adjust the Left, Right, Top, and Bottom margins (e.g. 0.25 cm or 0.1 in all round for neat breathing space).'
    ],
    ribbonPath: 'Shape Format → Format Pane → Text Options → Text Box',
    altPath: 'Right-click text box border → Format Shape → Text Options → Text Box',
    tip: "Tick 'Do not autofit' or 'Resize shape to fit text' in the same pane depending on whether you want a fixed box size or an expanding one.",
    lessonSlug: '06-text-boxes-and-margins',
    lessonTitle: 'Text Boxes & Internal Margins'
  },
  {
    id: 'snag-7',
    symptom: 'My page border gets cut off at the bottom when I print it!',
    category: 'layout-margins',
    cause:
      "By default, Word measures page borders from the 'Edge of page' (often 24 pt). Most desktop inkjet and laser printers have an unprintable physical bottom gripper margin of 12-15 mm, cropping the bottom line.",
    fixSteps: [
      'Go to the Design tab on the ribbon.',
      "Click 'Page Borders' on the far right to open the Borders and Shading dialogue.",
      "Click the 'Options...' button in the bottom-right corner of the dialogue.",
      "Change 'Measure from: Edge of page' to 'Measure from: Text'.",
      'Set top, bottom, left, and right margins to 10 pt (or your preferred offset from text), then click OK.'
    ],
    ribbonPath: 'Design → Page Borders → Options... → Measure from: Text',
    altPath: 'Home → Borders menu (arrow) → Borders and Shading → Page Border tab → Options...',
    tip: "Measuring from text ensures the border stays safely inside the printer's physical printable boundary.",
    lessonSlug: '11-page-borders-and-setup',
    lessonTitle: 'Page Borders, Margins & Setup'
  },
  {
    id: 'snag-8',
    symptom: "There's a stubborn blank page at the end of my document that won't delete!",
    category: 'layout-margins',
    cause:
      'When a table, large image, or continuous section break reaches the very bottom margin of a page, Word mandates a trailing paragraph mark (¶). If there is no space remaining on the page, Word forces that paragraph mark onto an extra blank page.',
    fixSteps: [
      'Turn on Show/Hide ¶ on the Home tab (or press Ctrl+Shift+8).',
      'Click onto the extra blank page and locate the lone paragraph mark (¶).',
      'Highlight that single paragraph mark.',
      "In the font size box on the Home tab, type '1' and press Enter. Set line spacing to 1.0 (Single).",
      'Because a 1 pt paragraph takes virtually zero height, Word pulls it back onto the previous page, deleting the blank sheet.'
    ],
    ribbonPath: 'Home → Show/Hide ¶ → Highlight mark → Font Size: 1 pt',
    altPath: 'Ctrl+Shift+8 → highlight trailing mark → Home → Line and Paragraph Spacing: 1.0',
    tip: 'If the trailing mark was preceded by a manual Page Break (Ctrl+Enter), simply highlight the page break line and press Delete or Backspace.',
    lessonSlug: '11-page-borders-and-setup',
    lessonTitle: 'Page Borders, Margins & Setup'
  },
  {
    id: 'snag-9',
    symptom: 'Anchor icon (⚓) is not showing when I click a floating object',
    category: 'images-anchors',
    cause:
      "Word hides object anchors by default to keep the editing canvas uncluttered. The anchor only appears when an object has floating text wrapping and Word's anchor display preference is enabled.",
    fixSteps: [
      "Verify the object is floating: click the object, click the floating Layout Options arch icon, and make sure it is NOT 'In Line with Text' (choose 'Square' or 'Tight').",
      'Turn on Show/Hide ¶ on the Home tab (Ctrl+Shift+8) — this immediately reveals anchors for selected floating objects.',
      'To keep anchors visible permanently: click File → Options → Display.',
      "Under 'Always show these formatting marks on the screen', tick 'Object anchors', then click OK."
    ],
    ribbonPath: 'Home → Show/Hide ¶ (Ctrl+Shift+8) OR File → Options → Display → Object anchors',
    altPath: 'Ctrl+Shift+8 (quick toggle for all formatting marks)',
    tip: 'Once visible, you can drag the anchor up or down in the left margin to change which paragraph owns the object.',
    lessonSlug: '02-show-hidden-clues',
    lessonTitle: 'Turn On Your X-Ray Vision'
  },
  {
    id: 'snag-10',
    symptom: 'Wrapped text is overlapping my picture rather than flowing around it',
    category: 'images-anchors',
    cause:
      "The image wrapping style is accidentally set to 'In Front of Text' or 'Behind Text'. These two modes remove the graphic from the text flow entirely, allowing body text to print directly beneath or over the image.",
    fixSteps: [
      'Click the picture to reveal the floating Layout Options arch icon beside its top-right corner.',
      "Click the arch icon and choose 'Square' (text wraps around a rectangular boundary) or 'Tight' (text contours along transparent image edges).",
      "If the text is too close to the picture, click 'See more...' at the bottom of the Layout pop-up.",
      "In the Text Wrapping tab, increase 'Distance from text' (e.g. 0.3 cm on Left and Right) and click OK."
    ],
    ribbonPath: 'Picture Format → Wrap Text → Square (or Tight)',
    altPath: 'Floating arch icon beside picture → Square',
    tip: "Avoid 'In Front of Text' unless you are creating a temporary overlay or intentional watermark.",
    lessonSlug: '04-text-wrapping',
    lessonTitle: 'Text Wrapping Options',
    sandboxUrl: '/sandboxes/#wrap'
  },
  {
    id: 'snag-11',
    symptom: "My header or footer is repeating on the cover page where I don't want it",
    category: 'layout-margins',
    cause:
      'In Publisher, every page is an independent blank sheet unless you choose a master page. In Word, headers and footers repeat across every page in the document or section unless explicitly told otherwise.',
    fixSteps: [
      'Double-click inside the header or footer area at the top or bottom of page 1 to activate header editing.',
      "The contextual 'Header & Footer' ribbon tab will automatically appear.",
      "In the Options group on the ribbon, tick the box for 'Different First Page'.",
      'The header and footer on page 1 will clear, leaving pages 2, 3, and onwards intact with your running headers and page numbers.',
      'Double-click back into the document body to finish.'
    ],
    ribbonPath: 'Header & Footer → Options → Different First Page',
    altPath: 'Layout → Page Setup dialogue launcher (tiny arrow) → Layout tab → Different first page',
    tip: "If you have multiple sections, make sure 'Link to Previous' is turned off where header changes are needed.",
    lessonSlug: '13-headers-footers-pages',
    lessonTitle: 'Headers, Footers & Page Numbers'
  },
  {
    id: 'snag-12',
    symptom: 'My multi-column text collapsed back into a single wide column across the whole page',
    category: 'layout-margins',
    cause:
      'Columns in Word are governed by section breaks. If you apply 2 columns without selecting text, Word sets the whole document to columns. If you delete a subtle Continuous Section break (often by pressing Backspace at the end of a column), Word merges the two sections back into one default column.',
    fixSteps: [
      "Turn on Show/Hide ¶ on the Home tab to see Section Breaks (they appear as double dotted lines marked 'Section Break (Continuous)').",
      'If you accidentally deleted a break, press Ctrl+Z to undo.',
      'To safely create columns: highlight ONLY the paragraphs you want in multi-column format.',
      'Go to Layout → Columns → Two. Word will automatically insert continuous section breaks before and after your selection.',
      "To return to full width after columns, ensure your cursor is below the bottom section break and verify Columns is set to 'One'."
    ],
    ribbonPath: 'Layout → Columns → Two (with text highlighted)',
    altPath: 'Layout → Breaks → Continuous Section Break before & after text',
    tip: 'Never apply columns to the entire document unless you want the title banner and footer split into columns as well.',
    lessonSlug: '11-page-borders-and-setup',
    lessonTitle: 'Page Borders, Margins & Setup'
  }
];
