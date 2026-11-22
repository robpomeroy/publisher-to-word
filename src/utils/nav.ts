export interface NavLayoutElements {
  header: HTMLElement;
  inner: HTMLElement;
  menu: HTMLElement;
  menuBtn?: HTMLElement | null;
}

/**
 * Checks whether the current path matches a navigation target,
 * matching either exact equality or valid URL path segment boundary.
 */
export function isCurrent(currentPath: string, href: string): boolean {
  if (href === '/') {
    return currentPath === '/';
  }
  return currentPath === href || currentPath.startsWith(href + '/');
}

/**
 * Temporarily measures if the inner navigation content fits inline
 * without overflowing, ensuring classList is correctly restored.
 */
export function measureNavFits(header: HTMLElement, inner: HTMLElement): boolean {
  header.classList.add("is-measuring");
  header.classList.add("is-wide");

  const fitsInline = inner.scrollWidth <= inner.clientWidth;

  header.classList.remove("is-measuring");
  header.classList.toggle("is-wide", fitsInline);

  return fitsInline;
}

/**
 * Applies responsive nav state to the header and popover menu.
 */
export function applyNavLayout(
  elements: Pick<NavLayoutElements, 'header' | 'menu' | 'menuBtn'>,
  fitsInline: boolean
): void {
  elements.header.classList.toggle("is-wide", fitsInline);

  if (fitsInline) {
    if (typeof elements.menu.hidePopover === "function" && elements.menu.matches?.(":popover-open")) {
      try {
        elements.menu.hidePopover();
      } catch {
        // Popover might already be closed
      }
    }
    elements.menu.removeAttribute("popover");
    if (elements.menuBtn) {
      elements.menuBtn.removeAttribute("aria-expanded");
    }
  } else {
    elements.menu.setAttribute("popover", "auto");
  }
}
