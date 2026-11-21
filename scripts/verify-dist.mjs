import fs from 'node:fs';
import path from 'node:path';

const DIST_DIR = path.resolve('dist');

if (!fs.existsSync(DIST_DIR)) {
  console.error('Error: dist directory does not exist. Run "npm run build" first.');
  process.exit(1);
}

// 1. Collect all HTML files
function getHtmlFiles(dir) {
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

const htmlFiles = getHtmlFiles(DIST_DIR);
console.log(`Auditing ${htmlFiles.length} rendered HTML files in dist/...\n`);

let errors = [];
const routeMap = new Map(); // routePath -> Set of IDs on that page

// Helper to convert file path to route path
function fileToRoute(filePath) {
  const rel = path.relative(DIST_DIR, filePath).replace(/\\/g, '/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return '/' + rel.replace(/\/index\.html$/, '');
  return '/' + rel.replace(/\.html$/, '');
}

// Pass 1: Parse IDs and register routes
for (const file of htmlFiles) {
  const route = fileToRoute(file);
  const content = fs.readFileSync(file, 'utf-8');
  const ids = new Set();

  const idMatches = content.matchAll(/\sid=["']([^"']+)["']/g);
  for (const match of idMatches) {
    ids.add(match[1]);
  }

  routeMap.set(route, { file, content, ids });
}

// Pass 2: Verify each page
for (const [route, { file, content, ids }] of routeMap) {
  const relFile = path.relative(process.cwd(), file);

  // 1. Heading structure & sequential hierarchy
  const h1Matches = [...content.matchAll(/<h1\b[^>]*>/gi)];
  if (h1Matches.length === 0) {
    errors.push(`[${relFile}] Missing <h1> element on page.`);
  } else if (h1Matches.length > 1) {
    errors.push(`[${relFile}] Multiple <h1> elements found (${h1Matches.length}). Expected exactly 1.`);
  }

  const allHeadings = [...content.matchAll(/<h([1-6])\b[^>]*>/gi)].map(m => parseInt(m[1], 10));
  let prevLevel = 0;
  for (const level of allHeadings) {
    if (prevLevel > 0 && level > prevLevel + 1) {
      errors.push(`[${relFile}] Non-sequential heading hierarchy: <h${prevLevel}> followed directly by <h${level}>.`);
    }
    prevLevel = level;
  }

  // 2. Main landmark
  const mainMatches = [...content.matchAll(/<main\b([^>]*)>/gi)];
  if (mainMatches.length === 0) {
    errors.push(`[${relFile}] Missing <main> landmark.`);
  } else if (mainMatches.length > 1) {
    errors.push(`[${relFile}] Multiple <main> landmarks found. Expected exactly 1.`);
  } else {
    const mainAttrs = mainMatches[0][1];
    if (!mainAttrs.includes('id="content"')) {
      errors.push(`[${relFile}] <main> element must have id="content" for skip-link target.`);
    }
  }

  // 3. Skip link
  if (!content.includes('href="#content"')) {
    errors.push(`[${relFile}] Missing skip link to "#content".`);
  }

  // 4. Headings inside summary (forbidden by modern-web-guidance)
  const summaryMatches = content.match(/<summary\b[^>]*>[\s\S]*?<\/summary>/gi) || [];
  for (const summary of summaryMatches) {
    if (/<h[1-6]\b/i.test(summary)) {
      errors.push(`[${relFile}] Found heading tag inside <summary>. JAWS/TalkBack drop headings inside summaries.`);
    }
  }

  // 5. Positive tabindex check
  const positiveTabindex = content.match(/tabindex=["']([1-9][0-9]*)["']/i);
  if (positiveTabindex) {
    errors.push(`[${relFile}] Disallowed positive tabindex="${positiveTabindex[1]}". Use tabindex="0" or "-1".`);
  }

  // 6. SVG accessibility
  const svgMatches = content.matchAll(/<svg\b([^>]*)>([\s\S]*?)<\/svg>/gi);
  for (const match of svgMatches) {
    const attrs = match[1];
    const inner = match[2];
    const isHidden = /aria-hidden=["']true["']/i.test(attrs);
    const hasRoleImg = /role=["']img["']/i.test(attrs);
    const hasAriaLabel = /aria-label=["']/i.test(attrs) || /aria-labelledby=["']/i.test(attrs);
    const hasTitle = /<title\b/i.test(inner);

    if (!isHidden && !(hasRoleImg && (hasAriaLabel || hasTitle))) {
      errors.push(`[${relFile}] SVG must have aria-hidden="true" OR role="img" with <title> / aria-label.`);
    }
  }

  // 7. Image accessibility
  const imgMatches = content.matchAll(/<img\b([^>]*)>/gi);
  for (const match of imgMatches) {
    const attrs = match[1];
    if (!/(?:^|\s)alt=["']/i.test(attrs)) {
      errors.push(`[${relFile}] <img> tag is missing an alt attribute.`);
    }
    const altValue = attrs.match(/(?:^|\s)alt=["']([^"']*)["']/i);
    if (altValue && /^(image of|picture of|photo of)\b/i.test(altValue[1].trim())) {
      errors.push(`[${relFile}] Clichéd alt text prefix "${altValue[1]}". Avoid "Image of..." or "Picture of...".`);
    }
  }

  // 8. Popovertarget matches a popover
  const popoverTargets = content.matchAll(/popovertarget=["']([^"']+)["']/gi);
  for (const target of popoverTargets) {
    const targetId = target[1];
    if (!ids.has(targetId)) {
      errors.push(`[${relFile}] popovertarget="${targetId}" does not match any element ID on the page.`);
    }
  }

  // 9. Internal link integrity (href)
  const links = content.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["']/gi);
  for (const link of links) {
    const href = link[1];

    // Ignore external links, mailto, tel, javascript
    if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) {
      continue;
    }

    if (href.startsWith('#')) {
      // In-page anchor link
      const targetId = href.slice(1);
      if (targetId && !ids.has(targetId)) {
        errors.push(`[${relFile}] Broken in-page link "${href}": element #${targetId} not found.`);
      }
    } else {
      // Internal URL resolution using base URL
      const currentUrl = new URL(route === '/' ? '/' : route + '/', 'https://example.com');
      const resolvedUrl = new URL(href, currentUrl);
      const normalizedPath = resolvedUrl.pathname.replace(/\/$/, '') || '/';
      const anchorPart = resolvedUrl.hash ? resolvedUrl.hash.slice(1) : '';

      const targetPage = routeMap.get(normalizedPath);
      if (!targetPage) {
        errors.push(`[${relFile}] Broken internal link "${href}": route "${normalizedPath}" does not exist.`);
      } else if (anchorPart && !targetPage.ids.has(anchorPart)) {
        errors.push(`[${relFile}] Broken internal link "${href}": element #${anchorPart} not found on "${normalizedPath}".`);
      }
    }
  }

  // 10. Author provenance link
  if (!content.includes('href="https://pomeroy.me/about/"')) {
    errors.push(`[${relFile}] Missing author provenance link to "https://pomeroy.me/about/".`);
  }

  // 11. Root language attribute (British English)
  if (!content.includes('<html lang="en-GB">') && !content.includes('<html lang="en-GB"')) {
    errors.push(`[${relFile}] Expected root element <html lang="en-GB">.`);
  }

  // 12. British English spelling in rendered copy
  const visibleText = content
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ');

  const usEnglishMatches = visibleText.match(/\b(gray|grayed|organize|organizing|organization|organizations|specialized|recognize|summarize|practiced|behavior|behavioral|dialog)\b/gi);
  if (usEnglishMatches) {
    errors.push(`[${relFile}] Detected US English spelling(s) in rendered copy: ${[...new Set(usEnglishMatches)].join(', ')}. Use British English (e.g. grey, organise, specialised, dialogue).`);
  }
}

// Summary
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
