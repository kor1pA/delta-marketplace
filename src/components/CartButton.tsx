"use client"

import { ShoppingCart } from "lucide-react"
import { useCart } from "@/context/CartContext"
import Link from "next/link"

export default function CartButton() {
  const { getCartItemCount } = useCart()
  const itemCount = getCartItemCount()

  return (
    <Link href="/en/cart">
      <button className="cart-button">
        <ShoppingCart className="cart-icon" />
        {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
      </button>
    </Link>
  )
}
