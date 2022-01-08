import React, { Component } from "react";
import { Menu, Grid } from "semantic-ui-react";

class Navbar extends Component {
  state = { activeItem: "aboutMe" };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });
  render() {
    const { activeItem } = this.state;

    return (
      <Grid.Row color="grey">
          <Grid.Column width={16}>
        <Menu text size="huge" fixed="top">
          <Menu.Item header>Mojahed Ibrahim</Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item
              name="aboutMe"
              active={activeItem === "aboutMe"}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              name="education"
              active={activeItem === "education"}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              name="projects"
              active={activeItem === "projects"}
              onClick={this.handleItemClick}
            />
          </Menu.Menu>
        </Menu>
        </Grid.Column>
      </Grid.Row>
    );
  }
}
export default Navbar;
