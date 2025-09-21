"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { CartItemComponent } from "@/components/cart/cart-item"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { createPurchase } from "@/lib/cart"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency } from "@/lib/currency"
import { useRazorpay } from "@/hooks/use-razorpay"
import { ShoppingCart, CreditCard, ArrowRight } from "lucide-react"

export default function CartPage() {
  const { user, loading } = useAuth()
  const { cartItems, cartTotal, cartCount, refreshCart } = useCart()
  const router = useRouter()
  const { toast } = useToast()
  const { initiatePayment, loading: paymentLoading } = useRazorpay()
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  const handleCheckout = async () => {
    if (!user || cartItems.length === 0) return

    // Create a summary of all cart items for payment
    const productNames = cartItems.map(item => item.product.title).join(', ')
    const totalAmount = cartTotal

    // Initiate Razorpay payment
    await initiatePayment(
      {
        amount: totalAmount,
        productName: `Cart Items: ${productNames}`,
        productId: `cart_${Date.now()}`,
        sellerId: 'multiple', // Multiple sellers in cart
      },
      async (response) => {
        // Payment successful - create purchase records
        setCheckoutLoading(true)
        try {
          const purchaseId = await createPurchase(user.uid, cartItems, {
            paymentMethod: 'razorpay',
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
          })
          await refreshCart()

          toast({
            title: "Purchase successful!",
            description: "Your order has been placed successfully.",
          })

          router.push("/purchases")
        } catch (error) {
          console.error("Error creating purchase record:", error)
          toast({
            title: "Error",
            description: "Payment successful but failed to save order. Please contact support.",
            variant: "destructive",
          })
        } finally {
          setCheckoutLoading(false)
        }
      },
      (error) => {
        console.error("Payment failed:", error)
        // Error handling is done in the hook
      }
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-emerald-50/50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-3">
            Shopping Cart
          </h1>
          <p className="text-gray-600 text-lg">
            {cartCount > 0 ? `${cartCount} item${cartCount !== 1 ? "s" : ""} in your cart` : "Your cart is empty"}
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gradient-to-r from-blue-100 to-emerald-100 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="h-16 w-16 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Discover amazing sustainable products from our community marketplace
            </p>
            <Button 
              onClick={() => router.push("/products")}
              className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <ArrowRight className="h-5 w-5 mr-2" />
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <CartItemComponent key={item.id} item={item} />
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6 border-0 shadow-xl bg-gradient-to-b from-white to-gray-50/50">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-gray-900">Order Summary</CardTitle>
                  <CardDescription className="text-gray-600">
                    {cartCount} items in your cart
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm py-2 border-b border-gray-100 last:border-0">
                        <span className="line-clamp-1 text-gray-700 font-medium">
                          {item.product.title} × {item.quantity}
                        </span>
                        <span className="text-gray-900 font-semibold">
                          {formatCurrency(item.product.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                        {formatCurrency(cartTotal)}
                      </span>
                    </div>
                  </div>

                  <Button 
                    onClick={handleCheckout} 
                    disabled={checkoutLoading || paymentLoading} 
                    className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]" 
                    size="lg"
                  >
                    <CreditCard className="h-5 w-5 mr-2" />
                    {(checkoutLoading || paymentLoading) ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      "Secure Payment via Razorpay"
                    )}
                  </Button>
                  
                  <div className="text-center text-xs text-gray-500 mt-3">
                    🔒 Your payment information is secure and encrypted
                  </div>

                  <p className="text-xs text-muted-foreground text-center">
                    Secure payment powered by Razorpay. By proceeding, you agree to our terms and conditions
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
