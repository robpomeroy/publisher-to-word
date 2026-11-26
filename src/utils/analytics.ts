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
