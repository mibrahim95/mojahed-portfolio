import about from "../json/about.json";
import experiences from "../json/expList.json";
import { GROUPS, SKILLS, logoFor } from "../skills";
import { tenure } from "../timeline";
import { SHORTCUT } from "../motion";
import { SkillLogo } from "./logo";
import Portrait from "./portrait";
import Skyline from "./skyline";

// The range: the core skill groups, each with the three skills that best stand for it.
const RANGE = GROUPS.slice(0, 6);
const current = experiences[0];
const edu = about.education;

// A two-frame pixel heart, the same one the frame shows when a heart arrives.
export function PixelHeart() {
  return (
    <svg className="pxheart" viewBox="0 0 7 6" shapeRendering="crispEdges" aria-hidden="true" focusable="false">
      <path d="M1 0h2v1h-2zM4 0h2v1h-2zM0 1h7v2h-7zM1 3h5v1h-5zM2 4h3v1h-3zM3 5h1v1h-1z" />
      <path className="pxheart-shine" d="M1 1h1v1h-1z" />
    </svg>
  );
}

// Before and after for the two speedups. Each row is drawn to its own scale (before = the
// full track), and every value sits in the column on the right, never on a bar.
const SPEEDUPS = [
  { title: "One slow job", how: "Rewrote its query, added indexes and changed its joins.", before: "100%", after: "−80%", w: 20, range: 0, sr: "One slow job now runs in 80% less time." },
  { title: "A recurring job", how: "Four or five hours down to about one.", before: "4 to 5 h", after: "~1 h", w: 20, range: 20, sr: "A recurring job went from four or five hours to about one." },
];

function Speedups() {
  return (
    <ul className="speed">
      {SPEEDUPS.map((r, i) => (
        <li key={r.title} className="sp-row" style={{ "--i": i, "--w": `${r.w}%`, "--range": `${r.range}%` }}>
          <p className="sp-title">
            {r.title}
            <span>{r.how}</span>
          </p>
          <div className="sp-bars" aria-hidden="true">
            <span className="sp-bar sp-before" />
            <span className="sp-bar sp-after" />
          </div>
          <p className="sp-vals" aria-hidden="true">
            <span>{r.before}</span>
            <span className="sp-val-after">{r.after}</span>
          </p>
          <p className="visually-hidden">{r.sr}</p>
        </li>
      ))}
    </ul>
  );
}

function Hero({ onGroup, onSearch }) {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="wrap intro">
        <div className="intro-copy">
          <h1 id="hero-title" className="id-name">
            <span className="id-line" style={{ "--d": 0 }}>
              <span>Mojahed</span>
            </span>
            <span className="id-line" style={{ "--d": 1 }}>
              <span>Ibrahim</span>
            </span>
          </h1>
          <p className="id-headline" data-load style={{ "--d": 3 }}>
            {about.headline}
          </p>
          <p className="id-lede" data-load style={{ "--d": 4 }}>
            {about.lede}
          </p>
          <div className="id-actions" data-load style={{ "--d": 5 }}>
            <a className="btn btn-primary" href="#projects">
              See projects
            </a>
            <a className="btn btn-ghost" href="#contact">
              Get in touch
            </a>
          </div>
        </div>

        <figure className="badge">
          <div className="badge-shell">
            <Portrait className="badge-photo" />
          </div>
          <figcaption className="badge-body">
            <p className="badge-now">
              <span className="badge-light" aria-hidden="true" /> Current role
            </p>
            <p className="badge-title">{current.position}</p>
            <p className="badge-co">{current.title}</p>
            <p className="badge-meta">
              Since {current.dates.split(/\s*–/)[0]} · {tenure(current.dates)}
            </p>
            <p className="badge-desc">{current.desc}</p>
          </figcaption>
        </figure>
      </div>

      <Skyline />

      <div className="wrap bento">
        <div className="tile tile-speed" data-reveal>
          <h2 className="tile-title">{about.sections.speedTitle}</h2>
          <p className="speed-big">
            <span>{about.highlights[0].value}</span> taken off the daily batch run by running job families in parallel.
          </p>
          <Speedups />
        </div>

        <div className="tile tile-edu" id="education" data-reveal style={{ "--i": 1 }}>
          <h2 className="tile-title">Education</h2>
          <p className="edu-school">{edu.school}</p>
          <p className="edu-college">{edu.college}</p>
          <p className="edu-degree">
            {edu.degree}
            <span>{edu.major}</span>
          </p>
          <p className="edu-year" aria-label={`Graduated ${edu.graduated}`}>
            <span aria-hidden="true">{edu.year}</span>
          </p>
          <ul className="edu-notes">
            {edu.honors.map((h) => (
              <li key={h}>{h}</li>
            ))}
            <li>
              {edu.teaching.role}, {edu.teaching.course}
            </li>
          </ul>
        </div>

        <div className="tile tile-stack" data-reveal style={{ "--i": 2 }}>
          <h2 className="tile-title">What I work on</h2>
          <ul className="range">
            {RANGE.map((g, i) => (
              <li key={g.group} style={{ "--i": i }}>
                <button type="button" className="range-btn" onClick={() => onGroup(g.group)}>
                  <span className="range-name">{g.group}</span>
                  <span className="range-skills">
                    {g.items.slice(0, 3).map((n) => (
                      <span key={n}>
                        <SkillLogo logo={logoFor(n)} name={n} size={14} />
                        {n}
                      </span>
                    ))}
                  </span>
                  <span className="range-n">
                    {g.items.length}
                    <span className="visually-hidden"> skills</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <button type="button" className="stack-more" onClick={onSearch}>
            Search all {SKILLS.length} skills <kbd>{SHORTCUT}</kbd>
          </button>
        </div>

      </div>
    </section>
  );
}

export default Hero;
