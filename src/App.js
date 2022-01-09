import "./App.css";
import LandingPage from "./components/intro/landingPage";
import JobList from "./components/expList";
import Projects from "./components/projects";
import Navbar from "./components/navbar";
import ContactMe from "./components/contactMe";
import { Grid, Header } from "semantic-ui-react";

function App() {
  return (
    <div className="App">
      <Grid padded>
        <Navbar />
        <LandingPage />
        <Grid.Row>
          <Grid.Column width={16}>
            <Header as="h2" dividing textAlign="left">
              Experience
            </Header>
          </Grid.Column>
        </Grid.Row>
        <JobList />
        <Grid.Row color="grey">
          <Grid.Column width={16}>
            <Header as="h2" dividing textAlign="left">
              Projects
            </Header>
          </Grid.Column>
        </Grid.Row>
        <Projects />
        <ContactMe />
      </Grid>
    </div>
  );
}

export default App;
