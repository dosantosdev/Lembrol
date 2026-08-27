import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { LanguageProvider } from "./i18n/LanguageContext.jsx";
import { ProjectProvider } from "./store/ProjectContext.jsx";
import { SettingsProvider } from "./store/SettingsContext.jsx";
import { ReminderProvider } from "./reminders/ReminderProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LanguageProvider>
      <ProjectProvider>
        <SettingsProvider>
          <ReminderProvider>
            <App />
          </ReminderProvider>
        </SettingsProvider>
      </ProjectProvider>
    </LanguageProvider>
  </React.StrictMode>,
);
