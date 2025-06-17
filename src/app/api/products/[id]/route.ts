import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// GET /api/products/[id] - получение товара по ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productId = params.id

    // Получаем товар
    const products = await executeQuery(
      `
        SELECT p.*, c.name as category_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.id = ?
      `,
      [productId]
    )

    const product = Array.isArray(products) && products.length > 0 ? products[0] : null

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Получаем изображения товара
    const images = await executeQuery(
      "SELECT * FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, display_order ASC",
      [productId]
    )

    // Получаем спецификации товара
    const specifications = await executeQuery(
      "SELECT * FROM product_specifications WHERE product_id = ?",
      [productId]
    )

    // Получаем варианты товара
    const variants = await executeQuery(
      "SELECT * FROM product_variants WHERE product_id = ?",
      [productId]
    )

    return NextResponse.json({
      ...product,
      images: Array.isArray(images) ? images : [],
      specifications: Array.isArray(specifications) ? specifications : [],
      variants: Array.isArray(variants) ? variants : [],
    })
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

// PUT /api/products/[id] - обновление товара
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Проверяем авторизацию и роль пользователя
    const session = await getServerSession(authOptions)
    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const productId = params.id
    const data = await request.json()

    // Валидация данных
    if (!data.name || !data.description || !data.price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Обновляем товар
    await executeQuery(
      `
        UPDATE products
        SET name = ?, description = ?, long_description = ?, price = ?,
            category_id = ?, in_stock = ?, updated_at = NOW()
        WHERE id = ?
      `,
      [
        data.name,
        data.description,
        data.long_description || null,
        data.price,
        data.category_id || null,
        data.in_stock !== undefined ? data.in_stock : true,
        productId,
      ]
    )

    // Получаем обновленный товар
    const products = await executeQuery(
      "SELECT * FROM products WHERE id = ?",
      [productId]
    )

    const product = Array.isArray(products) && products.length > 0 ? products[0] : null

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

// DELETE /api/products/[id] - удаление товара
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Проверяем авторизацию и роль пользователя
    const session = await getServerSession(authOptions)
    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const productId = params.id

    // Удаляем товар
    await executeQuery(
      "DELETE FROM products WHERE id = ?",
      [productId]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
