import { createContext, useContext, useEffect, useState } from "react";

const SettingsContext = createContext();

const SETTINGS_STORAGE_KEY = "lembrol-settings";

const defaultSettings = {
  reminders: {
    notification: true,
    sound: true,
    visual: true,
  },
};

function loadSettings() {
  const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);

  if (!storedSettings) {
    return defaultSettings;
  }

  try {
    const parsedSettings = JSON.parse(storedSettings);

    return {
      ...defaultSettings,
      ...parsedSettings,
      reminders: {
        ...defaultSettings.reminders,
        ...parsedSettings.reminders,
      },
    };
  } catch {
    return defaultSettings;
  }
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(loadSettings);

  useEffect(() => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  function updateReminderSettings(updates) {
    setSettings((previousSettings) => ({
      ...previousSettings,
      reminders: {
        ...previousSettings.reminders,
        ...updates,
      },
    }));
  }

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateReminderSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
