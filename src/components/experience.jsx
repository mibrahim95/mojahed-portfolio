import { useRef } from "react";
import experiences from "../json/expList.json";
import SectionHeader from "./sectionHeader";
import { Close, Download } from "./icons";

const RESUME_SRC = "/MojahedResume2022.jpg";

function Role({ role }) {
  const current = /present/i.test(role.dates);
  return (
    <li className="role" data-reveal>
      <div className="role-when mono">
        <span>{role.dates.replace(" - ", " – ")}</span>
        {current && <span className="badge">Current</span>}
      </div>
      <div>
        <h3 className="role-company">{role.title}</h3>
        <p className="role-title">{role.position}</p>
      </div>
      <div className="role-detail">
        <p className="role-desc">{role.desc}</p>
        <ul className="role-bullets">
          {role.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </div>
    </li>
  );
}

function Experience() {
  const dialogRef = useRef(null);

  return (
    <section id="experience" className="section" aria-labelledby="experience-title">
      <div className="wrap">
        <SectionHeader index="02" title="Experience" id="experience-title">
          <button type="button" className="btn" onClick={() => dialogRef.current?.showModal()}>
            View full résumé
          </button>
        </SectionHeader>

        <ol className="timeline">
          {experiences.map((role) => (
            <Role key={role.id} role={role} />
          ))}
        </ol>
      </div>

      <dialog
        ref={dialogRef}
        className="resume-dialog"
        aria-label="Résumé"
        onClick={(e) => e.target === dialogRef.current && dialogRef.current.close()}
      >
        <div className="resume-bar">
          <span className="eyebrow">Résumé</span>
          <div className="actions">
            <a className="btn" href={RESUME_SRC} download="Mojahed-Ibrahim-Resume.jpg">
              <Download /> Download
            </a>
            <button
              type="button"
              className="icon-btn"
              aria-label="Close résumé"
              onClick={() => dialogRef.current?.close()}
              style={{ width: 46, height: 46 }}
            >
              <Close />
            </button>
          </div>
        </div>
        <img src={RESUME_SRC} alt="Mojahed Ibrahim's résumé" width="612" height="792" loading="lazy" />
      </dialog>
    </section>
  );
}

export default Experience;
