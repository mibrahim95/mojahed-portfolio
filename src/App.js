import "./App.css";
import LandingPage from "./components/intro/landingPage";
import ExpList from "./components/expList";
import Projects from "./components/projects";
import Navbar from "./components/navbar";
import ContactMe from "./components/contactMe";
import { Container } from "semantic-ui-react";

function App() {
  return (
    <div className="App">
      <Container fluid>
        <Navbar />
        <LandingPage />
        <ExpList />
        <Projects />
        <ContactMe />
      </Container>
    </div>
  );
}

export default App;
