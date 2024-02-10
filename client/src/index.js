import React from "react";
import ReactDOM from "react-dom";
import { AuthProvider } from "./Context/Auth";
import {SearchProvider } from "./Context/Search";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";

ReactDOM.render(
  <AuthProvider>
    <SearchProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SearchProvider>
  </AuthProvider>, // Notice the correct placement of </AuthProvider>
  document.getElementById("root")
);