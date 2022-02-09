import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import "semantic-ui-css/semantic.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import smoothscroll from 'smoothscroll-polyfill';

smoothscroll.polyfill();

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}></Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

