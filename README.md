# Publisher to Word

> **A calm, step-by-step visual transition guide helping former Microsoft Publisher users comfortably adapt to Microsoft Word.**

---

## 📖 About This Project

Microsoft Publisher was loved for its intuitive **pinboard (freeform canvas)** model: you drew a text box or dropped a picture anywhere on the sheet of paper, and it stayed exactly where you placed it.

Microsoft Word thinks completely differently: it operates as a **river of text**, where words, pictures, and shapes flow continuously from top to bottom. For visual learners and everyday computer users accustomed to Publisher, Word's layout behavior often feels unpredictable—pictures jump across page breaks, text boxes sprout unwanted black borders, and specialized formatting ribbon tabs vanish when you click away.

**Publisher to Word** bridges this mental gap. Created by [Rob Pomeroy](https://pomeroy.me/about/), it provides a reassuring, visual-first static tutorial website designed with low cognitive load, zero popups or distractions, and clear side-by-side comparisons of Publisher habits versus Word solutions.

---

## 🧭 Live Website Sections

| Section | Route | Purpose |
| :--- | :--- | :--- |
| **Home** | `/` | Welcoming overview with interactive visual comparison of Publisher's canvas vs. Word's text stream. |
| **Start Here** | `/start-here` | 5-minute orientation explaining the core mental shift and the 3 visual switches to turn on immediately in Word (Show/Hide `¶`, Ruler, Alignment Guides). |
| **Lessons** | `/lessons` | The structured 4-module, 14-lesson curriculum taking learners from basic text flow to multi-column publishing. |
| **Lesson 1** | `/lessons/01-how-text-flows` | The foundation: Understanding the river of text and why you should never press <kbd>Enter</kbd> 15 times to reach the next page. |
| **Translator** | `/translator` | Quick "Rosetta Stone" table translating familiar Publisher terms (*Scratch area*, *Picture Frame*, *Master Page*, *Nudge*) into their exact Word equivalent. |
| **Rescue Guide** | `/rescue` | Symptom-first troubleshooting guide (*"My picture jumped onto the next page!"*, *"The Group button is grayed out!"*, *"My border gets chopped off when printing!"*). |
| **Projects** | `/projects` | Guided mini-projects (e.g. 1-Page Event Flyer, 2-Column Newsletter) to practice layout skills from scratch. |
| **Cheat Sheet** | `/cheat-sheet` | Clean 1-page desk reference card optimized for `@media print` to keep beside your keyboard. |

---

## 👤 For Everyday Users

- **Visual-First Learning:** Every concept is explained visually before showing the numbered steps.
- **Both Ways to Find It:** Every lesson shows both the **Ribbon Path** (highlighting contextual tabs like `Picture Format`) and the **Right-Click / Floating Icon Path**.
- **Printer-Friendly:** Every page has clean print styling (`@media print`). Click the **"Print this Page"** button in the footer or press <kbd>Ctrl</kbd> + <kbd>P</kbd> (<kbd>Cmd</kbd> + <kbd>P</kbd> on Mac) to print a clean offline reference without web menus.
- **Keyboard & Accessibility Support:** High-contrast focus indicators (`:focus-visible`), skip links (`Skip to content`), large $44 \times 44\,\text{px}$ click targets, and native Windows Forced Colors Mode (High Contrast) compatibility.

---

## 💻 For Developers (Quick Start)

### Prerequisites
- **Node.js**: v20+ (v22+ LTS recommended)
- **npm**: v10+

### Local Setup

```sh
# 1. Clone the repository
git clone https://github.com/your-org/publisher-to-word.git
cd publisher-to-word

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Visit `http://localhost:4321` in your browser. Astro provides instant hot module reloading for `.astro`, `.mdx`, and `.css` files.

### Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Astro development server at `http://localhost:4321`. |
| `npm run build` | Compiles the production static website into `dist/`. |
| `npm run preview` | Serves the compiled `dist/` build locally for verification. |
| `npm run check` | Runs Astro & TypeScript diagnostics across all components and MDX files. |
| `npm run lint` | Runs both ESLint (`npm run lint:eslint`) and Stylelint (`npm run lint:stylelint`). |
| `npm run verify:dist` | Audits compiled HTML in `dist/` for zero broken links, landmark hierarchy, and SVG/image accessibility. |
| `npm run verify:mwg` | Runs Google's `modern-web-guidance` static analyzer against `src/`. |
| `npm run quality` | **Mandatory Quality Gate:** Runs `check`, `lint`, `build`, `verify:dist`, and `verify:mwg` in sequence. |

> **Note on Windows / WSL Environments:**  
> If working on Windows where repository directories reside on or traverse WSL UNC paths (e.g. `\\wsl.localhost\...`), `astro.config.mjs` sets `vite: { resolve: { preserveSymlinks: true } }` to ensure Rollup and Vite resolve paths smoothly without breaking symlink boundaries.

---

## 🚀 For System Administrators & Static Hosting

The website compiles to a **100% static Multi-Page Application (MPA)** in `dist/`. There are no server-side runtimes, no database connections, no cookies, and no third-party tracking scripts.

### Building for Production
```sh
npm run quality
```
This builds and validates the production output in `dist/`.

### Deployment Options

- **Nginx / Apache / IIS:** Copy the contents of `dist/` to your web root (e.g. `/var/www/html` or `C:\inetpub\wwwroot`). Enable gzip/brotli compression and standard caching headers for static assets in `_astro/`.
- **Cloudflare Pages / GitHub Pages / Netlify / Vercel:**
  - Build command: `npm run build`
  - Output directory: `dist`
  - Node version: `20` or higher
- **Clean URLs:** Astro outputs directories with `index.html` (e.g. `/start-here/index.html`), compatible out-of-the-box with all modern static hosts.

---

## 📚 Documentation Index

- **[SPEC.md](SPEC.md):** The master product specification, covering curriculum design, pedagogical principles, design token values, and modern web platform integrations.
- **[AGENTS.md](AGENTS.md):** Rules and mandatory quality gate requirements for AI coding assistants and contributors.
- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md):** Comprehensive technical architecture, Astro MPA design, data modeling, and `modern-web-guidance` platform patterns.
- **[docs/DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md):** Maintainer guide covering daily workflows, authoring lessons/SVGs, and component conventions.
- **[docs/TESTING_AND_QA.md](docs/TESTING_AND_QA.md):** Complete guide to the 5-step automated quality gate, post-build HTML verification, and manual accessibility testing.

---

## ✍️ Author & Provenance

Created and maintained by [Rob Pomeroy](https://pomeroy.me/about/) as a free, independent public educational guide to help everyday computer users adapt smoothly to Microsoft Word.

---

## ⚖️ Legal & Trademarks

Microsoft, Microsoft Word, and Microsoft Publisher are trademarks or registered trademarks of Microsoft Corporation in the United States and/or other countries. This project is an independent educational website and is neither affiliated with, nor authorized, sponsored, or endorsed by, Microsoft Corporation.
