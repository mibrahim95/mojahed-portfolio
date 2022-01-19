import React, { Component } from "react";
import projects from "../json/projects.json";
import { Card, Image, Button, Label, Icon, Header } from "semantic-ui-react";

class Projects extends Component {
  handleLinkClick = (e, { urlLink }) => window.open(urlLink, "_blank");

  render() {
    return (
      <div id="projects">
        <Header as="h1" dividing textAlign="left">
          Projects
        </Header>

        <Card.Group centered>
          {projects.code.map((project) => (
            <Card>
              <Image src={project.imgPath} wrapped ui={false} />
              <Card.Content>
                <Card.Header>{project.header}</Card.Header>
                <Card.Meta>
                  <Label.Group size="mini">
                    {project.languages.map((language) => (
                      <Label as="a">{language}</Label>
                    ))}
                  </Label.Group>
                </Card.Meta>
                <Card.Description>{project.desc}</Card.Description>
              </Card.Content>
              <Card.Content extra>
                <div>
                  {project.github && (
                    <Button
                      animated
                      color="github"
                      urlLink={project.github}
                      onClick={this.handleLinkClick}
                    >
                      <Button.Content visible>GitHub Repo</Button.Content>
                      <Button.Content hidden>
                        <Icon name="github"  size="large"/>
                      </Button.Content>
                    </Button>
                  )}
                  {project.url && (
                    <Button
                      animated
                      color="blue"
                      urlLink={project.url}
                      onClick={this.handleLinkClick}
                    >
                      <Button.Content visible>Visit page</Button.Content>
                      <Button.Content hidden>
                        <Icon name="external alternate" /> 
                      </Button.Content>
                    </Button>
                  )}
                </div>
              </Card.Content>
            </Card>
          ))}
        </Card.Group>
      </div>
    );
  }
}
export default Projects;
