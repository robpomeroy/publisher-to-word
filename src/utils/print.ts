/**
 * Utility functions for CSP-safe printing and cross-browser <details> expansion during print.
 */

export function initPrintTrigger(
  targetDocument: Document = document,
  printFn: () => void = () => window.print()
): () => void {
  const handler = (event: Event) => {
    const target = event.target as HTMLElement | null;
    if (target?.closest?.("[data-print-trigger]")) {
      printFn();
    }
  };

  targetDocument.addEventListener("click", handler);
  return () => targetDocument.removeEventListener("click", handler);
}

export function expandDetailsForPrint(targetDocument: Document = document): HTMLDetailsElement[] {
  const closedDetails = Array.from(
    targetDocument.querySelectorAll<HTMLDetailsElement>("details.disclosure:not([open])")
  );
  for (const el of closedDetails) {
    el.open = true;
    el.setAttribute("open", "");
  }
  return closedDetails;
}

export function restoreDetailsAfterPrint(elements: HTMLDetailsElement[]): void {
  for (const el of elements) {
    el.open = false;
    el.removeAttribute("open");
  }
}

export function initPrintDetailsExpansion(
  targetWindow: Window = window,
  targetDocument: Document = document
): () => void {
  let expandedDetails: HTMLDetailsElement[] = [];

  const beforePrintHandler = () => {
    expandedDetails = expandDetailsForPrint(targetDocument);
  };

  const afterPrintHandler = () => {
    restoreDetailsAfterPrint(expandedDetails);
    expandedDetails = [];
  };

  targetWindow.addEventListener("beforeprint", beforePrintHandler);
  targetWindow.addEventListener("afterprint", afterPrintHandler);

  return () => {
    targetWindow.removeEventListener("beforeprint", beforePrintHandler);
    targetWindow.removeEventListener("afterprint", afterPrintHandler);
  };
}
