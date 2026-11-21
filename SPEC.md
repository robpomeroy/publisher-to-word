# Website Specification: *Publisher to Word — Visual Layout Guide*

> **Working Title:** *Publisher to Word* (or *Layout in Word, Simply* — subtitle: *A Calm, Visual Guide for People Moving from Microsoft Publisher*)  
> **Format:** Static multi-page tutorial website built with **Astro**  
> **Target Audience:** Former Microsoft Publisher users, visual learners, and everyday computer users who find Microsoft Word's layout controls frustrating or intimidating.  
> **Target Software Version:** Microsoft Word for Windows (Microsoft 365 / Word 2021–2024 modern ribbon), with concise expandable callouts where **Word on Mac** or **Word for the Web** differs.

---

## 1. Vision, Audience & Tone Principles

Microsoft Publisher worked like a **pinboard (freeform canvas)**: you drew a text box or dropped a photo anywhere on the page, and it stayed put. Microsoft Word works like a **river of text**: everything wants to flow inline from top to bottom unless you explicitly tell Word otherwise.

Most tutorials assume readers already understand Word's terminology or overwhelm them with dense menus and technical jargon. This website bridges the gap visually and gently.

### Design & Writing Principles
1. **Reassuring, Blame-Free Tone:** Explicitly validate the learner's experience (*"In Publisher, you just dragged a box anywhere. Word works differently — once you learn three hidden settings, it gets much easier."*).
2. **Visual-First Explanation:** Every concept leads with a clear visual (an interactive mini-simulator, a clean side-by-side Publisher-vs-Word diagram, or an annotated Word UI graphic) before explaining the steps.
3. **Always Show Both Ways to Find It:** Beginners often forget whether an option lives on the Ribbon or in a Right-Click menu. Every task shows a consistent **"Where to Find It"** card with:
   - **Ribbon Path** (with a reminder when a contextual tab like `Picture Format` or `Shape Format` only appears *after* clicking the object)
   - **Right-Click / On-Object Path** (Right-click menu and/or the floating **Layout Options** arch icon)
4. **Low Cognitive Load:** One concept per lesson, short 3–5 step instructions, plain English paired with Word's exact button labels in distinct UI badges, and zero popups, sign-up prompts, or visual clutter.
5. **No Dead Ends:** Every lesson ends with a quick **"Try It in 60 Seconds"** practice prompt, a **"Common Snag"** collapsible helper, and clear Previous / Next lesson buttons.

---

## 2. Information Architecture & Sitemap

The site follows a gentle, progressive learning path while also serving as a fast lookup desk reference.

```text
/ (Home)
├── /start-here/                     # Quick orientation + "How Word Thinks vs. Publisher"
├── /lessons/                        # Structured step-by-step curriculum (4 Modules, 14 Lessons)
│   ├── /01-how-text-flows/          # Module 1: The Big Mental Shift
│   ├── /02-show-hidden-clues/       # ¶ Formatting Marks, Rulers, Gridlines & Anchors
│   ├── /03-finding-the-controls/    # Contextual Ribbon Tabs, Right-Click & Layout Icon
│   ├── /04-text-wrapping/           # Module 2: Placing Pictures & Text Boxes
│   ├── /05-anchors-and-positioning/ # Move with Text vs. Fix Position on Page
│   ├── /06-text-boxes-and-margins/  # Simple Text Boxes, Internal Margins & Linking Boxes
│   ├── /07-cropping-and-resizing/   # Aspect Ratio, Cropping, Crop-to-Shape & Reset
│   ├── /08-borders-and-fills/       # Module 3: Styling & Arranging Objects
│   ├── /09-align-and-distribute/    # Align, Distribute, Align to Page vs. Margin & Smart Guides
│   ├── /10-grouping-and-layering/   # Grouping (+ the In-Line gotcha), Front/Back & Selection Pane
│   ├── /11-page-borders-and-setup/  # Page Borders, Margins, Orientation & Columns
│   ├── /12-invisible-tables/        # Module 4: Publisher-Style Layouts Made Easy
│   ├── /13-headers-footers-pages/   # Replacing Publisher's Master Pages & Section Breaks
│   └── /14-printing-and-pdf/        # Saving as PDF & Avoiding Cut-Off Borders
├── /translator/                     # "Publisher → Word" Quick Lookup (Rosetta Stone)
├── /rescue/                         # "Why Did That Happen?" Visual Troubleshooting Guide
├── /projects/                       # Guided Mini-Projects (e.g., 1-Page Flyer, 2-Column Newsletter)
└── /cheat-sheet/                    # Print-friendly 1–2 page quick reference cards (@media print)
```

---

## 3. Comprehensive Curriculum Specification

