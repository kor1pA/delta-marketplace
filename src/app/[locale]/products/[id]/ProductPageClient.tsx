"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, ShoppingCart, Heart } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useTranslation } from "@/providers/i18n-provider"
import { useCart } from "@/context/CartContext"
import { SafeHtml } from "@/components/safe-html"
import "./product-detail.css"

interface Product {
  id: number
  name: string
  description: string
  long_description?: string
  specifications?: Record<string, string>
  price: number
  rating: number
  reviewCount: number
  category_name: string
  inStock: boolean
  colors?: string[]
}

interface Review {
  id: number
  userId: number
  userName: string
  rating: number
  comment: string
  date: string
}

interface RelatedProduct {
  id: number
  name: string
  price: number
  image: string
}

interface ProductImage {
  image_url: string;
  color?: string;
}

interface ProductPageClientProps {
  params: { id: string; locale: string }
  product: Product
  relatedProducts: RelatedProduct[]
  images: ProductImage[]
  reviews?: Review[]
}

export default function ProductPageClient({ 
  params, 
  product, 
  relatedProducts, 
  images,
  reviews = []
}: ProductPageClientProps) {
  const { toast } = useToast()
  const { locale } = useTranslation()
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '')
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [productReviews, setProductReviews] = useState(reviews)

  // Group images by colors
  const imagesByColor = images.reduce((acc, img) => {
    if (img.color) {
      if (!acc[img.color]) {
        acc[img.color] = [];
      }
      acc[img.color].push(img);
    }
    return acc;
  }, {} as Record<string, ProductImage[]>);

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    setQuantity(quantity + 1)
  }

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    // Find the first image for the selected color
    const colorImages = imagesByColor[color];
    if (colorImages?.length) {
      const imageIndex = images.findIndex(img => img.image_url === colorImages[0].image_url);
      if (imageIndex !== -1) {
        setSelectedImage(imageIndex);
      }
    }
  };

  const addToWishlist = () => {
    toast({
      title: "Added to wishlist",
      description: `${product.name} has been added to your wishlist`,
    })
  }

  const addToCartHandler = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      color: selectedColor,
      image: images[selectedImage]?.image_url || "/placeholder.svg"
    });

    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name} has been added to your cart`,
    })
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/products/${product.id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: newReview.rating,
          comment: newReview.comment,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      // Add new review to the list
      setProductReviews([data, ...productReviews]);
      
      toast({
        title: "Review submitted",
        description: "Thank you for your review!",
      });

      setNewReview({ rating: 5, comment: '' });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="product-container">
      {/* Breadcrumb navigation */}
      <div className="breadcrumb">
        <Link href="/">Home</Link>
        <ChevronRight size={16} />
        <Link href="/products">Products</Link>
        <ChevronRight size={16} />
        <span>{product.category_name}</span>
      </div>

      {/* Product Details */}
      <div className="product-details">
        {/* Product Images Gallery */}
        <div className="product-images">
          <div className="main-image">
            <img 
              src={images[selectedImage]?.image_url || "/placeholder.svg"} 
              alt={product.name} 
            />
          </div>
          <div className="thumbnail-images">
            {images.map((image, index) => (
              <button
                key={index}
                className={`thumbnail ${index === selectedImage ? 'selected' : ''}`}
                onClick={() => setSelectedImage(index)}
              >
                <img src={image.image_url} alt={`${product.name} view ${index + 1}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="product-info">
          <h1>{product.name}</h1>
          
          {/* Rating */}
          <div className="rating">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`star ${i < Math.round(product.rating) ? 'filled' : ''}`}>
                ★
              </span>
            ))}
            <span className="review-count">({product.reviewCount || 0} reviews)</span>
          </div>

          {/* Price */}
          <div className="price">
            ${product.price?.toFixed(2)}
          </div>

          {/* Short Description */}
          <div className="description">
            {product.description}
          </div>

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="color-selection">
              <label>Color:</label>
              <div className="color-options">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    className={`color-button ${color === selectedColor ? 'selected' : ''}`}
                    onClick={() => handleColorChange(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="quantity-selector">
            <label>Quantity:</label>
            <div className="quantity-controls">
              <button onClick={decreaseQuantity} className="quantity-btn">-</button>
              <input 
                type="number" 
                value={quantity} 
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} 
                min="1"
              />
              <button onClick={increaseQuantity} className="quantity-btn">+</button>
            </div>
          </div>          {/* Action Buttons */}
          <div className="action-buttons">
            <Button 
              onClick={addToCartHandler} 
              className="add-to-cart-button"
            >
              <ShoppingCart className="mr-2" />
              Add to Cart
            </Button>
            <Button onClick={addToWishlist} variant="outline" className="wishlist-button">
              <Heart className="mr-2" />
              Add to Wishlist
            </Button>
          </div>
        </div>
      </div>

      {/* Product Tabs: Description, Specifications, Reviews */}
      <Tabs defaultValue="description" className="product-tabs">
        <TabsList>
          <TabsTrigger value="description">Full Description</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="tab-content">
          {product.long_description ? (
            <SafeHtml html={product.long_description} />
          ) : (
            <p>No detailed description available.</p>
          )}
        </TabsContent>

        <TabsContent value="specifications" className="tab-content">
          {product.specifications && Object.keys(product.specifications).length > 0 ? (
            <div className="specifications-list">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="specification-item">
                  <span className="spec-label">{key}:</span>
                  <span className="spec-value">{value}</span>
                </div>
              ))}
            </div>
          ) : (
            <p>No specifications available.</p>
          )}
        </TabsContent>

        <TabsContent value="reviews" className="tab-content">
          {/* Review Form */}
          <form onSubmit={handleSubmitReview} className="review-form">
            <h3>Write a Review</h3>
            <div className="rating-input">
              <label>Rating:</label>
              <div className="star-rating">
                {[5, 4, 3, 2, 1].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`star-button ${star <= newReview.rating ? 'filled' : ''}`}
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    disabled={isSubmitting}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div className="comment-input">
              <label>Your Review:</label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                required
                placeholder="Share your thoughts about this product..."
                rows={4}
                disabled={isSubmitting}
              />
            </div>
            <Button 
              type="submit" 
              className="submit-review-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </form>

          <div className="reviews-divider" />

          {/* Existing Reviews */}
          {productReviews.length > 0 ? (
            <div className="reviews-list">
              {productReviews.map((review) => (
                <div key={review.id} className="review-item">
                  <div className="review-header">
                    <span className="review-author">{review.userName}</span>
                    <div className="review-rating">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`star ${i < review.rating ? 'filled' : ''}`}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="review-date">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-reviews">No reviews yet. Be the first to review this product!</p>
          )}
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="related-products">
          <h2>Related Products</h2>
          <div className="related-products-grid">
            {relatedProducts.map((item) => (
              <Link 
                key={item.id} 
                href={`/${locale}/products/${item.id}`} 
                className="related-product-card"
              >
                <img src={item.image || "/placeholder.svg"} alt={item.name} />
                <h3>{item.name}</h3>
                <p className="price">${item.price?.toFixed(2)}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

