import { Card, Image, Button, Label, Icon, Header } from "semantic-ui-react";
import projects from "../json/projects.json";

const external = { target: "_blank", rel: "noopener noreferrer" };

function ProjectCard({ project }) {
  return (
    <Card className="project-card">
      {project.imgPath ? (
        <Image
          src={project.imgPath}
          alt={`Screenshot of ${project.header}`}
          width="800"
          height="430"
          loading="lazy"
          decoding="async"
          wrapped
          ui={false}
        />
      ) : (
        <div className="image project-placeholder" aria-hidden="true">
          <Icon name="code" size="huge" />
        </div>
      )}
      <Card.Content>
        <Card.Header as="h3">{project.header}</Card.Header>
        <Card.Meta>
          <Label.Group size="mini">
            {project.languages.map((language) => (
              <Label key={language}>{language}</Label>
            ))}
          </Label.Group>
        </Card.Meta>
        <Card.Description>{project.desc}</Card.Description>
      </Card.Content>
      {(project.github || project.url) && (
        <Card.Content extra>
          {project.github && (
            <Button
              as="a"
              href={project.github}
              {...external}
              animated
              color="black"
              aria-label={`${project.header} GitHub repository`}
            >
              <Button.Content visible>GitHub Repo</Button.Content>
              <Button.Content hidden>
                <Icon name="github" size="large" />
              </Button.Content>
            </Button>
          )}
          {project.url && (
            <Button
              as="a"
              href={project.url}
              {...external}
              animated
              color="blue"
              aria-label={`Visit ${project.header}`}
            >
              <Button.Content visible>Visit Page</Button.Content>
              <Button.Content hidden>
                <Icon name="external alternate" />
              </Button.Content>
            </Button>
          )}
        </Card.Content>
      )}
    </Card>
  );
}

function Projects() {
  return (
    <section id="projects" className="section">
      <Header as="h2" size="huge" dividing>
        Projects
      </Header>
      <Card.Group centered stackable>
        {projects.map((project) => (
          <ProjectCard key={project.header} project={project} />
        ))}
      </Card.Group>
    </section>
  );
}

export default Projects;
