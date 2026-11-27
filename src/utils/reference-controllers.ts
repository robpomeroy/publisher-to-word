/**
 * Client-side controllers and DOM wiring for Reference Tools (Translator and Rescue Guide).
 * Extracted into testable, reusable functions to allow headless DOM integration
 * testing without relying on unexecuted Astro client scripts.
 */

import {
  filterRescueItems,
  filterTranslatorEntries,
  type RescueCategory,
  type RescueItem,
} from './reference';
import { RESCUE_ITEMS } from '../data/rescue';
import {
  TRANSLATOR_ENTRIES,
  type TranslatorEntry,
  type TranslatorCategory,
} from '../data/translator';

export function getNextPillIndex(key: string, currentIndex: number, total: number): number {
  if (total <= 0) return -1;
  if (key === 'ArrowRight' || key === 'ArrowDown') {
    return (currentIndex + 1) % total;
  }
  if (key === 'ArrowLeft' || key === 'ArrowUp') {
    return (currentIndex - 1 + total) % total;
  }
  if (key === 'Home') {
    return 0;
  }
  if (key === 'End') {
    return total - 1;
  }
  return -1;
}

export interface RescueController {
  applyFilter: () => void;
  updateToggleAllButton: () => void;
  handleHashNavigation: (hash?: string) => void;
  getCurrentCategory: () => RescueCategory;
  getCurrentQuery: () => string;
  destroy: () => void;
}

export interface RescueControllerOptions {
  items?: RescueItem[];
  getHash?: () => string;
  onHashChange?: boolean;
  window?: Window;
}

