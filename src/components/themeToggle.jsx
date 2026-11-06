import { useState } from "react";

// Two dark themes: "dark" (graphite, the default) and "darker" (near-black, for OLED
// screens). index.html applies the saved one before first paint; this flips it,
// remembers it and keeps the browser chrome colour in step.
const CHROME = { dark: "#0d1012", darker: "#020303" };

function ThemeToggle() {
  const [theme, setTheme] = useState(() => (document.documentElement.dataset.theme === "darker" ? "darker" : "dark"));
  const next = theme === "dark" ? "darker" : "dark";

  const toggle = () => {
    document.documentElement.dataset.theme = next;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", CHROME[next]);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // storage blocked (private mode, policy): the choice lasts for this page view only
    }
    setTheme(next);
  };

  // A switch named "Darker": off is the graphite theme, on is near-black. The moon's dark
  // side grows when it is on.
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-pressed={theme === "darker"}
      title={theme === "darker" ? "Back to the dark theme" : "Near-black theme for OLED screens"}
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
