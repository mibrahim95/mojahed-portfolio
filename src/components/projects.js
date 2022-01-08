import React, { Component } from "react";
import projects from "../json/projects.json";
import { Card, Grid, Placeholder, Header } from "semantic-ui-react";

class Projects extends Component {
  render() {
    return (
      <Grid.Row color="grey">
          <Header as="h2" textAlign="right">
            Projects
          </Header>
          <Card.Group itemsPerRow={3}>
            {projects.map((project) => (
              <Card
                to="testProject"
                image={<Placeholder.Image />}
                header={project.header}
                meta={project.meta}
                description={project.desc}
              />
            ))}
          </Card.Group>
      </Grid.Row>
    );
  }
}
export default Projects;
