import { useState } from "react";
import { GROUPS, countLine, dash, findSkill, logoFor, searchSkills, suggestFor } from "../skills";
import { Close, Search } from "./icons";
import { SkillLogo } from "./logo";
import { SHORTCUT } from "../motion";

const TYPE = { project: "Project", job: "Job", school: "Education" };

export function SkillChip({ name, active, onPick, count = true }) {
  const s = findSkill(name);
  return (
    <button type="button" className="chip" aria-pressed={!!active} onClick={() => onPick(active ? null : name)}>
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
            <span>
              <b>{total}</b> {total === 1 ? "match" : "matches"} for <b>{skill.name}</b>
            </span>
            <span className="results-split">{countLine(skill)}</span>
          </p>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => onPick(null)}>
            <Close /> Reset
          </button>
        </div>
        {total === 0 ? (
          <p className="results-empty">
            {skill.name} is on my résumé, but nothing on this page is tagged with it yet. Related:{" "}
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

// Skills on the résumé that nothing on this page is tagged with get a plain mention, not a chip that finds nothing.
const resumeOnly = (names) => names.filter((n) => !findSkill(n)?.items.length);
const UNTAGGED = resumeOnly(GROUPS.flatMap((g) => g.items));

function Finder({ skill, query, onQuery, onPick }) {
  const [more, setMore] = useState(false);
  const status = skill
    ? `${skill.items.length} ${skill.items.length === 1 ? "match" : "matches"} for ${skill.name}: ${countLine(skill)}.`
    : query.trim()
      ? `No skill called ${query.trim()}.`
      : "";

  return (
    <section className="finder" id="skills" aria-labelledby="finder-title">
      <div className="wrap">
        <div className="finder-panel" data-reveal>
          <div className="finder-head">
            <h2 id="finder-title">Find my work by skill</h2>
            <p>
              Type a skill or pick one. The projects and jobs that use it move up front and the rest fold away.
              Press <kbd>{SHORTCUT}</kbd> to search from anywhere on the page.
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
          <p className="visually-hidden" role="status" aria-live="polite">
            {status}
          </p>

          <Results skill={skill} query={query} onPick={onPick} />

          <div className="groups">
            {GROUPS.filter((g) => (more || !g.more) && g.items.length > resumeOnly(g.items).length).map((g) => (
              <div className="group" key={g.group}>
                <h3>{g.group}</h3>
                <div className="chips">
                  {g.items.filter((n) => !UNTAGGED.includes(n)).map((n) => (
                    <SkillChip key={n} name={n} active={skill?.name === n} onPick={onPick} />
                  ))}
                </div>
              </div>
            ))}
          </div>
          {UNTAGGED.length > 0 && (
            <p className="groups-untagged">
              Also on my résumé, with no project or job here to show for it yet: {UNTAGGED.join(", ")}.
            </p>
          )}
          <button type="button" className="link-btn groups-more" aria-expanded={more} onClick={() => setMore((m) => !m)}>
            {more ? "Fewer skills" : `${GROUPS.at(-1).items.length} more skills from my projects`}
          </button>
        </div>
      </div>
    </section>
  );
}

export default Finder;
