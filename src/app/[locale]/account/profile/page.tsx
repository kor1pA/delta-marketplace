"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { updateUserProfile, changePassword } from "@/app/actions/auth-actions"
import ProtectedRoute from "@/components/auth/protected-route"
import { useTranslation } from "@/providers/i18n-provider"
import { generateCsrfToken } from "@/lib/csrf"
import { useRouter } from "next/navigation"
import "../account.css"

export default function ProfilePage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const { t } = useTranslation()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (session?.user) {
      // Разделяем имя пользователя на имя и фамилию
      const nameParts = session.user.name?.split(" ") || ["", ""]
      setProfileData({
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        email: session.user.email || "",
        phone: "",
      })
    }
  }, [session])

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData({
      ...profileData,
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

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData({
      ...passwordData,
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

  const validateProfileForm = () => {
    const newErrors: Record<string, string> = {}

    if (!profileData.firstName.trim()) {
      newErrors.firstName = t("auth.firstName") + " " + "is required"
    }

    if (!profileData.lastName.trim()) {
      newErrors.lastName = t("auth.lastName") + " " + "is required"
    }

    if (!profileData.email.trim()) {
      newErrors.email = t("auth.email") + " " + "is required"
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = t("auth.email") + " " + "is invalid"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validatePasswordForm = () => {
    const newErrors: Record<string, string> = {}

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = t("account.currentPassword") + " " + "is required"
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = t("account.newPassword") + " " + "is required"
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = t("account.newPassword") + " " + "must be at least 8 characters"
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateProfileForm() || !session?.user?.id) {
      return
    }

    setIsLoading(true)

    try {
      const csrfToken = await generateCsrfToken()
      const result = await updateUserProfile({
        userId: session.user.id,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        phone: profileData.phone,
        csrfToken: csrfToken, // <-- add this
      })

      if (result.error) {
        toast({
          title: "Update failed",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: t("account.profileUpdated"),
          description: t("account.profileUpdateSuccess"),
        })
      }
    } catch (error) {
      console.error("Profile update error:", error)
      toast({
        title: "Update failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validatePasswordForm() || !session?.user?.id) {
      return
    }

    setIsLoading(true)

    try {
      const csrfToken = await generateCsrfToken()
      const result = await changePassword({
        userId: session.user.id,
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        csrfToken: csrfToken, // <-- add this
      })

      if (result.error) {
        toast({
          title: "Password change failed",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: t("account.passwordChanged"),
          description: t("account.passwordChangeSuccess"),
        })
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      }
    } catch (error) {
      console.error("Password change error:", error)
      toast({
        title: "Password change failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="account-page">
        <div className="account-container">
          <h1 className="account-title">{t("account.accountSettings")}</h1>
          {/* Conditionally render admin button if role is admin */}
          {session?.user?.role === "admin" && (
            <Button 
              className="admin-menu" 
              onClick={() => router.push(`/admin/products/create`)}
            >
              Адмін Панель
            </Button>
          )}
          <Tabs defaultValue="profile" className="account-tabs">
            <TabsList className="account-tabs-list">
              <TabsTrigger value="profile">{t("account.profile")}</TabsTrigger>
              <TabsTrigger value="password">{t("account.password")}</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="account-tab-content">
              <form onSubmit={handleProfileSubmit} className="account-form">
                <div className="form-row">
                  <div className="form-group">
                    <Label htmlFor="firstName">{t("auth.firstName")}</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleProfileChange}
                      className={errors.firstName ? "input-error" : ""}
                    />
                    {errors.firstName && <p className="error-message">{errors.firstName}</p>}
                  </div>
                  <div className="form-group">
                    <Label htmlFor="lastName">{t("auth.lastName")}</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleProfileChange}
                      className={errors.lastName ? "input-error" : ""}
                    />
                    {errors.lastName && <p className="error-message">{errors.lastName}</p>}
                  </div>
                </div>
                <div className="form-group">
                  <Label htmlFor="email">{t("auth.email")}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    className={errors.email ? "input-error" : ""}
                  />
                  {errors.email && <p className="error-message">{errors.email}</p>}
                </div>
                <div className="form-group">
                  <Label htmlFor="phone">{t("auth.phone")} (optional)</Label>
                  <Input id="phone" name="phone" type="tel" value={profileData.phone} onChange={handleProfileChange} />
                </div>
                <Button type="submit" className="submit-button" disabled={isLoading}>
                  {isLoading ? "Saving..." : t("account.saveChanges")}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="password" className="account-tab-content">
              <form onSubmit={handlePasswordSubmit} className="account-form">
                <div className="form-group">
                  <Label htmlFor="currentPassword">{t("account.currentPassword")}</Label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className={errors.currentPassword ? "input-error" : ""}
                  />
                  {errors.currentPassword && <p className="error-message">{errors.currentPassword}</p>}
                </div>
                <div className="form-group">
                  <Label htmlFor="newPassword">{t("account.newPassword")}</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className={errors.newPassword ? "input-error" : ""}
                  />
                  {errors.newPassword && <p className="error-message">{errors.newPassword}</p>}
                  <p className="password-hint">{t("auth.passwordRequirements")}</p>
                </div>
                <div className="form-group">
                  <Label htmlFor="confirmPassword">{t("account.confirmNewPassword")}</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className={errors.confirmPassword ? "input-error" : ""}
                  />
                  {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
                </div>
                <Button type="submit" className="submit-button" disabled={isLoading}>
                  {isLoading ? "Changing..." : t("account.changePassword")}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  )
}
