"use client"

import { useState } from "react"
import Link from "next/link"
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import "./cart.css"

// Mock cart data
const initialCartItems = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 199.99,
    image: "/placeholder.svg?height=100&width=100",
    color: "Black",
    quantity: 1,
  },
  {
    id: 3,
    name: "Organic Cotton T-Shirt",
    price: 29.99,
    image: "/placeholder.svg?height=100&width=100",
    color: "Blue",
    size: "Medium",
    quantity: 2,
  },
  {
    id: 4,
    name: "Stainless Steel Water Bottle",
    price: 34.99,
    image: "/placeholder.svg?height=100&width=100",
    color: "Silver",
    quantity: 1,
  },
]

export default function CartPage() {
  const { toast } = useToast()
  const [cartItems, setCartItems] = useState(initialCartItems)
  const [promoCode, setPromoCode] = useState("")
  const [promoApplied, setPromoApplied] = useState(false)

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return
    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
    toast({
      title: "Item removed",
      description: "The item has been removed from your cart",
    })
  }

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "discount10") {
      setPromoApplied(true)
      toast({
        title: "Promo code applied",
        description: "10% discount has been applied to your order",
      })
    } else {
      toast({
        title: "Invalid promo code",
        description: "Please enter a valid promo code",
        variant: "destructive",
      })
    }
  }

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const discount = promoApplied ? subtotal * 0.1 : 0
  const shipping = subtotal > 100 ? 0 : 10
  const total = subtotal - discount + shipping

  return (
    <div className="cart-page">
      <h1 className="cart-title">Your Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <ShoppingBag className="empty-cart-icon" />
          <h2 className="empty-cart-title">Your cart is empty</h2>
          <p className="empty-cart-message">Looks like you haven't added anything to your cart yet.</p>
          <Link href="/products">
            <Button className="continue-shopping-btn">Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            <div className="cart-table">
              <div className="cart-header">
                <div className="cart-header-product">Product</div>
                <div className="cart-header-price">Price</div>
                <div className="cart-header-quantity">Quantity</div>
                <div className="cart-header-total">Total</div>
              </div>
              <Separator />
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-product">
                    <div className="cart-item-image-container">
                      <img src={item.image || "/placeholder.svg"} alt={item.name} className="cart-item-image" />
                    </div>
                    <div className="cart-item-details">
                      <h3 className="cart-item-name">{item.name}</h3>
                      <div className="cart-item-variant">
                        {item.color}
                        {item.size && ` / ${item.size}`}
                      </div>
                      <button className="cart-item-remove" onClick={() => removeItem(item.id)}>
                        <Trash2 className="remove-icon" />
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="cart-item-price">${item.price.toFixed(2)}</div>
                  <div className="cart-item-quantity">
                    <div className="quantity-controls">
                      <Button
                        variant="outline"
                        size="icon"
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </Button>
                      <span className="quantity-value">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <div className="cart-item-total">${(item.price * item.quantity).toFixed(2)}</div>
                  <Separator />
                </div>
              ))}
              <div className="cart-actions">
                <Link href="/products">
                  <Button variant="outline" className="continue-shopping">
                    Continue Shopping
                  </Button>
                </Link>
                <Button variant="ghost" className="clear-cart" onClick={() => setCartItems([])}>
                  Clear Cart
                </Button>
              </div>
            </div>
          </div>

          <div className="cart-summary">
            <div className="summary-container">
              <h2 className="summary-title">Order Summary</h2>
              <div className="summary-details">
                <div className="summary-row">
                  <span className="summary-label">Subtotal</span>
                  <span className="summary-value">${subtotal.toFixed(2)}</span>
                </div>
                {promoApplied && (
                  <div className="summary-row discount-row">
                    <span>Discount (10%)</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="summary-row">
                  <span className="summary-label">Shipping</span>
                  <span className="summary-value">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <Separator />
                <div className="summary-row total-row">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="promo-code">
                <div className="promo-input">
                  <Input
                    placeholder="Promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="promo-field"
                  />
                  <Button variant="outline" onClick={applyPromoCode} disabled={promoApplied} className="apply-btn">
                    Apply
                  </Button>
                </div>
                {promoApplied && <p className="promo-success">Promo code applied: 10% discount</p>}
                <p className="promo-hint">Try "DISCOUNT10" for 10% off</p>
              </div>

              <Link href="/checkout">
                <Button className="checkout-button" size="lg">
                  Checkout
                  <ArrowRight className="checkout-icon" />
                </Button>
              </Link>

              <div className="payment-methods">We accept credit cards, PayPal, and more</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
