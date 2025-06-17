"use client"

import type React from "react"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useTranslation } from "@/providers/i18n-provider"

export default function ProtectedRoute({
  children,
  requiredRole = "user",
}: {
  children: React.ReactNode
  requiredRole?: string
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { locale } = useTranslation()

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push(`/${locale}/auth/login?callbackUrl=` + encodeURIComponent(window.location.href))
    } else if (requiredRole && session.user && session.user.role !== requiredRole && session.user.role !== "admin") {
      router.push(`/${locale}/unauthorized`)
    }
  }, [session, status, router, requiredRole, locale])

  if (status === "loading") {
    return <div className="loading-auth">Loading...</div>
  }

  if (!session) {
    return null
  }

  if (requiredRole && session.user && session.user.role !== requiredRole && session.user.role !== "admin") {
    return null
  }

  return <>{children}</>
}
