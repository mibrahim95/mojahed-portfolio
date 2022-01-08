import React, { Component } from "react";
import summaryData from "../../json/summaryData.json";
import { Grid, List, Header, Icon, Menu } from "semantic-ui-react";

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
        <List animated relaxed size="huge">
          {summaryData.map((summary) => (
            <List.Item>
              <Icon name={summary.icon} size="large" verticalAlign='middle'/>
              <List.Content>
                <List.Header>{summary.title}</List.Header>
                <List.Description>{summary.desc}</List.Description>
              </List.Content>
            </List.Item>
          ))}
        </List>

        <p>Email: MojahedIbrahim95@gmail.com</p>
        <p>Phone: 215-460-6956</p>
        <div>
          <Menu.Item href="https://www.linkedin.com/in/mojahed-ibrahim/" position="right" target="_blank">
            <Icon name="linkedin" size="huge" color="blue" link />
          </Menu.Item>
          <Menu.Item href="https://github.com/mibrahim95" position="right" target="_blank">
            <Icon name="github" size="huge" color="black" link/>
          </Menu.Item>
        </div>
      </Grid.Column>
    );
  }
}
export default SummaryList;
