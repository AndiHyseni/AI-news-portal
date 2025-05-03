import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

// Add this code at the top of the file to suppress certain console warnings in development
if (process.env.NODE_ENV === "development") {
  // Hide timeout warnings
  const originalError = console.error;
  console.error = (...args) => {
    if (
      args[0]?.includes?.("Warning: validateDOMNesting") ||
      args[0]?.includes?.("[Violation]") ||
      (typeof args[0] === "string" &&
        args[0]?.includes?.("Error while trying to use the following icon"))
    ) {
      return;
    }
    originalError(...args);
  };
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
