import React from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/anton/latin-400.css";
import "@fontsource-variable/work-sans";
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
