import Hero from "./components/hero";
import About from "./components/about";
import Work from "./components/work";
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
      <div className="page">
        <Hero />
        <main id="main">
          <About />
          <Work />
          <Experience />
          <ContactMe />
        </main>
      </div>
      <Footer />
    </>
  );
}

export default App;
