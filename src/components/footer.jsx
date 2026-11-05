import { RESUME, SOCIAL, external } from "../sections";
import { Mark } from "./logo";

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <a className="footer-id" href="#top" aria-label="Mojahed Ibrahim, back to top">
          <Mark size={40} />
          <span>
            <b>Mojahed Ibrahim</b>
            <span>Software engineer in Philadelphia. © {new Date().getFullYear()}</span>
          </span>
        </a>
        <nav className="footer-links" aria-label="Elsewhere">
          <a className="link" href={SOCIAL.linkedin} {...external}>LinkedIn</a>
          <a className="link" href={SOCIAL.github} {...external}>GitHub</a>
          <a className="link" href={RESUME} {...external}>Résumé</a>
          <a className="link" href={SOCIAL.repo} {...external}>This site&rsquo;s code</a>
        </nav>
        <p className="footer-egg">
          <kbd>↑</kbd><kbd>↑</kbd><kbd>↓</kbd><kbd>↓</kbd><kbd>←</kbd><kbd>→</kbd><kbd>←</kbd><kbd>→</kbd><kbd>B</kbd><kbd>A</kbd>
          <span className="visually-hidden">The Konami code works on this page, or on the arcade cabinet in Projects.</span>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
