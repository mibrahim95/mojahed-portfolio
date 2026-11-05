import { useEffect, useState } from "react";
import Nav from "./components/nav";
import Hero from "./components/hero";
import Finder from "./components/finder";
import Projects from "./components/projects";
import Experience from "./components/experience";
import ContactMe from "./components/contactMe";
import Footer from "./components/footer";
import Palette from "./components/palette";
import { SkillLogo } from "./components/logo";
import { Close } from "./components/icons";
import useReveal from "./hooks/useReveal";
import { countLine, findSkill, logoFor, parseSql, resolveSkill } from "./skills";
import { transition } from "./motion";

// Shown at the bottom of the screen while a skill filter is on, so it is never a mystery.
function FilterBar({ skill, onReset }) {
  if (!skill) return null;
  return (
    <div className="filterbar" role="status">
      <SkillLogo logo={logoFor(skill.name)} name={skill.name} size={16} />
      <span>
        <b>{skill.name}</b>
        <span className="filterbar-n">{countLine(skill)}</span>
      </span>
      <a className="filterbar-see" href="#skills">Matches</a>
      <button type="button" onClick={onReset} aria-label={`Stop filtering by ${skill.name}`}>
        <Close />
      </button>
    </div>
  );
}

function App() {
  useReveal();
  const [query, setQuery] = useState("");
  const [skill, setSkill] = useState(null);
  const [palette, setPalette] = useState(false);

  const apply = (next) => {
    if (next?.name === skill?.name) return;
    transition(() => setSkill(next));
  };

  // A chip, tile or palette row: an exact skill name, or null to reset.
  const pick = (name) => {
    setQuery(name || "");
    apply(name ? findSkill(name) : null);
  };

  // Typing filters live by the best match; SQL works too.
  const type = (text) => {
    setQuery(text);
    apply(resolveSkill(parseSql(text) ?? text));
  };

  const pickAndShow = (name) => {
    pick(name);
    document.getElementById("skills")?.scrollIntoView({ block: "start" });
  };

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalette((o) => !o);
      } else if (e.key === "/" && !e.target.closest?.("input, textarea, [contenteditable]")) {
        e.preventDefault();
        setPalette(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav onSearch={() => setPalette(true)} />
      <main id="main">
        <Hero onPick={pickAndShow} onSearch={() => setPalette(true)} />
        <Finder skill={skill} query={query} onQuery={type} onPick={pick} />
        <Projects skill={skill} onPick={pick} />
        <Experience skill={skill} />
        <ContactMe />
      </main>
      <Footer />
      <FilterBar skill={skill} onReset={() => pick(null)} />
      <Palette open={palette} onClose={() => setPalette(false)} onPick={pick} />
    </>
  );
}

export default App;
