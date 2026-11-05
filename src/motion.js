import { flushSync } from "react-dom";

export const reducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

// Runs a React state update inside a View Transition, so elements with a
// view-transition-name glide to their new place. Without support, or with
// reduced motion, the update just happens.
export function transition(update) {
  if (!document.startViewTransition || reducedMotion()) {
    update();
    return null;
  }
  return document.startViewTransition(() => flushSync(update));
}

export const OPEN_PROJECT = "portfolio:open-project";
export const openProject = (key) => window.dispatchEvent(new CustomEvent(OPEN_PROJECT, { detail: key }));

const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
export const SHORTCUT = isMac ? "⌘K" : "Ctrl K";

// Page-wide arrow keys leave these alone: typing, dialogs and widgets with their own arrow handling.
export const SKIP_KEYS = "input, textarea, select, dialog, [contenteditable], [role='tablist'], [role='listbox'], .segmented";
