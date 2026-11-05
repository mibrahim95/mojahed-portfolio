import { useEffect, useRef, useState } from "react";
import experiences from "../json/expList.json";
import about from "../json/about.json";
import { RESUME, external } from "../sections";
import { dash, logoFor } from "../skills";
import { NOW, range, scale, tenure, toMonth, SHORT } from "../timeline";
import { SkillLogo } from "./logo";

const s = scale(2016);
const edu = about.education;
// Turn 14 and Comcast run back to back on one line; the internship and tutoring job overlapped, so each gets its own.
const LANE = { temple: 2, "5b": 3 };

// A tape measure pulled out from 2016 to today. One tick per month, a numeral per year.
function Tape({ hover, setHover, isLit }) {
  const grad = toMonth(edu.graduated);
  const ref = useRef(null);
  // On narrow screens the tape scrolls; start at today, the end that matters most.
  useEffect(() => {
    ref.current.scrollLeft = ref.current.scrollWidth;
  }, []);
  return (
    <div className="tape-scroll" data-reveal ref={ref}>
      <div className="tape-area">
        <div className="tape-spans" role="list" aria-label="Timeline of school and work">
          <div className={`tspan tspan-school${isLit("education") ? "" : " is-dim"}`} role="listitem" style={{ "--l": "0%", "--w": `${s.at(grad)}%`, "--lane": 0 }}>
            <a href="#education">
              {edu.school}, {edu.short} {edu.major}
              <span className="visually-hidden">, graduated {edu.graduated}</span>
            </a>
          </div>
          {experiences.map((j) => {
            const [a, b] = range(j.dates);
            return (
              <div
                key={j.id}
                role="listitem"
                className={`tspan tspan-${j.id}${hover === j.id ? " is-hover" : ""}${isLit(`job-${j.id}`) ? "" : " is-dim"}`}
                style={{ "--l": `${s.at(a)}%`, "--w": `${s.at(b) - s.at(a)}%`, "--lane": LANE[j.id] || 1 }}
                onMouseEnter={() => setHover(j.id)}
                onMouseLeave={() => setHover(null)}
              >
                <a href={`#job-${j.id}`}>
                  {SHORT[j.id]}
                  <span className="visually-hidden">: {j.position}, {dash(j.dates)}</span>
                </a>
              </div>
            );
          })}
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

const FIRST = 3;

function Job({ job, skill, lit, setHover }) {
  const [open, setOpen] = useState(false);
  const folded = skill && !lit;
  const extra = job.bullets.length - FIRST;
  const bullets = open ? job.bullets : job.bullets.slice(0, FIRST);
  const listId = `bullets-${job.id}`;
  return (
    <li
      className={`job${folded ? " is-folded" : ""}${skill && lit ? " is-match" : ""}`}
      id={`job-${job.id}`}
      data-reveal
      onMouseEnter={() => setHover(job.id)}
      onMouseLeave={() => setHover(null)}
      onFocus={() => setHover(job.id)}
      onBlur={() => setHover(null)}
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
            <ul className="job-bullets" id={listId}>
              {bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            {extra > 0 && (
              <button type="button" className="link-btn" aria-expanded={open} aria-controls={listId} onClick={() => setOpen((o) => !o)}>
                {open ? "Show fewer" : `Show ${extra} more`}
              </button>
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
  const [hover, setHover] = useState(null);
  const isLit = (key) => !skill || skill.items.some((i) => i.key === key);
  const lit = experiences.filter((j) => isLit(`job-${j.id}`)).length;
  return (
    <section className="experience" id="experience" aria-labelledby="experience-title">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <h2 id="experience-title">Experience</h2>
          <p>
            An internship and a tutoring job, four years of PHP and MySQL at Turn&nbsp;14, then reporting and data
            pipelines at Comcast. <a className="link" href={RESUME} {...external}>Full résumé (PDF)</a>
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

        <Tape hover={hover} setHover={setHover} isLit={isLit} />

        <ol className="jobs">
          {experiences.map((j) => (
            <Job key={j.id} job={j} skill={skill} lit={isLit(`job-${j.id}`)} setHover={setHover} />
          ))}
        </ol>
      </div>
    </section>
  );
}

export default Experience;
