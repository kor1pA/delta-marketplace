"use client"

import { useState } from "react"
import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTranslation } from "@/providers/i18n-provider"
import { locales, localeNames, type Locale } from "@/i18n/config"
import { useRouter, usePathname } from "next/navigation"

export function LanguageSwitcher() {
  const { locale, t } = useTranslation()
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const handleLocaleChange = (newLocale: Locale) => {
    if (newLocale === locale) {
      setIsOpen(false)
      return
    }

    // Ensure pathname is not null
    if (!pathname) {
      console.error("Pathname is null. Cannot change locale.")
      return
    }

    // Получаем текущий путь и заменяем локаль
    const pathSegments = pathname.split("/")

    if (locales.includes(pathSegments[1] as Locale)) {
      // Если в URL уже есть локаль, заменяем ее
      pathSegments[1] = newLocale
    } else {
      // Иначе добавляем локаль в начало пути
      pathSegments.splice(1, 0, newLocale)
    }

    const newPath = pathSegments.join("/") || `/${newLocale}`
    router.push(newPath)
    setIsOpen(false)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="language-button">
          <Globe className="language-icon" />
          <span className="sr-only">{t("language.language")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="language-dropdown">
        {locales.map((localeOption) => (
          <DropdownMenuItem
            key={localeOption}
            className={`language-option ${locale === localeOption ? "language-active" : ""}`}
            onClick={() => handleLocaleChange(localeOption)}
          >
            {localeNames[localeOption]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
