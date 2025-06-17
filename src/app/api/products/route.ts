import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import fs from 'fs';
import path from 'path';

// GET /api/products - получение списка товаров
export async function GET(request: NextRequest) {
  try {
    // Parse query parameters from the request URL
    const { search, category, sort, page } = Object.fromEntries(new URL(request.url).searchParams)
    console.log("API /products query parameters:", { search, category, sort, page })

    // Build SQL query dynamically based on filters
    let query = `
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `
    const queryParams: any[] = []

    // Validate category parameter (ensure it's numeric or null)
    if (category && category !== "All Categories") {
      const categoryId = parseInt(category, 10)
      if (!isNaN(categoryId)) {
        query += " AND p.category_id = ?"
        queryParams.push(categoryId)
      } else {
        console.warn("Invalid category parameter:", category)
      }
    }

    if (search) {
      query += " AND (p.name LIKE ? OR p.description LIKE ?)"
      queryParams.push(`%${search}%`, `%${search}%`)
    }

    // Sorting (default: newest)
    switch (sort) {
      case "name_asc":
        query += " ORDER BY p.name ASC"
        break
      case "name_desc":
        query += " ORDER BY p.name DESC"
        break
      case "price_asc":
        query += " ORDER BY p.price ASC"
        break
      case "price_desc":
        query += " ORDER BY p.price DESC"
        break
      case "rating_desc":
        query += " ORDER BY p.rating DESC"
        break
      case "oldest":
        query += " ORDER BY p.id ASC"
        break
      default:
        query += " ORDER BY p.id DESC"
    }

    // Pagination: assume 10 items per page, default page 1
    const itemsPerPage = 10
    const pageNumber = parseInt(page || "1")
    const offset = (pageNumber - 1) * itemsPerPage
    query += " LIMIT ? OFFSET ?"
    queryParams.push(itemsPerPage, offset)

    console.log("Final SQL query:", query, queryParams)

    const products = await executeQuery(query, queryParams)

    if (!products || !Array.isArray(products)) {
      console.warn("No products found in the database.")
      return NextResponse.json({ products: [], pagination: { total: 0, page: pageNumber, limit: itemsPerPage, totalPages: 0 } })
    }

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as total
      FROM products p
      WHERE 1=1
      ${category && category !== "All Categories" ? " AND p.category_id = ?" : ""}
      ${search ? " AND (p.name LIKE ? OR p.description LIKE ?)" : ""}
    `
    const countParams = []
    if (category && category !== "All Categories") {
      const categoryId = parseInt(category, 10)
      if (!isNaN(categoryId)) {
        countParams.push(categoryId)
      }
    }
    if (search) countParams.push(`%${search}%`, `%${search}%`)

    const countResult = await executeQuery(countQuery, countParams)

    const total = Array.isArray(countResult) && countResult.length > 0 ? countResult[0].total : 0

    console.log("Total products count:", total)

    return NextResponse.json({
      products: products,
      pagination: {
        total,
        page: pageNumber,
        limit: itemsPerPage,
        totalPages: Math.ceil(total / itemsPerPage),
      },
    })
  } catch (error) {
    console.error("Error fetching products:", (error as Error).message)
    return NextResponse.json({ error: "Failed to fetch products", details: (error as Error).message }, { status: 500 })
  }
}

// POST /api/products - создание нового товара
export async function POST(request: NextRequest) {
  try {
    // Check authorization and user role
    const session = await getServerSession(authOptions);
    console.log('Session:', session);
    
    if (!session || !session.user || session.user.role !== "admin") {
      console.log('Authorization failed:', { session });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the FormData
    const formData = await request.formData();
    
    // Log received data
    console.log('Received FormData entries:');
    for (let [key, value] of formData.entries()) {
      console.log(key + ':', value);
    }
    
    const data = Object.fromEntries(formData.entries());
    console.log('Parsed form data:', data);

    // Validate input data
    if (!data.name || !data.description || !data.price) {
      console.log('Missing required fields:', { name: !!data.name, description: !!data.description, price: !!data.price });
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Create product first
    console.log('Executing insert query with params:', [
      data.name,
      data.description,
      data.long_description || null,
      data.price,
      data.category_id || null,
      data.in_stock !== undefined ? data.in_stock : true,
    ]);

    const inStockValue = data.in_stock === 'true' ? 1 : 0; // Convert 'true'/'false' to 1/0

    const result = await executeQuery(
      `
        INSERT INTO products (
          name, description, long_description, price, 
          category_id, in_stock, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
      `,
      [
        data.name,
        data.description,
        data.long_description || null,
        data.price,
        data.category_id || null,
        inStockValue, // Use the converted value
      ]
    );

    console.log('Insert query result:', result);

    // @ts-ignore - MySQL2 возвращает insertId
    const productId = result.insertId;
    console.log('Created product ID:', productId);

    // Handle image upload
    const { image } = data;
    if (image && image instanceof File) {
        const uploadDir = path.join(process.cwd(), 'public/uploads/products');
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

        const imagePath = path.join(uploadDir, `${productId}_${image.name}`);
        console.log('Saving image to:', imagePath); // Debug log

        const fileReader = new FileReader();
        fileReader.onload = () => {
            fs.writeFileSync(imagePath, Buffer.from(fileReader.result as ArrayBuffer));
        };
        fileReader.readAsArrayBuffer(image);

        const imageQuery = `
            INSERT INTO product_images (product_id, image_url, created_at, updated_at)
            VALUES (?, ?, NOW(), NOW())
        `;
        await executeQuery(imageQuery, [productId, `/uploads/products/${productId}_${image.name}`]);
    }

    // Fetch the created product with image
    const products = await executeQuery(
      `
        SELECT p.*, pi.filename as image_url 
        FROM products p 
        LEFT JOIN product_images pi ON p.id = pi.product_id
        WHERE p.id = ?
      `,
      [productId]
    );

    console.log('Fetched created product:', products);

    const product = Array.isArray(products) && products.length > 0 ? products[0] : null;

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ 
      error: "Failed to create product", 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
