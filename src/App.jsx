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
import { GROUPS, countLine, findSkill, logoFor, parseSql, resolveSkill } from "./skills";
import { transition } from "./motion";

// While a skill filter is on and the search box has scrolled away, a pill under the nav
// says what is filtering the page, with a way back to change it and a way out.
function FilterBar({ skill, onReset }) {
  const [away, setAway] = useState(false);
  useEffect(() => {
    const el = document.querySelector("#skills .finder-box");
    if (!el || !("IntersectionObserver" in window)) return undefined;
    const io = new IntersectionObserver(([e]) => setAway(!e.isIntersecting), { rootMargin: "-110px 0px 0px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  if (!skill || !away) return null;
  return (
    <div className="filterbar" role="status">
      <SkillLogo logo={logoFor(skill.name)} name={skill.name} size={16} />
      <span className="filterbar-text">
        <b>{skill.name}</b>
        <span className="filterbar-n">{countLine(skill)}</span>
        <span className="filterbar-short">
          {skill.items.length} {skill.items.length === 1 ? "match" : "matches"}
        </span>
      </span>
      <a className="filterbar-see" href="#skills">Change</a>
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
  const [group, setGroup] = useState(GROUPS[0].group);

  const apply = (next) => {
    if (next?.name === skill?.name) return;
    transition(() => setSkill(next));
  };

  // A chip, tile or palette row: an exact skill name, or null to reset.
  const pick = (name) => {
    setQuery(name || "");
    const home = name && GROUPS.find((g) => g.items.includes(name));
    if (home) setGroup(home.group);
    apply(name ? findSkill(name) : null);
  };

  // Typing filters live by the best match; SQL works too.
  const type = (text) => {
    setQuery(text);
    apply(resolveSkill(parseSql(text) ?? text));
  };

  const show = () => document.getElementById("skills")?.scrollIntoView({ block: "start" });
  const pickAndShow = (name) => {
    pick(name);
    show();
  };
  // The hero's range tiles open their group in the finder.
  const groupAndShow = (g) => {
    transition(() => setGroup(g));
    show();
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
        <Hero onPick={pickAndShow} onGroup={groupAndShow} onSearch={() => setPalette(true)} />
        <Finder skill={skill} query={query} onQuery={type} onPick={pick} group={group} onGroup={(g) => transition(() => setGroup(g))} />
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
