import React, { Component } from "react";
import SummaryList from "./summaryList.js";
import { Image, Grid } from "semantic-ui-react";

class LandingPage extends Component {
  render() {
    return (
          <Grid.Row columns={2} color="grey" id="aboutMe">
            <Grid.Column width={6}>
              <Image src="/linkedInPic.jpeg" size="large" circular />
            </Grid.Column>
            <SummaryList />
          </Grid.Row>
    );
  }
}
export default LandingPage;
