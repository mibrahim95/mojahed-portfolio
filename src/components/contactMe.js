import React, { Component } from "react";
import { Grid, Form, Segment, Container, Header } from "semantic-ui-react";

class ContactMe extends Component {
  render() {
    return (
      <Grid padded>
        <Grid.Row padded>
          <Grid.Column width={16}>
            <Header as="h1" dividing textAlign="left">
              Contact Me
            </Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row id="contactMe" relaxed="very">
          <Container>
            <Segment raised>
              <Form size="huge">
                <Grid>
                  <Grid.Column computer={7} mobile={16}>
                    <Form.Field>
                      <Form.Input
                        label="Full Name"
                        placeholder="Full name"
                        required
                      />
                      <Form.Input label="Email" placeholder="Email" required />
                    </Form.Field>
                  </Grid.Column>
                  <Grid.Column computer={7} mobile={16}>
                    <Form.TextArea
                      required
                      rows={5}
                      label="Message"
                      placeholder="Please let me know your thoughts"
                    />
                  </Grid.Column>
                  <Grid.Column computer={2} mobile={16} verticalAlign="middle">
                    <Form.Button size="big" floated="right">Send</Form.Button>
                  </Grid.Column>
                </Grid>
              </Form>
            </Segment>
          </Container>
        </Grid.Row>
      </Grid>
    );
  }
}
export default ContactMe;
