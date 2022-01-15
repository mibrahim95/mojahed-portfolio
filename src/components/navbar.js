import React, { Component } from "react";
import { Menu, Container, Grid, Dropdown } from "semantic-ui-react";

class Navbar extends Component {
  state = { activeItem: "aboutMe" };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });
  render() {
    const { activeItem } = this.state;

    return (
      <div>
        <Grid only="computer">
          <Grid.Row only="computer">
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
                    name="experience"
                    active={activeItem === "experience"}
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
          </Grid.Row>
          <Grid.Row only="mobile">
            <Menu secondary fixed="top">
              <Menu.Menu position="right">
                <Dropdown item icon="sidebar" simple>
                  <Dropdown.Menu>
                    <Dropdown.Item>
                      <Dropdown.Item>About Me</Dropdown.Item>
                      <Dropdown.Item>Experience</Dropdown.Item>
                      <Dropdown.Item>Project</Dropdown.Item>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Menu.Menu>
            </Menu>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}
export default Navbar;
