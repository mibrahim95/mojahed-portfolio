import { Grid } from "semantic-ui-react";
import SummaryList from "./summaryList";

function LandingPage() {
  return (
    <section id="aboutMe" className="section intro">
      <Grid stackable verticalAlign="middle">
        <Grid.Row>
          <Grid.Column width={6} textAlign="center">
            <img
              className="ui circular image profile-photo"
              src="/profile.webp"
              alt="Portrait of Mojahed Ibrahim"
              width="600"
              height="600"
              fetchpriority="high"
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <SummaryList />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </section>
  );
}

export default LandingPage;
