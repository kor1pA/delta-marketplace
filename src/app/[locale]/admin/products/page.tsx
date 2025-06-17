import React from "react"
import { executeQuery } from '@/lib/db'

async function getProducts() {
  try {
    const products = await executeQuery(
      `SELECT p.*, c.name as category_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       ORDER BY p.id DESC`,
      []
    )
    // Parse each product (e.g. converting price to a number)
    return Array.isArray(products)
      ? products.map((prod: any) => ({
          ...prod,
          price: parseFloat(prod.price) || 0
        }))
      : []
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

export default async function AdminProductsPage() {
  const products = await getProducts()
  
  return (
    <div>
      <h1>Адмін Товари</h1>
      {products.length === 0 ? (
        <p>Немає товарів</p>
      ) : (
        <ul>
          {products.map((prod: any) => (
            <li key={prod.id}>
              <strong>{prod.name}</strong> - ${prod.price.toFixed(2)} - Категорія: {prod.category_name}
            </li>
          ))}
        </ul>
      )}
      {/* ...existing CRUD interface for products... */}
    </div>
  )
}