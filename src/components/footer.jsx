import { RESUME, SOCIAL, external } from "../sections";

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <p>© {new Date().getFullYear()} Mojahed Ibrahim</p>
        <div className="footer-links">
          <a className="link" href={SOCIAL.linkedin} {...external}>LinkedIn</a>
          <a className="link" href={SOCIAL.github} {...external}>GitHub</a>
          <a className="link" href={RESUME} {...external}>Résumé</a>
          <a className="link" href={SOCIAL.repo} {...external}>This site&rsquo;s code</a>
          <a className="link" href="#top">Back to top</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
