import { useState } from "react";
import projects from "../json/projects.json";
import Chat from "./chat";
import { external } from "../sections";

function Picture({ project }) {
  if (!project.imgPath) {
    return (
      <Chat
        name="Jane Doe"
        email="jane@example.com"
        msg="Hi Mojahed, I saw your portfolio and would like to talk about a role."
      />
    );
  }
  return (
    <img
      src={project.imgPath}
      alt={`Screenshot of ${project.header}`}
      width="800"
      height="600"
      decoding="async"
    />
  );
}

function Work() {
  const [active, setActive] = useState(0);

  return (
    <section className="work wrap" id="work" aria-labelledby="work-title">
      <div className="work-inner">
        <h2 className="work-head" id="work-title" data-reveal>
          Selected work
        </h2>
        <ul className="work-list">
          {projects.map((project, i) => {
            const isActive = i === active;
            const detailId = `work-detail-${i}`;
            return (
              <li
                key={project.header}
                className={`work-item${isActive ? " is-active" : ""}`}
              >
                <button
                  type="button"
                  className="work-row"
                  data-reveal
                  style={{ "--i": i + 1 }}
                  aria-expanded={isActive}
                  aria-controls={detailId}
                  onClick={() => setActive(i)}
                  onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
                  onFocus={() => setActive(i)}
                >
                  <span className="work-row__name">{project.header}</span>
                  <span className="work-row__kind">{project.kind}</span>
                  <span className="work-row__year">{project.year}</span>
                </button>
                <div className="work-detail" id={detailId}>
                  <div className="work-detail__frame">
                    <Picture project={project} />
                  </div>
                  <p className="work-detail__desc">{project.desc}</p>
                  <p className="work-detail__stack">{project.languages.join(", ")}</p>
                  <ul className="links-row">
                    {project.url && (
                      <li>
                        <a className="link" href={project.url} {...external}>
                          Visit the site<span className="visually-hidden">: {project.header}</span>
                        </a>
                      </li>
                    )}
                    {project.github && (
                      <li>
                        <a className="link" href={project.github} {...external}>
                          Read the code<span className="visually-hidden">: {project.header}</span>
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default Work;
