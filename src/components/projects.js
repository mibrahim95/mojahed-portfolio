import React, { Component } from "react";
import projects from "../json/projects.json";
import { Card, Grid, Image, Container, Label } from "semantic-ui-react";

class Projects extends Component {
  render() {
    return (
      <Grid.Row color="grey">
        <Container>
          <Card.Group itemsPerRow={3}>
            {projects.code.map((project) => (
              <Card>
                <Image src={project.imgPath} wrapped ui={false} />
                <Card.Content>
                  <Card.Header>{project.header}</Card.Header>
                  <Card.Meta>
                    <Label.Group tag>
                      {project.languages.map((language) => (
                        <Label as="a">{language}</Label>
                      ))}
                    </Label.Group>
                  </Card.Meta>
                  <Card.Description>{project.desc}</Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Card.Group>
        </Container>
      </Grid.Row>
    );
  }
}
export default Projects;
