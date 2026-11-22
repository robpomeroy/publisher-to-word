import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, it, expect, vi } from 'vitest';
import { parseHTML } from 'linkedom';
import {
  getHtmlFiles,
  fileToRoute,
  extractDocumentIds,
  auditHeadings,
  auditLandmarks,
  auditSkipLink,
  auditSummaryHeadings,
  auditPositiveTabindex,
  auditSvgAccessibility,
  auditImageAccessibility,
  auditPopoverTargets,
  auditLinks,
  auditProvenanceLink,
  auditLanguage,
  auditBritishSpelling,
  auditDocument,
  runDistVerification
} from '../scripts/verify-dist.mjs';

describe('Dist HTML Verification (scripts/verify-dist.mjs)', () => {
  describe('File and Route Utilities', () => {
    it('fileToRoute converts paths to canonical URL paths', () => {
      expect(fileToRoute(path.join('dist', 'index.html'), 'dist')).toBe('/');
      expect(fileToRoute(path.join('dist', 'lessons', 'index.html'), 'dist')).toBe('/lessons');
      expect(fileToRoute(path.join('dist', 'start-here.html'), 'dist')).toBe('/start-here');
    });

    it('extractDocumentIds collects all element IDs into a Set', () => {
      const { document } = parseHTML('<main id="content"><h1 id="title">T</h1><div id="box"></div></main>');
      const ids = extractDocumentIds(document);
      expect(ids.has('content')).toBe(true);
      expect(ids.has('title')).toBe(true);
      expect(ids.has('box')).toBe(true);
      expect(ids.has('other')).toBe(false);
    });

    it('getHtmlFiles recursively collects HTML files', () => {
      const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'verify-dist-files-'));
      const subDir = path.join(tempDir, 'sub');
      fs.mkdirSync(subDir);
      fs.writeFileSync(path.join(tempDir, 'index.html'), '<html></html>');
      fs.writeFileSync(path.join(subDir, 'page.html'), '<html></html>');
      fs.writeFileSync(path.join(subDir, 'image.png'), '');

      const files = getHtmlFiles(tempDir);
      expect(files).toHaveLength(2);
      expect(files.some((f: string) => f.endsWith('index.html'))).toBe(true);
      expect(files.some((f: string) => f.endsWith('page.html'))).toBe(true);

      fs.rmSync(tempDir, { recursive: true, force: true });
    });
  });

  describe('auditHeadings', () => {
    it('passes for valid sequential headings starting with a single h1', () => {
      const { document } = parseHTML('<html><body><h1>Title</h1><h2>Section</h2><h3>Sub</h3></body></html>');
      const errors = auditHeadings(document, 'test.html');
      expect(errors).toHaveLength(0);
    });

    it('fails when <h1> is missing or duplicated', () => {
      const { document: noH1 } = parseHTML('<html><body><h2>Section</h2></body></html>');
      expect(auditHeadings(noH1, 'test.html')).toContain('[test.html] Missing <h1> element on page.');

      const { document: multiH1 } = parseHTML('<html><body><h1>One</h1><h1>Two</h1></body></html>');
      expect(auditHeadings(multiH1, 'test.html')).toContain('[test.html] Multiple <h1> elements found (2). Expected exactly 1.');
    });

    it('fails when heading levels are skipped', () => {
      const { document } = parseHTML('<html><body><h1>Title</h1><h3>Skipped to H3</h3></body></html>');
      expect(auditHeadings(document, 'test.html')).toContain('[test.html] Non-sequential heading hierarchy: <h1> followed directly by <h3>.');
    });
  });

  describe('auditLandmarks', () => {
    it('passes for a single <main id="content">', () => {
      const { document } = parseHTML('<html><body><main id="content"><h1>Title</h1></main></body></html>');
      expect(auditLandmarks(document, 'test.html')).toHaveLength(0);
    });

    it('fails when <main> is missing, duplicated, or lacks id="content"', () => {
      const { document: noMain } = parseHTML('<html><body><h1>Title</h1></body></html>');
      expect(auditLandmarks(noMain, 'test.html')).toContain('[test.html] Missing <main> landmark.');

      const { document: multiMain } = parseHTML('<html><body><main id="content"></main><main></main></body></html>');
      expect(auditLandmarks(multiMain, 'test.html')).toContain('[test.html] Multiple <main> landmarks found. Expected exactly 1.');

      const { document: wrongId } = parseHTML('<html><body><main id="main"><h1>Title</h1></main></body></html>');
      expect(auditLandmarks(wrongId, 'test.html')).toContain('[test.html] <main> element must have id="content" for skip-link target.');
    });
  });

  describe('auditSkipLink', () => {
    it('validates presence of skip link to #content', () => {
      const { document: valid } = parseHTML('<a href="#content">Skip</a>');
      expect(auditSkipLink(valid, 'test.html')).toHaveLength(0);

      const { document: invalid } = parseHTML('<a href="#main">Skip</a>');
      expect(auditSkipLink(invalid, 'test.html')).toContain('[test.html] Missing skip link to "#content".');
    });
  });

  describe('auditSummaryHeadings', () => {
    it('flags headings nested inside <summary>', () => {
      const { document: bad } = parseHTML('<details><summary><h2>Heading in Summary</h2></summary><p>Content</p></details>');
      expect(auditSummaryHeadings(bad, 'test.html')).toHaveLength(1);

      const { document: good } = parseHTML('<details><summary>Plain Summary Text</summary><p>Content</p></details>');
      expect(auditSummaryHeadings(good, 'test.html')).toHaveLength(0);
    });
  });

  describe('auditPositiveTabindex', () => {
    it('flags positive tabindex values but allows 0 and -1', () => {
      const { document: bad } = parseHTML('<button tabindex="2">Bad</button>');
      expect(auditPositiveTabindex(bad, 'test.html')).toContain('[test.html] Disallowed positive tabindex="2". Use tabindex="0" or "-1".');

      const { document: good } = parseHTML('<button tabindex="0">Good</button><div tabindex="-1">Focussable</div>');
      expect(auditPositiveTabindex(good, 'test.html')).toHaveLength(0);
    });
  });

  describe('auditSvgAccessibility', () => {
    it('passes for decorative SVGs with aria-hidden="true"', () => {
      const { document } = parseHTML('<svg aria-hidden="true"><path d="" /></svg>');
      expect(auditSvgAccessibility(document, 'test.html')).toHaveLength(0);
    });

    it('passes for informative SVGs with role="img" and <title> or aria-label', () => {
      const { document: titleDoc } = parseHTML('<svg role="img"><title>Diagram of flow</title><path d="" /></svg>');
      expect(auditSvgAccessibility(titleDoc, 'test.html')).toHaveLength(0);

      const { document: labelDoc } = parseHTML('<svg role="img" aria-label="Visual icon"><path d="" /></svg>');
      expect(auditSvgAccessibility(labelDoc, 'test.html')).toHaveLength(0);
    });

    it('fails for SVGs without accessibility attributes', () => {
      const { document } = parseHTML('<svg><path d="" /></svg>');
      expect(auditSvgAccessibility(document, 'test.html')).toHaveLength(1);
    });
  });

  describe('auditImageAccessibility', () => {
    it('flags missing alt attributes and clichéd alt prefixes', () => {
      const { document: noAlt } = parseHTML('<img src="test.png">');
      expect(auditImageAccessibility(noAlt, 'test.html')).toContain('[test.html] <img> tag is missing an alt attribute.');

      const { document: cliche } = parseHTML('<img src="test.png" alt="Image of ribbon toolbar">');
      expect(auditImageAccessibility(cliche, 'test.html')).toContain('[test.html] Clichéd alt text prefix "Image of ribbon toolbar". Avoid "Image of..." or "Picture of...".');

      const { document: good } = parseHTML('<img src="test.png" alt="Ribbon toolbar layout">');
      expect(auditImageAccessibility(good, 'test.html')).toHaveLength(0);
    });
  });

  describe('auditPopoverTargets', () => {
    it('verifies popovertarget matches existing element ID', () => {
      const ids = new Set(['my-menu']);
      const { document: valid } = parseHTML('<button popovertarget="my-menu">Open</button>');
      expect(auditPopoverTargets(valid, 'test.html', ids)).toHaveLength(0);

      const { document: invalid } = parseHTML('<button popovertarget="missing-id">Open</button>');
      expect(auditPopoverTargets(invalid, 'test.html', ids)).toContain('[test.html] popovertarget="missing-id" does not match any element ID on the page.');
    });
  });

  describe('auditLinks', () => {
    it('flags empty href="" attributes', () => {
      const { document } = parseHTML('<a href="">Empty</a>');
      const errors = auditLinks(document, 'test.html', '/', new Map(), new Set());
      expect(errors).toContain('[test.html] Found empty href="" attribute on <a> tag.');
    });

    it('validates in-page anchor fragments against registered IDs', () => {
      const ids = new Set(['section-1']);
      const { document } = parseHTML('<a href="#section-1">Good</a><a href="#missing">Bad</a>');
      const errors = auditLinks(document, 'test.html', '/', new Map(), ids);
      expect(errors).toContain('[test.html] Broken in-page link "#missing": element #missing not found.');
    });

    it('validates cross-page internal links and hashes', () => {
      const routeMap = new Map([
        ['/lessons', { ids: new Set(['module-1']) }]
      ]);
      const { document } = parseHTML(`
        <a href="/lessons#module-1">Valid Page and Hash</a>
        <a href="/lessons#missing-hash">Missing Hash</a>
        <a href="/non-existent">Missing Page</a>
        <a href="https://external.com">External</a>
        <a href="mailto:test@example.com">Mailto</a>
      `);
      const errors = auditLinks(document, 'test.html', '/', routeMap, new Set());
      expect(errors).toContain('[test.html] Broken internal link "/lessons#missing-hash": element #missing-hash not found on "/lessons".');
      expect(errors).toContain('[test.html] Broken internal link "/non-existent": route "/non-existent" does not exist.');
      expect(errors).toHaveLength(2);
    });
  });

  describe('auditProvenanceLink and auditLanguage', () => {
    it('validates provenance link to https://pomeroy.me/about/', () => {
      const { document: valid } = parseHTML('<a href="https://pomeroy.me/about/">About</a>');
      expect(auditProvenanceLink(valid, 'test.html')).toHaveLength(0);

      const { document: invalid } = parseHTML('<a href="/about">About</a>');
      expect(auditProvenanceLink(invalid, 'test.html')).toContain('[test.html] Missing author provenance link to "https://pomeroy.me/about/".');
    });

    it('validates root html lang="en-GB"', () => {
      const { document: valid } = parseHTML('<html lang="en-GB"></html>');
      expect(auditLanguage(valid, 'test.html')).toHaveLength(0);

      const { document: invalid } = parseHTML('<html lang="en-US"></html>');
      expect(auditLanguage(invalid, 'test.html')).toContain('[test.html] Expected root element <html lang="en-GB">.');
    });
  });

  describe('auditBritishSpelling', () => {
    it('flags US English spellings in rendered copy', () => {
      const { document } = parseHTML('<body><p>We need to organize the toolbar and fix the gray color.</p></body>');
      const errors = auditBritishSpelling(document, 'test.html');
      expect(errors).toHaveLength(1);
      expect(errors[0]).toContain('organize');
    });

    it('ignores code snippets containing US English identifiers', () => {
      const { document } = parseHTML('<body><p>Clean text</p><pre><code>const color = "gray"; function organize() {}</code></pre></body>');
      const errors = auditBritishSpelling(document, 'test.html');
      expect(errors).toHaveLength(0);
    });
  });

  describe('auditDocument and runDistVerification', () => {
    const validHtml = `
      <!DOCTYPE html>
      <html lang="en-GB">
        <body>
          <a href="#content">Skip to content</a>
          <main id="content">
            <h1>Valid Page Title</h1>
            <p>Clean British English copy without US spellings.</p>
            <a href="https://pomeroy.me/about/">About Author</a>
          </main>
        </body>
      </html>
    `;

    it('auditDocument aggregates all audits and passes cleanly for valid HTML', () => {
      const { document } = parseHTML(validHtml);
      const ids = extractDocumentIds(document);
      const routeMap = new Map([['/', { ids }]]);
      const errors = auditDocument(document, 'index.html', '/', routeMap, ids);
      expect(errors).toHaveLength(0);
    });

    it('runDistVerification audits a directory of HTML files and succeeds', () => {
      const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'verify-dist-run-'));
      fs.writeFileSync(path.join(tempDir, 'index.html'), validHtml);

      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      expect(() => runDistVerification(tempDir)).not.toThrow();
      logSpy.mockRestore();

      fs.rmSync(tempDir, { recursive: true, force: true });
    });

    it('runDistVerification handles non-existent directory by exiting', () => {
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {
        throw new Error('process.exit(1)');
      }) as unknown as (code?: string | number | null | undefined) => never);
      const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => runDistVerification('/non/existent/path')).toThrow('process.exit(1)');

      exitSpy.mockRestore();
      errSpy.mockRestore();
    });

    it('runDistVerification exits if audit errors are discovered', () => {
      const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'verify-dist-err-'));
      fs.writeFileSync(path.join(tempDir, 'index.html'), '<html><body>Invalid</body></html>');

      const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {
        throw new Error('process.exit(1)');
      }) as unknown as (code?: string | number | null | undefined) => never);
      const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => runDistVerification(tempDir)).toThrow('process.exit(1)');

      exitSpy.mockRestore();
      errSpy.mockRestore();
      fs.rmSync(tempDir, { recursive: true, force: true });
    });
  });
});
