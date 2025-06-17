"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { getCategories } from "@/app/actions/product-actions"
import "./categories.css"

interface Category {
  id: number
  name: string
  image_url: string
  product_count: number
}

export function Categories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadCategories() {
      try {
        const result = await getCategories()

        if (result.error) {
          setError(result.error)
        } else if (result.categories) {
          setCategories(result.categories as Category[])
        }
      } catch (err) {
        setError("Failed to load categories")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
  }, [])

  if (loading) {
    return <div className="loading-categories">Loading categories...</div>
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>
  }

  return (
    <div className="categories-grid">
      {categories.map((category) => (
        <Link key={category.id} href={`/categories/${category.id}`} className="category-card">
          <div className="category-content">
            <div className="category-icon">
              <img src={category.image_url || "/placeholder.svg"} alt={category.name} className="category-image" />
            </div>
            <h3 className="category-name">{category.name}</h3>
            <p className="category-count">{category.product_count} products</p>
          </div>
        </Link>
      ))}
    </div>
  )
}
