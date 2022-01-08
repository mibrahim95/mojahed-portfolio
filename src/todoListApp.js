import React, { Component } from "react";
import { Grid, List, Button, Input } from "semantic-ui-react";

class TodoListApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listItems: [],
      numOfTasks: 0,
    };
  }

  handleAddTaskClick = (e, { name }) => {
    this.setState({
      listItems: [...this.state.listItems, this.state[this.state.numOfTasks]],
    });
    this.setState({ numOfTasks: this.state.numOfTasks + 1 });
  };

  handleCompleteClick = (e, { name }) => {
      this.setState({loading:true});
      setTimeout(() => {
      this.setState({loading:false});
      },5000);

  };
  handleDeleteClick = (e, { taskId }) => {
      this.setState({listItems: this.state.listItems.filter(function(listItem,index) { 
        return index !== taskId 
    })});
  };

  handleInputChange = (e, { name }) =>
    this.setState({ [name]: e.target.value });

  render() {
    console.log(this.state);

    return (
      <Grid container>
        <Grid.Column>
          <List divided size="large" verticalAlign="middle">
            {this.state.listItems &&
              this.state.listItems.map((listItem, index) => (
                <List.Item color="green" key={index}>
                  <List.Content> {listItem}</List.Content>
                  <List.Content floated="right">
                    <Button loading={this.state.loading} animated fluid color="green" taskId={index} onClick={this.handleCompleteClick}>
                      Complete
                    </Button>
                    <Button color="red" taskId={index} onClick={this.handleDeleteClick}>
                      Delete
                    </Button>
                  </List.Content>
                </List.Item>
              ))}

            <List.Item>
              <List.Content floated="right">
                <Button name="listItem" onClick={this.handleAddTaskClick}>
                  Add
                </Button>
              </List.Content>
              <List.Content>
                <Input
                  fluid
                  placeholder="Add a task..."
                  onChange={this.handleInputChange}
                  name={this.state.numOfTasks}
                />
              </List.Content>
            </List.Item>
          </List>
        </Grid.Column>
      </Grid>
    );
  }
}
export default TodoListApp;
