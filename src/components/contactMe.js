import React, { Component } from "react";
import { Grid, Form, Segment, Container, Header } from "semantic-ui-react";

class ContactMe extends Component {
  state = { fullName: "", email: "", msg: "" };

  handleFormChange = (e, { name }) => this.setState({ [name]: e.target.value });

  submitContactRequest = () => {
    console.log(process.env);
    let text = `Hello Mojo,${this.state.fullName} has requested to contact you with the following message: 
      ${this.state.msg} Please reach out to him at  ${this.state.email}`;
    fetch(
      `https://api.telegram.org/bot${process.env.REACT_APP_TELEGRAM_BOT_KEY}/sendMessage?chat_id=${process.env.REACT_APP_CONTACTME_TELEGRAM_CHANNEL}&text=${text}`,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((result) => {
        this.setState({ fullName: "", email: "", msg: "" });
        console.log("Success:", result);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

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
                        name="fullName"
                        required
                        onChange={this.handleFormChange}
                        value={this.state.fullName}
                      />
                      <Form.Input
                        label="Email"
                        placeholder="Email"
                        name="email"
                        required
                        onChange={this.handleFormChange}
                        value={this.state.email}
                      />
                    </Form.Field>
                  </Grid.Column>
                  <Grid.Column computer={7} mobile={16}>
                    <Form.TextArea
                      required
                      rows={5}
                      label="Message"
                      placeholder="Please let me know your thoughts"
                      name="msg"
                      onChange={this.handleFormChange}
                      value={this.state.msg}
                    />
                  </Grid.Column>
                  <Grid.Column computer={2} mobile={16} verticalAlign="middle">
                    <Form.Button
                      size="big"
                      floated="right"
                      onClick={this.submitContactRequest}
                    >
                      Send
                    </Form.Button>
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
