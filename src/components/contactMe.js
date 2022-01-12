import React, { Component } from "react";
import { Grid, Form, Segment, Container } from "semantic-ui-react";

class ContactMe extends Component {
  render() {
    return (
      <Grid.Row id="contactMe" relaxed="very">
        <Container>
          <Segment raised>
            <Grid.Row>
              <Grid.Column width={6} textAlign="left">
                <Form size="big">
                  <Form.Field>
                    <Form.Input
                      label="Full Name"
                      placeholder="Full name"
                      width={12}
                    />
                  </Form.Field>
                  <Form.Field>
                    <Form.Input label="Email" placeholder="Email" width={12} />
                  </Form.Field>
                </Form>
              </Grid.Column>
              <Grid.Column width={10}>
                <Form size="big">
                  <Form.Group>
                    <Form.TextArea
                      width={10}
                      rows={5}
                      label="Message"
                      placeholder="Please let me know your thought"
                    />
                    <Form.Button>Send</Form.Button>
                  </Form.Group>
                </Form>
              </Grid.Column>
            </Grid.Row>
          </Segment>
        </Container>
      </Grid.Row>
    );
  }
}
export default ContactMe;
