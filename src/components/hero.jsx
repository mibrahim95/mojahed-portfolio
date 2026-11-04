import facts from "../json/summaryData.json";
import { ArrowRight, GitHub, LinkedIn } from "./icons";
import { SOCIAL } from "../sections";

function Hero() {
  return (
    <section id="aboutMe" className="hero" aria-labelledby="hero-title">
      <div className="wrap">
        <div className="hero-grid">
          <div>
            <p className="status eyebrow" data-reveal>
              <span className="status-dot" aria-hidden="true" />
              Web Application Developer · Turn 14 Distribution
            </p>
            <h1 className="hero-title" id="hero-title" data-reveal style={{ "--reveal-delay": "60ms" }}>
              Hello, I&rsquo;m Mojahed.
              <em>I build database&#8209;driven web apps.</em>
            </h1>
            <p className="hero-lede" data-reveal style={{ "--reveal-delay": "120ms" }}>
              Since 2019 I&rsquo;ve been developing web applications for internal and
              external clients with PHP, JavaScript and MySQL. On my own time I
              build things like the Java Spring Boot API behind this site&rsquo;s
              contact form.
            </p>
            <div className="hero-actions" data-reveal style={{ "--reveal-delay": "180ms" }}>
              <a className="btn btn-primary" href="#projects">
                See my work <ArrowRight />
              </a>
              <a className="btn" href="#contactMe">
                Get in touch
              </a>
              <div className="socials">
                <a className="icon-link" href={SOCIAL.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <LinkedIn />
                </a>
                <a className="icon-link" href={SOCIAL.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <GitHub />
                </a>
              </div>
            </div>
          </div>

          <figure className="portrait" data-reveal style={{ "--reveal-delay": "100ms" }}>
            <div className="portrait-frame">
              <img
                src="/profile.webp"
                alt="Portrait of Mojahed Ibrahim"
                width="600"
                height="600"
                fetchpriority="high"
              />
            </div>
            <figcaption className="mono">Temple University alum</figcaption>
          </figure>
        </div>

        <dl className="facts" data-reveal style={{ "--reveal-delay": "240ms" }}>
          {facts.map((fact) => (
            <div className="fact" key={fact.label}>
              <dt className="eyebrow">{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export default Hero;
