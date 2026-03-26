import { createContext, useContext, useMemo, useState } from 'react'
import { translations } from '../i18n/translations.js'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(
    localStorage.getItem('citizen-assist-language') || 'en',
  )

  const value = useMemo(
    () => ({
      language,
      setLanguage(nextLanguage) {
        localStorage.setItem('citizen-assist-language', nextLanguage)
        setLanguageState(nextLanguage)
      },
      t: translations[language],
    }),
    [language],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
