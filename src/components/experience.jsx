import experiences from "../json/expList.json";
import about from "../json/about.json";
import { RESUME, external } from "../sections";

function Experience() {
  return (
    <section className="light" id="experience" aria-labelledby="experience-title">
      <div className="wrap exp-grid">
        <div className="exp-aside" data-reveal>
          <h2 id="experience-title">Experience</h2>
          <p>
            Reporting and data work at Comcast, four years of web development
            at Turn&nbsp;14, and the tutoring and analyst roles that came before.
          </p>
          <a className="btn btn-light" href={RESUME} {...external}>
            Open the full résumé
          </a>
        </div>

        <ol className="timeline">
          {experiences.map((job, i) => {
            const current = /now/i.test(job.dates);
            return (
              <li className="job" key={job.id} data-reveal style={{ "--i": Math.min(i, 3) }}>
                <p className="job-when">{job.dates}</p>
                <div>
                  <h3 className="job-company">
                    {job.title}
                    {current && <span className="job-now">Current</span>}
                  </h3>
                  <p className="job-role">
                    {job.position}
                    {job.location && <span className="job-where"> · {job.location}</span>}
                  </p>
                  {job.desc && <p className="job-desc">{job.desc}</p>}
                  {job.bullets.length > 0 && (
                    <ul className="job-bullets">
                      {job.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            );
          })}
          <li className="job job--edu" data-reveal>
            <p className="job-when">Education</p>
            <div>
              <h3 className="job-company">{about.education.school}</h3>
              <p className="job-role">
                {about.education.detail}, {about.education.year}
              </p>
            </div>
          </li>
        </ol>
      </div>
    </section>
  );
}

export default Experience;
