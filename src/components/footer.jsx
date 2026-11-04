import { Container, Icon } from "semantic-ui-react";

function Footer() {
  return (
    <footer className="site-footer">
      <Container>
        <p>
          <a
            href="https://www.linkedin.com/in/mojahed-ibrahim/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="linkedin" aria-hidden="true" />
            LinkedIn
          </a>
          <a
            href="https://github.com/mibrahim95"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="github" aria-hidden="true" />
            GitHub
          </a>
        </p>
        <p>© {new Date().getFullYear()} Mojahed Ibrahim</p>
      </Container>
    </footer>
  );
}

export default Footer;
