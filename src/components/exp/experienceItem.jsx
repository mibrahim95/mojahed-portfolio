import { Grid, Header, Label, Segment, List } from "semantic-ui-react";

// One job. On tablet and desktop the card and the bullets sit side by side,
// alternating sides each row; on phones they stack (card first).
function ExperienceItem({ experience, flipped }) {
  return (
    <Grid.Row
      className="experience-item"
      reversed={flipped ? "computer tablet" : undefined}
    >
      <Grid.Column width={6}>
        <Segment size="large">
          <Header as="h3" size="large" textAlign="center">
            {experience.title}
            <Header.Subheader>{experience.position}</Header.Subheader>
          </Header>
          <Label color="blue" ribbon="right" size="large">
            {experience.dates}
          </Label>
        </Segment>
      </Grid.Column>
      <Grid.Column width={10}>
        <Header as="h4" size="medium" textAlign="center">
          {experience.desc}
        </Header>
        <List bulleted size="large" relaxed className="bullets">
          {experience.bullets.map((bullet) => (
            <List.Item key={bullet}>{bullet}</List.Item>
          ))}
        </List>
      </Grid.Column>
    </Grid.Row>
  );
}

export default ExperienceItem;
