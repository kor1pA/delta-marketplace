import Link from "next/link"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { locales } from "@/i18n/config"
import { executeQuery } from "@/lib/db"
import "./products.css"

// Генерируем статические параметры для всех поддерживаемых локалей
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

// Fetch products from the database
async function getProducts() {
  try {
    const query = `
      SELECT id, name, description, price, rating, category_id
      FROM products
      LIMIT 20
    `
    const products = await executeQuery(query)
    return Array.isArray(products) ? products : []
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

export default async function ProductsPage({ params }: { params: { locale: string } }) {
  const locale = params.locale // No need to await params.locale
  const products = await getProducts()

  return (
    <div className="products-page">
      <div className="products-header">
        <h1 className="products-title">All Products</h1>
        <div className="filter-controls">
          <div className="search-filters">
            <Input placeholder="Search products..." className="search-products" />
            <Select defaultValue="all">
              <SelectTrigger className="category-select">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="home">Home & Kitchen</SelectItem>
                <SelectItem value="beauty">Beauty & Personal Care</SelectItem>
                <SelectItem value="sports">Sports & Outdoors</SelectItem>
                <SelectItem value="books">Books</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="sort-controls">
            <Select defaultValue="featured">
              <SelectTrigger className="sort-select">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="products-list">
        {products.map((product: any) => (
          <div key={product.id} className="product-item">
            <Link href={`/${locale}/products/${product.id}`} className="product-image-link">
              <div className="product-image-container">
                <img src="/placeholder.svg" alt={product.name} className="product-image" />
                <div className="product-category-tag">{product.category_id || "Uncategorized"}</div>
              </div>
            </Link>
            <div className="product-details">
              <div className="product-info">
                <div className="product-header">
                  <Link href={`/${locale}/products/${product.id}`} className="product-title">
                    {product.name}
                  </Link>
                  <div className="product-rating">
                    <Star className="rating-icon" />
                    <span className="rating-text">{product.rating || "N/A"}</span>
                  </div>
                </div>
                <p className="product-description">{product.description}</p>
                <div className="product-price">${parseFloat(product.price).toFixed(2)}</div>
              </div>
            </div>
            <div className="product-actions">
              <Button className="add-to-cart-btn">Add to Cart</Button>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination-container">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
