import { useState } from "react";
import about from "../json/about.json";
import { ALL, GROUPS, SKILLS, countLine, dash, findSkill, logoFor, noteFor, searchSkills, suggestFor } from "../skills";
import { Close, Search } from "./icons";
import { SkillLogo } from "./logo";
import { SHORTCUT } from "../motion";

const TYPE = { project: "Project", job: "Job", school: "Education" };

export function SkillChip({ name, active, onPick, count = true }) {
  const s = findSkill(name);
  const none = s && !s.items.length;
  return (
    <button
      type="button"
      className={`chip${none ? " is-resume" : ""}`}
      aria-pressed={!!active}
      onClick={() => onPick(active ? null : name)}
      title={none ? noteFor(s) : undefined}
    >
      <SkillLogo logo={logoFor(name)} name={name} size={15} />
      <span>{name}</span>
      {count && s && (
        <span className="chip-count">
          {s.items.length}
          <span className="visually-hidden"> {s.items.length === 1 ? "place" : "places"}</span>
        </span>
      )}
    </button>
  );
}

function Results({ skill, query, onPick }) {
  if (skill) {
    const total = skill.items.length;
    return (
      <div className="results" key={skill.name}>
        <div className="results-head">
          <p className="results-count">
            <SkillLogo logo={logoFor(skill.name)} name={skill.name} size={22} />
            {total ? (
              <>
                <span>
                  <b>{total}</b> {total === 1 ? "match" : "matches"} for <b>{skill.name}</b>
                </span>
                <span className="results-split">{countLine(skill)}</span>
              </>
            ) : (
              <>
                <b>{skill.name}</b>
                <span className="results-split">{noteFor(skill)}</span>
              </>
            )}
          </p>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => onPick(null)}>
            <Close /> Reset
          </button>
        </div>
        {total === 0 ? (
          <p className="results-empty">
            Closest work on this page:{" "}
            {suggestFor(skill.name)
              .filter((n) => n !== skill.name)
              .slice(0, 3)
              .map((n) => (
                <SkillChip key={n} name={n} onPick={onPick} count={false} />
              ))}
          </p>
        ) : (
          <ol className="results-list">
            {skill.items.map((item, i) => (
              <li key={item.key + item.type} style={{ "--i": i }}>
                <a href={`#${item.key}`} className="result">
                  <span className={`result-type t-${item.type}`}>{TYPE[item.type]}</span>
                  <span className="result-title">{item.title}</span>
                  <span className="result-sub">{item.sub}</span>
                  <span className="result-when">{dash(item.when)}</span>
                </a>
              </li>
            ))}
          </ol>
        )}
      </div>
    );
  }
  if (query.trim()) {
    const near = searchSkills(query).slice(0, 6).map((s) => s.name);
    const ideas = near.length ? near : suggestFor(query);
    return (
      <div className="results results-none">
        <p className="results-count">
          {near.length ? (
            <span>Keep typing, or pick one of these:</span>
          ) : (
            <span>
              Nothing on record for <b>&ldquo;{query.trim()}&rdquo;</b>. The closest things I do work with:
            </span>
          )}
        </p>
        <div className="chips">
          {ideas.map((n) => (
            <SkillChip key={n} name={n} onPick={onPick} />
          ))}
        </div>
      </div>
    );
  }
  return null;
}

// "All" first, then the groups that follow the range of the work. All shows the first
// FIRST skills with a plain "showing N of M" line and a chip that reveals the rest; a
// group shows every skill in it. The chip filtering the page always stays in view.
const TABS = [{ group: ALL, short: "All", items: SKILLS.map((x) => x.name) }, ...GROUPS];
const FIRST = 24;

function Cloud({ skill, group, onGroup, onPick }) {
  const [open, setOpen] = useState(false);
  const current = TABS.find((g) => g.group === group) || TABS[0];
  const fold = current.group === ALL && !open && current.items.length > FIRST;
  const shown = fold ? current.items.filter((n, i) => i < FIRST || n === skill?.name) : current.items;
  return (
    <div className="cloud-wrap">
      <div className="rail" role="group" aria-label="Skill groups">
        {TABS.map((g, i) => (
          <button
            key={g.group}
            type="button"
            aria-pressed={current.group === g.group}
            onClick={() => onGroup(g.group)}
            style={{ "--i": i }}
          >
            <span className="rail-name">{g.group}</span>
            <span className="rail-short" aria-hidden="true">{g.short}</span>
            <span className="rail-n">{g.items.length}</span>
          </button>
        ))}
      </div>
      <div className="cloud-pane">
        <p className="cloud-title">
          {current.group}
          <span>
            {fold ? `Showing ${shown.length} of ${current.items.length}` : `${current.items.length} skills`}
          </span>
        </p>
        <ul className="cloud" id="skill-cloud" key={current.group} aria-label={`${current.group}`}>
          {shown.map((n, i) => (
            <li key={n} className={skill?.name === n ? "is-on" : undefined} style={{ "--i": i }}>
              <SkillChip name={n} active={skill?.name === n} onPick={onPick} />
            </li>
          ))}
          {current.group === ALL && current.items.length > FIRST && (
            <li>
              <button type="button" className="chip chip-more" aria-expanded={open} aria-controls="skill-cloud" onClick={() => setOpen((o) => !o)}>
                {open ? "Show fewer" : `+${current.items.length - shown.length} more`}
              </button>
            </li>
          )}
        </ul>
        <p className="cloud-hint">
          {current.group === ALL ? "Or pick a group on the left." : `One of ${GROUPS.length} groups.`} Search every skill from anywhere with{" "}
          <kbd>{SHORTCUT}</kbd>.
        </p>
      </div>
    </div>
  );
}

function Finder({ skill, query, onQuery, onPick, group, onGroup }) {
  const status = skill
    ? `${skill.items.length} ${skill.items.length === 1 ? "match" : "matches"} for ${skill.name}: ${countLine(skill)}.`
    : query.trim()
      ? `No skill called ${query.trim()}.`
      : "";

  return (
    <section className="finder" id="skills" aria-labelledby="finder-title">
      <div className="wrap">
        <div className="finder-panel" data-reveal>
          <div className="finder-side">
            <div className="finder-head">
              <h2 id="finder-title">Find my work by skill</h2>
              <p>
                {about.sections.skills} <kbd>{SHORTCUT}</kbd> searches from anywhere.
              </p>
            </div>

            <div className="finder-box">
              <Search />
              <label htmlFor="finder-input" className="visually-hidden">
                Search skills
              </label>
              <input
                id="finder-input"
                type="search"
                value={query}
                onChange={(e) => onQuery(e.target.value)}
                placeholder="Try Java, Docker or SQL"
                autoComplete="off"
                spellCheck="false"
              />
              {query && (
                <button type="button" className="finder-clear" onClick={() => onPick(null)} aria-label="Clear the search">
                  <Close />
                </button>
              )}
            </div>
          </div>

          <Cloud skill={skill} group={group} onGroup={onGroup} onPick={onPick} />

          <p className="visually-hidden" role="status" aria-live="polite">
            {status}
          </p>
          <Results skill={skill} query={query} onPick={onPick} />
        </div>
      </div>
    </section>
  );
}

export default Finder;
