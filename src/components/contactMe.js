import React, { Component } from "react";
import { Grid, Form, Segment, Container } from "semantic-ui-react";

class ContactMe extends Component {
  render() {
    return (
      <Grid.Row id="contactMe" relaxed="very">
        <Container>
          <Segment raised>
            <Form size="huge">
              <Grid>
                <Grid.Column width={7}>
                  <Form.Field>
                    <Form.Input label="Full Name" placeholder="Full name" required />
                    <Form.Input label="Email" placeholder="Email" required />
                  </Form.Field>
                </Grid.Column>
                <Grid.Column width={7}>
                  <Form.TextArea
                    required
                    rows={5}
                    label="Message"
                    placeholder="Please let me know your thoughts"
                  />
                </Grid.Column>
                <Grid.Column width={2} verticalAlign="middle">
                  <Form.Button size="big">Send</Form.Button>
                </Grid.Column>
              </Grid>
            </Form>
          </Segment>
        </Container>
      </Grid.Row>
    );
  }
}
export default ContactMe;
