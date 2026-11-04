import { SOCIAL, external } from "../sections";
import { ArrowRight } from "./icons";

const FACTS = [
  { label: "Now", value: "Software Engineer II at Comcast" },
  { label: "Before", value: "Web Application Developer at Turn 14 Distribution, 2019–2023" },
  { label: "Studied", value: "B.B.A. in Management Information Systems, Temple University" },
  { label: "Works with", value: "PHP, JavaScript, MySQL, Java, Spring Boot, React" },
];

function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="wrap">
        <div className="hero-grid">
          <div>
            <p className="hero-role" data-load style={{ "--d": "0ms" }}>
              <span className="badge-now">Now</span>
              <span>
                <strong>Software Engineer II</strong> at Comcast
              </span>
            </p>
            <h1 id="hero-title" data-load style={{ "--d": "80ms" }}>
              <span className="hi">Hi, I&rsquo;m Mojahed.</span> <span className="grad">I build data&#8209;driven web apps.</span>
            </h1>
            <p className="hero-lede" data-load style={{ "--d": "160ms" }}>
              Software engineer at Comcast since 2023. Before that I spent four
              years at Turn&nbsp;14 Distribution building PHP and MySQL tools for
              internal and external clients. On my own time I write Java services,
              and I once turned an arcade cabinet into a RetroPie machine.
            </p>
            <div className="hero-actions" data-load style={{ "--d": "240ms" }}>
              <a className="btn btn-primary" href="#projects">
                See my projects <ArrowRight />
              </a>
              <a className="btn btn-ghost" href="#contact">
                Get in touch
              </a>
              <div className="hero-socials">
                <a className="link" href={SOCIAL.linkedin} {...external}>LinkedIn</a>
                <a className="link" href={SOCIAL.github} {...external}>GitHub</a>
              </div>
            </div>
          </div>

          <div className="hero-visual" data-load style={{ "--d": "120ms" }}>
            <div className="portrait">
              <img
                src="/profile.webp"
                alt="Mojahed Ibrahim in a navy suit and tie, smiling outdoors"
                width="600"
                height="600"
                fetchpriority="high"
              />
            </div>
            <figure className="float-shot two" aria-hidden="true">
              <div className="bar"><i /><i /><i /></div>
              <img src="/cousinsInv.webp" alt="" width="800" height="430" />
            </figure>
            <figure className="float-shot one" aria-hidden="true">
              <div className="bar"><i /><i /><i /></div>
              <img src="/turn14.webp" alt="" width="800" height="427" />
            </figure>
          </div>
        </div>

        <dl className="facts" data-load style={{ "--d": "320ms" }}>
          {FACTS.map((f) => (
            <div className="fact" key={f.label}>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export default Hero;
