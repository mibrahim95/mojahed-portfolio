import React, { Component } from "react";
import experiences from "../../json/expList.json";
import {Header} from "semantic-ui-react";
import ExpListMobile from "./expListMobile";
import ExpListComputer from "./expListComputer";

class ExpList extends Component {
  render() {
    return (
      <div id="experience">
        <Header as="h1" dividing textAlign="left" columns={16}>
          Experience
        </Header>
        <ExpListMobile exp={experiences}/>
        <ExpListComputer exp={experiences}/>

      </div>
    );
  }
}
export default ExpList;
