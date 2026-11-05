import { RESUME, external } from "../sections";
import ThemeToggle from "./themeToggle";

function Nav() {
  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <a className="wordmark" href="#top">
          <span className="wordmark-mark" aria-hidden="true">MI</span>
          Mojahed Ibrahim
        </a>
        <nav className="nav-links" aria-label="Main">
          <a className="nav-section" href="#projects">Projects</a>
          <a className="nav-section" href="#experience">Experience</a>
          <a className="nav-section" href="#education">Education</a>
          <a className="nav-section" href="#skills">Skills</a>
          <a className="nav-section" href="#contact">Contact</a>
          <a className="btn btn-ghost" href={RESUME} {...external}>Résumé</a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

export default Nav;
