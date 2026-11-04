import { Menu, Container, Dropdown } from "semantic-ui-react";
import useActiveSection from "../hooks/useActiveSection";

function Navbar({ sections }) {
  const active = useActiveSection(sections.map((s) => s.id));

  return (
    <header className="site-nav">
      <Container>
        <Menu text size="huge" as="nav" aria-label="Main">
          <Menu.Item as="a" href={`#${sections[0].id}`} header>
            Mojahed Ibrahim
          </Menu.Item>

          <Menu.Menu position="right" className="nav-desktop">
            {sections.map(({ id, label }) => (
              <Menu.Item
                key={id}
                as="a"
                href={`#${id}`}
                active={active === id}
                aria-current={active === id ? "location" : undefined}
              >
                {label}
              </Menu.Item>
            ))}
          </Menu.Menu>

          <Menu.Menu position="right" className="nav-mobile">
            <Dropdown item icon="sidebar" direction="left" aria-label="Open menu">
              <Dropdown.Menu>
                {sections.map(({ id, label }) => (
                  <Dropdown.Item
                    key={id}
                    as="a"
                    href={`#${id}`}
                    active={active === id}
                    text={label}
                  />
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Menu>
        </Menu>
      </Container>
    </header>
  );
}

export default Navbar;
