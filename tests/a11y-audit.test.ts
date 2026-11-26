import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import axe from 'axe-core';
import { JSDOM } from 'jsdom';
import { getHtmlFiles, fileToRoute } from '../scripts/verify-dist.mjs';

const distDir = path.resolve(process.cwd(), 'dist');

describe('Accessibility & WCAG 2.2 AA Audit Suite (axe-core + jsdom)', () => {
  const htmlFiles = fs.existsSync(distDir) ? getHtmlFiles(distDir) : [];

  it('verifies that dist/ contains all 26 compiled HTML pages', () => {
    expect(htmlFiles.length).toBe(26);
  });

  describe('axe-core automated WCAG standards scan', () => {
    for (const filePath of htmlFiles) {
      const route = fileToRoute(filePath, distDir);

      it(`has 0 WCAG 2.0/2.1/2.2 AA violations on route: ${route}`, async () => {
        const html = fs.readFileSync(filePath, 'utf-8');
        const dom = new JSDOM(html, { runScripts: 'outside-only' });

        const results = await axe.run(dom.window.document.documentElement, {
          runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'],
          },
        });

        if (results.violations.length > 0) {
          const summary = results.violations.map(v => ({
            id: v.id,
            impact: v.impact,
            description: v.description,
            nodes: v.nodes.map(n => n.html),
          }));
          expect.fail(`axe-core violations found on ${route}:\n${JSON.stringify(summary, null, 2)}`);
        }

        expect(results.violations).toHaveLength(0);
      });
    }
  });

  describe('Design Token Integrity Audit', () => {
    it('verifies that every CSS var(--*) token used in src/ is declared in tokens.css or component styles', () => {
      const tokensFile = path.resolve(process.cwd(), 'src/styles/tokens.css');
      const tokensContent = fs.readFileSync(tokensFile, 'utf-8');

      // Extract all defined custom properties in tokens.css
      const declaredTokens = new Set<string>();
      const tokenDefRegex = /(--[\w-]+)\s*:/g;
      let defMatch: RegExpExecArray | null;
      while ((defMatch = tokenDefRegex.exec(tokensContent)) !== null) {
        declaredTokens.add(defMatch[1]);
      }

      // Also allow dynamic / locally declared scoped CSS properties
      const locallyScopedProperties = new Set<string>([
        '--pin-left',
        '--pin-top',
        '--popover-left',
        '--popover-top',
        '--box-margin',
      ]);

      // Scan all .astro and .css files in src/
      function scanDirForCssVarUsages(dir: string): { file: string; token: string }[] {
        let usages: { file: string; token: string }[] = [];
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            usages = usages.concat(scanDirForCssVarUsages(fullPath));
          } else if (entry.name.endsWith('.astro') || entry.name.endsWith('.css')) {
            const content = fs.readFileSync(fullPath, 'utf-8');

            // Collect any component-local property definitions (e.g. style blocks defining :root or local vars)
            const localDefs = new Set<string>();
            let localDefMatch: RegExpExecArray | null;
            const localRegex = /(--[\w-]+)\s*:/g;
            while ((localDefMatch = localRegex.exec(content)) !== null) {
              localDefs.add(localDefMatch[1]);
            }

            const varUsageRegex = /var\(\s*(--[\w-]+)(?:\s*,[^)]+)?\)/g;
            let usageMatch: RegExpExecArray | null;
            while ((usageMatch = varUsageRegex.exec(content)) !== null) {
              const token = usageMatch[1];
              if (!declaredTokens.has(token) && !locallyScopedProperties.has(token) && !localDefs.has(token)) {
                usages.push({ file: path.relative(process.cwd(), fullPath), token });
              }
            }
          }
        }
        return usages;
      }

      const undeclaredUsages = scanDirForCssVarUsages(path.resolve(process.cwd(), 'src'));
      if (undeclaredUsages.length > 0) {
        expect.fail(
          `Undeclared CSS custom properties found:\n` +
          undeclaredUsages.map(u => `  ${u.file}: ${u.token}`).join('\n')
        );
      }

      expect(undeclaredUsages).toHaveLength(0);
    });
  });
});
