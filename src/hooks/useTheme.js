import { useCallback, useEffect, useState } from "react";

const KEY = "theme";

function readStored() {
  try {
    const value = localStorage.getItem(KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

function systemTheme() {
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

// Light/dark theme: follows the OS until the visitor picks one.
export default function useTheme() {
  const [theme, setTheme] = useState(() => readStored() ?? systemTheme());

  useEffect(() => {
    if (readStored()) return undefined;
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!mq) return undefined;
    const onChange = (e) => setTheme(e.matches ? "dark" : "light");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const toggle = useCallback(() => {
    setTheme((current) => {
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem(KEY, next);
      } catch {
        /* storage unavailable: theme still applies for this visit */
      }
      return next;
    });
  }, []);

  return [theme, toggle];
}
