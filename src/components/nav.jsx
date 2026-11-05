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

function Nav({ onSearch }) {
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
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <div className="nav-actions">
          <button type="button" className="kbtn" onClick={onSearch} aria-keyshortcuts="Control+K Meta+K">
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
