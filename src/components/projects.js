import React, { Component } from "react";
import projects from "../json/projects.json";
import { Card, Grid, Image, Button, Label, Icon } from "semantic-ui-react";

class Projects extends Component {
  handleLinkClick = (e, { urlLink }) => window.open(urlLink, "_blank");

  render() {
    return (
      <Grid.Row id="projects" color="grey">
        <Card.Group itemsPerRow={3} centered>
          {projects.code.map((project) => (
            <Card fluid>
              <Image src={project.imgPath} wrapped ui={false} />
              <Card.Content>
                <Card.Header>{project.header}</Card.Header>
                <Card.Meta>
                  <Label.Group tag size="mini">
                    {project.languages.map((language) => (
                      <Label as="a">{language}</Label>
                    ))}
                  </Label.Group>
                </Card.Meta>
                <Card.Description>{project.desc}</Card.Description>
              </Card.Content>
              <Card.Content extra>
                <Button
                  color="github"
                  urlLink={project.github}
                  onClick={this.handleLinkClick}
                >
                  <Icon name="github" /> Visit the GitHub Repo
                </Button>
                <Button
                  color="blue"
                  urlLink={project.url}
                  onClick={this.handleLinkClick}
                >
                  <Icon name="external alternate" /> Visit the page
                </Button>
              </Card.Content>
            </Card>
          ))}
        </Card.Group>
      </Grid.Row>
    );
  }
}
export default Projects;
