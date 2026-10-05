import { createContext, useContext, useState, useCallback } from "react";
import en from "../i18n/en.json";
import hi from "../i18n/hi.json";

const translations = { en, hi };
const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("rntl-lang") || "en");

  const t = useCallback(
    (key) => translations[lang]?.[key] || translations.en[key] || key,
    [lang]
  );

  const switchLang = (l) => {
    setLang(l);
    localStorage.setItem("rntl-lang", l);
  };

  return (
    <LanguageContext.Provider value={{ lang, switchLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
