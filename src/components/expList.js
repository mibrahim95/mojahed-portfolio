import React, { Component } from "react";
import experiences from "../json/expList.json";
import bullets from "../json/expBullets.json";

import { Grid, List, Header } from "semantic-ui-react";

class JobList extends Component {
  state = { activeBullet: bullets.t14 };

  getRelatedBullets = (e, { id }) => {
    this.setState({ activeBullet: bullets[id] });
  };

  render() {
    const { activeBullet } = this.state;

    return (
      <Grid.Row id="education" divided padded="very">
        <Grid.Column width={6} textAlign="center">
          <List size="massive" relaxed="very" animated>
            {experiences.map((experience) => (
              <List.Item
                id={experience.id}
                key={experience.id}
                onClick={this.getRelatedBullets}
              >
                <List.Content key={experience.id + "content"}>
                  <List.Header>{experience.title}</List.Header>
                  <List.Description>{experience.desc}</List.Description>
                </List.Content>
              </List.Item>
            ))}
          </List>
        </Grid.Column>
        <Grid.Column width={10} textAlign="left">
          <List relaxed="very" bulleted size="huge">
            {activeBullet.bullets.map((bullet) => (
              <List.Item key={bullet}>{bullet}</List.Item>
            ))}
          </List>
        </Grid.Column>
      </Grid.Row>
    );
  }
}
export default JobList;
