export interface NavLayoutElements {
  header: HTMLElement;
  inner: HTMLElement;
  menu: HTMLElement;
  menuBtn?: HTMLElement | null;
  submenu?: HTMLElement | null;
  submenuTrigger?: HTMLElement | null;
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
  header.classList.remove("is-narrow");

  const fitsInline = inner.scrollWidth <= inner.clientWidth;

  header.classList.remove("is-measuring");
  header.classList.toggle("is-wide", fitsInline);
  header.classList.toggle("is-narrow", !fitsInline);

  return fitsInline;
}

/**
 * Applies responsive nav state to the header and popover menu.
 */
export function applyNavLayout(
  elements: Pick<NavLayoutElements, 'header' | 'menu' | 'menuBtn' | 'submenu' | 'submenuTrigger'>,
  fitsInline: boolean
): void {
  elements.header.classList.toggle("is-wide", fitsInline);
  elements.header.classList.toggle("is-narrow", !fitsInline);

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

    if (elements.submenu) {
      elements.submenu.setAttribute("popover", "auto");
      elements.submenu.hidden = false;
    }
    if (elements.submenuTrigger) {
      elements.submenuTrigger.setAttribute("aria-expanded", "false");
    }
  } else {
    elements.menu.setAttribute("popover", "auto");

    if (elements.submenu) {
      if (typeof elements.submenu.hidePopover === "function" && elements.submenu.matches?.(":popover-open")) {
        try {
          elements.submenu.hidePopover();
        } catch {
          // Submenu popover might already be closed
        }
      }
      elements.submenu.removeAttribute("popover");
      elements.submenu.hidden = true;
    }
    if (elements.submenuTrigger) {
      elements.submenuTrigger.setAttribute("aria-expanded", "false");
    }
  }
}

export interface SubmenuCoords {
  top: number;
  left: number;
}

/**
 * Computes top and left coordinates for floating submenu when CSS Anchor Positioning is unsupported.
 */
export function computeSubmenuFallbackPosition(
  triggerRect: { top: number; bottom: number; left: number; right: number },
  submenuRect: { width: number; height: number },
  viewport: { innerWidth: number; innerHeight: number }
): SubmenuCoords {
  let top = triggerRect.bottom + 8;
  if (top + submenuRect.height > viewport.innerHeight && triggerRect.top - submenuRect.height > 0) {
    top = Math.max(0, triggerRect.top - submenuRect.height - 8);
  }

  let left = triggerRect.left;
  if (left + submenuRect.width > viewport.innerWidth) {
    left = Math.max(0, viewport.innerWidth - submenuRect.width - 16);
  }

  return { top, left };
}

/**
 * Determines whether a keyboard event should trigger adjacent lesson navigation.
 * Prevents intercepting arrow keys when typing into inputs, sliders, buttons, or with modifier keys.
 */
export function shouldHandleArrowNav(
  event: Pick<KeyboardEvent, 'defaultPrevented' | 'altKey' | 'ctrlKey' | 'metaKey' | 'shiftKey'>,
  target: unknown
): boolean {
  if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
    return false;
  }
  if (!target || typeof target !== 'object') {
    return true;
  }

  const el = target as { tagName?: string; getAttribute?: (attr: string) => string | null; isContentEditable?: boolean };
  if (typeof el.tagName === 'string') {
    const tag = el.tagName.toUpperCase();
    if (['INPUT', 'TEXTAREA', 'SELECT', 'OPTION', 'BUTTON'].includes(tag)) {
      return false;
    }
  }
  if (el.isContentEditable) {
    return false;
  }
  if (typeof el.getAttribute === 'function') {
    const role = el.getAttribute('role');
    if (role === 'slider' || role === 'tab' || role === 'combobox' || role === 'textbox') {
      return false;
    }
  }
  return true;
}

/**
 * Handles ArrowLeft and ArrowRight keydown navigation.
 */
export function handleArrowNavKey(
  event: KeyboardEvent,
  options: {
    prevUrl?: string;
    nextUrl?: string;
    navigate?: (url: string) => void;
  }
): boolean {
  if (!shouldHandleArrowNav(event, event.target)) {
    return false;
  }

  const navigate = options.navigate || ((url: string) => {
    if (typeof window !== 'undefined' && window.location) {
      window.location.href = url;
    }
  });

  if (event.key === 'ArrowLeft' && options.prevUrl) {
    navigate(options.prevUrl);
    return true;
  }
  if (event.key === 'ArrowRight' && options.nextUrl) {
    navigate(options.nextUrl);
    return true;
  }

  return false;
}

