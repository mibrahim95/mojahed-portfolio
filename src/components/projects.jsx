import { useEffect, useLayoutEffect, useRef, useState } from "react";
import projects from "../json/projects.json";
import about from "../json/about.json";
import { external } from "../sections";
import { dash, logoFor, slug } from "../skills";
import { OPEN_PROJECT, transition } from "../motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, Close, Lock } from "./icons";
import { SkillLogo } from "./logo";
import { ProjectMedia } from "./media";

// Three projects get a full case study; the rest go in a compact index. Day job first,
// then the backend service, then the hardware build (see options/projects-research.md).
const FEATURED = ["Turn 14 Distribution", "Telegram contact API", "Heartbeat Frame"];
const ALL = projects.map((p) => ({ ...p, key: `p-${slug(p.header)}` }));
const LEAD = FEATURED.map((h) => ALL.find((p) => p.header === h)).filter(Boolean);
const REST = ALL.filter((p) => !FEATURED.includes(p.header));
// Long stacks show their first few here; the detail dialog lists them all.
const STACK_MAX = 12;

// A description's first sentence says what the thing is; the rest says how it works.
function split(desc) {
  const [first, ...rest] = desc.split(/(?<=\.)\s+/);
  return [first, rest.join(" ")];
}

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

const media = (key) => document.getElementById(key)?.querySelector(".case-media");

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

// One case study: big picture, what it is, how it works, what it is built with, where to see it.
// `problem` and `outcome` show when projects.json has them.
function Case({ p, n, lit, dim, onOpen }) {
  const [what, how] = split(p.desc);
  return (
    <article
      id={p.key}
      className={`case case-${n}${lit ? " is-match" : ""}${dim ? " is-dim" : ""}`}
      aria-labelledby={`${p.key}-t`}
      data-reveal
    >
      <div className="case-frame">
        <button type="button" className="case-media" onClick={() => onOpen(p)} aria-haspopup="dialog" aria-label={`Open ${p.header}`}>
          <ProjectMedia project={p} sizes={n === 0 ? "(min-width: 1100px) 760px, 100vw" : "(min-width: 1100px) 600px, 100vw"} />
        </button>
      </div>
      <div className="case-body">
        <p className="case-kind">
          <span>{p.kind}</span>
          <span>{dash(p.year)}</span>
        </p>
        <h3 id={`${p.key}-t`}>{p.header}</h3>
        <p className="case-what">{what}</p>
        <dl className="case-facts">
          {p.problem && (
            <div>
              <dt>The problem</dt>
              <dd>{p.problem}</dd>
            </div>
          )}
          {how && (
            <div>
              <dt>How it works</dt>
              <dd>{how}</dd>
            </div>
          )}
          {p.outcome && (
            <div>
              <dt>Outcome</dt>
              <dd>{p.outcome}</dd>
            </div>
          )}
          <div>
            <dt>Stack</dt>
            <dd>
              <ul className="case-stack">
                {p.skills.slice(0, STACK_MAX).map((s) => (
                  <li key={s}>
                    <SkillLogo logo={logoFor(s)} name={s} size={14} />
                    {s}
                  </li>
                ))}
                {p.skills.length > STACK_MAX && (
                  <li className="case-stack-more">
                    <button type="button" className="link-btn" onClick={() => onOpen(p)} aria-haspopup="dialog">
                      {p.skills.length - STACK_MAX} more<span className="visually-hidden"> skills used in {p.header}</span>
                    </button>
                  </li>
                )}
              </ul>
            </dd>
          </div>
        </dl>
        <Links p={p} />
      </div>
    </article>
  );
}

// More builds: every one is on show as a card with its picture, what it is and its
// stack. A card opens the full write-up; nothing is hidden behind a hover.
function Builds({ items, isLit, skill, onOpen }) {
  return (
    <ul className="builds">
      {items.map((p, i) => {
        const lit = skill && isLit(p);
        return (
          <li
            key={p.key}
            id={p.key}
            className={`build build-${i}${lit ? " is-match" : ""}${skill && !lit ? " is-dim" : ""}`}
            data-reveal
            style={{ "--i": i }}
          >
            <button type="button" className="build-btn proj-open" onClick={() => onOpen(p)} aria-haspopup="dialog">
              <span className="build-pic case-media">
                <ProjectMedia project={p} sizes="(min-width: 900px) 400px, 100vw" />
              </span>
              <span className="build-meta">
                <span>{p.kind}</span>
                <span>{dash(p.year)}</span>
              </span>
              <span className="build-title">
                {p.header} <ArrowUpRight className="build-arrow" />
              </span>
              <span className="build-what">{split(p.desc)[0]}</span>
              <span className="build-stack" aria-hidden="true">
                {p.languages.slice(0, 5).map((l) => (
                  <SkillLogo key={l} logo={logoFor(l)} name={l} size={15} />
                ))}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function Projects({ skill, onPick }) {
  const [detail, setDetail] = useState(null);

  const isLit = (p) => !skill || skill.items.some((i) => i.key === p.key);
  const lit = ALL.filter(isLit).length;

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
    document.getElementById(detail.key)?.querySelector(".case-media, .proj-open")?.focus({ preventScroll: true });
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

  return (
    <section className="projects" id="projects" aria-labelledby="projects-title">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <h2 id="projects-title">Projects</h2>
          <p>{about.sections.projects}</p>
          {skill && (
            <p className="proj-note">
              <SkillLogo logo={logoFor(skill.name)} name={skill.name} size={16} />
              <span>
                <b>{lit}</b> of {ALL.length} use {skill.name}
                {lit < ALL.length && ". The others are dimmed"}.
              </span>
              <button type="button" className="link-btn" onClick={() => onPick(null)}>
                Show all
              </button>
            </p>
          )}
        </div>

        <div className="cases">
          {LEAD.map((p, n) => (
            <Case key={p.key} p={p} n={n} lit={skill && isLit(p)} dim={skill && !isLit(p)} onOpen={open} />
          ))}
        </div>

        <div className="index-head" data-reveal>
          <h3>More builds</h3>
          <p>The server I run at home, this site, and smaller PHP and MySQL tools. Each card opens the full write-up.</p>
        </div>
        <Builds items={REST} isLit={isLit} skill={skill} onOpen={open} />
      </div>
      <Detail project={detail} onClose={close} onStep={step} />
    </section>
  );
}

export default Projects;
