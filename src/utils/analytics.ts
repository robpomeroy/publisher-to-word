/**
 * Resolves and validates the optional Plausible Analytics script URL.
 * Only returns a URL in production builds when a valid HTTPS URL is supplied.
 */
export function resolvePlausibleScriptUrl(
  rawUrl?: string,
  isProd: boolean = false
): string | null {
  if (!isProd || !rawUrl) {
    return null;
  }

  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return null;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'https:') {
      return null;
    }
    return parsed.href;
  } catch {
    return null;
  }
}

/**
 * Initialises the window.plausible function and queue in a CSP-compliant manner,
 * avoiding inline script execution.
 */
export function initPlausible(customWindow?: unknown): void {
  const win = (customWindow ?? (typeof window !== 'undefined' ? window : undefined)) as unknown as {
    plausible?: {
      (...args: unknown[]): void;
      q?: unknown[];
      init?: (opts?: unknown) => void;
      o?: unknown;
    };
  } | undefined;

  if (!win) {
    return;
  }

  win.plausible =
    win.plausible ||
    function (...args: unknown[]) {
      (win.plausible!.q = win.plausible!.q || []).push(args);
    };

  win.plausible.q = win.plausible.q || [];

  win.plausible.init =
    win.plausible.init ||
    function (i?: unknown) {
      win.plausible!.o = i || {};
    };

  win.plausible.init();
}

