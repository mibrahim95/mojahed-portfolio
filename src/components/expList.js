import React, { Component } from "react";
import experiences from "../json/expList.json";
import { Grid, List, Placeholder, Divider, Segment } from "semantic-ui-react";

class JobList extends Component {
  render() {
    return (
      <Grid.Row color="black" id="education" inverted>
        <Segment>
          <Grid.Column width={8}>
            <List inverted>
              {experiences.map((experience) => (
                <List.Item>
                  <List.Content>
                    <List.Header>{experience.title}</List.Header>
                    <List.Description>{experience.desc}</List.Description>
                  </List.Content>
                </List.Item>
              ))}
            </List>
          </Grid.Column>
          <Grid.Column width={8} inverted>
            <Placeholder>
              <Placeholder.Image square />
            </Placeholder>
          </Grid.Column>
          <Divider vertical>And</Divider>
        </Segment>
      </Grid.Row>
    );
  }
}
export default JobList;
