import { useEffect, useState } from "react";
import useActiveSection from "../hooks/useActiveSection";
import useTheme from "../hooks/useTheme";
import { Close, Menu, Moon, Sun } from "./icons";

function Navbar({ sections }) {
  const active = useActiveSection(sections.map((s) => s.id));
  const [theme, toggleTheme] = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={`site-nav${scrolled ? " is-scrolled" : ""}`}>
      <div className="wrap nav-inner">
        <a className="brand" href={`#${sections[0].id}`} onClick={() => setOpen(false)}>
          Mojahed Ibrahim<span>.</span>
        </a>

        <nav aria-label="Main">
          <ul id="nav-links" className={`nav-links${open ? " is-open" : ""}`}>
            {sections.map(({ id, label }, i) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={active === id ? "location" : undefined}
                  onClick={() => setOpen(false)}
                >
                  <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav-actions">
          <button
            type="button"
            className="icon-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            {theme === "dark" ? <Sun /> : <Moon />}
          </button>
          <button
            type="button"
            className="icon-btn menu-btn"
            aria-expanded={open}
            aria-controls="nav-links"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <Close /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
