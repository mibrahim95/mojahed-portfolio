import { useState } from "react";
import { flushSync } from "react-dom";
import { reducedMotion } from "../motion";

// Two dark moods: "dark" (Blue Hour: navy slate and cobalt, the default) and "darker"
// (Midnight: blue-ink black, hairlines and moonlight blue). index.html applies the saved one before first paint; this flips it,
// remembers it and keeps the browser chrome colour in step.
const CHROME = { dark: "#0e131f", darker: "#06080f" };

function ThemeToggle() {
  const [theme, setTheme] = useState(() => (document.documentElement.dataset.theme === "darker" ? "darker" : "dark"));
  const next = theme === "dark" ? "darker" : "dark";

  const apply = () => {
    document.documentElement.dataset.theme = next;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", CHROME[next]);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // storage blocked (private mode, policy): the choice lasts for this page view only
    }
    flushSync(() => setTheme(next));
  };

  // A real switch: the new mood spreads out from the toggle as a circle.
  const toggle = (e) => {
    const root = document.documentElement;
    if (!document.startViewTransition || reducedMotion()) return apply();
    const r = e.currentTarget.getBoundingClientRect();
    root.style.setProperty("--tx", `${r.left + r.width / 2}px`);
    root.style.setProperty("--ty", `${r.top + r.height / 2}px`);
    root.classList.add("theme-flip");
    // A second click mid-wipe skips this transition and rejects `finished`; that is fine.
    document
      .startViewTransition(apply)
      .finished.catch(() => {})
      .finally(() => root.classList.remove("theme-flip"));
  };

  // A switch named "Darker": off is the navy theme, on is near-black. The moon's dark
  // side grows when it is on.
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-pressed={theme === "darker"}
      title={theme === "darker" ? "Back to Blue Hour, the navy theme" : "Midnight: blue-black with moonlight accents"}
    >
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
        <circle className="tt-disc" cx="12" cy="12" r="8" />
        <circle className="tt-shade" cx="12" cy="12" r="8" />
      </svg>
      <span className="tt-label">Darker</span>
      <span className="tt-track" aria-hidden="true" />
    </button>
  );
}

export default ThemeToggle;
