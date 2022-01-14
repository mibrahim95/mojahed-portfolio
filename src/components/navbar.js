import React, { Component } from "react";
import { Menu, Container, Grid, Dropdown, Sticky } from "semantic-ui-react";

class Navbar extends Component {
  state = { activeItem: "aboutMe" };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });
  render() {
    const { activeItem } = this.state;

    return (
      <Grid>
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
        <Grid.Row only="mobile" columns={1}>
          <Grid.Column>
            <Menu secondary>
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
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}
export default Navbar;
