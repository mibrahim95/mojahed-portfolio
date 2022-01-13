import React, { Component } from "react";
import { Menu, Container } from "semantic-ui-react";

class Navbar extends Component {
  state = { activeItem: "aboutMe" };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });
  render() {
    const { activeItem } = this.state;

    return (
      <Container>
        <Menu text size="huge">
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
      </Container>
    );
  }
}
export default Navbar;
