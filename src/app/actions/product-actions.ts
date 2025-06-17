"use server"

import { executeQuery } from "@/lib/db"

// Define types for our data
interface Product {
  id: number
  name: string
  description: string
  long_description?: string
  price: number | string
  rating: number | string
  review_count?: number
  category_id?: number
  in_stock?: boolean
  created_at?: string
  updated_at?: string
  category_name?: string
  image?: string // Add the image field
}

interface ProductImage {
  id: number
  product_id: number
  image_url: string
  is_primary: boolean
  display_order: number
  created_at: string
}

interface ProductVariant {
  id: number
  product_id: number
  variant_type: string
  variant_value: string
  created_at: string
}

interface ProductSpecification {
  id: number
  product_id: number
  spec_name: string
  spec_value: string
  created_at: string
}

interface Category {
  id: number
  name: string
  description: string
  image_url: string
  product_count: number
  created_at: string
  updated_at: string
}

interface GroupedVariants {
  [key: string]: string[]
}

interface SpecificationsObject {
  [key: string]: string
}

interface ProductWithDetails extends Product {
  images: string[]
  variants: GroupedVariants
  specifications: SpecificationsObject
}

export async function getProducts() {
  try {
    const query = `
        SELECT p.id, p.name, p.description, 
               CAST(p.price AS DECIMAL(10,2)) as price, 
               p.rating, p.review_count, p.category_id, p.in_stock, 
               p.created_at, p.updated_at, c.name as category_name, 
               (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as image
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        ORDER BY p.id
        LIMIT 10
      `
    const products = await executeQuery(query) as Product[]

    // Log the first product to see its structure
    if (products && products.length > 0) {
      console.log("First product:", products[0])
    }

    return { products, error: null }
  } catch (error) {
    console.error("Error fetching products:", error)
    return {
      products: null,
      error: "Failed to fetch products",
    }
  }
}

export async function getProductById(id: number) {
  try {
    // Get product details
    const query = `
        SELECT p.*, c.name as category_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.id = ?
      `
    const products = await executeQuery(query, [id]) as Product[]

    const product = Array.isArray(products) && products.length > 0 ? products[0] : null

    if (!product) {
      return { product: null, error: "Product not found" }
    }

    // Get product images
    const queryImages = "SELECT * FROM product_images WHERE product_id = ? ORDER BY display_order"
    const images = await executeQuery(queryImages, [id]) as ProductImage[]

    // Get product variants
    const queryVariants = "SELECT * FROM product_variants WHERE product_id = ?"
    const variants = await executeQuery(queryVariants, [id]) as ProductVariant[]

    // Get product specifications
    const querySpecifications = "SELECT * FROM product_specifications WHERE product_id = ?"
    const specifications = await executeQuery(querySpecifications, [id]) as ProductSpecification[]

    // Group variants by type (color, size, etc.)
    const groupedVariants: GroupedVariants = {}
    if (Array.isArray(variants)) {
      variants.forEach((variant) => {
        if (!groupedVariants[variant.variant_type]) {
          groupedVariants[variant.variant_type] = []
        }
        groupedVariants[variant.variant_type].push(variant.variant_value)
      })
    }

    // Convert specifications to object
    const specsObject: SpecificationsObject = {}
    if (Array.isArray(specifications)) {
      specifications.forEach((spec) => {
        specsObject[spec.spec_name] = spec.spec_value
      })
    }

    // Combine all data
    const productWithDetails: ProductWithDetails = {
      ...product,
      images: Array.isArray(images) ? images.map((img) => img.image_url) : [],
      variants: groupedVariants,
      specifications: specsObject,
    }

    return { product: productWithDetails, error: null }
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error)
    return {
      product: null,
      error: `Failed to fetch product with ID ${id}`,
    }
  }
}

export async function getCategories() {
  try {
    const query = "SELECT * FROM categories ORDER BY name"
    const categories = await executeQuery(query) as Category[]

    return { categories, error: null }
  } catch (error) {
    console.error("Error fetching categories:", error)
    return {
      categories: null,
      error: "Failed to fetch categories",
    }
  }
}

export async function uploadProductImage(formData: FormData) {
  try {
    const response = await fetch('/api/products/images', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error uploading product image:', error);
    throw error;
  }
}
