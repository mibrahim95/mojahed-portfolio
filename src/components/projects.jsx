import projects from "../json/projects.json";
import SectionHeader from "./sectionHeader";
import { ArrowUpRight } from "./icons";

const external = { target: "_blank", rel: "noopener noreferrer" };
const displayUrl = (href) => href.replace(/^https?:\/\//, "").replace(/\/$/, "");

// Illustrates the contact API for the project that has no screenshot.
function Terminal() {
  return (
    <div className="terminal" aria-hidden="true">
      <span className="t-dim">$</span> curl -X POST /contact \{"\n"}
      {"    "}-d <span className="t-accent">{'\'{"fullName":"Ada","email":"ada@…","msg":"Hi!"}\''}</span>
      {"\n\n"}
      <span className="t-ok">✓</span> request validated{"\n"}
      <span className="t-ok">✓</span> forwarded to Telegram bot{"\n"}
      <span className="t-dim">←</span> 200 OK <span className="t-dim">{"{ \"status\": \"sent\" }"}</span>
    </div>
  );
}

function Frame({ project }) {
  const href = project.url || project.github;
  return (
    <div className="frame">
      <div className="frame-bar">
        <div className="frame-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <div className="frame-url">{displayUrl(href)}</div>
      </div>
      {project.imgPath ? (
        <img
          src={project.imgPath}
          alt={`Screenshot of ${project.header}`}
          width="800"
          height="450"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <Terminal />
      )}
    </div>
  );
}

function Project({ project, index }) {
  const href = project.url || project.github;
  return (
    <article
      className={`project${project.featured ? " is-featured" : ""}`}
      data-reveal
      style={{ "--reveal-delay": `${(index % 2) * 80}ms` }}
    >
      <a className="frame-link" href={href} {...external} tabIndex={-1} aria-hidden="true">
        <Frame project={project} />
      </a>
      <div className="project-body">
        <p className="project-meta mono">
          <span className="num">{String(index + 1).padStart(2, "0")}</span>
          {project.featured && <span>Featured · day job</span>}
        </p>
        <h3 className="project-title">{project.header}</h3>
        <p className="project-desc">{project.desc}</p>
        <ul className="stack" aria-label="Technologies">
          {project.languages.map((lang) => (
            <li key={lang}>{lang}</li>
          ))}
        </ul>
        <div className="project-links">
          {project.url && (
            <a className="text-link" href={project.url} {...external}>
              Visit site <ArrowUpRight />
              <span className="visually-hidden"> for {project.header}</span>
            </a>
          )}
          {project.github && (
            <a className="text-link" href={project.github} {...external}>
              Source on GitHub <ArrowUpRight />
              <span className="visually-hidden"> for {project.header}</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function Projects() {
  return (
    <section id="projects" className="section" aria-labelledby="projects-title">
      <div className="wrap">
        <SectionHeader index="03" title={<>Selected <em>work</em></>} id="projects-title">
          <p className="section-intro">
            From production tools at my day job to side projects built to scratch
            my own itch.
          </p>
        </SectionHeader>
        <div className="projects-grid">
          {projects.map((project, i) => (
            <Project key={project.header} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;
