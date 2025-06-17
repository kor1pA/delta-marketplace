export const defaultLocale = "en"
export const locales = ["en", "ru", "uk"] as const
export type Locale = (typeof locales)[number]

export const localeNames = {
  en: "English",
  ru: "Русский",
  uk: "Українська",
}

export function getLocaleFromPathname(pathname: string): Locale {
  const segments = pathname.split("/")
  const localeSegment = segments[1]

  if (locales.includes(localeSegment as Locale)) {
    return localeSegment as Locale
  }

  return defaultLocale
}

// Добавим функцию для проверки, существует ли страница для данной локали
export function isValidLocalePath(pathname: string, locale: Locale): boolean {
  // Здесь можно добавить логику проверки существования страницы
  // Для простоты всегда возвращаем true для английской локали
  if (locale === "en") return true

  // Для других локалей можно добавить проверку
  // Например, проверить наличие файлов в соответствующих директориях
  return true
}

export const i18n = {
  locales: ["en", "ru", "uk"], // add all supported locales here
  defaultLocale: "en",
}

