import { useEffect, useRef, useState } from "react";
import experiences from "../json/expList.json";
import about from "../json/about.json";
import { RESUME, external } from "../sections";
import { dash, logoFor } from "../skills";
import { NOW, range, scale, tenure, toMonth, SHORT } from "../timeline";
import { SkillLogo } from "./logo";
import { Pix } from "./pixel";
import { HERO_IDLE, HERO_IDLE_2, HERO_WALK_A, HERO_WALK_B } from "../sprites";
import { SKIP_KEYS, reducedMotion } from "../motion";

const s = scale(2016);
const edu = about.education;
// Turn 14 and Comcast run back to back on one line; the internship and tutoring job overlapped, so each gets its own.
const LANE = { temple: 2, "5b": 3 };
// Oldest first, for the arrow keys.
const ORDER = experiences.slice().sort((a, b) => range(a.dates)[0] - range(b.dates)[0]).map((j) => j.id);
const mid = (j) => {
  const [a, b] = range(j.dates);
  return s.at(a) + (s.at(b) - s.at(a)) / 2;
};
const SPOT = Object.fromEntries(experiences.map((j) => [j.id, mid(j)]));

// The page's pixel me, walking along the top of the tape to whichever job is selected.
function Walker({ to }) {
  const [from, setFrom] = useState(to);
  const [facing, setFacing] = useState("right");
  const [walk, setWalk] = useState(0);
  const [frame, setFrame] = useState(0);
  const [seen, setSeen] = useState(false);
  const el = useRef(null);

  // Breathe and walk only while the tape is on screen; offscreen the timer stops.
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting));
    io.observe(el.current);
    return () => io.disconnect();
  }, []);

  // A new target: turn to face it and walk for a time that matches the distance.
  if (from !== to) {
    const dx = SPOT[to] - SPOT[from];
    setFrom(to);
    setFacing(dx < 0 ? "left" : "right");
    setWalk(reducedMotion() ? 0 : Math.round(Math.min(1400, Math.max(380, Math.abs(dx) * 22))));
  }

  useEffect(() => {
    if (!walk) return undefined;
    const t = setTimeout(() => setWalk(0), walk);
    return () => clearTimeout(t);
  }, [walk, from]);

  useEffect(() => {
    if (reducedMotion() || !seen) return undefined;
    const t = setInterval(() => setFrame((f) => f + 1), walk ? 140 : 560);
    return () => clearInterval(t);
  }, [walk, seen]);

  const rows = walk ? (frame % 2 ? HERO_WALK_B : HERO_WALK_A) : frame % 2 ? HERO_IDLE_2 : HERO_IDLE;
  return (
    <div className="walker" ref={el} style={{ "--x": SPOT[to], "--dur": `${walk}ms` }} aria-hidden="true">
      <span className="walker-sprite" data-facing={facing}>
        <Pix rows={rows} scale={3} />
      </span>
    </div>
  );
}

