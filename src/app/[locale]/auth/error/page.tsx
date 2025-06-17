"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/providers/i18n-provider"
import "../auth.css"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const { locale } = useTranslation()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const errorParam = searchParams?.get("error")
    if (errorParam) {
      switch (errorParam) {
        case "OAuthAccountNotLinked":
          setError("This email is already associated with another account. Please sign in using the original provider.")
          break
        case "OAuthSignin":
        case "OAuthCallback":
          setError("There was a problem with the OAuth sign in. Please try again.")
          break
        case "AccessDenied":
          setError("Access denied. You do not have permission to sign in.")
          break
        case "Verification":
          setError("The verification link is invalid or has expired. Please request a new one.")
          break
        default:
          setError("An error occurred during authentication. Please try again.")
      }
    }
  }, [searchParams])

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-error-container">
          <div className="auth-error-icon">
            <AlertTriangle size={48} className="text-destructive" />
          </div>
          <h1 className="auth-error-title">Authentication Error</h1>
          <p className="auth-error-message">{error || "An unknown error occurred"}</p>
          <div className="auth-error-actions">
            <Link href={`/${locale}/auth/login`}>
              <Button variant="outline">Back to Login</Button>
            </Link>
            <Link href={`/${locale}`}>
              <Button>Go to Homepage</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