### Module 1: The Big Shift (How Word Thinks)

| # | Lesson | Core Concepts Covered | Interactive / Visual Aid |
| :-: | :--- | :--- | :--- |
| **1** | **How Text Flows in Word** | The "Pinboard" (Publisher) vs. "River of Text" (Word) mental model. Why pressing `Enter` pushes things down. Difference between `Enter` (new paragraph), `Shift+Enter` (line break), and `Ctrl+Enter` (Page Break — instead of pressing Enter 15 times!). | Side-by-side animated/interactive SVG comparing Publisher's independent boxes vs. Word's flowing document stream. |
| **2** | **Turn On Your X-Ray Vision** | Three stress-saving switches to turn on immediately: **Show/Hide `¶`** (`Home` tab), **Ruler** (`View` tab), and **Gridlines / Alignment Guides** (`Layout` → `Align`). Recognizing paragraph marks (`¶`), page breaks, and blue object anchors (`⚓`). | Interactive toggle preview of a Word page with `¶` OFF vs. ON showing the hidden clues. |
| **3** | **Where Did the Buttons Go?** | Navigating Word's **three ways** to reach layout tools: (1) **Contextual Ribbon Tabs** (`Picture Format` and `Shape Format` — explaining why they vanish when you deselect!), (2) the floating **Layout Options** icon beside every picture/box, and (3) the **Right-Click** menu + **Format Picture / Format Shape** side pane. | Interactive Word interface hotspot diagram (click numbered pins to inspect Ribbon, Floating Icon, and Right-Click menu via native popovers). |

### Module 2: Placing Pictures & Text Boxes Without Fighting Word

