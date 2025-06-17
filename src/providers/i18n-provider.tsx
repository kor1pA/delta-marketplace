"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { defaultLocale, locales, type Locale } from "@/i18n/config"

// Загрузка переводов
async function loadTranslations(locale: Locale) {
  try {
    return (await import(`@/i18n/locales/${locale}.json`)).default
  } catch (error) {
    console.error(`Failed to load translations for locale: ${locale}`, error)
    // Возвращаем английские переводы как запасной вариант
    return (await import("@/i18n/locales/en.json")).default
  }
}

interface I18nContextType {
  locale: Locale
  translations: Record<string, any>
  changeLocale: (newLocale: Locale) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | null>(null)

export function I18nProvider({
  children,
  initialLocale = defaultLocale,
}: {
  children: ReactNode
  initialLocale?: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [locale, setLocale] = useState<Locale>(initialLocale as Locale)
  const [translations, setTranslations] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(true)

  // Загрузка переводов при первом рендере
  useEffect(() => {
    loadTranslations(locale)
      .then(setTranslations)
      .finally(() => setIsLoading(false))
  }, [locale])

  // Определение текущей локали из URL при изменении пути
  useEffect(() => {
    // Извлекаем локаль из пути
    const pathSegments = pathname.split("/").filter(Boolean)
    const pathLocale = pathSegments[0]

    // Проверяем, является ли первый сегмент пути допустимой локалью
    if (locales.includes(pathLocale as Locale) && pathLocale !== locale) {
      setLocale(pathLocale as Locale)
    }
  }, [pathname, locale])

  // Функция для изменения локали
  const changeLocale = (newLocale: Locale) => {
    if (newLocale === locale) return

    setIsLoading(true)

    // Загружаем новые переводы
    loadTranslations(newLocale)
      .then((newTranslations) => {
        setTranslations(newTranslations)
        setLocale(newLocale)
      })
      .finally(() => setIsLoading(false))
  }

  // Функция для получения перевода по ключу
  const t = (key: string): string => {
    if (!translations || Object.keys(translations).length === 0) {
      return key
    }

    const keys = key.split(".")
    let value = translations

    for (const k of keys) {
      if (!value || typeof value !== "object") return key
      value = value[k]
    }

    return typeof value === "string" ? value : key
  }

  // Создаем контекст даже во время загрузки, чтобы избежать ошибок
  const contextValue = {
    locale,
    translations,
    changeLocale,
    t,
  }

  return <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>
}

// Хук для использования переводов в компонентах
export function useTranslation() {
  const context = useContext(I18nContext)

  if (!context) {
    throw new Error("useTranslation must be used within an I18nProvider")
  }

  return context
}
