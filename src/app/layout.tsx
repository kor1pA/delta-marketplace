import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import "./components/custom-buttons.css"
import { CartProvider } from "@/context/CartContext" // Fixed import path


export const metadata: Metadata = {
  title: "Delta Marketplace",
  description: "Your one-stop shop for all your needs",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <header>
            
            
          </header>
          {children}
        </CartProvider>
      </body>
    </html>
  )
}
