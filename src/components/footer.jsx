import { SOCIAL } from "../sections";
import { ArrowUp, ArrowUpRight } from "./icons";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-inner">
        <p className="mono">© {new Date().getFullYear()} Mojahed Ibrahim</p>
        <div className="footer-links">
          <a className="text-link" href={SOCIAL.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn <ArrowUpRight />
          </a>
          <a className="text-link" href={SOCIAL.github} target="_blank" rel="noopener noreferrer">
            GitHub <ArrowUpRight />
          </a>
          <a className="text-link" href={SOCIAL.repo} target="_blank" rel="noopener noreferrer">
            Site source <ArrowUpRight />
          </a>
          <a className="text-link" href="#top">
            Back to top <ArrowUp />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
