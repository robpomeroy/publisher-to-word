# Agent Guidelines & Quality Gate

## Repository Overview
- **Project:** *Publisher to Word* — a calm, step-by-step visual tutorial website helping former Microsoft Publisher users adapt to Microsoft Word.
- **Tech Stack:** Static Multi-Page Application (MPA) built with Astro, MDX, and vanilla web platform APIs.
- **Design System:** *Calm Stationery* — strictly light-mode (`color-scheme: light`), warm paper background (`#FAF9F6`), high-contrast ink (`#1E293B`), bounded typography scales (`rem` and `clamp()`), and Windows Forced Colours Mode (`@media (forced-colors: active)`) support.
- **Standards:** Complies with Google's `modern-web-guidance` skill recommendations for accessibility, responsive navigation, native disclosures, and container queries.
- **Language & Spelling:** British English (`en-GB`) throughout all editorial copy, curriculum headings, UI explanations, and documentation. All rendered pages declare `<html lang="en-GB">`.

## Mandatory Quality Gate

Before completing any task or creating any commit, you **MUST** run the quality suite and ensure all checks pass with **0 errors and 0 warnings**:

```sh
npm run quality
```

The quality suite executes:
1. `astro check`: Validates TypeScript, `.astro` components, and Content Collection schemas.
2. `npm run lint`: Runs ESLint (`eslint .`) and Stylelint (`stylelint "src/**/*.{css,astro}"`) for code and CSS best practices.
3. `astro build`: Compiles static output into `dist/`.
4. `npm run verify:dist`: Custom static analysis script (`scripts/verify-dist.mjs`) auditing:
   - Zero broken internal links (`href`) or missing in-page `#anchor` targets.
   - Exact landmark invariants (single `<main id="content">`, single `<h1>` per page, sequential headings, no headings inside `<summary>`).
   - SVG accessibility (`aria-hidden="true"` or `role="img"` with `<title>`/`aria-label`) and image accessibility (`alt` without clichés).
   - Popover target integrity (`popovertarget` matches valid element ID).
   - No positive `tabindex` attributes.
5. `npm run verify:mwg`: Runs `modern-web-guidance legacy-scan src --json` to ensure no legacy web platform patterns are introduced.

## Implementation Rules
- **No unverified commits:** Never bypass the quality gate.
- **British English throughout:** Always use British English spellings (`en-GB`) across content, UI strings, and documentation (e.g. *colour*, *grey*, *organise*, *practise* [verb], *dialogue*).
- **No broken links:** If adding a lesson, companion page, or component, verify its route and anchor links resolve properly.
- **Accessible disclosures:** Always use native `<details class="disclosure">` with chevrons placed before the summary text. Never put `<h1>`–`<h6>` inside `<summary>`.
- **Target sizes:** Maintain `min-block-size: 2.75rem` and `min-inline-size: 2.75rem` (44×44px minimum) on interactive controls.
