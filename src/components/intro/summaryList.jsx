import { List, Header, Icon } from "semantic-ui-react";
import summaryData from "../../json/summaryData.json";

function SummaryList() {
  return (
    <>
      <Header as="h1" size="huge" textAlign="center">
        Hello, I&apos;m Mojahed
        <Header.Subheader>
          Motivated programmer with a passion for building projects and watching
          them come to life.
        </Header.Subheader>
      </Header>
      <List relaxed="very" size="huge" className="summary-list">
        {summaryData.map((summary) => (
          <List.Item key={summary.title}>
            <Icon name={summary.icon} size="large" aria-hidden="true" />
            <List.Content>
              <List.Header>{summary.title}</List.Header>
              <List.Description>{summary.desc}</List.Description>
            </List.Content>
          </List.Item>
        ))}
      </List>
      <div className="social-links">
        <a
          href="https://www.linkedin.com/in/mojahed-ibrahim/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Mojahed on LinkedIn"
        >
          <Icon name="linkedin" size="huge" color="blue" link aria-hidden="true" />
        </a>
        <a
          href="https://github.com/mibrahim95"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Mojahed on GitHub"
        >
          <Icon name="github" size="huge" color="black" link aria-hidden="true" />
        </a>
      </div>
    </>
  );
}

export default SummaryList;
