"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useTranslation } from "@/providers/i18n-provider"
import { useCart } from "@/context/CartContext"
import "./cart.css"

export default function CartPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { locale } = useTranslation()
  const { cart, removeFromCart } = useCart()
  const [cartItems, setCartItems] = useState(cart) // Use cart from context
  const [isLoading, setIsLoading] = useState(false)

  // Update item quantity
  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return

    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)),
    )
  }

  // Remove item from cart
  const removeItem = (itemId: number) => {
    removeFromCart(itemId) // Update context
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId))

    toast({
      title: "Товар удален",
      description: "Товар был удален из корзины",
    })
  }

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 10.0
  const total = subtotal + shipping

  // Handle checkout
  const handleCheckout = (event: React.FormEvent) => {
    event.preventDefault()
    router.push(`/${locale}/checkout`)
  }

  if (isLoading) {
    return (
      <div className="cart-page">
        <div className="cart-loading">
          <ShoppingBag className="cart-loading-icon" />
          <p>Загрузка корзины...</p>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty">
          <ShoppingBag className="cart-empty-icon" />
          <h2 className="cart-empty-title">Ваша корзина пуста</h2>
          <p className="cart-empty-text">Добавьте товары в корзину, чтобы продолжить покупки</p>
          <Link href={`/${locale}/catalog`}>
            <Button className="cart-empty-button">Перейти в каталог</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1 className="cart-title">Корзина</h1>
        <p className="cart-description">Просмотрите и отредактируйте товары в вашей корзине</p>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          <div className="cart-items-header">
            <div className="cart-header-product">Товар</div>
            <div className="cart-header-price">Цена</div>
            <div className="cart-header-quantity">Количество</div>
            <div className="cart-header-total">Всего</div>
            <div className="cart-header-actions"></div>
          </div>

          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-product">
                <div className="cart-item-image">
                  <img src={item.image || "/placeholder.svg"} alt={item.name} />
                </div>
                <div className="cart-item-details">
                  <Link href={`/${locale}/products/${item.id}`} className="cart-item-name">
                    {item.name}
                  </Link>
                </div>
              </div>

              <div className="cart-item-price">${item.price.toFixed(2)}</div>

              <div className="cart-item-quantity">
                <div className="quantity-control">
                  <button
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value) || 1)}
                    className="quantity-input"
                  />
                  <button className="quantity-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                    +
                  </button>
                </div>
              </div>

              <div className="cart-item-total">${(item.price * item.quantity).toFixed(2)}</div>

              <div className="cart-item-actions">
                <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="remove-item-btn">
                  <Trash2 size={18} />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2 className="summary-title">Итого</h2>

          <div className="summary-row">
            <span className="summary-label">Подытог</span>
            <span className="summary-value">${subtotal.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span className="summary-label">Доставка</span>
            <span className="summary-value">${shipping.toFixed(2)}</span>
          </div>

          <div className="summary-divider"></div>

          <div className="summary-row summary-total">
            <span className="summary-label">Итого</span>
            <span className="summary-value">${total.toFixed(2)}</span>
          </div>

          <div className="summary-actions">
            <form onSubmit={handleCheckout}>
              <Button type="submit" className="checkout-btn">
                Оформить заказ
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </form>
            <Link href={`/${locale}/catalog`} className="continue-shopping-link">
              Продолжить покупки
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
