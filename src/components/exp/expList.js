import React, { Component } from "react";
import experiences from "../../json/expList.json";
import { Header, Message, Button, Grid, Modal, Image } from "semantic-ui-react";
import ExpListMobile from "./expListMobile";
import ExpListComputer from "./expListComputer";

class ExpList extends Component {
  state = { open: false };
  handleModalOpen = (e) => this.setState({ open: e });
  render() {
    return (
      <div id="experience">
        <Header as="h1" dividing textAlign="left" columns={16}>
          Experience
        </Header>
        <ExpListMobile exp={experiences} />
        <ExpListComputer exp={experiences} />
        <Grid centered columns={1}>
          <Grid.Column width={14} textAlign="center">
            <Message info>
              <Message.Header>
                Click below to view my full resume
              </Message.Header>
              <Modal
                basic
                onClose={() => this.handleModalOpen(false)}
                onOpen={() => this.handleModalOpen(true)}
                open={this.state.open}
                size="small"
                trigger={<Button color="black">View Full Resume</Button>}
              >
                <Modal.Content>
                  <Image src="MojahedResume2022.png" />
                </Modal.Content>
                <Modal.Actions>
                  <Button
                    basic
                    color="red"
                    inverted
                    onClick={() => this.handleModalOpen(false)}
                  >
                    Close
                  </Button>
                </Modal.Actions>
              </Modal>
            </Message>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
export default ExpList;
