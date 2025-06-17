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
import "../products/products.css"

// Mock product data
const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    description: "Premium noise-cancelling wireless headphones with 30-hour battery life.",
    price: 199.99,
    rating: 4.5,
    image: "/placeholder.svg?height=200&width=200",
    category: "Electronics",
  },
  {
    id: 2,
    name: "Smart Watch",
    description: "Track your fitness, receive notifications, and more with this sleek smart watch.",
    price: 249.99,
    rating: 4.2,
    image: "/placeholder.svg?height=200&width=200",
    category: "Electronics",
  },
  {
    id: 3,
    name: "Organic Cotton T-Shirt",
    description: "Comfortable, eco-friendly t-shirt made from 100% organic cotton.",
    price: 29.99,
    rating: 4.8,
    image: "/placeholder.svg?height=200&width=200",
    category: "Clothing",
  },
  {
    id: 4,
    name: "Stainless Steel Water Bottle",
    description: "Keep your drinks hot or cold for hours with this insulated water bottle.",
    price: 34.99,
    rating: 4.7,
    image: "/placeholder.svg?height=200&width=200",
    category: "Home & Kitchen",
  },
  {
    id: 5,
    name: "Bluetooth Speaker",
    description: "Portable Bluetooth speaker with 360° sound and 12-hour battery life.",
    price: 79.99,
    rating: 4.3,
    image: "/placeholder.svg?height=200&width=200",
    category: "Electronics",
  },
  {
    id: 6,
    name: "Yoga Mat",
    description: "Non-slip, eco-friendly yoga mat perfect for all types of yoga.",
    price: 45.99,
    rating: 4.6,
    image: "/placeholder.svg?height=200&width=200",
    category: "Sports & Outdoors",
  },
  {
    id: 7,
    name: "Coffee Maker",
    description: "Programmable coffee maker with thermal carafe to keep your coffee hot for hours.",
    price: 129.99,
    rating: 4.4,
    image: "/placeholder.svg?height=200&width=200",
    category: "Home & Kitchen",
  },
  {
    id: 8,
    name: "Leather Wallet",
    description: "Genuine leather wallet with RFID blocking technology.",
    price: 39.99,
    rating: 4.5,
    image: "/placeholder.svg?height=200&width=200",
    category: "Accessories",
  },
]

export default function ProductsPage() {
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
        {products.map((product) => (
          <div key={product.id} className="product-item">
            <Link href={`/products/${product.id}`} className="product-image-link">
              <div className="product-image-container">
                <img src={product.image || "/placeholder.svg"} alt={product.name} className="product-image" />
                <div className="product-category-tag">{product.category}</div>
              </div>
            </Link>
            <div className="product-details">
              <div className="product-info">
                <div className="product-header">
                  <Link href={`/products/${product.id}`} className="product-title">
                    {product.name}
                  </Link>
                  <div className="product-rating">
                    <Star className="rating-icon" />
                    <span className="rating-text">{product.rating}</span>
                  </div>
                </div>
                <p className="product-description">{product.description}</p>
                <div className="product-price">${product.price.toFixed(2)}</div>
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
