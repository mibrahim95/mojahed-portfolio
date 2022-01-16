import React, { Component } from "react";
import SummaryList from "./summaryList.js";
import { Image, Grid } from "semantic-ui-react";

class LandingPage extends Component {
  render() {
    return (
      <Grid stackable padded id="aboutMe">
        <Grid.Row columns={2} doubling>
          <Grid.Column width={6}>
            <Image src="/linkedInPic.jpeg" size="large" circular />
          </Grid.Column>
          <SummaryList />
        </Grid.Row>
      </Grid>
    );
  }
}
export default LandingPage;
