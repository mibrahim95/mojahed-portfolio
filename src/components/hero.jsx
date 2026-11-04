import { RESUME, SOCIAL, external } from "../sections";

function Intro({ className = "" }) {
  return (
    <div className={`hero-intro ${className}`} data-load style={{ "--d": "420ms" }}>
      <p>
        I build database-driven web apps at Turn&nbsp;14&nbsp;Distribution.
      </p>
      <a className="button" href="#work">
        See my work
      </a>
    </div>
  );
}

function Hero() {
  return (
    <header className="hero" id="top">
      <div className="hero-top">
        <Intro />
        <nav aria-label="Sections" data-load style={{ "--d": "480ms" }}>
          <ul className="links-row">
            <li><a className="link link--quiet" href="#work">Work</a></li>
            <li><a className="link link--quiet" href="#experience">Experience</a></li>
            <li><a className="link link--quiet" href="#contact">Contact</a></li>
          </ul>
        </nav>
      </div>

      <div className="hero-name-scale">
        <h1 className="hero-name">
          <span className="line">
            <span data-line>Mojahed Ibrahim</span>
          </span>
          <span className="visually-hidden">, web application developer</span>
        </h1>
      </div>

      <Intro className="hero-intro--phone" />

      <div className="hero-bottom" data-load style={{ "--d": "540ms" }}>
        <p className="hero-kind">Web application developer since 2019</p>
        <ul className="links-row">
          <li><a className="link link--quiet" href={SOCIAL.linkedin} {...external}>LinkedIn</a></li>
          <li><a className="link link--quiet" href={SOCIAL.github} {...external}>GitHub</a></li>
          <li><a className="link link--quiet" href={RESUME} {...external}>Résumé</a></li>
        </ul>
      </div>

      <div className="hero-shot" aria-hidden="true">
        <img src="/turn14.webp" alt="" width="800" height="450" />
      </div>
    </header>
  );
}

export default Hero;
