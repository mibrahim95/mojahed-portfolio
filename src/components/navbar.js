import React, { Component } from "react";
import { Menu, Container, Grid, Dropdown } from "semantic-ui-react";
import { HashLink } from "react-router-hash-link";

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
                    as={HashLink}
                    smooth
                    to="#aboutMe"
                    name="aboutMe"
                    active={activeItem === "aboutMe"}
                    onClick={this.handleItemClick}
                  />
                  <Menu.Item
                    as={HashLink}
                    smooth
                    to="#experience"
                    name="experience"
                    active={activeItem === "experience"}
                    onClick={this.handleItemClick}
                  />
                  <Menu.Item
                    as={HashLink}
                    smooth
                    to="#projects"
                    name="projects"
                    active={activeItem === "projects"}
                    onClick={this.handleItemClick}
                  />
                  <Menu.Item
                    as={HashLink}
                    smooth
                    to="#contactMe"
                    name="Contact Me"
                    active={activeItem === "Contact Me"}
                    onClick={this.handleItemClick}
                  />
                </Menu.Menu>
              </Menu>
            </Container>
          </Grid.Row>
          <Grid.Row only="mobile">
            <Menu secondary fixed="top" size="huge">
              <Menu.Menu position="right">
                <Dropdown item icon="sidebar">
                  <Dropdown.Menu>
                    <Dropdown.Item>
                      <Dropdown.Item as={HashLink} smooth to="#aboutMe">
                        About Me
                      </Dropdown.Item>
                      <Dropdown.Item as={HashLink} smooth to="#experience">
                        Experience
                      </Dropdown.Item>
                      <Dropdown.Item as={HashLink} smooth to="#projects">
                        Project
                      </Dropdown.Item>
                      <Dropdown.Item as={HashLink} smooth to="#contactMe">
                        Contact Me
                      </Dropdown.Item>
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
