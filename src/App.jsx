import { Container } from "semantic-ui-react";
import Navbar from "./components/navbar";
import LandingPage from "./components/intro/landingPage";
import ExpList from "./components/exp/expList";
import Projects from "./components/projects";
import ContactMe from "./components/contactMe";
import Footer from "./components/footer";
import { SECTIONS } from "./sections";

function App() {
  return (
    <>
      <Navbar sections={SECTIONS} />
      <Container as="main">
        <LandingPage />
        <ExpList />
        <Projects />
        <ContactMe />
      </Container>
      <Footer />
    </>
  );
}

export default App;
