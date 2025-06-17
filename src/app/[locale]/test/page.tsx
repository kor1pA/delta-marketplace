import Link from "next/link"
import { locales } from "@/i18n/config"

// Генерируем статические параметры для всех поддерживаемых локалей
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default function TestPage({ params }: { params: { locale: string } }) {
  // Используем статический подход для определения локали
  // Это безопасно, так как мы используем generateStaticParams
  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Тестовая страница</h1>
      <p>Текущая локаль: {params.locale}</p>
      <div style={{ marginTop: "1rem" }}>
        <Link href={`/${params.locale}`} style={{ color: "blue", textDecoration: "underline" }}>
          Вернуться на главную
        </Link>
      </div>
    </div>
  )
}
