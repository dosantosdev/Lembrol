import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ProjectProvider } from "./store/ProjectContext.jsx";
import { LanguageProvider } from "./i18n/LanguageContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LanguageProvider>
      <ProjectProvider>
        <App />
      </ProjectProvider>
    </LanguageProvider>
  </React.StrictMode>,
);
