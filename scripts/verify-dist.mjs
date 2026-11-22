import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseHTML } from 'linkedom';

export function getHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      results = results.concat(getHtmlFiles(filePath));
    } else if (file.endsWith('.html')) {
      results.push(filePath);
    }
  }
  return results;
}

export function fileToRoute(filePath, distDir) {
  const rel = path.relative(distDir, filePath).replace(/\\/g, '/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return '/' + rel.replace(/\/index\.html$/, '');
  return '/' + rel.replace(/\.html$/, '');
}

export function extractDocumentIds(document) {
  const ids = new Set();
  const elements = document.querySelectorAll('[id]');
  for (const el of elements) {
    const id = el.getAttribute('id');
    if (id) ids.add(id);
  }
  return ids;
}

export function auditHeadings(document, relFile) {
  const errors = [];
  const h1s = document.querySelectorAll('h1');
  if (h1s.length === 0) {
    errors.push(`[${relFile}] Missing <h1> element on page.`);
  } else if (h1s.length > 1) {
    errors.push(`[${relFile}] Multiple <h1> elements found (${h1s.length}). Expected exactly 1.`);
  }

  const headings = [...document.querySelectorAll('h1, h2, h3, h4, h5, h6')];
  let prevLevel = 0;
  for (const el of headings) {
    const level = parseInt(el.tagName.slice(1), 10);
    if (prevLevel > 0 && level > prevLevel + 1) {
      errors.push(`[${relFile}] Non-sequential heading hierarchy: <h${prevLevel}> followed directly by <h${level}>.`);
    }
    prevLevel = level;
  }
  return errors;
}

export function auditLandmarks(document, relFile) {
  const errors = [];
  const mains = document.querySelectorAll('main');
  if (mains.length === 0) {
    errors.push(`[${relFile}] Missing <main> landmark.`);
  } else if (mains.length > 1) {
    errors.push(`[${relFile}] Multiple <main> landmarks found. Expected exactly 1.`);
  } else if (mains[0].getAttribute('id') !== 'content') {
    errors.push(`[${relFile}] <main> element must have id="content" for skip-link target.`);
  }
  return errors;
}

export function auditSkipLink(document, relFile) {
  const errors = [];
  const skipLink = document.querySelector('a[href="#content"]');
  if (!skipLink) {
    errors.push(`[${relFile}] Missing skip link to "#content".`);
  }
  return errors;
}

export function auditSummaryHeadings(document, relFile) {
  const errors = [];
  const headingsInsideSummary = document.querySelectorAll('summary h1, summary h2, summary h3, summary h4, summary h5, summary h6');
  if (headingsInsideSummary.length > 0) {
    errors.push(`[${relFile}] Found heading tag inside <summary>. JAWS/TalkBack drop headings inside summaries.`);
  }
  return errors;
}

export function auditPositiveTabindex(document, relFile) {
  const errors = [];
  const elementsWithTabindex = document.querySelectorAll('[tabindex]');
  for (const el of elementsWithTabindex) {
    const val = parseInt(el.getAttribute('tabindex') || '0', 10);
    if (val > 0) {
      errors.push(`[${relFile}] Disallowed positive tabindex="${val}". Use tabindex="0" or "-1".`);
    }
  }
  return errors;
}

export function auditSvgAccessibility(document, relFile) {
  const errors = [];
  const svgs = document.querySelectorAll('svg');
  for (const svg of svgs) {
    const isHidden = svg.getAttribute('aria-hidden') === 'true';
    const hasRoleImg = svg.getAttribute('role') === 'img';
    const hasAriaLabel = svg.hasAttribute('aria-label') || svg.hasAttribute('aria-labelledby');
    const hasTitle = svg.querySelector('title') !== null;

    if (!isHidden && !(hasRoleImg && (hasAriaLabel || hasTitle))) {
      errors.push(`[${relFile}] SVG must have aria-hidden="true" OR role="img" with <title> / aria-label.`);
    }
  }
  return errors;
}

export function auditImageAccessibility(document, relFile) {
  const errors = [];
  const imgs = document.querySelectorAll('img');
  for (const img of imgs) {
    if (!img.hasAttribute('alt')) {
      errors.push(`[${relFile}] <img> tag is missing an alt attribute.`);
      continue;
    }
    const altValue = img.getAttribute('alt') || '';
    if (/^(image of|picture of|photo of)\b/i.test(altValue.trim())) {
      errors.push(`[${relFile}] Clichéd alt text prefix "${altValue}". Avoid "Image of..." or "Picture of...".`);
    }
  }
  return errors;
}

export function auditPopoverTargets(document, relFile, ids) {
  const errors = [];
  const popoverTriggers = document.querySelectorAll('[popovertarget]');
  for (const trigger of popoverTriggers) {
    const targetId = trigger.getAttribute('popovertarget');
    if (targetId && !ids.has(targetId)) {
      errors.push(`[${relFile}] popovertarget="${targetId}" does not match any element ID on the page.`);
    }
  }
  return errors;
}

export function auditLinks(document, relFile, route, routeMap, ids) {
  const errors = [];
  const links = document.querySelectorAll('a');
  for (const link of links) {
    if (!link.hasAttribute('href') || link.getAttribute('href').trim() === '') {
      errors.push(`[${relFile}] Found empty href="" attribute on <a> tag.`);
      continue;
    }
    const href = link.getAttribute('href');

    // External / protocol links
    if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) {
      continue;
    }

    if (href.startsWith('#')) {
      const targetId = href.slice(1);
      if (targetId && !ids.has(targetId)) {
        errors.push(`[${relFile}] Broken in-page link "${href}": element #${targetId} not found.`);
      }
    } else {
      const currentUrl = new URL(route === '/' ? '/' : route + '/', 'https://example.com');
      const resolvedUrl = new URL(href, currentUrl);
      const normalizedPath = resolvedUrl.pathname.replace(/\/$/, '') || '/';
      const anchorPart = resolvedUrl.hash ? resolvedUrl.hash.slice(1) : '';

      let decodedAnchor = anchorPart;
      try {
        decodedAnchor = decodeURIComponent(anchorPart);
      } catch {
        // Fall back to raw anchor
      }

      const targetPage = routeMap.get(normalizedPath);
      if (!targetPage) {
        errors.push(`[${relFile}] Broken internal link "${href}": route "${normalizedPath}" does not exist.`);
      } else if (anchorPart && !targetPage.ids.has(anchorPart) && !targetPage.ids.has(decodedAnchor)) {
        errors.push(`[${relFile}] Broken internal link "${href}": element #${anchorPart} not found on "${normalizedPath}".`);
      }
    }
  }
  return errors;
}

