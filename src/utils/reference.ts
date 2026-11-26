import type { TranslatorEntry, TranslatorCategory } from '../data/translator';

export type RescueCategory =
  | 'all'
  | 'images-anchors'
  | 'layout-margins'
  | 'text-formatting'
  | 'objects-layering';

export interface RescueItem {
  id: string;
  symptom: string;
  category: Exclude<RescueCategory, 'all'>;
  cause: string;
  fixSteps: string[];
  ribbonPath: string;
  altPath?: string;
  tip?: string;
  lessonSlug: string;
  lessonTitle: string;
  sandboxUrl?: string;
}

/**
 * Normalises search text for robust, accent-insensitive, case-insensitive comparison.
 */
export function normaliseSearch(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Filters translator entries by search query and category.
 */
export function filterTranslatorEntries(
  entries: TranslatorEntry[],
  query: string,
  category: TranslatorCategory = 'all'
): TranslatorEntry[] {
  const normQuery = normaliseSearch(query);

  return entries.filter(entry => {
    if (category !== 'all' && entry.category !== category) {
      return false;
    }

    if (!normQuery) {
      return true;
    }

    const haystack = [
      entry.publisher,
      entry.word,
      entry.ribbonPath,
      entry.altPath || '',
      entry.tip,
      entry.lessonTitle,
    ]
      .map(normaliseSearch)
      .join(' ');

    return haystack.includes(normQuery);
  });
}

/**
 * Filters rescue guide items by search query and category.
 */
export function filterRescueItems(
  items: RescueItem[],
  query: string,
  category: string = 'all'
): RescueItem[] {
  const normQuery = normaliseSearch(query);

  return items.filter(item => {
    if (category !== 'all' && item.category !== category) {
      return false;
    }

    if (!normQuery) {
      return true;
    }

    const haystack = [
      item.symptom,
      item.cause,
      item.fixSteps.join(' '),
      item.ribbonPath,
      item.altPath || '',
      item.tip || '',
      item.lessonTitle,
    ]
      .map(normaliseSearch)
      .join(' ');

    return haystack.includes(normQuery);
  });
}
