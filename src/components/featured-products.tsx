"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { getProducts } from "@/app/actions/product-actions"
import "./featured-products.css"

// Update the interface to match the actual data structure from the server
interface Product {
  id: number
  name: string
  description: string
  price: number | string
  rating: number | string
  category_name?: string
  image?: string // Make image optional since it might not always be present
}

export function FeaturedProducts() {
  const { toast } = useToast()
  const [cart, setCart] = useState<number[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProducts() {
      try {
        const result = await getProducts()

        if (result.error) {
          setError(result.error)
        } else if (result.products) {
          // No need for type assertion since we're making the interface match the data
          setProducts(result.products)
        }
      } catch (err) {
        setError("Failed to load products")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  const addToCart = (productId: number) => {
    setCart([...cart, productId])
    toast({
      title: "Added to cart",
      description: "Product has been added to your cart",
    })
  }

  if (loading) {
    return <div className="loading-products">Loading products...</div>
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>
  }

  return (
    <div className="products-grid">
      {products.map((product) => (
        <div key={product.id} className="product-card">
          <Link href={`/products/${product.id}`} className="product-image-container">
            <div className="product-image-wrapper">
              <img src={product.image || "/placeholder.svg"} alt={product.name} className="product-image" />
              <div className="product-category">{product.category_name || "Uncategorized"}</div>
            </div>
          </Link>
          <div className="product-content">
            <div className="product-info">
              <div className="product-header">
                <Link href={`/products/${product.id}`} className="product-name">
                  {product.name}
                </Link>
                <div className="product-rating">
                  <Star className="rating-star" />
                  <span className="rating-value">
                    {typeof product.rating === "number"
                      ? product.rating.toFixed(1)
                      : Number.parseFloat(String(product.rating || 0)).toFixed(1)}
                  </span>
                </div>
              </div>
              <p className="product-description">{product.description}</p>
              <div className="product-price">
                $
                {typeof product.price === "number"
                  ? product.price.toFixed(2)
                  : Number.parseFloat(String(product.price || 0)).toFixed(2)}
              </div>
            </div>
          </div>
          <div className="product-footer">
            <Button className="product-button" onClick={() => addToCart(product.id)}>
              Add to Cart
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
