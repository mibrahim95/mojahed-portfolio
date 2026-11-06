import about from "../json/about.json";
import experiences from "../json/expList.json";
import projects from "../json/projects.json";
import { RESUME, SOCIAL, external } from "../sections";
import { SKILLS, dash, logoFor, slug } from "../skills";
import { range, scale, tenure, SHORT, toMonth } from "../timeline";
import { SHORTCUT, openProject } from "../motion";
import { ArrowRight, Download } from "./icons";
import { SkillLogo } from "./logo";
import Portrait from "./portrait";

// Backend first, the way the résumé now reads. PL/SQL is on the résumé but never leads.
const STACK = ["Java", "Spring Boot", "REST APIs", "SQL", "MySQL", "Redis", "Git", "Maven", "Concourse CI/CD", "Jira", "Linux", "Docker", "Python", "PHP", "JavaScript", "Tailscale"];
const current = experiences[0];
const building = projects.find((p) => p.header === "Heartbeat Frame");
const edu = about.education;
// The first sentence of a description, for short blurbs.
const lead = (text) => text.split(/(?<=\.)\s+/)[0];

// A two-frame pixel heart, the same one the frame shows when a heart arrives.
export function PixelHeart() {
  return (
    <svg className="pxheart" viewBox="0 0 7 6" shapeRendering="crispEdges" aria-hidden="true" focusable="false">
      <path d="M1 0h2v1h-2zM4 0h2v1h-2zM0 1h7v2h-7zM1 3h5v1h-5zM2 4h3v1h-3zM3 5h1v1h-1z" />
      <path className="pxheart-shine" d="M1 1h1v1h-1z" />
    </svg>
  );
}

// Before/after bars for the two Comcast speedups, drawn to scale.
function Speedups() {
  const rows = [
    { label: "One slow job, after I rewrote its query, added indexes and changed its joins", before: 100, after: 20, note: "80% less runtime" },
    { label: "A separate recurring job", before: 100, after: 100 / 4.5, note: "4 to 5 hours, now about 1" },
  ];
  return (
    <ul className="speed">
      {rows.map((r, i) => (
        <li key={r.label} style={{ "--i": i }}>
          <p className="speed-label">{r.label}</p>
          <div className="speed-bars" aria-hidden="true">
            <span className="speed-before" />
            <span className="speed-after" style={{ "--w": `${r.after}%` }} />
          </div>
          <p className="speed-note">{r.note}</p>
        </li>
      ))}
    </ul>
  );
}

// Turn 14 and Comcast share the main line; the internship and tutoring job overlapped, so each gets its own.
const ROW = { temple: 1, "5b": 2 };

function CareerStrip() {
  const s = scale(2018);
  const lanes = experiences
    .slice()
    .reverse()
    .map((j) => ({ id: j.id, label: SHORT[j.id], when: range(j.dates), href: `#job-${j.id}`, dates: j.dates }));
  const grad = toMonth(edu.graduated);
  return (
    <div className="strip" role="list" aria-label="Career timeline">
      {lanes.map((l, i) => (
        <a
          key={l.id}
          role="listitem"
          href={l.href}
          className={`strip-bar strip-${l.id}`}
          aria-label={`${l.label}, ${dash(l.dates)}`}
          style={{ "--l": `${s.at(l.when[0])}%`, "--w": `${s.at(l.when[1]) - s.at(l.when[0])}%`, "--row": ROW[l.id] || 0, "--i": i }}
        >
          <span>{l.label}</span>
        </a>
      ))}
      <span className="strip-grad" style={{ "--l": `${s.at(grad)}%` }}>
        <span>B.B.A. {edu.year}</span>
      </span>
      <div className="strip-years" aria-hidden="true">
        {s.years.map((y) => (
          <span key={y} style={{ "--l": `${s.at(y * 12)}%` }}>
            {String(y).slice(2).padStart(3, "’")}
          </span>
        ))}
      </div>
    </div>
  );
}

function Hero({ onPick, onSearch }) {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="wrap intro">
        <div className="intro-copy">
          <p className="id-place" data-load style={{ "--d": 0 }}>
            {about.role} at {about.company} · {about.location}
          </p>
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
              See projects <ArrowRight />
            </a>
            <a className="btn btn-ghost" href="#contact">
              Get in touch
            </a>
            <a className="btn btn-ghost" href={RESUME} {...external}>
              <Download /> Résumé PDF
            </a>
          </div>
          <p className="id-social" data-load style={{ "--d": 6 }}>
            <a className="link" href={SOCIAL.linkedin} {...external}>LinkedIn</a>
            <a className="link" href={SOCIAL.github} {...external}>GitHub</a>
            <a className="link" href={`mailto:${about.email}`}>{about.email}</a>
          </p>
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

      <div className="wrap bento">
        <div className="tile tile-speed" data-reveal>
          <h2 className="tile-title">{about.sections.speedTitle}</h2>
          <p className="speed-big">
            <span>{about.highlights[0].value}</span> {about.highlights[0].label}.
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
          <h2 className="tile-title">Stack</h2>
          <ul className="stack">
            {STACK.map((name, i) => {
              const s = SKILLS.find((x) => x.name === name);
              return (
                <li key={name} style={{ "--i": i }}>
                  <button type="button" className="stack-btn" onClick={() => onPick(name)}>
                    <SkillLogo logo={logoFor(name)} name={name} size={22} />
                    <span className="stack-name">{name}</span>
                    <span className="stack-count">
                      {s.items.length}
                      <span className="visually-hidden"> places on this page</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <button type="button" className="stack-more" onClick={onSearch}>
            Search all {SKILLS.length} skills <kbd>{SHORTCUT}</kbd>
          </button>
        </div>

        <div className="tile tile-build" data-reveal style={{ "--i": 3 }}>
          <div className="build-media">
            <img src={building.imgPath} alt="The Heartbeat Frame build" width="800" height="480" loading="lazy" />
            <PixelHeart />
          </div>
          <div className="build-body">
            <h2 className="tile-title">Building now</h2>
            <p className="build-name">{building.header}</p>
            <p className="build-desc">{lead(building.desc)}</p>
            <button type="button" className="link-btn" onClick={() => openProject(`p-${slug(building.header)}`)}>
              Open the project <ArrowRight />
            </button>
          </div>
        </div>

        <div className="tile tile-career" data-reveal style={{ "--i": 4 }}>
          <h2 className="tile-title">
            Career <a className="link tile-link" href="#experience">Full history</a>
          </h2>
          <CareerStrip />
        </div>
      </div>
    </section>
  );
}

export default Hero;
