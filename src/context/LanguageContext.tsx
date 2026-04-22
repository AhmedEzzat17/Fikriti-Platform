import React, { createContext, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import "../i18n";

type Language = "en" | "ar";

interface LanguageContextProps {
  currentLang: Language;
  toggleLanguage: (e?: React.MouseEvent) => void;
  // Fallback to accepting a string, though in JS it was string literal unions earlier
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language as Language;

  useEffect(() => {
    document.body.dir = currentLang === "ar" ? "rtl" : "ltr";
  }, [currentLang]);

  const toggleLanguage = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const newLang = currentLang === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
    localStorage.setItem("selectedLang", newLang);
  };

  return (
    <LanguageContext.Provider value={{ currentLang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextProps => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

