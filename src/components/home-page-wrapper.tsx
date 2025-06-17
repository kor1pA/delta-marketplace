"use client"

import { useTranslation } from "@/providers/i18n-provider"
import HomePage from "./home-page"
import type { Locale } from "@/i18n/config"

export default function HomePageWrapper({ initialLocale }: { initialLocale: string }) {
  // Этот компонент имеет доступ к I18nProvider из layout
  const { t, locale } = useTranslation()

  return <HomePage t={t} locale={locale as Locale} />
}
