import React, { Component } from "react";
import experiences from "../json/expList.json";
import bullets from "../json/expBullets.json";

import { Grid, List, Header, Container } from "semantic-ui-react";

class ExpList extends Component {
  state = { activeBullet: bullets.t14 };

  getRelatedBullets = (e, { id }) => {
    this.setState({ activeBullet: bullets[id] });
  };

  render() {
    const { activeBullet } = this.state;

    return (
      <div>
        <Header as="h1" dividing textAlign="left" columns={16}>
          Experience
        </Header>
        <Grid>
          <Grid.Column width={6} textAlign="center">
            <List animated size="huge">
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
            <List bulleted size="big">
              {activeBullet.bullets.map((bullet) => (
                <List.Item key={bullet}>{bullet}</List.Item>
              ))}
            </List>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
export default ExpList;
