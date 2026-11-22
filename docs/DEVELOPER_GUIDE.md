# Developer & Maintainer Guide: Publisher to Word

> **Audience:** Developers, Content Authors, and Maintainers  
> **Status:** Phase 2 Complete (Core Teaching Components & Interactive Simulators)

---

## 1. Getting Started & Development Workflow

### Prerequisites
- **Node.js**: v20+ (v22+ LTS recommended)
- **npm**: v10+
- **Git**

### Daily Commands

```sh
# Start local development server with hot-reloading
npm run dev

# Run full TypeScript & Astro type checking
npm run check

# Run ESLint (TypeScript + Astro + JSX-A11y rules)
npm run lint:eslint

# Run Stylelint (CSS + Astro <style> blocks)
npm run lint:stylelint

# Run complete Quality Gate (Check + Lint + Build + Dist Audit + MWG Scan)
npm run quality
```

> **Cross-Platform Note (Windows / WSL):**  
> If you develop on Windows using WSL2, run `npm` commands directly inside the WSL Linux environment where native binaries reside. In `astro.config.mjs`, `preserveSymlinks: true` is configured to ensure paths crossing symlinks or UNC boundaries resolve cleanly.

---

## 2. Repository Layout

```text
publisher-to-word/
├── public/                       # Static public assets (favicon.svg, future fonts)
├── scripts/
│   └── verify-dist.mjs           # Zero-dependency post-build HTML & a11y auditor
├── src/
│   ├── content.config.ts         # Astro Content Collections schemas (Zod)
│   ├── content/
│   │   ├── lessons/              # MDX lesson articles
│   │   ├── rescue/               # (Phase 4) Troubleshooting entries
│   │   └── projects/             # (Phase 4) Guided mini-projects
│   ├── data/
│   │   ├── curriculum.ts         # Master 4-Module, 14-Lesson catalog & helpers
│   │   └── translator.ts         # Publisher → Word dictionary data
│   ├── layouts/
│   │   ├── BaseLayout.astro      # Root HTML shell, skip-link, header & footer
│   │   └── LessonLayout.astro    # 2-column lesson template with sidebar
│   ├── components/
│   │   ├── nav/                  # Header, Footer, Sidebar, PrevNext
│   │   ├── teaching/             # (Phase 2) Callout cards, comparison boxes, steps
│   │   └── interactive/          # (Phase 2) Visual mini-simulators
│   ├── styles/
│   │   ├── tokens.css            # Palette, fluid clamp typography, high-contrast
│   │   ├── base.css              # Reset, typography, focus, view transitions
│   │   ├── components.css        # Cards, disclosures, buttons, badges
│   │   └── print.css             # @media print styling
│   └── pages/                    # Astro file-based routes
├── .stylelintrc.mjs              # Stylelint configuration
├── eslint.config.mjs             # ESLint flat configuration
└── astro.config.mjs              # Astro configuration
```

---

## 3. How to Author or Unlock a Lesson

The 14-lesson curriculum is predefined in `src/data/curriculum.ts`. To publish a new lesson:

### Step 1: Create the MDX File
Create a new file in `src/content/lessons/<slug>.mdx` (e.g. `src/content/lessons/02-show-hidden-clues.mdx`).

Ensure your frontmatter matches the schema in `src/content.config.ts`:

```mdx
---
title: "Turn On Your X-Ray Vision"
module: 1
moduleTitle: "The Big Shift: How Word Thinks"
order: 2
summary: "The 3 stress-saving switches: Show/Hide ¶, Rulers, and Alignment Guides."
wordTabs: ["Home", "View", "Layout"]
hasMacNotes: true
---

## Why You Need X-Ray Vision

In Word, formatting doesn't happen by accident. Every jump across the page is caused by a hidden character...
```

### Step 2: Mark the Lesson as Available
Open `src/data/curriculum.ts`, find the corresponding lesson object in `CURRICULUM`, and set:
```ts
isAvailable: true
```
Once set, the lesson link will immediately activate across the homepage, curriculum directory, lesson sidebar, and previous/next navigation cards.

### Step 3: Follow Editorial Conventions
- **Reassuring, Blame-Free Tone:** Empathize with the learner's Publisher muscle memory.
- **Always Show Both Paths:** Provide both the **Ribbon Path** and the **Right-Click / Floating Icon Path**.
- **Keyboard Keys:** Use `<kbd>Enter</kbd>`, `<kbd>Shift</kbd> + <kbd>Enter</kbd>`, `<kbd>Ctrl</kbd> + <kbd>Enter</kbd>`.
- **Word Formatting Marks:** Wrap formatting symbols in `<samp>` (e.g. `<samp>¶</samp>`).
- **Mac Notes:** Whenever a menu or shortcut differs on macOS, add a `<MacNote>` callout (or accessible `<details class="disclosure">`).

---

## 4. Authoring Accessible Inline SVG Word Diagrams

Conceptual diagrams and Word UI schematics use inline SVGs so they stay crisp at 200% zoom, load instantly, and require no image assets.

Our automated auditor (`scripts/verify-dist.mjs`) strictly validates every SVG. Follow these rules:

### A. Non-Decorative (Informative) SVGs
Must have `role="img"` and an accessible name via `<title>` and `<desc>`:

