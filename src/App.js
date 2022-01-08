import "./App.css";
import LandingPage from "./components/intro/landingPage";
import JobList from "./components/expList";
import Projects from "./components/projects";
import Navbar from "./components/navbar";
import { Grid } from "semantic-ui-react";

function App() {
  return (
    <div className="App">
      <Grid padded>
        <Navbar />
        <LandingPage />
        <JobList />
        <Projects />
      </Grid>
    </div>
  );
}

export default App;
