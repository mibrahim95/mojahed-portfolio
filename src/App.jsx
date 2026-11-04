import Nav from "./components/nav";
import Hero from "./components/hero";
import Projects from "./components/projects";
import Experience from "./components/experience";
import ContactMe from "./components/contactMe";
import Footer from "./components/footer";
import useReveal from "./hooks/useReveal";

function App() {
  useReveal();
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <Projects />
        <Experience />
        <ContactMe />
      </main>
      <Footer />
    </>
  );
}

export default App;
