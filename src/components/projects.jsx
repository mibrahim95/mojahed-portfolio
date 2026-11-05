import { useEffect, useLayoutEffect, useRef, useState } from "react";
import projects from "../json/projects.json";
import { external } from "../sections";
import { dash, logoFor, slug } from "../skills";
import { OPEN_PROJECT, transition } from "../motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, Close, Lock } from "./icons";
import { SkillLogo } from "./logo";
import { ProjectMedia } from "./media";

const CATEGORY = {
  "Turn 14 Distribution": "work",
  "Telegram contact API": "web",
  "Cousin's Supermarket inventory": "web",
  "Video game maintenance list": "web",
  "This portfolio": "web",
  "Heartbeat Frame": "hardware",
  Homelab: "hardware",
  "Arcade1Up RetroPie mod": "hardware",
};
const FILTERS = [
  ["all", "All"],
  ["work", "Day job"],
  ["web", "Web and APIs"],
  ["hardware", "Hardware and home lab"],
];
const ALL = projects.map((p) => ({ ...p, key: `p-${slug(p.header)}`, cat: CATEGORY[p.header] || "web" }));

// Projects whose code exists but is not public. projects.json says so in the description.
const PRIVATE = new Set(["Heartbeat Frame"]);

// Live site, code, or a plain note that the code is private.
function Links({ p, small }) {
  const size = small ? " btn-sm" : "";
  if (!p.url && !p.github && !PRIVATE.has(p.header)) return null;
  return (
    <div className="proj-links">
      {p.url && (
        <a className={`btn btn-primary${size}`} href={p.url} {...external}>
          Visit site <ArrowUpRight />
          <span className="visually-hidden"> for {p.header}</span>
        </a>
      )}
      {p.github && (
        <a className={`btn btn-ghost${size}`} href={p.github} {...external}>
          Code on GitHub <ArrowUpRight />
          <span className="visually-hidden"> for {p.header}</span>
        </a>
      )}
      {PRIVATE.has(p.header) && (
        <span className="proj-private">
          <Lock width={15} height={15} /> Private repo
        </span>
      )}
    </div>
  );
}

const media = (key) => document.getElementById(key)?.querySelector(".card-media");

function Detail({ project, onClose, onStep }) {
  const ref = useRef(null);

  // Runs inside the transition's flushSync, so the dialog is open before the new frame is captured.
  useLayoutEffect(() => {
    const d = ref.current;
    if (project && !d.open) d.showModal();
    if (!project && d.open) d.close();
  }, [project]);

  return (
    <dialog
      ref={ref}
      className="detail"
      aria-labelledby="detail-title"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") onStep(1);
        if (e.key === "ArrowLeft") onStep(-1);
      }}
    >
      {project && (
        <article className="detail-box">
          <div className="detail-media">
            <ProjectMedia project={project} />
          </div>
          <div className="detail-body">
            <p className="detail-kind">
              {project.kind} · {dash(project.year)}
            </p>
            <h3 id="detail-title">{project.header}</h3>
            <p className="detail-desc">{project.desc}</p>
            <h4>Built with</h4>
            <ul className="detail-stack">
              {project.skills.map((s) => (
                <li key={s}>
                  <SkillLogo logo={logoFor(s)} name={s} size={15} />
                  {s}
                </li>
              ))}
            </ul>
            <Links p={project} small />
          </div>
          <div className="detail-nav">
            <button type="button" className="icon-btn" onClick={() => onStep(-1)} aria-label="Previous project">
              <ChevronLeft />
            </button>
            <button type="button" className="icon-btn" onClick={() => onStep(1)} aria-label="Next project">
              <ChevronRight />
            </button>
            <button type="button" className="icon-btn" onClick={onClose} aria-label="Close" autoFocus>
              <Close />
            </button>
          </div>
        </article>
      )}
    </dialog>
  );
}

