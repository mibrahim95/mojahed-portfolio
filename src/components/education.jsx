import about from "../json/about.json";

function Education() {
  const edu = about.education;
  return (
    <section className="education" id="education" aria-labelledby="education-title">
      <div className="wrap">
        <h2 id="education-title" data-reveal>Education</h2>
        <article className="edu" data-reveal style={{ "--i": 1 }}>
          <p className="edu-when">{edu.graduated}</p>
          <h3 className="edu-school">{edu.school}</h3>
          <p className="edu-college">{edu.college} · {edu.location}</p>
          <p className="edu-degree">
            {edu.degree}, major in <strong>{edu.major}</strong>
          </p>
          <p className="edu-summary">{edu.summary}</p>
          {edu.honors.length > 0 && (
            <ul className="edu-honors" aria-label="Honors">
              {edu.honors.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          )}
          <div className="edu-teaching">
            <h4>{edu.teaching.role}</h4>
            <p className="edu-teaching-when">{edu.teaching.dates}</p>
            <p>{edu.teaching.text}</p>
          </div>
        </article>
      </div>
    </section>
  );
}

export default Education;
