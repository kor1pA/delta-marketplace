"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslation } from "@/providers/i18n-provider"
import { LayoutDashboard, Package, ShoppingBag, Users, Settings, BarChart, LogOut, Tag } from "lucide-react"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function AdminSidebar() {
  const pathname = usePathname()
  const { locale } = useTranslation()

  // Извлекаем локаль из пути
  const localePath = `/${locale}`

  const isActive = (path: string) => {
    return pathname?.startsWith(`${localePath}/admin${path}`)
  }

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: `${localePath}` })
  }

  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-header">
        <h1 className="admin-logo">Delta Admin</h1>
      </div>

      <nav className="admin-nav">
        <ul className="admin-nav-list">
          <li>
            <Link
              href={`${localePath}/admin`}
              className={cn("admin-nav-link", isActive("") && !isActive("/products") && "active")}
            >
              <LayoutDashboard className="admin-nav-icon" />
              <span>Панель управления</span>
            </Link>
          </li>
          <li>
            <Link
              href={`${localePath}/admin/products`}
              className={cn("admin-nav-link", isActive("/products") && "active")}
            >
              <Package className="admin-nav-icon" />
              <span>Товары</span>
            </Link>
          </li>
          <li>
            <Link
              href={`${localePath}/admin/categories`}
              className={cn("admin-nav-link", isActive("/categories") && "active")}
            >
              <Tag className="admin-nav-icon" />
              <span>Категории</span>
            </Link>
          </li>
          <li>
            <Link href={`${localePath}/admin/orders`} className={cn("admin-nav-link", isActive("/orders") && "active")}>
              <ShoppingBag className="admin-nav-icon" />
              <span>Заказы</span>
            </Link>
          </li>
          <li>
            <Link href={`${localePath}/admin/users`} className={cn("admin-nav-link", isActive("/users") && "active")}>
              <Users className="admin-nav-icon" />
              <span>Пользователи</span>
            </Link>
          </li>
          <li>
            <Link
              href={`${localePath}/admin/analytics`}
              className={cn("admin-nav-link", isActive("/analytics") && "active")}
            >
              <BarChart className="admin-nav-icon" />
              <span>Аналитика</span>
            </Link>
          </li>
          <li>
            <Link
              href={`${localePath}/admin/settings`}
              className={cn("admin-nav-link", isActive("/settings") && "active")}
            >
              <Settings className="admin-nav-icon" />
              <span>Настройки</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="admin-sidebar-footer">
        <Button variant="outline" className="admin-logout-button" onClick={handleLogout}>
          <LogOut className="admin-logout-icon" />
          <span>Выйти</span>
        </Button>
      </div>
    </div>
  )
}
