"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { User, ShoppingCart, LogOut, Settings, Package, Heart, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { useTranslation } from "@/providers/i18n-provider"
import { useCart } from "@/context/CartContext"

export function UserNav() {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const { locale, t } = useTranslation()
  const { getCartItemCount } = useCart() // Use CartContext to get item count
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await signOut({ redirect: false })
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      })
      router.push(`/${locale}`)
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        title: "Logout failed",
        description: "An error occurred during logout",
        variant: "destructive",
      })
    } finally {
      setIsLoggingOut(false)
    }
  }

  const itemCount = getCartItemCount() // Get the total number of items in the cart

  if (!session || !session.user) {
    return (
      <div className="user-actions">
        <Link href={`/${locale}/cart`}>
          <Button variant="ghost" size="icon" className="cart-button">
            <ShoppingCart className="cart-icon" />
            {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
          </Button>
        </Link>
        <Link href={`/${locale}/auth/login`}>
          <Button variant="outline" className="login-button">
            {t("auth.login")}
          </Button>
        </Link>
        <Link href={`/${locale}/auth/signup`}>
          <Button className="signup-button">{t("auth.signup")}</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="user-actions">
      <Link href={`/${locale}/cart`}>
        <Button variant="ghost" size="icon" className="cart-button">
          <ShoppingCart className="cart-icon" />
          {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
        </Button>
      </Link>
      <Link href={`/${locale}/wishlist`}>
        <Button variant="ghost" size="icon" className="wishlist-button">
          <Heart className="wishlist-icon" />
        </Button>
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="user-menu-button">
            <span className="user-name">{session.user.name}</span>
            <ChevronDown className="dropdown-icon" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="user-dropdown">
          <div className="user-dropdown-header">
            <User className="user-icon" />
            <div className="user-info">
              <p className="user-display-name">{session.user.name}</p>
              <p className="user-email">{session.user.email}</p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/${locale}/account/profile`} className="dropdown-link">
              <Settings className="dropdown-icon" />
              <span>{t("account.accountSettings")}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/${locale}/account/orders`} className="dropdown-link">
              <Package className="dropdown-icon" />
              <span>{t("account.orders")}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="dropdown-item-logout" disabled={isLoggingOut} onClick={handleLogout}>
            <LogOut className="dropdown-icon" />
            <span>{isLoggingOut ? "Logging out..." : t("auth.logout")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
