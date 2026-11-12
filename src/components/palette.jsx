import { useEffect, useRef, useState } from "react";
import about from "../json/about.json";
import { RESUME } from "../sections";
import { SKILLS, countLine, logoFor, parseSql, resolveSkill, searchSkills, suggestFor, noteFor } from "../skills";
import { ArrowRight, Search } from "./icons";
import { SkillLogo } from "./logo";

const PLACES = [
  ["Projects", "#projects"],
  ["Experience", "#experience"],
  ["Education", "#education"],
  ["Skills", "#skills"],
  ["Contact", "#contact"],
];
const STARTERS = ["Java", "Spring Boot", "REST APIs", "SQL", "Docker", "Python"];

function buildRows(text) {
  const sql = parseSql(text);
  const q = sql ?? text;
  const skills = q.trim()
    ? (sql ? [resolveSkill(sql)].filter(Boolean) : searchSkills(q)).slice(0, 7)
    : STARTERS.map((n) => SKILLS.find((s) => s.name === n));
  const rows = skills.map((s) => ({ kind: "skill", id: `s-${s.name}`, skill: s }));
  const lower = q.trim().toLowerCase();
  const places = PLACES.filter(([n]) => !lower || n.toLowerCase().startsWith(lower));
  rows.push(...places.map(([label, href]) => ({ kind: "place", id: `g-${href}`, label, href })));
  const hits = (words) => !lower || words.some((w) => w.startsWith(lower));
  if (hits(["resume", "résumé", "pdf", "cv"])) rows.push({ kind: "link", id: "resume", label: "Open the résumé (PDF)", href: RESUME });
  if (hits(["email", "mail"])) rows.push({ kind: "link", id: "mail", label: `Email ${about.email}`, href: `mailto:${about.email}` });
  return rows;
}

// Ctrl/Cmd+K from anywhere. A native <dialog> gives focus trapping and Escape for free.
function Palette({ open, onClose, onPick }) {
  const dialog = useRef(null);
  const input = useRef(null);
  const [text, setText] = useState("");
  const [active, setActive] = useState(0);
  const rows = buildRows(text);
  const sel = Math.min(active, rows.length - 1);

  useEffect(() => {
    const d = dialog.current;
    if (open && !d.open) {
      d.showModal();
      setText("");
      setActive(0);
      input.current?.focus();
    } else if (!open && d.open) d.close();
  }, [open]);

  const choose = (row) => {
    if (!row) return;
    if (row.kind === "skill") {
      onPick(row.skill.name);
      onClose();
      document.getElementById("skills")?.scrollIntoView({ block: "start" });
    } else if (row.kind === "place") {
      onClose();
      document.querySelector(row.href)?.scrollIntoView({ block: "start" });
    } else {
      onClose();
      window.open(row.href, row.href.startsWith("mailto") ? "_self" : "_blank", "noopener,noreferrer");
    }
    setText("");
    setActive(0);
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!rows.length) return;
      const step = e.key === "ArrowDown" ? 1 : -1;
      setActive((sel + step + rows.length) % rows.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(rows[sel]);
    }
  };

  const sqlHit = parseSql(text);
  const noSkill = text.trim() && !rows.some((r) => r.kind === "skill");

  return (
    <dialog
      ref={dialog}
      className="palette"
      aria-label="Find a skill or jump to a section"
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="palette-box">
        <div className="palette-input">
          <Search />
          <input
            ref={input}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Search skills or sections"
            role="combobox"
            aria-expanded={rows.length > 0}
            aria-controls="palette-list"
            aria-activedescendant={rows[sel] ? `pal-${rows[sel].id}` : undefined}
            aria-autocomplete="list"
            autoComplete="off"
            spellCheck="false"
          />
          <kbd>Esc</kbd>
        </div>
        {sqlHit && <p className="palette-sql">Query parsed. Filtering work where skill = &lsquo;{sqlHit}&rsquo;.</p>}
        <ul className="palette-list" id="palette-list" role="listbox" aria-label="Results">
          {noSkill && (
            <li className="palette-empty" role="presentation">
              No skill matches &ldquo;{text.trim()}&rdquo;. Try{" "}
              {suggestFor(text).slice(0, 3).join(", ")}.
            </li>
          )}
          {rows.map((r, i) => (
            <li
              key={r.id}
              id={`pal-${r.id}`}
              role="option"
              aria-selected={i === sel}
              className={`palette-row${i === sel ? " is-active" : ""}`}
              onMouseMove={() => i !== sel && setActive(i)}
              onClick={() => choose(r)}
            >
              {r.kind === "skill" ? (
                <>
                  <span className="palette-ico">
                    <SkillLogo logo={logoFor(r.skill.name)} name={r.skill.name} size={18} />
                  </span>
                  <span className="palette-name">{r.skill.name}</span>
                  <span className="palette-meta">{r.skill.items.length ? countLine(r.skill) : noteFor(r.skill)}</span>
                </>
              ) : (
                <>
                  <span className="palette-ico">
                    <ArrowRight />
                  </span>
                  <span className="palette-name">{r.kind === "place" ? `Go to ${r.label}` : r.label}</span>
                  <span className="palette-meta">{r.kind === "place" ? "section" : "link"}</span>
                </>
              )}
            </li>
          ))}
        </ul>
        <p className="palette-foot">
          <span><kbd>↑</kbd><kbd>↓</kbd> move</span>
          <span><kbd>Enter</kbd> choose</span>
          <span className="palette-hint">Fluent in SQL? So is this box.</span>
        </p>
      </div>
    </dialog>
  );
}

export default Palette;