function Card({ p, folded, matched, wide, onOpen }) {
  return (
    <li
      id={p.key}
      className={`card${wide ? " is-wide" : ""}${folded ? " is-folded" : ""}${matched ? " is-match" : ""}`}
      style={{ viewTransitionName: `card-${p.key}` }}
    >
      <div className="card-media">
        <ProjectMedia project={p} sizes={wide ? "(min-width: 1100px) 720px, 100vw" : "(min-width: 1100px) 600px, 100vw"} />
      </div>
      <div className="card-body">
        <p className="card-kind">
          <span>{p.kind}</span> <span>{dash(p.year)}</span>
        </p>
        <h3>{p.header}</h3>
        <p className="card-desc">{p.desc}</p>
        <ul className="card-logos" aria-label="Built with">
          {p.languages.map((l) => (
            <li key={l}>
              <SkillLogo logo={logoFor(l)} name={l} size={15} />
              <span>{l}</span>
            </li>
          ))}
        </ul>
        <div className="card-foot">
          <Links p={p} small />
          <button type="button" className="link-btn card-more" onClick={() => onOpen(p)} aria-haspopup="dialog">
            Details<span className="visually-hidden">: {p.header}</span>
          </button>
        </div>
      </div>
    </li>
  );
}

// The grid is three across. The first n % 3 projects get full-width rows, so the rest fill
// whole rows and none is left on its own.
const isWide = (i, n) => i < n % 3;

function Projects({ skill, onPick }) {
  const [cat, setCat] = useState("all");
  const [detail, setDetail] = useState(null);

  const inCat = ALL.filter((p) => cat === "all" || p.cat === cat);
  const matches = (p) => !skill || skill.items.some((i) => i.key === p.key);
  // Matches move to the front; the rest fold up behind them.
  const shown = skill ? [...inCat.filter(matches), ...inCat.filter((p) => !matches(p))] : inCat;
  const lit = inCat.filter(matches).length;

  const open = (p) => {
    const m = media(p.key);
    if (m) m.style.viewTransitionName = "proj-media";
    const vt = transition(() => {
      if (m) m.style.viewTransitionName = "";
      setDetail(p);
    });
    if (!vt && m) m.style.viewTransitionName = "";
  };

  const close = () => {
    if (!detail) return;
    const m = media(detail.key);
    const vt = transition(() => {
      setDetail(null);
      if (m) m.style.viewTransitionName = "proj-media";
    });
    const done = () => m && (m.style.viewTransitionName = "");
    if (vt) vt.finished.finally(done);
    else done();
    document.getElementById(detail.key)?.querySelector(".card-more")?.focus({ preventScroll: true });
  };

  const step = (d) => {
    const i = ALL.findIndex((p) => p.key === detail.key);
    transition(() => setDetail(ALL[(i + d + ALL.length) % ALL.length]));
  };

  useEffect(() => {
    const onOpen = (e) => {
      const p = ALL.find((x) => x.key === e.detail);
      if (p) open(p);
    };
    window.addEventListener(OPEN_PROJECT, onOpen);
    return () => window.removeEventListener(OPEN_PROJECT, onOpen);
  });

  const pickCat = (c) => {
    transition(() => setCat(c));
  };

  return (
    <section className="projects" id="projects" aria-labelledby="projects-title">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <h2 id="projects-title">Projects</h2>
          <p>Code from my Turn&nbsp;14 years and from my own time, from a Spring Boot API to a Raspberry&nbsp;Pi picture frame.</p>
        </div>

        <div className="proj-bar" data-reveal>
          <div className="segmented" role="group" aria-label="Filter projects">
            {FILTERS.map(([id, label]) => {
              const n = id === "all" ? ALL.length : ALL.filter((p) => p.cat === id).length;
              return (
                <button key={id} type="button" aria-pressed={cat === id} onClick={() => pickCat(id)}>
                  {label} <span>{n}</span>
                </button>
              );
            })}
          </div>
          {skill && (
            <p className="proj-note" role="status">
              <SkillLogo logo={logoFor(skill.name)} name={skill.name} size={16} />
              <span>
                <b>{lit}</b> of {inCat.length} use {skill.name}
                {lit < inCat.length && ". The rest are folded at the end"}.
              </span>
              <button type="button" className="link-btn" onClick={() => onPick(null)}>
                Show all
              </button>
            </p>
          )}
        </div>

        <ul className="gallery">
          {shown.filter(matches).map((p, i, list) => (
            <Card key={p.key} p={p} matched={!!skill} wide={isWide(i, list.length)} onOpen={open} />
          ))}
        </ul>
        {skill && lit < inCat.length && (
          <>
            <h3 className="folded-title">No {skill.name} in these</h3>
            <ul className="gallery gallery-folded">
              {shown
                .filter((p) => !matches(p))
                .map((p) => (
                  <Card key={p.key} p={p} folded onOpen={open} />
                ))}
            </ul>
          </>
        )}
      </div>
      <Detail project={detail} onClose={close} onStep={step} />
    </section>
  );
}

export default Projects;