export function initRescueController(
  root: Document | HTMLElement = typeof document !== 'undefined' ? document : ({} as Document),
  options: RescueControllerOptions = {}
): RescueController | null {
  const items = options.items ?? RESCUE_ITEMS;
  const doc = (root as Document).defaultView ? (root as Document) : (root as HTMLElement).ownerDocument;
  const win =
    options.window ??
    (doc?.defaultView as Window | null) ??
    (typeof window !== 'undefined' ? window : undefined);

  const searchInput = root.querySelector<HTMLInputElement>('#rescue-search');
  const pillButtons = Array.from(root.querySelectorAll<HTMLButtonElement>('.category-pills .pill-btn'));
  const filterStatus = root.querySelector<HTMLElement>('#filter-status');
  const emptyState = root.querySelector<HTMLElement>('#rescue-empty');
  const resetBtn = root.querySelector<HTMLElement>('#reset-filters-btn');
  const toggleAllBtn = root.querySelector<HTMLButtonElement>('#toggle-all-btn');
  const toggleAllText = root.querySelector<HTMLElement>('#toggle-all-text');
  const cards = Array.from(root.querySelectorAll<HTMLDetailsElement>('.rescue-card'));
  const pillsContainer = root.querySelector<HTMLElement>('.category-pills');

  if (cards.length === 0 && !searchInput) {
    return null;
  }

  let currentCategory: RescueCategory = 'all';
  let currentQuery = '';

  function isCardFilteredOut(card: HTMLDetailsElement): boolean {
    return card.hasAttribute('hidden');
  }

  function updateToggleAllButton(): void {
    if (!toggleAllBtn || !toggleAllText) return;
    const visibleCards = cards.filter(card => !isCardFilteredOut(card));
    if (visibleCards.length === 0) {
      toggleAllBtn.disabled = true;
      return;
    }
    toggleAllBtn.disabled = false;
    const allOpen = visibleCards.every(card => card.open);
    toggleAllBtn.setAttribute('aria-expanded', allOpen ? 'true' : 'false');
    toggleAllText.textContent = allOpen ? 'Collapse All' : 'Expand All';
  }

  function applyFilter(): void {
    const filtered = filterRescueItems(items, currentQuery, currentCategory);
    const visibleIds = new Set(filtered.map(item => item.id));

    let visibleCount = 0;
    for (const card of cards) {
      const cardId = card.getAttribute('data-id') || '';
      const isVisible = visibleIds.has(cardId);
      if (isVisible) {
        card.removeAttribute('hidden');
        visibleCount++;
      } else {
        card.setAttribute('hidden', 'until-found');
      }
    }

    if (emptyState) {
      emptyState.hidden = visibleCount > 0;
    }

    if (filterStatus) {
      if (visibleCount === 0) {
        filterStatus.textContent = 'No matching troubleshooting snags found. Reset filters to see all snags.';
      } else if (visibleCount === items.length) {
        filterStatus.textContent = `Showing all ${visibleCount} troubleshooting snags.`;
      } else {
        filterStatus.textContent = `Showing ${visibleCount} of ${items.length} troubleshooting snags.`;
      }
    }

    updateToggleAllButton();
  }

  const handleSearchInput = () => {
    if (searchInput) {
      currentQuery = searchInput.value;
      applyFilter();
    }
  };

  const pillClickHandlers = new Map<HTMLButtonElement, () => void>();
  for (const pill of pillButtons) {
    const handler = () => {
      const cat = pill.getAttribute('data-category') as RescueCategory | null;
      if (!cat) return;

      currentCategory = cat;
      for (const btn of pillButtons) {
        const isActive = btn === pill;
        btn.classList.toggle('is-active', isActive);
        btn.setAttribute('aria-checked', isActive ? 'true' : 'false');
        btn.setAttribute('tabindex', isActive ? '0' : '-1');
      }

      applyFilter();
    };
    pillClickHandlers.set(pill, handler);
    pill.addEventListener('click', handler);
  }

  const handlePillsKeyDown = (e: Event) => {
    const keyEvent = e as KeyboardEvent;
    const currentIndex = pillButtons.findIndex(btn => btn.getAttribute('tabindex') === '0');
    if (currentIndex === -1) return;

    const nextIndex = getNextPillIndex(keyEvent.key, currentIndex, pillButtons.length);
    if (nextIndex !== -1) {
      keyEvent.preventDefault();
      const nextPill = pillButtons[nextIndex];
      nextPill.click();
      if (typeof nextPill.focus === 'function') {
        nextPill.focus();
      }
    }
  };

  const handleToggleAllClick = () => {
    const visibleCards = cards.filter(card => !isCardFilteredOut(card));
    const allOpen = visibleCards.every(card => card.open);
    const targetState = !allOpen;

    for (const card of visibleCards) {
      card.open = targetState;
    }

    updateToggleAllButton();
  };

  const cardToggleHandlers = new Map<HTMLDetailsElement, () => void>();
  const cardBeforeMatchHandlers = new Map<HTMLDetailsElement, () => void>();
  for (const card of cards) {
    const toggleHandler = () => updateToggleAllButton();
    cardToggleHandlers.set(card, toggleHandler);
    card.addEventListener('toggle', toggleHandler);

    const beforeMatchHandler = () => {
      // If user uses browser Find-in-Page (Ctrl+F), ensure all cards are visible and active card opens
      if (currentQuery !== '' || currentCategory !== 'all') {
        currentQuery = '';
        currentCategory = 'all';
        if (searchInput) {
          searchInput.value = '';
        }
        for (const btn of pillButtons) {
          const isAll = btn.getAttribute('data-category') === 'all';
          btn.classList.toggle('is-active', isAll);
          btn.setAttribute('aria-checked', isAll ? 'true' : 'false');
          btn.setAttribute('tabindex', isAll ? '0' : '-1');
        }
        applyFilter();
      }
      card.open = true;
      updateToggleAllButton();
    };
    cardBeforeMatchHandlers.set(card, beforeMatchHandler);
    card.addEventListener('beforematch', beforeMatchHandler);
  }

  const handleResetClick = () => {
    currentQuery = '';
    currentCategory = 'all';

    if (searchInput) {
      searchInput.value = '';
    }

    for (const btn of pillButtons) {
      const isAll = btn.getAttribute('data-category') === 'all';
      btn.classList.toggle('is-active', isAll);
      btn.setAttribute('aria-checked', isAll ? 'true' : 'false');
      btn.setAttribute('tabindex', isAll ? '0' : '-1');
    }

    applyFilter();
    if (searchInput && typeof searchInput.focus === 'function') {
      searchInput.focus();
    }
  };

  function handleHashNavigation(customHash?: string): void {
    const rawHash =
      customHash ??
      (options.getHash
        ? options.getHash()
        : win?.location?.hash ?? '');
    const hash = rawHash.replace(/^#/, '');
    if (!hash) return;

    const targetCard = root.querySelector<HTMLDetailsElement>(`#${hash}`);
    if (targetCard && targetCard.classList.contains('rescue-card')) {
      const cardCategory = targetCard.getAttribute('data-category') as RescueCategory | null;
      if (currentQuery !== '' || (currentCategory !== 'all' && currentCategory !== cardCategory)) {
        currentQuery = '';
        currentCategory = 'all';
        if (searchInput) {
          searchInput.value = '';
        }
        for (const btn of pillButtons) {
          const isAll = btn.getAttribute('data-category') === 'all';
          btn.classList.toggle('is-active', isAll);
          btn.setAttribute('aria-checked', isAll ? 'true' : 'false');
          btn.setAttribute('tabindex', isAll ? '0' : '-1');
        }
        applyFilter();
      }
      targetCard.open = true;
      targetCard.scrollIntoView?.({ behavior: 'smooth', block: 'nearest' });
      updateToggleAllButton();
    }
  }

  const handleWindowHashChange = () => {
    handleHashNavigation();
  };

  searchInput?.addEventListener('input', handleSearchInput);
  pillsContainer?.addEventListener('keydown', handlePillsKeyDown);
  toggleAllBtn?.addEventListener('click', handleToggleAllClick);
  resetBtn?.addEventListener('click', handleResetClick);

  if (win && options.onHashChange !== false) {
    win.addEventListener('hashchange', handleWindowHashChange);
  }

  handleHashNavigation();
  updateToggleAllButton();

  return {
    applyFilter,
    updateToggleAllButton,
    handleHashNavigation,
    getCurrentCategory: () => currentCategory,
    getCurrentQuery: () => currentQuery,
    destroy: () => {
      searchInput?.removeEventListener('input', handleSearchInput);
      pillsContainer?.removeEventListener('keydown', handlePillsKeyDown);
      toggleAllBtn?.removeEventListener('click', handleToggleAllClick);
      resetBtn?.removeEventListener('click', handleResetClick);
      for (const [pill, handler] of pillClickHandlers) {
        pill.removeEventListener('click', handler);
      }
      for (const [card, handler] of cardToggleHandlers) {
        card.removeEventListener('toggle', handler);
      }
      for (const [card, handler] of cardBeforeMatchHandlers) {
        card.removeEventListener('beforematch', handler);
      }
      if (win && options.onHashChange !== false) {
        win.removeEventListener('hashchange', handleWindowHashChange);
      }
    },
  };
}

export interface TranslatorController {
  applyFilter: () => void;
  getCurrentCategory: () => TranslatorCategory;
  getCurrentQuery: () => string;
  destroy: () => void;
}

export interface TranslatorControllerOptions {
  entries?: TranslatorEntry[];
}

export function initTranslatorController(
  root: Document | HTMLElement = typeof document !== 'undefined' ? document : ({} as Document),
  options: TranslatorControllerOptions = {}
): TranslatorController | null {
  const entries = options.entries ?? TRANSLATOR_ENTRIES;
  const searchInput = root.querySelector<HTMLInputElement>('#translator-search');
  const pillBtns = Array.from(root.querySelectorAll<HTMLButtonElement>('.category-pills .pill-btn'));
  const table = root.querySelector<HTMLTableElement>('#translator-table');
  const rows = Array.from(root.querySelectorAll<HTMLTableRowElement>('.translator-row'));
  const emptyState = root.querySelector<HTMLElement>('#translator-empty');
  const filterStatus = root.querySelector<HTMLElement>('#filter-status');
  const resetBtn = root.querySelector<HTMLElement>('#reset-filters-btn');
  const pillsContainer = root.querySelector<HTMLElement>('.category-pills');

  if (rows.length === 0 && !searchInput) {
    return null;
  }

  let currentCategory: TranslatorCategory = 'all';
  let currentQuery = '';

  function applyFilter(): void {
    const matchedEntries = filterTranslatorEntries(
      entries,
      currentQuery,
      currentCategory
    );
    const matchedIds = new Set(matchedEntries.map(e => e.id));

    let visibleCount = 0;
    rows.forEach(row => {
      const id = row.getAttribute('data-id') || '';
      const isVisible = matchedIds.has(id);
      row.hidden = !isVisible;
      if (isVisible) visibleCount++;
    });

    if (table) {
      table.style.display = visibleCount === 0 ? 'none' : '';
    }
    if (emptyState) {
      emptyState.hidden = visibleCount > 0;
    }

    if (filterStatus) {
      if (visibleCount === entries.length) {
        filterStatus.textContent = `Showing all ${entries.length} translations.`;
      } else if (visibleCount === 0) {
        filterStatus.textContent = 'No translations found matching your search.';
      } else {
        filterStatus.textContent = `Showing ${visibleCount} of ${entries.length} translations.`;
      }
    }
  }

  const handleSearchInput = () => {
    if (searchInput) {
      currentQuery = searchInput.value;
      applyFilter();
    }
  };

  const pillClickHandlers = new Map<HTMLButtonElement, () => void>();
  pillBtns.forEach(btn => {
    const handler = () => {
      const cat = (btn.getAttribute('data-category') || 'all') as TranslatorCategory;
      currentCategory = cat;

      pillBtns.forEach(b => {
        const isActive = b === btn;
        b.classList.toggle('is-active', isActive);
        b.setAttribute('aria-checked', isActive ? 'true' : 'false');
        b.setAttribute('tabindex', isActive ? '0' : '-1');
      });

      applyFilter();
    };
    pillClickHandlers.set(btn, handler);
    btn.addEventListener('click', handler);
  });

  const handlePillsKeyDown = (e: Event) => {
    const keyEvent = e as KeyboardEvent;
    const currentIndex = pillBtns.findIndex(btn => btn.getAttribute('tabindex') === '0');
    if (currentIndex === -1) return;

    const nextIndex = getNextPillIndex(keyEvent.key, currentIndex, pillBtns.length);
    if (nextIndex !== -1) {
      keyEvent.preventDefault();
      const nextPill = pillBtns[nextIndex];
      nextPill.click();
      if (typeof nextPill.focus === 'function') {
        nextPill.focus();
      }
    }
  };

  const handleResetClick = () => {
    if (searchInput) {
      searchInput.value = '';
      currentQuery = '';
    }
    currentCategory = 'all';

    pillBtns.forEach(b => {
      const isAll = b.getAttribute('data-category') === 'all';
      b.classList.toggle('is-active', isAll);
      b.setAttribute('aria-checked', isAll ? 'true' : 'false');
      b.setAttribute('tabindex', isAll ? '0' : '-1');
    });

    applyFilter();
    if (searchInput && typeof searchInput.focus === 'function') {
      searchInput.focus();
    }
  };

  searchInput?.addEventListener('input', handleSearchInput);
  pillsContainer?.addEventListener('keydown', handlePillsKeyDown);
  resetBtn?.addEventListener('click', handleResetClick);

  return {
    applyFilter,
    getCurrentCategory: () => currentCategory,
    getCurrentQuery: () => currentQuery,
    destroy: () => {
      searchInput?.removeEventListener('input', handleSearchInput);
      pillsContainer?.removeEventListener('keydown', handlePillsKeyDown);
      resetBtn?.removeEventListener('click', handleResetClick);
      for (const [pill, handler] of pillClickHandlers) {
        pill.removeEventListener('click', handler);
      }
    },
  };
}
