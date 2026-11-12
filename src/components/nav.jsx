import { useEffect, useState } from "react";
import { RESUME, external } from "../sections";
import { Mark } from "./logo";
import ThemeToggle from "./themeToggle";
import { Search } from "./icons";
import { SHORTCUT } from "../motion";


const LINKS = [
  ["#projects", "Projects"],
  ["#experience", "Experience"],
  ["#education", "Education"],
  ["#skills", "Skills"],
  ["#contact", "Contact"],
];

// The section crossing the middle of the screen; its nav link is marked as the current location.
function useCurrent() {
  const [current, setCurrent] = useState(null);
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setCurrent(`#${e.target.id}`);
          else setCurrent((c) => (c === `#${e.target.id}` ? null : c));
        }
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );
    for (const [href] of LINKS) {
      const el = document.querySelector(href);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);
  return current;
}

function Nav({ onSearch }) {
  const current = useCurrent();
  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <a className="wordmark" href="#top" aria-label="Mojahed Ibrahim, back to top">
          <Mark size={30} />
          <span className="wordmark-name">
            Mojahed <b>Ibrahim</b>
          </span>
        </a>
        <nav className="nav-links" aria-label="Main">
          {LINKS.map(([href, label]) => (
            <a key={href} href={href} aria-current={current === href ? "location" : undefined}>
              {label}
            </a>
          ))}
        </nav>
        <div className="nav-actions">
          <button type="button" className="kbtn" onClick={onSearch} aria-label="Find a skill or jump to a section" aria-keyshortcuts="Control+K Meta+K">
            <Search />
            <span className="kbtn-label">Find a skill</span>
            <kbd>{SHORTCUT}</kbd>
          </button>
          <a className="btn btn-quiet btn-sm nav-resume" href={RESUME} {...external}>
            Résumé
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export default Nav;
