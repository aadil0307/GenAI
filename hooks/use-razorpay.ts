import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/hooks/use-toast'

declare global {
  interface Window {
    Razorpay: any
  }
}

export interface PaymentDetails {
  amount: number
  productName: string
  productId: string
  sellerId: string
}

export function useRazorpay() {
  const [loading, setLoading] = useState(false)
  const { userProfile } = useAuth()
  const { toast } = useToast()

  const initiatePayment = async (
    paymentDetails: PaymentDetails,
    onSuccess?: (response: any) => void,
    onError?: (error: any) => void
  ) => {
    if (!userProfile) {
      toast({
        title: 'Error',
        description: 'Please login to make a purchase',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    try {
      // Load Razorpay script
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.async = true
      document.body.appendChild(script)

      script.onload = async () => {
        try {
          // Create order on server
          const orderResponse = await fetch('/api/razorpay/create-order', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              amount: paymentDetails.amount,
              receipt: `ord_${Date.now().toString().slice(-10)}`, // Max 40 chars, using last 10 digits of timestamp
              notes: {
                productId: paymentDetails.productId,
                productName: paymentDetails.productName,
                sellerId: paymentDetails.sellerId,
                buyerId: userProfile.uid,
              },
            }),
          })

          const orderData = await orderResponse.json()

          if (!orderData.success) {
            throw new Error(orderData.error || 'Failed to create order')
          }

          // Initialize Razorpay payment
          const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
            amount: orderData.order.amount,
            currency: orderData.order.currency,
            name: 'OdooXNMIT Store',
            description: `Purchase: ${paymentDetails.productName}`,
            order_id: orderData.order.id,
            handler: async (response: any) => {
              try {
                // Verify payment on server
                const verifyResponse = await fetch('/api/razorpay/verify-payment', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                  }),
                })

                const verifyData = await verifyResponse.json()

                if (verifyData.success) {
                  toast({
                    title: 'Payment Successful!',
                    description: 'Your purchase has been completed successfully.',
                  })
                  onSuccess?.(response)
                } else {
                  throw new Error('Payment verification failed')
                }
              } catch (error) {
                console.error('Payment verification error:', error)
                toast({
                  title: 'Payment Verification Failed',
                  description: 'Please contact support if amount was deducted.',
                  variant: 'destructive',
                })
                onError?.(error)
              }
            },
            prefill: {
              name: userProfile.username || userProfile.email,
              email: userProfile.email,
              contact: userProfile.phone || '',
            },
            theme: {
              color: '#3B82F6',
            },
            modal: {
              ondismiss: () => {
                toast({
                  title: 'Payment Cancelled',
                  description: 'You can try again anytime.',
                })
                setLoading(false)
              },
            },
          }

          const rzp = new window.Razorpay(options)
          rzp.open()
        } catch (error) {
          console.error('Payment initiation error:', error)
          toast({
            title: 'Payment Failed',
            description: error instanceof Error ? error.message : 'Failed to initiate payment',
            variant: 'destructive',
          })
          onError?.(error)
        } finally {
          setLoading(false)
        }
      }

      script.onerror = () => {
        toast({
          title: 'Error',
          description: 'Failed to load Razorpay. Please check your internet connection.',
          variant: 'destructive',
        })
        setLoading(false)
        onError?.(new Error('Failed to load Razorpay script'))
      }
    } catch (error) {
      console.error('Payment setup error:', error)
      toast({
        title: 'Error',
        description: 'Failed to setup payment. Please try again.',
        variant: 'destructive',
      })
      setLoading(false)
      onError?.(error)
    }
  }

  return {
    initiatePayment,
    loading,
  }
}
