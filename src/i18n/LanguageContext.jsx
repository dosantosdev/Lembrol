import { createContext, useContext, useEffect, useState } from "react";

import ptBR from "./pt-BR.js";
import enUS from "./en-US.js";

const translations = {
  "pt-BR": ptBR,
  "en-US": enUS,
};

const LANGUAGE_STORAGE_KEY = "lembrol-language";

const LanguageContext = createContext();

function getInitialLanguage() {
  const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);

  if (storedLanguage && translations[storedLanguage]) {
    return storedLanguage;
  }

  return "pt-BR";
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language]);

  function t(section, key) {
    return translations[language]?.[section]?.[key] ?? key;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
