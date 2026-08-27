import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { LanguageProvider } from "./i18n/LanguageContext.jsx";
import { ProjectProvider } from "./store/ProjectContext.jsx";
import { ReminderProvider } from "./reminders/ReminderProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LanguageProvider>
      <ProjectProvider>
        <ReminderProvider>
          <App />
        </ReminderProvider>
      </ProjectProvider>
    </LanguageProvider>
  </React.StrictMode>,
);
