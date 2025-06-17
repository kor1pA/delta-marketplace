import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db'; // Adjust the path as needed

// GET /api/categories - get list of categories
export async function GET(request: NextRequest) {
  try {
    const categories = await executeQuery(
      "SELECT * FROM categories ORDER BY name ASC",
      []
    )

    return NextResponse.json(Array.isArray(categories) ? categories : [])
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

// POST /api/categories - create new category
export async function POST(request: NextRequest) {
  try {
    // ... authorization check remains unchanged ...

    const data = await request.json()

    // Data validation
    if (!data.name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 })
    }

    // Create category
    const result = await executeQuery(
      `INSERT INTO categories (name, description, image_url, created_at, updated_at)
       VALUES (?, ?, ?, NOW(), NOW())`,
      [data.name, data.description || null, data.image_url || null]
    )

    // Get created category
    const insertId = (result as any)?.insertId;
    if (!insertId) {
      return NextResponse.json({ error: "Failed to retrieve new category ID" }, { status: 500 });
    }
    const categories = await executeQuery(
      "SELECT * FROM categories WHERE id = ?",
      [insertId]
    )

    const category = Array.isArray(categories) && categories.length > 0 ? categories[0] : null

    return NextResponse.json(category)
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}