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

const STACK = ["PHP", "MySQL", "SQL", "JavaScript", "jQuery", "HTML", "CSS", "Java", "Spring Boot", "React", "Python", "Docker", "Linux", "Git", "Excel", "Raspberry Pi"];
const current = experiences[0];
const building = projects.find((p) => p.header === "Heartbeat Frame");
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

// Before/after bars for the two Comcast speedups, drawn to scale.
function Speedups() {
  const rows = [
    { label: "Slow report, after I rewrote its query, indexes and joins", before: 100, after: 20, note: "80% less runtime" },
    { label: "A recurring report", before: 100, after: 100 / 4.5, note: "4 to 5 hours, now about 1" },
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
      <div className="wrap bento">
        <div className="tile tile-id" data-load style={{ "--d": 0 }}>
          <p className="id-place">
            <span className="dot-live" aria-hidden="true" />
            {about.role}, {about.location}
          </p>
          <h1 id="hero-title">
            Mojahed <em>Ibrahim</em>
          </h1>
          <p className="id-headline">{about.headline}</p>
          <p className="id-lede">{about.lede}</p>
          <div className="id-actions">
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
          <p className="id-social">
            <a className="link" href={SOCIAL.linkedin} {...external}>LinkedIn</a>
            <a className="link" href={SOCIAL.github} {...external}>GitHub</a>
            <a className="link" href={`mailto:${about.email}`}>{about.email}</a>
          </p>
        </div>

        <div className="tile tile-role" data-load style={{ "--d": 1 }}>
          <Portrait className="role-photo" />
          <div className="role-body">
            <h2 className="tile-title">Current role</h2>
            <p className="role-title">{current.position}</p>
            <p className="role-co">{current.title}</p>
            <p className="role-meta">
              Since {current.dates.split(/\s*–/)[0]} · {tenure(current.dates)}
            </p>
            <p className="role-desc">{current.desc}</p>
          </div>
        </div>

        <div className="tile tile-speed" data-load style={{ "--d": 2 }}>
          <h2 className="tile-title">Making slow reports fast</h2>
          <p className="speed-big">
            <span>6+ hours</span> cut from the daily reporting run by running report families in parallel.
          </p>
          <Speedups />
        </div>

        <div className="tile tile-edu" id="education" data-load style={{ "--d": 3 }}>
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

        <div className="tile tile-stack" data-load style={{ "--d": 4 }}>
          <h2 className="tile-title">Daily stack</h2>
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

        <div className="tile tile-build" data-load style={{ "--d": 5 }}>
          <div className="build-media">
            <img src={building.imgPath} alt="The Heartbeat Frame build" width="800" height="480" loading="lazy" />
            <PixelHeart />
          </div>
          <div className="build-body">
            <h2 className="tile-title">
              <span className="dot-live" aria-hidden="true" /> Currently building
            </h2>
            <p className="build-name">{building.header}</p>
            <p className="build-desc">
              A Raspberry Pi 5 gift frame with a color e-ink panel, a round display, two OLEDs, a touch pad and a
              speaker. My Python app drives all of it, and a phone shortcut sends it a heart.
            </p>
            <button type="button" className="link-btn" onClick={() => openProject(`p-${slug(building.header)}`)}>
              Open the project <ArrowRight />
            </button>
          </div>
        </div>

        <div className="tile tile-career" data-load style={{ "--d": 6 }}>
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
