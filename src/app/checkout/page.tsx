"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, CreditCard, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useToast } from "@/hooks/use-toast"
import "./checkout.css"

// Mock cart data
const cartItems = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 199.99,
    image: "/placeholder.svg?height=100&width=100",
    color: "Black",
    quantity: 1,
  },
  {
    id: 3,
    name: "Organic Cotton T-Shirt",
    price: 29.99,
    image: "/placeholder.svg?height=100&width=100",
    color: "Blue",
    size: "Medium",
    quantity: 2,
  },
  {
    id: 4,
    name: "Stainless Steel Water Bottle",
    price: 34.99,
    image: "/placeholder.svg?height=100&width=100",
    color: "Silver",
    quantity: 1,
  },
]

const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
const discount = 0
const shipping = subtotal > 100 ? 0 : 10
const total = subtotal - discount + shipping

export default function CheckoutPage() {
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState("credit-card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const handleSubmitShipping = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(2)
    window.scrollTo(0, 0)
  }

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      setIsComplete(true)
      window.scrollTo(0, 0)
      toast({
        title: "Order placed successfully!",
        description: "Thank you for your purchase",
      })
    }, 2000)
  }

  if (isComplete) {
    return (
      <div className="order-complete">
        <div className="success-icon">
          <Check className="success-check" />
        </div>
        <h1 className="complete-title">Order Confirmed!</h1>
        <p className="complete-message">
          Thank you for your purchase. Your order has been confirmed and will be shipped soon.
        </p>
        <div className="order-info">
          <div className="order-number">Order #12345</div>
          <div className="order-email">A confirmation email has been sent to your email address.</div>
        </div>
        <div className="complete-actions">
          <Link href="/products">
            <Button>Continue Shopping</Button>
          </Link>
          <Link href="/account/orders">
            <Button variant="outline">View Order</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <div className="breadcrumb">
        <Link href="/" className="breadcrumb-link">
          Home
        </Link>
        <ChevronRight className="breadcrumb-separator" />
        <Link href="/cart" className="breadcrumb-link">
          Cart
        </Link>
        <ChevronRight className="breadcrumb-separator" />
        <span className="breadcrumb-current">Checkout</span>
      </div>

      <h1 className="checkout-title">Checkout</h1>

      <div className="checkout-content">
        <div className="checkout-main">
          <div className="checkout-steps">
            <div>
              <div className="step-header">
                <div className={`step-number ${step >= 1 ? "step-active" : "step-inactive"}`}>1</div>
                <div className="step-title">Shipping Information</div>
              </div>

              {step === 1 && (
                <form onSubmit={handleSubmitShipping} className="shipping-form">
                  <div className="form-grid">
                    <div className="form-group">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input id="first-name" required />
                    </div>
                    <div className="form-group">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input id="last-name" required />
                    </div>
                    <div className="form-group">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" required />
                    </div>
                    <div className="form-group">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" type="tel" required />
                    </div>
                    <div className="form-group full-width">
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" required />
                    </div>
                    <div className="form-group">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" required />
                    </div>
                    <div className="form-group">
                      <Label htmlFor="postal-code">Postal Code</Label>
                      <Input id="postal-code" required />
                    </div>
                    <div className="form-group">
                      <Label htmlFor="country">Country</Label>
                      <Select defaultValue="us">
                        <SelectTrigger id="country">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="ca">Canada</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="au">Australia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="form-group">
                      <Label htmlFor="state">State/Province</Label>
                      <Select defaultValue="ny">
                        <SelectTrigger id="state">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ny">New York</SelectItem>
                          <SelectItem value="ca">California</SelectItem>
                          <SelectItem value="tx">Texas</SelectItem>
                          <SelectItem value="fl">Florida</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="form-actions">
                    <Button type="submit">Continue to Payment</Button>
                  </div>
                </form>
              )}
            </div>

            {step >= 2 && (
              <>
                <div className="shipping-info">
                  <div className="shipping-header">
                    <div>
                      <div className="shipping-title">Shipping Address</div>
                      <div className="shipping-address">
                        John Doe
                        <br />
                        123 Main St
                        <br />
                        New York, NY 10001
                        <br />
                        United States
                      </div>
                    </div>
                    {step === 2 && (
                      <button className="edit-button" onClick={() => setStep(1)}>
                        Edit
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <div className="step-header">
                    <div className={`step-number ${step >= 2 ? "step-active" : "step-inactive"}`}>2</div>
                    <div className="step-title">Payment Method</div>
                  </div>

                  {step === 2 && (
                    <form onSubmit={handleSubmitPayment}>
                      <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="payment-methods">
                        <div
                          className={`payment-method ${paymentMethod === "credit-card" ? "payment-method-selected" : ""}`}
                        >
                          <RadioGroupItem value="credit-card" id="credit-card" />
                          <Label htmlFor="credit-card" className="payment-label">
                            <div className="payment-option">
                              <CreditCard className="payment-icon" />
                              <span>Credit Card</span>
                            </div>
                          </Label>
                        </div>
                        <div
                          className={`payment-method ${paymentMethod === "paypal" ? "payment-method-selected" : ""}`}
                        >
                          <RadioGroupItem value="paypal" id="paypal" />
                          <Label htmlFor="paypal" className="payment-label">
                            <div className="payment-option">
                              <svg className="payment-icon" viewBox="0 0 24 24" fill="none">
                                <path
                                  d="M7.5 19.5H3.5L5 8.5H9.5C12.5 8.5 14 10 13.5 12.5C13 15 10.5 16.5 7.5 16.5"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M13.5 19.5H9.5L11 8.5H15.5C18.5 8.5 20 10 19.5 12.5C19 15 16.5 16.5 13.5 16.5"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <span>PayPal</span>
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>

                      {paymentMethod === "credit-card" && (
                        <div className="payment-details">
                          <div className="card-fields">
                            <div className="form-group">
                              <Label htmlFor="card-number">Card Number</Label>
                              <Input id="card-number" placeholder="1234 5678 9012 3456" required />
                            </div>
                            <div className="card-row">
                              <div className="form-group">
                                <Label htmlFor="expiry">Expiry Date</Label>
                                <Input id="expiry" placeholder="MM/YY" required />
                              </div>
                              <div className="form-group">
                                <Label htmlFor="cvc">CVC</Label>
                                <Input id="cvc" placeholder="123" required />
                              </div>
                            </div>
                            <div className="form-group">
                              <Label htmlFor="name-on-card">Name on Card</Label>
                              <Input id="name-on-card" required />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="form-actions">
                        <Button type="submit" disabled={isProcessing}>
                          {isProcessing ? "Processing..." : "Place Order"}
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="checkout-summary">
          <div className="summary-container">
            <h2 className="summary-title">Order Summary</h2>

            <Accordion type="single" collapsible defaultValue="items" className="order-items">
              <AccordionItem value="items">
                <AccordionTrigger>
                  {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="order-items-list">
                    {cartItems.map((item) => (
                      <div key={item.id} className="order-item">
                        <div className="item-image">
                          <img src={item.image || "/placeholder.svg"} alt={item.name} />
                        </div>
                        <div className="item-details">
                          <div className="item-name">{item.name}</div>
                          <div className="item-variant">
                            {item.color}
                            {item.size && ` / ${item.size}`}
                          </div>
                          <div className="item-quantity">
                            {item.quantity} × ${item.price.toFixed(2)}
                          </div>
                        </div>
                        <div className="item-price">${(item.price * item.quantity).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Separator />

            <div className="summary-details">
              <div className="summary-row">
                <span className="summary-label">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="summary-row discount-row">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="summary-row">
                <span className="summary-label">Shipping</span>
                <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
              </div>
              <Separator />
              <div className="summary-row total-row">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
