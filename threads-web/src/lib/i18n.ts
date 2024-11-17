import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import enTranslations from "../locales/en/common.json"
import viTranslations from "../locales/vi/common.json"

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslations },
    vi: { translation: viTranslations }
  },
  lng: "en",
  fallbackLng: "en", // Use English if selected language is not available
  interpolation: {
    escapeValue: false // React already safes from xss
  }
})

export default i18n
