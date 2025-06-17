"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useTranslation } from "@/providers/i18n-provider"
import { getCsrfToken } from "@/app/actions/auth-actions"
import "../auth.css"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { locale, t } = useTranslation()
  const callbackUrl = searchParams?.get("callbackUrl") || `/${locale}`
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState<string | null>(null)
  const [csrfToken, setCsrfToken] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Получаем CSRF токен при загрузке компонента
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const csrfToken = await getCsrfToken()
        setCsrfToken(csrfToken || "") // Ensure csrfToken is always a string
      } catch (error) {
        console.error("Failed to fetch CSRF token:", error)
      }
    }

    fetchCsrfToken()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) {
      newErrors.email = t("auth.email") + " " + "is required"
    }

    if (!formData.password) {
      newErrors.password = t("auth.password") + " " + "is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    console.log("Form submitted:", formData) // Debugging log
    console.log("CSRF token:", csrfToken) // Debugging log

    if (!validateForm() || !csrfToken) {
      if (!csrfToken) {
        toast({
          title: "Security error",
          description: "Could not verify form security. Please refresh the page and try again.",
          variant: "destructive",
        })
      }
      return
    }

    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
        csrfToken,
      })

      console.log("SignIn result:", result) // Debugging log

      if (result?.error) {
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive",
        })
      } else {
        toast({
          title: t("auth.loginSuccess"),
          description: t("auth.welcomeBack"),
        })
        router.push(callbackUrl)
      }
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Login failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: string) => {
    try {
      setSocialLoading(provider)
      await signIn(provider, { callbackUrl })
    } catch (error) {
      console.error(`${provider} login error:`, error)
      toast({
        title: "Login failed",
        description: `An error occurred during ${provider} login`,
        variant: "destructive",
      })
      setSocialLoading(null)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1 className="auth-title">
            {t("auth.login")} {t("common.appName")}
          </h1>
          <p className="auth-description">Enter your credentials to access your account</p>
        </div>

        <div className="auth-form-container">
          <form onSubmit={handleSubmit} className="auth-form">
            {/* Скрытое поле для CSRF токена */}
            <input type="hidden" name="csrfToken" value={csrfToken} />

            <div className="form-group">
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "input-error" : ""}
                maxLength={100} // Ограничиваем длину ввода
              />
              {errors.email && <p className="error-message">{errors.email}</p>}
            </div>
            <div className="form-group">
              <div className="password-header">
                <Label htmlFor="password">{t("auth.password")}</Label>
                <Link href={`/${locale}/auth/forgot-password`} className="forgot-password">
                  {t("auth.forgotPassword")}
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "input-error" : ""}
                maxLength={100} // Ограничиваем длину ввода
              />
              {errors.password && <p className="error-message">{errors.password}</p>}
            </div>
            <Button type="submit" className="submit-button" disabled={isLoading || !csrfToken}>
              {isLoading ? "Logging in..." : (t("auth.login") || "Login")}
            </Button>
          </form>

          <div className="form-divider">
            <div className="divider-line"></div>
            <span className="divider-text">OR</span>
            <div className="divider-line"></div>
          </div>

          <div className="social-buttons">
            <Button
              variant="outline"
              className="social-button google-button"
              onClick={() => handleSocialLogin("google")}
              disabled={socialLoading !== null}
            >
              <svg className="social-icon" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              {socialLoading === "google" ? "Connecting..." : "Continue with Google"}
            </Button>
            <Button
              variant="outline"
              className="social-button facebook-button"
              onClick={() => handleSocialLogin("facebook")}
              disabled={socialLoading !== null}
            >
              <svg className="social-icon" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
              {socialLoading === "facebook" ? "Connecting..." : "Continue with Facebook"}
            </Button>
          </div>
        </div>

        <div className="auth-footer">
          <p className="auth-footer-text">
            {t("auth.dontHaveAccount")}{" "}
            <Link href={`/${locale}/auth/signup`} className="auth-link">
              {t("auth.signup")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
