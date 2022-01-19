import React, { Component } from "react";
import summaryData from "../../json/summaryData.json";
import { Grid, List, Header, Icon } from "semantic-ui-react";

class SummaryList extends Component {
  render() {
    return (
      <Grid.Column width={9} textAlign="left">
        <Header size="huge" textAlign="center">
          Hello, I'm Mojahed
        </Header>
        <Header size="medium" textAlign="center">
          Motivated programmer with a passion for building projects and watching
          them come to life.
        </Header>
        <List animated relaxed="very" size="huge">
          {summaryData.map((summary) => (
            <List.Item id={summary.title + "Summary"}>
              <Icon name={summary.icon} size="large" verticalAlign="middle" />
              <List.Content>
                <List.Header>{summary.title}</List.Header>
                <List.Description>{summary.desc}</List.Description>
              </List.Content>
            </List.Item>
          ))}
        </List>

        <p>Email: MojahedIbrahim95@gmail.com</p>
        <p>Phone: 215-460-6956</p>
        <a href="https://www.linkedin.com/in/mojahed-ibrahim/">
          <Icon name="linkedin" size="huge" color="blue" link />
        </a>
        <a href="https://github.com/mibrahim95">
          <Icon name="github" size="huge" color="black" link />
        </a>
      </Grid.Column>
    );
  }
}
export default SummaryList;