// A tape measure pulled out from 2016 to today. One tick per month, a numeral per year.
function Tape({ sel, setSel, isLit }) {
  const grad = toMonth(edu.graduated);
  const ref = useRef(null);
  // On narrow screens the tape scrolls; start at today, the end that matters most.
  useEffect(() => {
    ref.current.scrollLeft = ref.current.scrollWidth;
  }, []);
  return (
    <div className="tape-scroll" data-reveal ref={ref}>
      <div className="tape-area">
        <div className="tape-track">
          <div className="tape-spans" role="list" aria-label="Timeline of school and work">
            <div className={`tspan tspan-school${isLit("education") ? "" : " is-dim"}`} role="listitem" style={{ "--l": "0%", "--w": `${s.at(grad)}%`, "--lane": 0 }}>
              <a href="#education">
                {edu.school}, {edu.short} {edu.major}, to {edu.year}
                <span className="visually-hidden">, graduated {edu.graduated}</span>
              </a>
            </div>
            {experiences.map((j) => {
              const [a, b] = range(j.dates);
              return (
                <div
                  key={j.id}
                  role="listitem"
                  className={`tspan tspan-${j.id}${sel === j.id ? " is-hover" : ""}${isLit(`job-${j.id}`) ? "" : " is-dim"}`}
                  style={{ "--l": `${s.at(a)}%`, "--w": `${s.at(b) - s.at(a)}%`, "--lane": LANE[j.id] || 1 }}
                  onMouseEnter={() => setSel(j.id)}
                >
                  <a href={`#job-${j.id}`} onFocus={() => setSel(j.id)}>
                    {SHORT[j.id]}
                    <span className="visually-hidden">: {j.position}, {dash(j.dates)}</span>
                  </a>
                </div>
              );
            })}
          </div>
          <Walker to={sel} />
        </div>
        <div className="tape" aria-hidden="true">
          <span className="tape-case">
            <span>{about.highlights[1].value}</span>
          </span>
          <div className="tape-blade" style={{ "--months": NOW - s.start, right: `${100 - s.at(NOW)}%` }}>
            {s.years.map((y) => (
              <span key={y} className="tape-year" style={{ "--l": `${s.at(y * 12)}%` }}>
                {y}
              </span>
            ))}
            <span className="tape-hook" style={{ "--l": `${s.at(toMonth("now"))}%` }}>
              <span>now</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const FIRST = 2;

function Job({ job, skill, lit, setSel }) {
  const folded = skill && !lit;
  const extra = job.bullets.slice(FIRST);
  return (
    <li
      className={`job${folded ? " is-folded" : ""}${skill && lit ? " is-match" : ""}`}
      id={`job-${job.id}`}
      data-reveal
      onMouseEnter={() => setSel(job.id)}
      onFocus={() => setSel(job.id)}
    >
      <div className="job-when">
        <p>{dash(job.dates)}</p>
        <p>
          {job.kind} · {tenure(job.dates)}
        </p>
      </div>
      <div className="job-body">
        <h3>
          <span className="job-co">{job.title}</span>
          <span className="job-pos">
            {job.position}, {job.location}
          </span>
        </h3>
        {folded ? (
          <p className="job-fold">No {skill.name} in this role.</p>
        ) : (
          <>
            {job.desc && <p className="job-desc">{job.desc}</p>}
            <ul className="job-bullets">
              {job.bullets.slice(0, FIRST).map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            {extra.length > 0 && (
              <details className="job-more">
                <summary>
                  <span className="job-more-open">
                    {extra.length} more {extra.length === 1 ? "highlight" : "highlights"}
                  </span>
                  <span className="job-more-close">Hide highlights</span>
                  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">
                    <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </summary>
                <div className="job-more-body">
                  <ul className="job-bullets">
                    {extra.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
              </details>
            )}
            <ul className="job-tags" aria-label="Skills used">
              {job.skills.map((t) => (
                <li key={t} className={skill?.name === t ? "is-hit" : undefined}>
                  <SkillLogo logo={logoFor(t)} name={t} size={13} />
                  {t}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </li>
  );
}

function Experience({ skill }) {
  const [sel, setSel] = useState(ORDER.at(-1));
  const root = useRef(null);

  // Left and right walk the timeline while this section holds the middle of the screen.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || e.target.closest?.(SKIP_KEYS)) return;
      const r = root.current.getBoundingClientRect();
      const midY = window.innerHeight / 2;
      if (r.top > midY || r.bottom < midY) return;
      e.preventDefault();
      setSel((id) => ORDER[Math.min(ORDER.length - 1, Math.max(0, ORDER.indexOf(id) + (e.key === "ArrowRight" ? 1 : -1)))]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isLit = (key) => !skill || skill.items.some((i) => i.key === key);
  const lit = experiences.filter((j) => isLit(`job-${j.id}`)).length;
  return (
    <section className="experience" id="experience" aria-labelledby="experience-title" ref={root}>
      <div className="wrap">
        <div className="section-head" data-reveal>
          <h2 id="experience-title">Experience</h2>
          <p>
            {about.sections.experience}{" "}
            <a className="link" href={RESUME} {...external}>Full résumé (PDF)</a>
          </p>
          {skill && (
            <p className="proj-note" role="status">
              <SkillLogo logo={logoFor(skill.name)} name={skill.name} size={16} />
              <span>
                <b>{lit}</b> of {experiences.length} jobs use {skill.name}.
              </span>
            </p>
          )}
        </div>

        <Tape sel={sel} setSel={setSel} isLit={isLit} />

        <ol className="jobs">
          {experiences.map((j) => (
            <Job key={j.id} job={j} skill={skill} lit={isLit(`job-${j.id}`)} setSel={setSel} />
          ))}
        </ol>
      </div>
    </section>
  );
}

export default Experience;
