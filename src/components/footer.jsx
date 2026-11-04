import { RESUME, SOCIAL, external } from "../sections";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-cols">
        <div className="footer-col">
          <ul>
            <li>Mojahed Ibrahim</li>
            <li>Web application developer</li>
            <li>Turn 14 Distribution</li>
          </ul>
        </div>
        <div className="footer-col">
          <ul>
            <li>On this page</li>
            <li><a className="link link--quiet" href="#work">Work</a></li>
            <li><a className="link link--quiet" href="#experience">Experience</a></li>
            <li><a className="link link--quiet" href="#contact">Contact</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <ul>
            <li>Elsewhere</li>
            <li><a className="link link--quiet" href={SOCIAL.linkedin} {...external}>LinkedIn</a></li>
            <li><a className="link link--quiet" href={SOCIAL.github} {...external}>GitHub</a></li>
            <li><a className="link link--quiet" href={SOCIAL.repo} {...external}>This site’s code</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <ul>
            <li>Hiring or have a project?</li>
            <li><a className="link link--quiet" href={RESUME} {...external}>Résumé</a></li>
          </ul>
          <a className="button button--accent" href="#contact">
            Send a message
          </a>
        </div>
      </div>
      <div aria-hidden="true" />
      <div className="footer-name-wrap">
        <p className="footer-name" aria-hidden="true">
          <span className="part">Mojahed</span> <span className="part">Ibrahim</span>
        </p>
      </div>
      <p className="footer-legal">
        © {new Date().getFullYear()} Mojahed Ibrahim. Temple University photograph by
        ImagineerJC, CC0, via{" "}
        <a className="link link--quiet" href="https://commons.wikimedia.org/wiki/File:Beury_Beach,_Bell_Tower,_Paley_Library.jpg" target="_blank" rel="noopener noreferrer">
          Wikimedia Commons
        </a>
        .
      </p>
    </footer>
  );
}

export default Footer;