export function auditProvenanceLink(document, relFile) {
  const errors = [];
  const authorLink = document.querySelector('a[href="https://pomeroy.me/about/"]');
  if (!authorLink) {
    errors.push(`[${relFile}] Missing author provenance link to "https://pomeroy.me/about/".`);
  }
  return errors;
}

export function auditLanguage(document, relFile) {
  const errors = [];
  const htmlEl = document.documentElement;
  if (!htmlEl || htmlEl.getAttribute('lang') !== 'en-GB') {
    errors.push(`[${relFile}] Expected root element <html lang="en-GB">.`);
  }
  return errors;
}

export function auditBritishSpelling(document, relFile) {
  const errors = [];
  const root = document.documentElement || document.body || document;
  const clone = root.cloneNode(true);

  // Remove code / style / script elements prior to spellcheck
  const codeNodes = clone.querySelectorAll('script, style, pre, code, kbd, samp');
  for (const node of codeNodes) {
    node.remove();
  }

  const visibleText = clone.textContent || '';
  const usEnglishMatches = visibleText.match(/\b(gray|grayed|organize|organizing|organization|organizations|specialized|recognize|summarize|practiced|behavior|behavioral|dialog)\b/gi);
  if (usEnglishMatches) {
    errors.push(`[${relFile}] Detected US English spelling(s) in rendered copy: ${[...new Set(usEnglishMatches)].join(', ')}. Use British English (e.g. grey, organise, specialised, dialogue).`);
  }
  return errors;
}

export function auditDocument(document, relFile, route, routeMap, ids) {
  return [
    ...auditHeadings(document, relFile),
    ...auditLandmarks(document, relFile),
    ...auditSkipLink(document, relFile),
    ...auditSummaryHeadings(document, relFile),
    ...auditPositiveTabindex(document, relFile),
    ...auditSvgAccessibility(document, relFile),
    ...auditImageAccessibility(document, relFile),
    ...auditPopoverTargets(document, relFile, ids),
    ...auditLinks(document, relFile, route, routeMap, ids),
    ...auditProvenanceLink(document, relFile),
    ...auditLanguage(document, relFile),
    ...auditBritishSpelling(document, relFile),
  ];
}

export function runDistVerification(distDir = path.resolve('dist')) {
  if (!fs.existsSync(distDir)) {
    console.error('Error: dist directory does not exist. Run "npm run build" first.');
    process.exit(1);
  }

  const htmlFiles = getHtmlFiles(distDir);
  console.log(`Auditing ${htmlFiles.length} rendered HTML files in ${path.relative(process.cwd(), distDir)}/...\n`);

  let errors = [];
  const routeMap = new Map();

  // Pass 1: Parse DOM & collect route IDs
  for (const file of htmlFiles) {
    const route = fileToRoute(file, distDir);
    const content = fs.readFileSync(file, 'utf-8');
    const { document } = parseHTML(content);
    const ids = extractDocumentIds(document);
    routeMap.set(route, { file, document, ids });
  }

  // Pass 2: Audit each page
  for (const [route, { file, document, ids }] of routeMap) {
    const relFile = path.relative(process.cwd(), file);
    const pageErrors = auditDocument(document, relFile, route, routeMap, ids);
    errors.push(...pageErrors);
  }

  if (errors.length > 0) {
    console.error(`❌ Dist Verification Failed (${errors.length} issue(s) found):\n`);
    for (const err of errors) {
      console.error(`  - ${err}`);
    }
    console.error('\nPlease fix the issues above before committing.');
    process.exit(1);
  } else {
    console.log('✅ Dist Verification Passed!');
    console.log(`   - Verified ${htmlFiles.length} rendered pages.`);
    console.log('   - 0 broken internal links or anchors.');
    console.log('   - 0 heading or landmark hierarchy violations.');
    console.log('   - 0 SVG / Image accessibility violations.');
    console.log('   - 0 popovertarget target mismatches.');
    console.log('   - Verified author provenance link (https://pomeroy.me/about/) on all pages.');
    console.log('   - Verified <html lang="en-GB"> and British English copy on all pages.\n');
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  runDistVerification();
}
