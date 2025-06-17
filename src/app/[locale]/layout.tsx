import type React from "react"
import type { Metadata } from "next"
import AuthSessionProvider from "@/providers/session-provider"
import { I18nProvider } from "@/providers/i18n-provider"
import { locales, defaultLocale, i18n } from "@/i18n/config"
import { notFound } from "next/navigation"
import { runMigrations } from "@/lib/db_migrations"

// Define and cast the i18n object with optional properties
const i18nTyped = i18n as { locales?: string[]; defaultLocale?: string }

export const metadata: Metadata = {
  title: "Delta Marketplace",
  description: "Your one-stop shop for all your needs",
}

// Генерируем статические параметры для всех поддерживаемых локалей
export function generateStaticParams() {
  return (i18nTyped.locales || ["en"]).map((locale) => ({ locale }))
}

interface Props {
  children: React.ReactNode
  params: { locale: string }
}

export default async function RootLayout(props: {
  children: React.ReactNode
  params: { locale: string }
}) {
  // Await params before using them
  const paramsData = await Promise.resolve(props.params)
  const { locale } = paramsData

  // Run migrations
  await runMigrations()

  // Use fallback values if i18nTyped properties are undefined
  const localesArr = i18nTyped?.locales || ["en"]
  const defaultLoc = i18nTyped?.defaultLocale || "en"

  if (!localesArr.includes(locale)) {
    notFound()
  }

  // Используем статический подход для определения локали
  const currentLocale = localesArr.includes(locale) ? locale : defaultLoc

  return (
    <AuthSessionProvider>
      <I18nProvider initialLocale={currentLocale}>{props.children}</I18nProvider>
    </AuthSessionProvider>
  )
}
