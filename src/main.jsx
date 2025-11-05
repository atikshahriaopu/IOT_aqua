import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Suppress browser extension errors
window.addEventListener("unhandledrejection", (event) => {
  if (event.reason?.message?.includes("message channel closed")) {
    event.preventDefault();
    console.warn("Browser extension error suppressed:", event.reason.message);
  }
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
