function About() {
  return (
    <section className="about wrap" id="about" aria-labelledby="about-title">
      <figure className="about-photo" data-reveal style={{ "--i": 1 }}>
        <img
          src="/profile.webp"
          alt="Mojahed Ibrahim in a navy suit and tie, outdoors"
          width="600"
          height="600"
          loading="lazy"
        />
      </figure>
      <div className="about-text">
        <h2 id="about-title" data-reveal style={{ "--i": 0 }}>
          About
        </h2>
        <p className="statement" data-reveal style={{ "--i": 1 }}>
          Since 2019 I&rsquo;ve built web apps at Turn&nbsp;14 Distribution, from
          MySQL reports to tools for its clients.
        </p>
        <p className="about-body" data-reveal style={{ "--i": 2 }}>
          Before that I managed the front end at Cousin&rsquo;s Supermarket,
          built labour and overtime reports as an intern at Five Below, and
          helped students through data-centric application development as a
          teaching assistant at Temple University. On my own time I write Java
          and Spring Boot services, like the one behind this page&rsquo;s
          contact form.
        </p>
        <dl className="about-facts" data-reveal style={{ "--i": 3 }}>
          <div>
            <dt>Education</dt>
            <dd>Temple University, B.B.A. in Management Information Systems</dd>
          </div>
          <div>
            <dt>Works with</dt>
            <dd>PHP, JavaScript, jQuery, MySQL, Java, Spring&nbsp;Boot, React</dd>
          </div>
        </dl>
      </div>
      <figure className="band" data-reveal>
        <div className="band__frame">
          <img
            src="/assets/temple-bell-tower.webp"
            alt="Panorama of Temple University's Bell Tower and Paley Library, with students on the lawn of Beury Beach"
            width="2400"
            height="574"
            loading="lazy"
            decoding="async"
          />
        </div>
        <figcaption>
          Beury Beach and the Bell Tower at Temple University, where I studied
          Management Information Systems.
        </figcaption>
      </figure>
    </section>
  );
}

export default About;
