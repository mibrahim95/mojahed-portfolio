import Navbar from "./components/navbar";
import Hero from "./components/hero";
import Experience from "./components/experience";
import Projects from "./components/projects";
import ContactMe from "./components/contactMe";
import Footer from "./components/footer";
import useReveal from "./hooks/useReveal";
import { SECTIONS } from "./sections";

function App() {
  useReveal();
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navbar sections={SECTIONS} />
      <main id="main">
        <Hero />
        <Experience />
        <Projects />
        <ContactMe />
      </main>
      <Footer />
    </>
  );
}

export default App;