| # | Lesson | Core Concepts Covered | Interactive / Visual Aid |
| :-: | :--- | :--- | :--- |
| **4** | **Text Wrapping Options** | Visual tour of all 7 options: **In Line with Text** (Word's tricky default — behaves like a giant letter!), **Square**, **Tight**, **Through**, **Top and Bottom**, **Behind Text**, and **In Front of Text**. Practical rule of thumb: *Start with **Square** for photos with text, or **In Front of Text** for Publisher-style freedom.* Bonus: **Edit Wrap Points** & **Distance from Text** (so text doesn't touch photo edges). | **Interactive Wrap Simulator:** Click any of the 7 wrap icons and watch live mock text immediately reflow around a sample photo with a plain-English tip for each mode. |
| **5** | **Move with Text vs. Fix Position on Page** | Demystifying the little **Anchor (`⚓`)** icon. Exact difference between **Move with text** (picture travels with its paragraph when you edit above it) and **Fix position on page** (picture stays pinned to that spot on the page, like Publisher). Also covers **More Layout Options → Position** (Horizontal/Vertical alignment relative to Page vs. Margin) and **Lock anchor**. | **Interactive Anchor Simulator:** Toggle between *Move with text* and *Fix position on page*, then press **"Add a paragraph above"** to watch what happens to the photo. |
| **6** | **Text Boxes & Internal Margins** | Drawing a clean **Simple Text Box** (`Insert` → `Text Box` → `Draw Text Box`, ignoring the cluttered templates). Finding **Internal Margins** (`Right-click border` → `Format Shape` → `Text Options` → `Text Box` icon → Left/Right/Top/Bottom margins — plus Vertical Alignment and "Resize shape to fit text"). **Linking Text Boxes** (`Shape Format` → `Create Link`) to overflow text from one box into another just like Publisher. | **Interactive Internal Margin Sandbox:** Choose *Tight (0 cm)*, *Word Default*, or *Roomy* (or adjust sliders) and watch text inside a box pull comfortably away from the border. |
| **7** | **Resizing & Cropping Photos Cleanly** | Always dragging **corner handles** (never side handles!) to prevent squished photos. Using **Crop**, **Crop to Shape** (circles, rounded rectangles), **Crop → Fill / Fit** (replacing Publisher's Picture Frame zoom/pan), and **Reset Picture** if something goes wrong. | Visual "Do vs. Don't" handle diagram + step-by-step Crop-to-Fill visual strip. |

### Module 3: Styling, Aligning & Organizing Your Page

| # | Lesson | Core Concepts Covered | Interactive / Visual Aid |
| :-: | :--- | :--- | :--- |
| **8** | **Borders (Lines) & Fills** | Styling shapes, text boxes, and pictures: **Shape Fill** (solid color, Eyedropper, **No Fill** for transparent boxes), **Shape Outline** (color, Weight/thickness, Dashes, **No Outline** to hide the default black box border!). Clarifying the common confusion between **Shape Outline** (box border) vs. **Paragraph Borders & Shading** (`Home` tab). | Live visual swatch showing a Text Box transforming from Word's default white-with-black-box into a clean borderless overlay or soft tinted callout card. |
| **9** | **Align, Distribute & Smart Guides** | Lining things up neatly without eyeballing it: selecting multiple objects (`Shift+Click` or `Ctrl+Click`), **Align Left / Center / Right / Top / Middle / Bottom**, **Distribute Horizontally / Vertically**, and the crucial hidden toggle: **Align to Page** vs. **Align to Margin** vs. **Align Selected Objects**. Plus using Word's green **Alignment Guides** and keyboard arrow nudging (`Ctrl + Arrow` for tiny nudges!). | **Interactive Align & Distribute Playground:** Three draggable/preset cards on a mini page with working *Align Top*, *Align Center*, *Distribute Evenly*, and *Align to Page vs. Selected* buttons. |
| **10** | **Grouping, Layering & the Selection Pane** | **Grouping** (`Ctrl+Click` items → `Shape Format` / `Picture Format` → `Group`, or Right-click → `Group`) so a photo and its caption move as one unit. Highlighting the **#1 Word Gotcha**: *Word grays out "Group" if any selected item is set to "In Line with Text"!* Plus **Bring Forward / Send Backward**, and opening the **Selection Pane** (`Select` → `Selection Pane`) to find and click items trapped "Behind Text". | Annotated visual showing the **Selection Pane** alongside overlapping layers, plus a clear visual checklist explaining why *Group* is grayed out. |
| **11** | **Page Borders & Page Setup** | Setting **Margins**, **Orientation** (Portrait/Landscape), **Paper Size**, and **Columns** (`Layout` tab). Adding **Page Borders** (`Design` → `Page Borders` → Box / Shadow / Art, Width, Color, *Apply to: Whole document vs. First page only*). Critical printing fix: `Options` → **Measure from: Text vs. Edge of page** so home printers don't chop off the bottom border! | Visual diagram illustrating *Edge of Page* (inside printer non-printable zone) vs. *Measure from Text* (safe print area). |

### Module 4: Publisher-Style Layouts the Easy Way

| # | Lesson | Core Concepts Covered | Interactive / Visual Aid |
| :-: | :--- | :--- | :--- |
| **12** | **The Secret Weapon: Invisible Tables** | Why a **borderless Table** is often far calmer than floating text boxes for newsletters, flyers, event schedules, and photo+caption grids. Creating a simple table, setting **No Border** (`Table Design` → `Borders`), turning on **View Gridlines** (`Table Layout` → `View Gridlines`) so you can still see the structure while editing, and disabling **AutoFit** (`Fixed Column Width`) so cells don't jump around. | Toggle button on a mock flyer showing *"What you see while editing (blue dashed gridlines)"* vs. *"What prints (clean invisible layout)"*. |
| **13** | **Replacing Master Pages (Headers, Footers & Sections)** | Publisher had **Master Pages** for repeating logos, page numbers, and backgrounds. In Word, use **Headers & Footers** (double-click top/bottom margin, tick **Different First Page** for title pages) and **Section Breaks** (`Layout` → `Breaks` → `Next Page` or `Continuous`) to mix 1-column banners with 2-column body text or mix Portrait & Landscape pages in one document. | Visual page-anatomy diagram comparing Publisher's Master Page to Word's Header/Footer layer + Section Break boundary. |
| **14** | **Printing & Saving Safely as PDF** | Why `.docx` layouts sometimes shift when opened on someone else's computer (missing fonts / different printer drivers). Step-by-step `File` → `Save a Copy` / `Export` → **PDF** so your carefully arranged layout is frozen identically for printing or emailing. | Simple 3-step visual export flowchart + Print Preview checklist. |

### Companion Reference Pages
- **Publisher → Word Translator (`/translator/`):** A clean, filterable table translating ~20 familiar Publisher habits to their exact Word equivalent (e.g., *Scratch area*, *Master Page*, *Picture Frame*, *Draw Text Box*, *Nudge*, *Baseline Guides*, *Booklet Fold*, *Send to Back*).
- **"Why Did That Happen?" Rescue Guide (`/rescue/`):** Problem-first collapsible cards organized by visual symptoms:
  1. *"My picture jumped onto the next page when I typed!"*
  2. *"The `Picture Format` or `Shape Format` tab disappeared!"*
  3. *"The `Group` button is grayed out!"*
  4. *"I put a picture Behind Text and now I can't click it!"*
  5. *"My text box has an ugly black line / white background!"*
  6. *"My text is squished right up against the edge of the box!"*
  7. *"My page border gets cut off at the bottom when I print!"*
  8. *"There's a stubborn blank extra page at the end of my document!"*
- **Guided Mini-Projects (`/projects/`):**
  - **Project 1:** *Make a 1-Page Community Flyer* (Page Border + Title Text Box + Square-wrapped Photo + Fixed-position Info Box + Save as PDF).
  - **Project 2:** *Make a 2-Column Newsletter* (Masthead + Continuous Section Break + 2 Columns + Linked Text Boxes or Borderless Table).
- **Printable Desk Cheat Sheets (`/cheat-sheet/`):** Clean `@media print` layouts for a 1-page *Wrap & Anchor Guide* and a 1-page *Where to Find Layout Controls* card.

---

## 4. Visual Theme & Aesthetic System

### Look & Feel: *"Calm Stationery"*
Clean, airy, light, approachable, and completely unintimidating — closer to a well-designed printed craft workbook than a software manual.

### Color Palette (WCAG AA/AAA Compliant)
All foreground/background pairs meet or exceed **4.5:1** for body text and **3:1** for UI boundaries, borders, and icons (`color` guide, WCAG 1.4.3 & 1.4.11).

| Token | Hex | Role & Contrast Notes |
| :--- | :--- | :--- |
| `--surface-page` | `#FAF9F6` | Warm paper off-white page background (reduces harsh screen glare). |
| `--surface-card` | `#FFFFFF` | Crisp elevated card background for steps, demos, and callouts. |
| `--surface-subtle` | `#F1F5F9` | Soft tint for UI breadcrumbs, code/menu pills, and table headers. |
| `--ink-primary` | `#1E293B` | Deep slate charcoal for body text (~14:1 contrast on `#FAF9F6`). |
| `--ink-secondary` | `#475569` | Muted slate for captions and secondary labels (~7:1 contrast on `#FFFFFF`). |
| `--border-ui` | `#94A3B8` | Clear non-text boundary color (~3:1+ on white) for inputs, buttons, and cards. |
| `--border-subtle` | `#CBD5E1` | Decorative dividers (never used alone to denote interactive boundaries). |
| `--accent-word` | `#1D4ED8` | Friendly Word-inspired blue for primary actions, links, and Ribbon path pills (~6.5:1 on white). |
| `--accent-publisher` | `#0F766E` | Calm Publisher-nod teal for *"Coming from Publisher"* callout boxes (~5.4:1 on white). |
| `--accent-tip` | `#B45309` | Warm amber for *"Watch Out / Common Gotcha"* callouts (paired with warning icon, ~5.0:1 on white). |
| `--accent-success` | `#15803D` | Soft botanical green for *"Try It"* / *"Good Practice"* badges (paired with checkmark icon). |

- **Never Color Alone (WCAG 1.4.1):** Every callout (*Coming from Publisher*, *Watch Out*, *Tip*, *Try It*), active nav link, and simulator state pairs color with an explicit icon and/or text label and border/underline treatment.
- **Forced Colors Mode (Windows High Contrast):** Define `@media (forced-colors: active)` fallbacks using system keywords (`Canvas`, `CanvasText`, `LinkText`, `Highlight`, `ButtonText`) and explicit `border`/`outline` treatments instead of relying on `box-shadow` or gradients (`color` guide).
- **Theme Policy:** Strictly **light mode** (`color-scheme: light`) to mirror the familiar paper-page workspace of Microsoft Publisher and Word and keep the interface calm and predictable, while honoring `@media (forced-colors: active)` for Windows High Contrast Mode.

### Typography (`typography` guide)
- **Font Stack:** Clean, open, humanist sans-serif with unmistakable letterforms (e.g., **Atkinson Hyperlegible Next** or **Plus Jakarta Sans** / **Inter** for headings + **Source Sans 3** or system UI humanist sans for body — self-hosted `.woff2` with `font-display: swap` so there is zero third-party tracking or layout shift).
- **Sizing & Units:** Strictly `rem` / `em` (never `px` for `font-size`) so user browser font-size settings are honored.
  - Base body text: **`1.125rem` (18px equivalent)** — slightly larger than typical websites for effortless reading.
  - Fluid headings via `clamp()`, keeping maximum size `<= 2.5 × minimum` (e.g., `h1: clamp(1.75rem, 1.3rem + 1.8vw, 2.75rem)`) so 200% browser zoom always works cleanly (WCAG 1.4.4).
  - Unitless `line-height: 1.6` for prose (`1.25` for headings).
- **Measure & Wrapping:**
  - Cap prose blocks at `max-width: 60ch` (~70–80 characters per line).
  - Never use `text-align: justify`; always use `text-align: start`.
  - Apply `text-wrap: balance` selectively on headings (`h1`–`h3`, `th`) — never on bordered boxes or `*`.
  - Apply `text-wrap: pretty` on body `<p>` elements to prevent awkward single-word orphans.
  - Never set fixed `height` / `block-size` on buttons, tabs, badges, or cards — use `min-block-size` so WCAG 1.4.12 text-spacing overrides never clip text.

---

## 5. Modern Web Platform & UX Architecture (`modern-web-guidance`)

The site is built as a **static Multi-Page Application (MPA) in Astro** with zero unnecessary client-side framework overhead. Interactive widgets use native HTML/CSS platform features first, with lightweight vanilla JS progressive enhancements and standards-compliant fallbacks.

### 5.1 Content-First Layout & Zero Noise (`content-first-noise-reduction`)
- **Zero Interruptions:** No newsletter modals, no cookie banners (no tracking cookies needed!), no auto-opening tooltips, and no floating chat widgets.
- **Compact Single-Row Sticky Header:** Kept strictly under `12%` of viewport height (`~3.75rem`).
- **Auto-Hide on Scroll Down:** Uses a CSS scroll-state container query (`html { container-type: scroll-state; }` + `@container scroll-state((scrolled: bottom) and (scrollable: top))`) to smoothly slide the header out of view while reading down, revealing it immediately on scroll up — while keeping `.top-bar:focus-within { transform: none; }` so keyboard users never lose focus. Includes a tiny passive-scroll fallback script gated by `!CSS.supports('container-type', 'scroll-state')` for Firefox and Safari, plus `:target { scroll-margin-top: 4.5rem; }` so anchor links never hide beneath the header.

### 5.2 Responsive Navigation Bar (`navbar`)
- **Single Semantic `<nav aria-label="Primary">` Tree:** No duplicated desktop/mobile menus.
- **Content-Aware Collapse (No Brittle Breakpoints):** Starts collapsed by default (works even without JavaScript) and promotes to inline wide layout (`.site-header.is-wide`) via `ResizeObserver` measuring `inner.scrollWidth <= inner.clientWidth`. This automatically adapts when a learner zooms text to 200%!
- **Native Popover Narrow Menu:** Uses `<button popovertarget="site-menu" popovertargetaction="toggle" aria-controls="site-menu">` paired with `<ul id="site-menu" popover="auto">` positioned via CSS Anchor Positioning (`inset-block-start: anchor(--menu-button bottom)`) preceded by a simple static offset fallback (`inset-block-start: 4.25rem`).
- **Current Page Indicator:** Uses `aria-current="page"` with a high-contrast underline/pill border (`>= 3:1` contrast, not color alone).
- **Popover Polyfill Fallback:** Conditionally lazy-loads `@oddbird/popover-polyfill` *only* when `!Object.hasOwn(HTMLElement.prototype, "popover")`, using `setAttribute()`/`removeAttribute()` (never the IDL property) and styling with `[popover]:is(:popover-open, .\:popover-open)`.

### 5.3 Expandable Tips, Troubleshooting & FAQs (`accordion`, `search-hidden-content`)
- **Native `<details>` & `<summary>`:** Used for *"Common Snags"*, *"Mac / Word Online Differences"*, and the *Rescue Guide* items.
- **Non-Exclusive by Default:** Avoid shared `name` attributes on troubleshooting/tip accordions so learners can keep two tips open side-by-side to compare them without content unexpectedly jumping out of view.
- **Find-in-Page (`Ctrl+F`) Support:** Native `<details>` keeps closed content discoverable via browser Find-in-Page automatically (unlike `display: none`). For any custom collapsible panel where `<details>` cannot be used, use `hidden="until-found"` with a `beforematch` listener and a feature-detected fallback (`!('onbeforematch' in HTMLElement.prototype)`).
- **Accessible Disclosure Markers & Headings:**
  - Never place `<h1>`–`<h6>` inside `<summary>` (screen readers like JAWS/TalkBack strip heading semantics inside `<summary>`).
  - Replace the default `::marker` with a `::before` masked chevron icon placed **immediately before** the summary label text (not pushed to the far right edge, so low-vision and screen-magnifier users can easily associate it).
- **Progressive Slide Animation:** Animate `details::details-content` using `interpolate-size: allow-keywords`, `contain: layout`, and `transition-behavior: allow-discrete` inside `@media (prefers-reduced-motion: no-preference)`. Unsupported browsers gracefully open/close cleanly without breakage.

### 5.4 Interactive Word UI Callout Hotspots (`position-aware-tooltips`)
- Annotated screenshots/SVGs of Word's Ribbon, Floating Layout Icon, and Right-Click menu place numbered `<button popovertarget="tip-N" aria-describedby="tip-N">` hotspot pins over key buttons.
- Each callout uses `popover="auto"` (implicit anchor connection via `popovertarget`), `position-area: block-start`, `position-try-fallbacks: flip-block`, and `container-type: anchored` so its directional arrow automatically flips via `@container anchored(fallback: flip-block)` (gated behind `@supports (container-type: anchored)`).
- **WCAG 2.4.11 Protection:** Ensure callout popovers never obscure neighboring interactive hotspot pins when keyboard focus advances, and dismiss cleanly on `Esc` or outside click.

### 5.5 Smooth Lesson-to-Lesson Navigation (`cross-document-transitions`)
- Astro generates fast static HTML pages; opting in to native **Cross-Document View Transitions** gives the smooth, calm feel of flipping pages in a handbook with zero SPA complexity:
  ```css
  @media (prefers-reduced-motion: no-preference) {
    @view-transition {
      navigation: auto;
    }
  }
  ```
- Optional subtle directional transitions (`next` / `previous` lesson) using `pagereveal` + `window.navigation?.activation`, degrading gracefully to instant standard MPA navigation in Firefox or when reduced motion is preferred.

### 5.6 Images, Diagrams & Performance (`optimize-image-priority`)
- Use Astro's built-in `astro:assets` (`<Image>` / `<Picture>`) to emit **AVIF + WebP** with explicit `width` and `height` attributes on every image (preventing Cumulative Layout Shift while reading).
- **Priority Rules:**
  - Single above-the-fold hero/lead illustration: `fetchpriority="high"` and **never** `loading="lazy"`.
  - Standard below-the-fold step screenshots: `loading="lazy"` **only** (omit `fetchpriority` so they load at normal priority when scrolled into view).
  - Images hidden inside popovers or secondary interactive tabs: `fetchpriority="low"` (plus `loading="lazy"` where appropriate).
- **Visual Asset Strategy:** Use **reasonably realistic, custom inline SVGs** that faithfully mirror Word's real visual cues (Ribbon tab strips, contextual `Picture Format` / `Shape Format` highlights, the floating Layout Options arch icon, wrap-style glyphs, blue anchor icon, selection handles, and right-click context menus) so learners immediately recognize them on their own screen while staying razor-sharp at 200% zoom. Keep Astro `<Image>` / `<Picture>` support ready if real screenshots are added later.

### 5.7 Accessibility Standards (`accessibility`)
- **Landmarks & Skip Link:** One `<main>`, labeled `<nav aria-label="Primary">` and `<nav aria-label="Lesson curriculum">`, `<aside>` for lesson Table of Contents / Quick Jump, and a `.visually-hidden` (visible on `:focus-within`) skip link targeting `<h1 id="content" tabindex="-1">`.
- **Generous Target Sizes:** All buttons, simulator controls, hotspot pins, and lesson nav links use `min-block-size: 2.75rem; min-inline-size: 2.75rem` (`44×44 CSS px`, exceeding WCAG 2.5.8's `24×24px` minimum — ideal for less-confident mouse users and touchscreens).
- **Clear Focus Rings:** High-contrast `3px solid` `:focus-visible` outline with `outline-offset: 3px`.
- **Media & SVG Accessibility:** Informative `alt` text (no *"Image of..."* prefixes, hyphenated filenames), `<figure>` + `<figcaption>` for complex diagrams, `role="img"` + `<title>` for meaningful inline SVGs, and `aria-hidden="true"` for decorative icons.
- **Interactive Simulators:** Full keyboard operability using native `<button>`, `<input type="radio">`, and `<input type="range">` controls, plus a single polite `aria-live="polite"` status sentence summarizing what changed in the visual demo (e.g., *"Text wrapping set to Square: text now flows cleanly around the rectangular edge of the photo."*).

---

## 6. Reusable Astro Component Library

| Component | Purpose |
| :--- | :--- |
| `BaseLayout.astro` | Semantic shell (`<html lang="en">`), unique front-loaded `<title>`, Skip Link, sticky auto-hiding header, View Transition CSS, print styles. |
| `LessonLayout.astro` | 2-column reading layout (collapsible/sticky Lesson Sidebar + `60ch` main content column) with module progress indicator and Prev/Next footer navigation. |
| `WhereToFindIt.astro` | Signature dual-path lookup card showing **Ribbon Path** (with contextual tab badge) and **Right-Click / Floating Icon Path**. |
| `PublisherCompare.astro` | Calm teal callout card: *"How you did it in Publisher → How it works in Word"*. |
| `StepList.astro` | Numbered, spacious visual step cards (`<ol>`) pairing 1 short action sentence with an inline SVG schematic or annotated screenshot. |
| `GotchaBox.astro` | Warm amber warning box (`<details>` or visible callout) with icon + plain-English explanation of common Word traps. |
| `MacNote.astro` | Collapsible native `<details>` diverging section (*"Using Word on a Mac?"*) shown wherever Mac menus, ribbon labels, or shortcuts (`Cmd` vs `Ctrl`) differ from Windows. |
| `TryItCard.astro` | Stateless green end-of-lesson 60-second practice box inviting the learner to try the concept in Word (no accounts, cookies, or `localStorage` state). |
| `UiHotspotMap.astro` | Reusable interactive Word Ribbon / Right-Click diagram with numbered `<button popovertarget>` pins and position-aware callout popovers. |
| `WrapSimulator.astro` | Interactive visual playground demonstrating all 7 Word text-wrapping modes live. |
| `AnchorSimulator.astro` | Interactive demo comparing *Move with text* vs. *Fix position on page* when paragraphs are added above. |
| `BoxMarginSimulator.astro` | Interactive demo showing Text Box internal margins, No Fill, and No Outline in real time. |
| `AlignSimulator.astro` | Interactive playground for Align Left/Center/Right, Distribute Evenly, and Align to Page vs. Selected Objects. |

---

## 7. Proposed Astro Project Structure

```text
publisher-to-word/
├── README.md                     # Project overview, getting started, build & static deployment guide
├── AGENTS.md                     # Agent guidelines & mandatory quality gate rules
├── SPEC.md                       # Master product, curriculum, design & technical specification
├── astro.config.mjs              # Static output, MDX integration, sitemap
├── eslint.config.mjs             # ESLint flat config (Astro, TypeScript, JSX-A11y)
├── .stylelintrc.mjs              # Stylelint config for CSS and Astro <style> blocks
├── package.json
├── docs/
│   ├── ARCHITECTURE.md           # System architecture, MPA design, tokens & modern-web-guidance patterns
│   ├── DEVELOPER_GUIDE.md        # Maintainer workflow, authoring lessons/SVGs, component conventions
│   └── TESTING_AND_QA.md         # Automated quality gate, verify-dist invariants & manual a11y test plan
├── scripts/
│   └── verify-dist.mjs           # Post-build static HTML, link integrity, landmark & SVG a11y verifier
├── public/
│   ├── favicon.svg
│   └── fonts/                    # Self-hosted WOFF2 fonts (optional / zero external requests)
└── src/
    ├── content.config.ts         # Astro Content Collections schema (lessons, rescue, projects)
    ├── content/
    │   ├── lessons/              # 14 MDX lessons with frontmatter (module, order, summary, wordTabs)
    │   ├── rescue/               # Troubleshooting entries for /rescue/
    │   └── projects/             # Guided mini-project walkthroughs
    ├── data/
    │   ├── curriculum.ts         # Ordered 4-Module, 14-Lesson master catalog & adjacency helpers
    │   └── translator.ts         # Structured Publisher → Word lookup data
    ├── layouts/
    │   ├── BaseLayout.astro
    │   └── LessonLayout.astro
    ├── components/
    │   ├── nav/                  # SiteHeader, SiteFooter, LessonSidebar, PrevNextNav
    │   ├── teaching/             # WhereToFindIt, PublisherCompare, StepList, GotchaBox, MacNote, TryItCard
    │   └── interactive/          # WrapSimulator, AnchorSimulator, BoxMarginSimulator, AlignSimulator, UiHotspotMap
    ├── styles/
    │   ├── tokens.css            # Color, spacing, radius, typography custom properties + forced-colors
    │   ├── base.css              # Reset, typography, focus-visible, visually-hidden, transitions
    │   ├── components.css        # Shared disclosure, popover, callout, breadcrumb styles
    │   └── print.css             # Clean @media print styling for cheat sheets & lessons
    └── pages/
        ├── index.astro
        ├── start-here.astro
        ├── lessons/
        │   ├── index.astro
        │   └── [...slug].astro
        ├── translator.astro
        ├── rescue.astro
        ├── projects/
        │   └── index.astro
        └── cheat-sheet.astro
```

---

## 8. Implementation Roadmap (Phased Delivery)

1. **Phase 1 — Foundation, Design System, Quality Gate & Core Documentation:** Scaffold Astro + MDX, implement `tokens.css` / `base.css` / `components.css` / `print.css`, accessible `BaseLayout`, adaptive `SiteHeader` (`navbar` + scroll-state hiding), `LessonLayout`, automated 5-step Quality Gate (`npm run quality` + pre-commit hook), and foundational project documentation (`README.md`, `docs/ARCHITECTURE.md`, `docs/DEVELOPER_GUIDE.md`, `docs/TESTING_AND_QA.md`).
2. **Phase 2 — Core Teaching Components & Interactive Simulators:** Build `WhereToFindIt`, `PublisherCompare`, `StepList`, `GotchaBox`, `MacNote`, `TryItCard`, `UiHotspotMap`, and the 4 visual simulators (*Wrap*, *Anchor/Position*, *Text Box Internal Margins*, *Align & Distribute*).
3. **Phase 3 — Full Curriculum Content (Modules 1–4):** Author all 14 visual lessons with crisp inline SVG diagrams (and slots/guidelines for optional real Word screenshots if desired).
4. **Phase 4 — Reference Tools:** Expand the *Publisher → Word Translator*, *"Why Did That Happen?" Rescue Guide*, *Printable Cheat Sheets*, and *Guided Mini-Projects*.
5. **Phase 5 — Verification & Accessibility Audit:** Test keyboard-only navigation, 200% zoom reflow (`320px` viewport), `Ctrl+F` search inside collapsed troubleshooting cards, Windows Forced Colors Mode, print preview, and Lighthouse/axe-core audits.

---

## 9. Confirmed Project Decisions

1. **Visual Illustrations:** Use **reasonably realistic custom inline SVG diagrams & Word UI schematics** (faithfully depicting Word's Ribbon, Layout Options arch icon, handles, anchors, and right-click menus) so they stay crisp at any zoom and immediately recognizable in Word.
2. **Word Platform Coverage:** Primary focus on **Word for Windows (Microsoft 365 desktop)**, with dedicated collapsible **Mac diverging sections** (`MacNote.astro`) wherever Mac menus, dialog paths, or shortcuts differ.
3. **Color Mode:** **Light mode only** (`color-scheme: light`), reflecting the familiar paper-page feel of Publisher and Word, with full `@media (forced-colors: active)` support for Windows High Contrast users.
4. **Stateless Pages:** **No progress checkboxes or `localStorage` tracking** at this stage — pages remain completely stateless, fast, and uncluttered.
5. **Browser Support Policy:** Standard Baseline + the lightweight progressive fallbacks defined in Section 5 (covering modern Chrome, Edge, Firefox, and Safari).

---

## 10. Documentation & Quality Assurance Specification

To keep the project maintainable and approachable for every stakeholder group, the repository maintains a structured documentation suite alongside its automated quality gate:

### 10.1 Stakeholder Documentation Map

| Document | Primary Audience | Scope & Responsibilities |
| :--- | :--- | :--- |
| **`README.md`** | Developers, Administrators / Installers, End Users | Project mission, live route overview, local development quick start, build commands, static hosting/deployment guide (`dist/`), and end-user offline/printing tips. |
| **`docs/ARCHITECTURE.md`** | System Architects, UI/UX Designers | Astro static MPA architecture, Content Collections + Curriculum data model, *Calm Stationery* design token specification, Forced Colors support, and `modern-web-guidance` implementation patterns. |
| **`docs/DEVELOPER_GUIDE.md`** | Developers, Content Authors, Maintainers | Day-to-day workflow, how to add/unlock MDX lessons, authoring accessible inline SVG Word diagrams, CSS/Stylelint conventions, and phased component architecture. |
| **`docs/TESTING_AND_QA.md`** | Testers, QA Engineers, Contributors | Detailed breakdown of the 5-step `npm run quality` gate, `scripts/verify-dist.mjs` HTML assertions, and the manual accessibility/reflow/print testing checklist. |
| **`AGENTS.md`** | AI Coding Agents, Contributors | Workspace rules and mandatory pre-commit quality gate enforcement. |

### 10.2 Automated Quality Gate (`npm run quality`)

Every code or content change must pass the 5-step automated quality gate (enforced via `.git/hooks/pre-commit`):

1. **`npm run check` (`astro check`):** Validates TypeScript types, `.astro` component props, and Content Collection schemas.
2. **`npm run lint:eslint` (`eslint .`):** Runs `eslint-plugin-astro` and `eslint-plugin-jsx-a11y-x` across `.astro`, `.ts`, and `.mjs` files.
3. **`npm run lint:stylelint` (`stylelint "src/**/*.{css,astro}"`):** Validates CSS rules and modern syntax across global stylesheets and scoped `<style>` blocks.
4. **`npm run build` + `npm run verify:dist` (`node scripts/verify-dist.mjs`):** Compiles static HTML to `dist/` and audits every rendered page for:
   - Zero broken internal links (`href`) or missing `#anchor` targets
   - Single `<main id="content">`, single `<h1>`, and skip-link presence
   - Zero headings (`<h1>`–`<h6>`) nested inside `<summary>`
   - Valid SVG accessibility (`aria-hidden="true"` or `role="img"` + `<title>`/`aria-label`) and `<img>` `alt` text
   - Valid `[popovertarget]` ID matching and zero positive `tabindex` attributes
5. **`npm run verify:mwg` (`modern-web-guidance legacy-scan src --json`):** Confirms zero legacy web platform anti-patterns in `src/`.
