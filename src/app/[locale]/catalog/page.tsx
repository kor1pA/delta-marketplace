import React from "react"
import { executeQuery } from '@/lib/db'

async function getProducts() {
  try {
    const products = await executeQuery(
      `SELECT p.*, c.name as category_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       ORDER BY p.id DESC
       LIMIT 12`,
      []
    )
    return Array.isArray(products) ? products : []
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

async function getCategories() {
  try {
    const categories = await executeQuery(
      "SELECT * FROM categories ORDER BY name ASC",
      []
    )
    return Array.isArray(categories) ? categories : []
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

// Updated to receive locale from route params
export default async function CatalogPage({ params }: { params: { locale: string } }) {
  const { locale } = params
  const products = await getProducts()
  const categories = await getCategories()

  return (
    <div>
      <h1>Catalog</h1>
      {/* CRUD - Create button */}
      <div>
        <a href={`/${locale}/admin/products/create`} className="btn btn-primary">
          Створити новий товар
        </a>
      </div>
      {/* Display list of categories */}
      <section>
        <h2>Категорії</h2>
        <ul>
          {categories.map((cat: any) => (
            <li key={cat.id}>{cat.name}</li>
          ))}
        </ul>
      </section>
      {/* Display list of products with Update and Delete options */}
      <section>
        <h2>Товари</h2>
        <ul>
          {products.map((prod: any) => (
            <li key={prod.id}>
              <h3>{prod.name}</h3>
              <p>{prod.category_name}</p>
              <p>Ціна: {prod.price}</p>
              <div>
                {/* Update link */}
                <a href={`/${locale}/admin/products/edit/${prod.id}`} className="btn btn-secondary">
                  Редагувати
                </a>
                {/* Delete form */}
                <form
                  action={`/api/products/${prod.id}`}
                  method="post"
                  style={{ display: "inline" }}                  onSubmit={(e) => {
                    if (!confirm("Are you sure you want to delete this item?")) {
                      return;
                    }
                    e.preventDefault();
                    // Handle delete action
                  }}
                >
                  {/* Emulate DELETE method (if using method override middleware) */}
                  <input type="hidden" name="_method" value="DELETE" />
                  <button type="submit" className="btn btn-danger">
                    Delete
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}