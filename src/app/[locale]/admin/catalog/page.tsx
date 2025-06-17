import React from "react"
import { executeQuery } from '@/lib/db'
import { useRouter } from "next/navigation"

async function getProducts() {
  try {
    const products = await executeQuery(
      `SELECT p.*, c.name as category_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       ORDER BY p.id DESC`,
      []
    )
    return Array.isArray(products) ? products : []
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

export default async function AdminCatalogPage() {
  const products = await getProducts()

  return (
    <div>
      <h1>Admin Catalog</h1>
      <button onClick={() => useRouter().push("/[locale]/admin/products/create")}>
        Create New Product
      </button>
      <ul>
        {products.map((prod: any) => (
          <li key={prod.id}>
            <h3>{prod.name}</h3>
            <p>{prod.category_name}</p>
            <p>Price: {prod.price}</p>
            {/* Add admin actions e.g. Edit/Delete */}
            <button>Edit</button>
            <button>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}