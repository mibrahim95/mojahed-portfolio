import React, { Component } from "react";
import {
  Grid,
  Form,
  Segment,
  Container,
  Header,
  Popup,
  Icon,
} from "semantic-ui-react";
import ContactResponse from "./contactResponse";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

class ContactMe extends Component {
  state = {
    fullName: "",
    email: "",
    msg: "",
    loading: false,
    displayresponse: false,
    displayForm: true,
    responseReason: "",
    responseHeader: "",
    responseSegColor: "red",
    responseMsgColor: "negative",
  };

  handleFormChange = (e, { name }) => this.setState({ [name]: e.target.value });

  showError = (reason) =>
    this.setState({
      responseHeader: "Sorry an issue occurred",
      responseReason: reason,
      responseSegColor: "red",
      responseMsgColor: "negative",
      displayresponse: true,
      loading: false,
    });

  submitContactRequest = () => {
    const { fullName, email, msg, loading } = this.state;
    if (loading) return;

    if (!fullName.trim() || !msg.trim() || !EMAIL_REGEX.test(email.trim())) {
      this.showError(
        "Please provide your name, a valid email and a message"
      );
      return;
    }

    this.setState({ loading: true });
    const headers = new Headers();
    headers.append(
      "Authorization",
      "Basic " + window.btoa(process.env.REACT_APP_JAVA_API_USERNAME_AND_PASS)
    );
    headers.append("Content-Type", "application/json");

    fetch(process.env.REACT_APP_API_HOST, {
      method: "POST",
      headers,
      body: JSON.stringify({ email, fullName, msg }),
    })
      .then((response) => {
        if (response.ok) return response.json();
        this.showError(
          response.status >= 400 && response.status < 500
            ? "Please check the form fields and try again"
            : "The server had a problem, please try again later"
        );
      })
      .then((result) => {
        if (!result) return;
        this.setState({
          displayForm: false,
          responseHeader: "Thank you for reaching out " + fullName + "!",
          responseReason: "I will reach out to you as soon as possible",
          responseSegColor: "green",
          responseMsgColor: "positive",
          displayresponse: true,
          loading: false,
        });
      })
      .catch(() => this.showError("Please check your connection and try again"));
  };

  render() {
    return (
      <Grid padded>
        <Grid.Row>
          <Grid.Column width={16}>
            <Header as="h1" dividing textAlign="left">
              Contact Me
              <Header.Subheader>
                Validated and submitted to Telegram-integration-service through
                use of personal Java Spring Boot API
                <Popup
                  content="View the Github repo"
                  trigger={
                    <a href="https://github.com/mibrahim95/telegramApi">
                      <Icon name="info circle" size="small" />
                    </a>
                  }
                />
              </Header.Subheader>
            </Header>
          </Grid.Column>
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
      </Grid>
    );
  }
}
export default ContactMe;