```html
<figure class="diagram-figure">
  <svg viewBox="0 0 460 260" width="100%" height="auto" fill="none" role="img" aria-labelledby="svg-wrap-title svg-wrap-desc">
    <title id="svg-wrap-title">Square text wrap around a photo in Word</title>
    <desc id="svg-wrap-desc">Shows text flowing neatly around the rectangular bounding box of a photo.</desc>
    <!-- Realistic Word UI elements -->
    <rect x="10" y="10" width="120" height="90" rx="4" fill="#EFF6FF" stroke="#1D4ED8" stroke-width="2"/>
    <text x="20" y="30" fill="#1D4ED8" font-size="12" font-weight="bold">Picture Format</text>
  </svg>
  <figcaption class="diagram-caption">Square wrap keeps text comfortably away from photo edges.</figcaption>
</figure>
```

### B. Decorative Icons
Icons paired with visible text (e.g. printer icon on a button, chevron on a summary) must be hidden from screen readers:

```html
<svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor" aria-hidden="true">
  <path d="..." />
</svg>
```

### Visual Palette for Word UI Elements:
- **Word Blue Ribbon / Focus:** `#1D4ED8`
- **Word Contextual Tab (Gold/Amber):** `#FEF3C7` background, `#D97706` border, `#92400E` text
- **Publisher Teal Comparison:** `#0F766E`
- **Paper Canvas:** `#FFFFFF` or `#FAF9F6`
- **Anchor Glyph:** Blue anchor icon (`⚓`) anchored beside paragraph text

---

## 5. CSS & Styling Guidelines

### Logical Properties
Always use CSS logical properties for layout spacing and sizing to support internationalization and bidirectional flow:
- `margin-block` / `margin-inline` instead of `margin-top` / `margin-left`
- `padding-block` / `padding-inline` instead of `padding-top` / `padding-left`
- `inline-size` / `block-size` instead of `width` / `height`

### Target Sizes (WCAG 2.5.8)
All interactive elements (buttons, links, disclosures, tabs) must maintain a minimum bounding target of **$44 \times 44\,\text{px}$**:
```css
.btn {
  min-block-size: var(--target-min-size); /* 2.75rem = 44px */
  min-inline-size: var(--target-min-size);
}
```

### Modern Colour & Alpha Notation
Stylelint enforces modern space-separated colour function syntax:
- **Do:** `rgb(0 0 0 / 10%)`
- **Don't:** `rgba(0, 0, 0, 0.1)`

### Accessible Disclosures
When styling `<details>` and `<summary>`:
- Never put `<h1>`–`<h6>` inside `<summary>` (screen readers will drop heading navigation).
- Place the disclosure marker (`::before` chevron) **before** the label text for vertical scanning.
- Animate expansion on `details::details-content` using `interpolate-size: allow-keywords`.

---

## 6. Pre-Commit Quality Gate

Before pushing or creating a pull request, run:

```sh
npm run quality
```

The Git pre-commit hook in `.git/hooks/pre-commit` will automatically block any commit if there are lint errors, type failures, broken links, or accessibility violations.

---

## 7. Using Teaching Components in Lessons

Phase 2 provides 6 specialized teaching components in `src/components/teaching/` and 5 visual simulators in `src/components/interactive/`. You can import and use them in any MDX lesson file:

```mdx
import PublisherCompare from '../../components/teaching/PublisherCompare.astro';
import WhereToFindIt from '../../components/teaching/WhereToFindIt.astro';
import StepList from '../../components/teaching/StepList.astro';
import GotchaBox from '../../components/teaching/GotchaBox.astro';
import MacNote from '../../components/teaching/MacNote.astro';
import TryItCard from '../../components/teaching/TryItCard.astro';
```

### Component Examples:

#### 1. `<PublisherCompare>`
```mdx
<PublisherCompare
  title="Pinboard vs. River of Text"
  publisherWay="Every text box and picture was an independent island pinned to a static canvas."
  wordWay="All text flows continuously from top to bottom. Pictures and text boxes anchor into the river."
/>
```

#### 2. `<WhereToFindIt>`
```mdx
<WhereToFindIt
  title="Where to Find Page Break in Word"
  ribbonPath={["Insert", "Pages", "Page Break"]}
  contextualTab="Picture Format"
  rightClickPath={["Layout", "Page Setup", "Breaks", "Page"]}
  floatingIconTip="Use keyboard shortcut Ctrl + Enter for instant page breaks anywhere."
/>
```

#### 3. `<StepList>`
```mdx
<StepList
  steps={[
    {
      title: "Normal Paragraph Break: Enter",
      detail: "Creates a brand new paragraph mark (¶).",
      ribbonBadge: "Enter",
    },
    {
      title: "Gentle Line Break: Shift + Enter",
      detail: "Drops to the next line without starting a new paragraph.",
      ribbonBadge: "Shift + Enter",
    },
  ]}
/>
```

#### 4. `<GotchaBox>`
```mdx
<GotchaBox title="Common Snag — The 15 Enters Trap" collapsible={false}>
  <p>Never press Enter multiple times to push content onto the next page!</p>
</GotchaBox>
```

#### 5. `<MacNote>`
```mdx
<MacNote summary="Using Word on a Mac? Shortcut & menu differences">
  <p>On macOS, press <kbd>Cmd ⌘</kbd> + <kbd>Return</kbd> instead of <kbd>Ctrl</kbd> + <kbd>Enter</kbd>.</p>
</MacNote>
```

#### 6. `<TryItCard>`
```mdx
<TryItCard
  title="Try It in Word (60 Seconds)"
  steps={[
    "Open a blank document in Microsoft Word.",
    "Type a short heading and press Enter.",
  ]}
/>
```
