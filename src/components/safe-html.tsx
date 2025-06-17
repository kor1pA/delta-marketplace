"use client"

import { useEffect, useRef } from "react"
import DOMPurify from "dompurify"

interface SafeHtmlProps {
  html: string
  className?: string
}

export function SafeHtml({ html, className }: SafeHtmlProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      // Настраиваем DOMPurify для безопасного отображения HTML
      DOMPurify.addHook("afterSanitizeAttributes", (node) => {
        // Добавляем rel="noopener noreferrer" для всех ссылок
        if (node.tagName === "A") {
          node.setAttribute("rel", "noopener noreferrer")

          // Если ссылка внешняя, открываем в новой вкладке
          if (node.getAttribute("href")?.startsWith("http")) {
            node.setAttribute("target", "_blank")
          }
        }

        // Удаляем все обработчики событий
        node.removeAttribute("onclick")
        node.removeAttribute("onmouseover")
        node.removeAttribute("onload")
        node.removeAttribute("onerror")
      })

      // Санитизируем HTML и вставляем в контейнер
      const sanitizedHtml = DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [
          "b",
          "i",
          "em",
          "strong",
          "a",
          "p",
          "ul",
          "ol",
          "li",
          "br",
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "span",
          "div",
        ],
        ALLOWED_ATTR: ["href", "target", "rel", "class", "id", "style"],
      })

      containerRef.current.innerHTML = sanitizedHtml
    }
  }, [html])

  return <div ref={containerRef} className={className} />
}
