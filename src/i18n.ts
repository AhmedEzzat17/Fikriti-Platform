import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import arTranslations from "./locales/ar.json";
import enTranslations from "./locales/en.json";

// The translations
const resources = {
  ar: {
    translation: arTranslations,
  },
  en: {
    translation: enTranslations,
  },
};

// Initialize i18n
const savedLang = localStorage.getItem("selectedLang") || "en";

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: savedLang, // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
