import React from "react"
import ProductPageClient from "./ProductPageClient"
import { executeQuery } from "../../../../lib/db"

// Fetch product details and related products
async function getProductDetails(id: string) {
  try {
    const productQuery = `
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `
    const productResult = await executeQuery(productQuery, [id])
    const product = Array.isArray(productResult) && productResult.length > 0 ? productResult[0] : null

    const relatedProductsQuery = `
      SELECT p.id, p.name, p.price, p.rating, 
             COALESCE(
               (SELECT pi.image_url 
                FROM product_images pi 
                WHERE pi.product_id = p.id 
                ORDER BY pi.display_order ASC 
                LIMIT 1),
               '/placeholder.svg'
             ) as image
      FROM products p
      WHERE p.category_id = (SELECT category_id FROM products WHERE id = ?)
      AND p.id != ?
      LIMIT 4
    `
    const relatedProducts = await executeQuery(relatedProductsQuery, [id, id])
    const formattedRelatedProducts = Array.isArray(relatedProducts) 
      ? relatedProducts.map(product => ({
          ...product,
          price: parseFloat(product.price) || 0,
          rating: parseFloat(product.rating) || 0
        }))
      : []

    // Handle product images
    let formattedImages = []
    if (id === "23") {
      // For product 23, use image from public/uploads/products
      formattedImages = [{
        image_url: "/uploads/products/1.jpg" // Images in public directory are served from root
      }]
    } else {
      // For other products, try to fetch from database
      const imagesQuery = `
        SELECT image_url
        FROM product_images
        WHERE product_id = ?
        ORDER BY display_order ASC
      `
      const images = await executeQuery(imagesQuery, [id])
      formattedImages = Array.isArray(images) ? images.map((image: { image_url: string }) => ({
        ...image,
        image_url: image.image_url.startsWith('http') 
          ? image.image_url 
          : image.image_url.startsWith('/') 
            ? image.image_url // If path starts with /, assume it's relative to public directory
            : `/uploads/products/${image.image_url}` // Otherwise, assume it's in uploads/products
      })) : []
    }

    return { 
      product: product ? {
        ...product,
        price: parseFloat(product.price) || 0,
        rating: parseFloat(product.rating) || 0
      } : null, 
      relatedProducts: formattedRelatedProducts, 
      images: formattedImages 
    }
  } catch (error) {
    console.error("Error fetching product details:", error)
    return { product: null, relatedProducts: [], images: [] }
  }
}

const ProductPage = async ({ params }: { params: { id: string; locale: string } }) => {
  const { id, locale } = await Promise.resolve(params)
  const { product, relatedProducts, images } = await getProductDetails(id)

  if (!product) {
    return <div>Product not found</div>
  }

  return (
    <div className="product-detail-page">
      <ProductPageClient params={{ id, locale }} product={product} relatedProducts={relatedProducts} images={images} />
    </div>
  )
}

export default ProductPage
