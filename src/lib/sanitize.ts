import DOMPurify from "dompurify"

/**
 * Санитизирует HTML строку, удаляя потенциально опасные скрипты и атрибуты
 * @param html HTML строка для санитизации
 * @returns Санитизированная HTML строка
 */
export function sanitizeHtml(html: string): string {
  if (typeof window === "undefined") {
    // Серверная санитизация (можно использовать jsdom или другие библиотеки)
    // Для простоты в этом примере просто удаляем все теги
    return html.replace(/<[^>]*>/g, "")
  }

  // Клиентская санитизация с использованием DOMPurify
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p", "ul", "ol", "li", "br"],
    ALLOWED_ATTR: ["href", "target", "rel"],
  })
}

/**
 * Санитизирует текстовый ввод, удаляя потенциально опасные символы
 * @param text Текст для санитизации
 * @returns Санитизированный текст
 */
export function sanitizeText(text: string): string {
  if (!text) return ""

  // Удаляем HTML теги и экранируем специальные символы
  return text
    .replace(/<[^>]*>/g, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

/**
 * Санитизирует объект, применяя sanitizeText ко всем строковым свойствам
 * @param obj Объект для санитизации
 * @returns Санитизированный объект
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const result = { ...obj }

  for (const key in result) {
    if (typeof result[key] === "string") {
      result[key] = sanitizeText(result[key] as string) as typeof obj[typeof key]
    } else if (typeof result[key] === "object" && result[key] !== null) {
      result[key] = sanitizeObject(result[key])
    }
  }

  return result
}
