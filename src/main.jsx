import React from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import "@fontsource/instrument-serif/latin-400.css";
import "@fontsource/instrument-serif/latin-400-italic.css";
import "@fontsource/press-start-2p/latin-400.css";
import "./styles.css";
import App from "./App";

// Gate the entrance animations before the first paint of the React tree, and
// only where the observer that reveals them exists (otherwise nothing hides).
if ("IntersectionObserver" in window) document.documentElement.classList.add("js");

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
