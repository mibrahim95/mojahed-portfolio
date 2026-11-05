import { useRef, useState } from "react";
import projects from "../json/projects.json";
import { external } from "../sections";
import { ChevronLeft, ChevronRight } from "./icons";

// The Telegram API has no screenshot, so the screen shows what it outputs.
function Phosphor() {
  return (
    <div className="phosphor" aria-label="Example of a message the API delivers to Telegram" role="img">
      <span className="dim">&gt; POST /sendMessage</span>
      <span>Name: Jane Doe</span>
      <span>Email: jane@example.com</span>
      <span>Message: Hi Mojahed, can we talk about a role?</span>
      <span className="dim">&gt; validated · forwarded to Telegram</span>
    </div>
  );
}

function Screen({ project }) {
  return (
    <div className="screen-content" key={project.header}>
      {project.imgPath ? (
        <img
          src={project.imgPath}
          alt={`Screenshot of ${project.header}`}
          width="800"
          height="600"
        />
      ) : (
        <Phosphor />
      )}
    </div>
  );
}

function Projects() {
  const [active, setActive] = useState(0);
  const tabs = useRef([]);
  const project = projects[active];
  const count = projects.length;

  const select = (i, focus = false) => {
    const next = (i + count) % count;
    setActive(next);
    if (focus) tabs.current[next]?.focus();
  };

  const onKeyDown = (e) => {
    const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    if (e.key in keys) {
      e.preventDefault();
      select(active + keys[e.key], true);
    } else if (e.key === "Home") {
      e.preventDefault();
      select(0, true);
    } else if (e.key === "End") {
      e.preventDefault();
      select(count - 1, true);
    }
  };

  return (
    <section className="arcade" id="projects" aria-labelledby="projects-title">
      <div className="wrap">
        <div className="arcade-head" data-reveal>
          <div>
            <p className="arcade-kicker" aria-hidden="true">
              <span className="p1">1UP</span>
              <span className="hi">{count} PROJECTS</span>
            </p>
            <h2 id="projects-title">Select a project</h2>
          </div>
          <div>
            <p className="arcade-intro">
              Production work from Turn&nbsp;14, plus the side projects I build
              for myself and for friends. Pick one, or use the arrow keys.
            </p>
            <p className="press-start" aria-hidden="true">PRESS ◀ ▶ TO SELECT</p>
          </div>
        </div>

        <div className="arcade-stage" data-reveal style={{ "--i": 1 }}>
          <div className="cabinet">
            <div className="cabinet-marquee" aria-hidden="true">
              <span>{project.header}</span>
              <span>{project.year}</span>
            </div>
            <div className="screen" id="project-panel" role="tabpanel" aria-labelledby={`cart-${active}`}>
              <Screen project={project} />
            </div>
            <div className="cabinet-controls">
              <div className="joystick">
                <button type="button" className="joy-btn" onClick={() => select(active - 1)} aria-label="Previous project">
                  <ChevronLeft />
                </button>
                <button type="button" className="joy-btn cyan" onClick={() => select(active + 1)} aria-label="Next project">
                  <ChevronRight />
                </button>
              </div>
              <span className="coin-slot" aria-hidden="true">
                {active + 1} / {count}
              </span>
            </div>
          </div>

          <div className="panel" aria-live="polite">
            <p className="panel-level">
              <span>{project.year === "Personal" ? "BONUS LEVEL" : `LEVEL ${project.year}`}</span>
              <span className="kind">{project.kind.toUpperCase()}</span>
            </p>
            <h3>{project.header}</h3>
            <p className="panel-desc">{project.desc}</p>
            <ul className="powerups" aria-label="Built with">
              {project.languages.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
            {(project.url || project.github) && (
              <div className="panel-actions">
                {project.url && (
                  <a className="pixel-btn" href={project.url} {...external}>
                    ▶ VISIT SITE<span className="visually-hidden">: {project.header}</span>
                  </a>
                )}
                {project.github && (
                  <a className="pixel-btn alt" href={project.github} {...external}>
                    VIEW CODE<span className="visually-hidden">: {project.header}</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="carts" role="tablist" aria-label="Projects" onKeyDown={onKeyDown} data-reveal style={{ "--i": 2 }}>
          {projects.map((p, i) => (
            <button
              key={p.header}
              ref={(el) => (tabs.current[i] = el)}
              type="button"
              role="tab"
              id={`cart-${i}`}
              className="cart"
              aria-selected={i === active}
              aria-controls="project-panel"
              tabIndex={i === active ? 0 : -1}
              onClick={() => select(i)}
            >
              <span className="cart-thumb" aria-hidden="true">
                {p.imgPath ? (
                  <img src={p.imgPath} alt="" width="800" height="600" loading="lazy" />
                ) : (
                  <span className="mini-term">&gt;_</span>
                )}
              </span>
              <span className="cart-name">{p.header}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;
