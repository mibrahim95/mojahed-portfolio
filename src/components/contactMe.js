import React, { Component } from "react";
import { Grid, Form, Segment, Container, Header } from "semantic-ui-react";
import ContactResponse from "./contactResponse";

class ContactMe extends Component {
  state = {
    fullName: "",
    email: "",
    msg: "",
    loading: false,
    displayresponse: false,
    displayForm: true,
    responseReason: "Please fill out all required fields",
    responseHeader: "Sorry you can't do that",
    responseSegColor: "red",
    responseMsgColor: "negative",
  };

  handleFormChange = (e, { name }) => this.setState({ [name]: e.target.value });

  submitContactRequest = () => {
    let headers = new Headers();
    let test = "Basic " + window.btoa("abc:123").toString("base64");
    headers.append("Authorization", test);
    headers.append("Content-Type", "application/json");

    fetch(process.env.REACT_APP_API_HOST, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        email: this.state.email,
        fullName: this.state.fullName,
        msg: this.state.msg,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.success) {
          this.setState({
            displayForm: false,
            responseHeader: "Congrats you succeeded",
            responseSegColor: "green",
            responseMsgColor: "positive",
          });
          console.log(this.state);
        }
        this.setState({
          displayresponse: true,
          responseReason: result.message,
        });
      })
      .catch((error) => {
        console.log("Error:", error);
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
          {this.state.displayForm && (
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
                        rows={5}
                        label="Message"
                        placeholder="Please let me know your thoughts"
                        name="msg"
                        onChange={this.handleFormChange}
                        value={this.state.msg}
                      />
                    </Grid.Column>
                    <Grid.Column
                      computer={2}
                      mobile={16}
                      verticalAlign="middle"
                    >
                      <Form.Button
                        size="big"
                        floated="right"
                        loading={this.state.loading}
                        onClick={this.submitContactRequest}
                      >
                        Send
                      </Form.Button>
                    </Grid.Column>
                  </Grid>
                </Form>
              </Segment>
            </Container>
          )}
        </Grid.Row>

        <Grid.Row>
          {this.state.displayresponse && (
            <ContactResponse
              header={this.state.responseHeader}
              message={this.state.responseReason}
              segmentColor={this.state.responseSegColor}
              messageColor={this.state.responseMsgColor}
            />
          )}
        </Grid.Row>
      </Grid>
    );
  }
}
export default ContactMe;
