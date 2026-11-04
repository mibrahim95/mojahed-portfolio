import experiences from "../json/expList.json";
import { RESUME, external } from "../sections";

function Experience() {
  return (
    <section className="experience" id="experience" aria-labelledby="experience-title">
      <h2 id="experience-title" data-reveal>
        Experience
      </h2>
      <ol className="lineup">
        {experiences.map((role, i) => (
          <li key={role.id} data-reveal style={{ "--i": i + 1 }}>
            <details open={i === 0}>
              <summary>
                <span className="lineup__role">{role.position.trim()}</span>
                <span className="lineup__company">{role.title}</span>
                <span className="lineup__kind">{role.kind}</span>
                <span className="lineup__dates">
                  {role.dates}
                  <span className="lineup__toggle" aria-hidden="true" />
                </span>
              </summary>
              <div className="lineup__body">
                <p>{role.desc}</p>
                <ul>
                  {role.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            </details>
          </li>
        ))}
      </ol>
      <p className="experience-foot" data-reveal>
        <a className="link" href={RESUME} {...external}>
          Open the full résumé
        </a>
      </p>
    </section>
  );
}

export default Experience;
