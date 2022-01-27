import React, { Component } from "react";
import {
  Segment,
  Container,
  Message,
} from "semantic-ui-react";

class ContactResponse extends Component {
  render() {
    return (
      <Container>
        <Segment raised color={this.props.segmentColor}>
          <Message color={this.props.messageColor}>
            <Message.Header>
              {this.props.header}
            </Message.Header>
            <p>{this.props.message}</p>
          </Message>
        </Segment>
      </Container>
    );
  }
}
export default ContactResponse;
