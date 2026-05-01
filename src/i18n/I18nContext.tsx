import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { translations, type Lang } from './translations'

interface I18nContextType {
  lang: Lang
  setLang: (lang: Lang) => void
  toggleLang: () => void
  t: (key: string) => string
  tf: (key: string, params?: Record<string, string | number>) => string
}

const I18nContext = createContext<I18nContextType | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem('language') as Lang | null
    if (saved === 'zh' || saved === 'en') return saved
    return navigator.language.startsWith('zh') ? 'zh' : 'en'
  })

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    localStorage.setItem('language', l)
    document.documentElement.lang = l
  }, [])

  const toggleLang = useCallback(() => {
    setLang(lang === 'zh' ? 'en' : 'zh')
  }, [lang, setLang])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const t = useCallback((key: string): string => {
    return translations[lang]?.[key] ?? key
  }, [lang])

  const tf = useCallback((key: string, params?: Record<string, string | number>): string => {
    let text = translations[lang]?.[key] ?? key
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        text = text.replace(`{${k}}`, String(v))
      }
    }
    return text
  }, [lang])

  return (
    <I18nContext.Provider value={{ lang, setLang, toggleLang, t, tf }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
