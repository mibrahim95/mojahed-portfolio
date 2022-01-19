import React, { Component } from "react";
import { Grid, Header, Label, Segment, List } from "semantic-ui-react";

class ExpListComputer extends Component {
  render() {
    return (
      <div>
        <Grid divided padded centered only="computer">
          {this.props.exp.map((experience, index) =>
            index % 2 === 0 ? (
              <Grid.Row stretched only="computer">
                <Grid.Column width={6} padded='horizontally'>
                  <Segment size="large">
                    <Header as="h1" textAlign="center">
                      {experience.title}
                    </Header>
                    <Header.Subheader>{experience.position}</Header.Subheader>
                    <Label as="a" color="blue" ribbon="right" size="large">
                      {experience.dates}
                    </Label>
                  </Segment>
                </Grid.Column>

                <Grid.Column width={10} textAlign="center" padded='horizontally'>
                  <Header as="h2">{experience.desc}</Header>
                  <List bulleted size="big" textAlign="center" relaxed="very">
                    {experience.bullets.map((bullet) => (
                      <List.Item>{bullet}</List.Item>
                    ))}
                  </List>
                </Grid.Column>
              </Grid.Row>

            ) : (
              <Grid.Row stretched only="computer">
                <Grid.Column width={10} textAlign="center" padded='horizontally'> 
                  <Header as="h1">{experience.desc}</Header>
                  <List bulleted size="big" textAlign="center" relaxed="very">
                    {experience.bullets.map((bullet) => (
                      <List.Item>{bullet}</List.Item>
                    ))}
                  </List>
                </Grid.Column>
                <Grid.Column width={6} padded='horizontally'>
                  <Segment size="large">
                    <Header as="h2" textAlign="left">
                      {experience.title}
                    </Header>
                    <Header.Subheader>{experience.position}</Header.Subheader>
                    <Label as="a" color="blue" ribbon="right" size="large">
                      {experience.dates}
                    </Label>
                  </Segment>
                </Grid.Column>
              </Grid.Row>
            )
          )}
        </Grid>
      </div>
    );
  }
}
export default ExpListComputer;
