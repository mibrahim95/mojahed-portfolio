import about from "../json/about.json";

function Skills() {
  return (
    <section className="skills" id="skills" aria-labelledby="skills-title">
      <div className="wrap">
        <h2 id="skills-title" data-reveal>Skills</h2>
        <dl className="highlights" data-reveal style={{ "--i": 1 }}>
          {about.highlights.map((h) => (
            <div className="highlight" key={h.value}>
              <dt>{h.value}</dt>
              <dd>{h.label}</dd>
            </div>
          ))}
        </dl>
        <div className="skill-groups" data-reveal style={{ "--i": 2 }}>
          {about.skills.map((g) => (
            <div className="skill-group" key={g.group}>
              <h3>{g.group}</h3>
              <ul>
                {g.items.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;
