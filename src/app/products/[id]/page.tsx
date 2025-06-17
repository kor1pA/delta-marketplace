"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, Minus, Plus, Star, ShoppingCart, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import "./product-detail.css"

// Mock product data
const product = {
  id: 1,
  name: "Wireless Headphones",
  description: "Premium noise-cancelling wireless headphones with 30-hour battery life.",
  longDescription: `
    <p>Experience premium sound quality with our Wireless Headphones. These headphones feature advanced noise-cancellation technology that blocks out ambient noise, allowing you to focus on your music or calls.</p>
    <p>With a 30-hour battery life, you can enjoy your favorite tunes all day long without worrying about recharging. The comfortable over-ear design ensures you can wear them for extended periods without discomfort.</p>
    <p>Key Features:</p>
    <ul>
      <li>Active Noise Cancellation</li>
      <li>30-hour battery life</li>
      <li>Bluetooth 5.0 connectivity</li>
      <li>Built-in microphone for calls</li>
      <li>Comfortable over-ear design</li>
      <li>Quick charge: 5 minutes for 3 hours of playback</li>
    </ul>
  `,
  price: 199.99,
  rating: 4.5,
  reviewCount: 128,
  images: [
    "/placeholder.svg?height=500&width=500",
    "/placeholder.svg?height=500&width=500",
    "/placeholder.svg?height=500&width=500",
    "/placeholder.svg?height=500&width=500",
  ],
  colors: ["Black", "Silver", "Blue"],
  category: "Electronics",
  inStock: true,
  specifications: {
    Brand: "TechAudio",
    Model: "WH-1000X",
    Connectivity: "Bluetooth 5.0",
    "Battery Life": "30 hours",
    Weight: "250g",
    Dimensions: "7.3 x 3.1 x 9.4 inches",
    Warranty: "1 year",
  },
}

// Mock related products
const relatedProducts = [
  {
    id: 2,
    name: "Smart Watch",
    price: 249.99,
    rating: 4.2,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 5,
    name: "Bluetooth Speaker",
    price: 79.99,
    rating: 4.3,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 9,
    name: "Wireless Earbuds",
    price: 129.99,
    rating: 4.6,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 12,
    name: "Portable Charger",
    price: 49.99,
    rating: 4.4,
    image: "/placeholder.svg?height=200&width=200",
  },
]

export default function ProductPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [selectedImage, setSelectedImage] = useState(0)

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    setQuantity(quantity + 1)
  }

  const addToCart = () => {
    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name} (${selectedColor}) added to your cart`,
    })
  }

  const addToWishlist = () => {
    toast({
      title: "Added to wishlist",
      description: `${product.name} has been added to your wishlist`,
    })
  }

  return (
    <div className="product-detail-page">
      <div className="breadcrumb">
        <Link href="/" className="breadcrumb-link">
          Home
        </Link>
        <ChevronRight className="breadcrumb-separator" />
        <Link href="/products" className="breadcrumb-link">
          Products
        </Link>
        <ChevronRight className="breadcrumb-separator" />
        <Link href={`/categories/${product.category.toLowerCase()}`} className="breadcrumb-link">
          {product.category}
        </Link>
        <ChevronRight className="breadcrumb-separator" />
        <span className="breadcrumb-current">{product.name}</span>
      </div>

      <div className="product-detail">
        <div className="product-gallery">
          <div className="product-main-image">
            <img src={product.images[selectedImage] || "/placeholder.svg"} alt={product.name} className="main-image" />
          </div>
          <div className="product-thumbnails">
            {product.images.map((image, index) => (
              <button
                key={index}
                className={`thumbnail-button ${selectedImage === index ? "thumbnail-active" : ""}`}
                onClick={() => setSelectedImage(index)}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} - Image ${index + 1}`}
                  className="thumbnail-image"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="product-info">
          <div className="product-header">
            <h1 className="product-title">{product.name}</h1>
            <div className="product-rating">
              <div className="rating-stars">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`star-icon ${
                      i < Math.floor(product.rating) ? "star-filled" : i < product.rating ? "star-half" : "star-empty"
                    }`}
                  />
                ))}
              </div>
              <span className="rating-count">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>
          </div>

          <div className="product-price">${product.price.toFixed(2)}</div>

          <div className="product-options">
            <div className="color-options">
              <h3 className="option-label">Color</h3>
              <div className="color-buttons">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    className={`color-button ${selectedColor === color ? "color-active" : ""}`}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div className="quantity-selector">
              <h3 className="option-label">Quantity</h3>
              <div className="quantity-controls">
                <Button variant="outline" size="icon" onClick={decreaseQuantity} disabled={quantity <= 1}>
                  <Minus className="quantity-icon" />
                </Button>
                <span className="quantity-value">{quantity}</span>
                <Button variant="outline" size="icon" onClick={increaseQuantity}>
                  <Plus className="quantity-icon" />
                </Button>
              </div>
            </div>
          </div>

          <div className="product-actions">
            <Button className="add-to-cart" size="lg" onClick={addToCart}>
              <ShoppingCart className="action-icon" />
              Add to Cart
            </Button>
            <Button variant="outline" size="lg" onClick={addToWishlist} className="add-to-wishlist">
              <Heart className="action-icon" />
              Add to Wishlist
            </Button>
          </div>

          <div className="product-summary">
            <p className="product-short-description">{product.description}</p>
            <div className="product-meta">
              <div className="product-availability">
                <div className="availability-indicator"></div>
                <span>{product.inStock ? "In Stock" : "Out of Stock"}</span>
              </div>
              <div className="product-category-info">Category: {product.category}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="product-details-tabs">
        <Tabs defaultValue="description">
          <TabsList className="tabs-list">
            <TabsTrigger value="description" className="tab-trigger">
              Description
            </TabsTrigger>
            <TabsTrigger value="specifications" className="tab-trigger">
              Specifications
            </TabsTrigger>
            <TabsTrigger value="reviews" className="tab-trigger">
              Reviews
            </TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="tab-content">
            <div className="product-description" dangerouslySetInnerHTML={{ __html: product.longDescription }} />
          </TabsContent>
          <TabsContent value="specifications" className="tab-content">
            <div className="product-specifications">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="specification-item">
                  <span className="specification-key">{key}</span>
                  <span className="specification-value">{value}</span>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="tab-content">
            <div className="reviews-placeholder">
              <h3 className="reviews-title">Customer Reviews</h3>
              <p className="reviews-message">Reviews will be displayed here. Sign in to leave a review.</p>
              <Button className="write-review-button">Write a Review</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="related-products">
        <h2 className="related-title">Related Products</h2>
        <div className="related-grid">
          {relatedProducts.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`} className="related-product">
              <div className="related-product-content">
                <div className="related-image-container">
                  <img src={product.image || "/placeholder.svg"} alt={product.name} className="related-image" />
                </div>
                <div className="related-details">
                  <h3 className="related-name">{product.name}</h3>
                  <div className="related-info">
                    <span className="related-price">${product.price.toFixed(2)}</span>
                    <div className="related-rating">
                      <Star className="related-star" />
                      <span className="related-rating-value">{product.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
