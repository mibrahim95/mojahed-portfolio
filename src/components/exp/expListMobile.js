import React, { Component } from "react";
import { Grid, Header, Label, Segment, List } from "semantic-ui-react";

class ExpListMobile extends Component {
  render() {
    return (
      <div>
        <Grid divided padded centered>
          {this.props.exp.map((experience, index) =>
            index % 2 === 0 ? (
              <Grid.Row key={index} stretched only="mobile">
                <Grid.Column width={8} padded='horizontally'>
                  <Segment size="large">
                    <Header as="h3" textAlign="center">
                      {experience.title}
                    </Header>
                    <Header.Subheader>{experience.position}</Header.Subheader>
                    <Label as="a" color="blue" ribbon="right" size="tiny">
                      {experience.dates}
                    </Label>
                  </Segment>
                </Grid.Column>
                <Grid.Column width={8} textAlign="center" padded='horizontally'>
                  <Header as="h5">{experience.desc}</Header>
                  <List bulleted size="mini" textAlign="left" padded>
                    {experience.bullets.map((bullet) => (
                      <List.Item key={bullet}>{bullet}</List.Item>
                    ))}
                  </List>
                </Grid.Column>
              </Grid.Row>
            ) : (
              <Grid.Row key={index} stretched only="mobile">
                <Grid.Column width={8} textAlign="center" padded='horizontally'> 
                  <Header as="h5">{experience.desc}</Header>
                  <List bulleted size="mini" textAlign="left" padded>
                    {experience.bullets.map((bullet) => (
                      <List.Item key={bullet}>{bullet}</List.Item>
                    ))}
                  </List>
                </Grid.Column>
                <Grid.Column width={8} padded='horizontally'>
                  <Segment size="large">
                    <Header as="h3" textAlign="center">
                      {experience.title}
                    </Header>
                    <Header.Subheader>{experience.position}</Header.Subheader>
                    <Label as="a" color="blue" ribbon="right" size="tiny">
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
export default ExpListMobile;
