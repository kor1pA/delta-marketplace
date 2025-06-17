import type React from "react"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import AdminSidebar from "@/components/admin/admin-sidebar"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Проверяем авторизацию и роль пользователя на сервере
  const session = await getServerSession(authOptions)

  // Если пользователь не авторизован или не имеет роли админа, перенаправляем на страницу входа
  if (!session || !session.user || session.user.role !== "admin") {
    redirect("/auth/login?callbackUrl=/admin")
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">{children}</main>
    </div>
  )
}
