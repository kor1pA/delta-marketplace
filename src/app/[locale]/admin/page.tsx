import React from "react"
import { executeQuery } from '@/lib/db'; // Adjust the path as needed

async function getStats() {
  try {
    // Отримуємо кількість користувачів
    const usersResult = await executeQuery(
      "SELECT COUNT(*) as count FROM users",
      []
    )
    const usersCount = Array.isArray(usersResult) && usersResult.length > 0 ? usersResult[0].count : 0

    // Отримуємо кількість продуктів
    const productsResult = await executeQuery(
      "SELECT COUNT(*) as count FROM products",
      []
    )
    const productsCount = Array.isArray(productsResult) && productsResult.length > 0 ? productsResult[0].count : 0

    // Отримуємо кількість категорій
    const categoriesResult = await executeQuery(
      "SELECT COUNT(*) as count FROM categories",
      []
    )
    const categoriesCount = Array.isArray(categoriesResult) && categoriesResult.length > 0 ? categoriesResult[0].count : 0

    // Отримуємо кількість замовлень
    const ordersResult = await executeQuery(
      "SELECT COUNT(*) as count FROM orders",
      []
    )
    const ordersCount = Array.isArray(ordersResult) && ordersResult.length > 0 ? ordersResult[0].count : 0

    // Отримуємо суму всіх замовлень
    const revenueResult = await executeQuery(
      "SELECT SUM(total_amount) as total FROM orders",
      []
    )
    const revenue = Array.isArray(revenueResult) && revenueResult.length > 0 ? revenueResult[0].total || 0 : 0

    // Отримуємо останні замовлення
    const latestOrders = await executeQuery(
      `SELECT o.id, o.created_at, o.total_amount, o.order_status, 
              u.first_name, u.last_name, u.email
       FROM orders o
       JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC
       LIMIT 5`,
      []
    )

    // Отримуємо популярні продукти
    const popularProducts = await executeQuery(
      `SELECT p.id, p.name, p.price, 
              COUNT(oi.id) as order_count,
              SUM(oi.quantity) as total_quantity
       FROM products p
       LEFT JOIN order_items oi ON p.id = oi.product_id
       GROUP BY p.id
       ORDER BY total_quantity DESC
       LIMIT 5`,
      []
    )

    return {
      usersCount,
      productsCount,
      categoriesCount,
      ordersCount,
      revenue,
      latestOrders: Array.isArray(latestOrders) ? latestOrders : [],
      popularProducts: Array.isArray(popularProducts) ? popularProducts : [],
    }
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return {
      usersCount: 0,
      productsCount: 0,
      categoriesCount: 0,
      ordersCount: 0,
      revenue: 0,
      latestOrders: [],
      popularProducts: [],
    }
  }
}

export default function AdminPage() {
  return (
    <div>
      <h1>Адмін Панель</h1>
      {/* ...add your CRUD admin tools interface here... */}
    </div>
  )
}