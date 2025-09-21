import Razorpay from 'razorpay'

// Initialize Razorpay instance (server-side only)
let razorpayInstance: Razorpay | null = null

function getRazorpayInstance() {
  if (!razorpayInstance) {
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET

    if (!keyId || !keySecret) {
      throw new Error('Razorpay credentials not found in environment variables')
    }

    razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    })
  }
  return razorpayInstance
}

// Types for Razorpay
export interface RazorpayOrderData {
  amount: number // Amount in paise (multiply by 100)
  currency: string
  receipt: string
  notes?: Record<string, string>
}

export interface RazorpayPaymentOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  handler: (response: any) => void
  prefill: {
    name: string
    email: string
    contact: string
  }
  theme: {
    color: string
  }
}

// Create Razorpay order
export async function createRazorpayOrder(orderData: RazorpayOrderData) {
  try {
    const razorpay = getRazorpayInstance()
    const order = await razorpay.orders.create({
      amount: orderData.amount,
      currency: orderData.currency,
      receipt: orderData.receipt,
      notes: orderData.notes,
    })
    return order
  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    throw error
  }
}

// Verify Razorpay payment signature
export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const crypto = require('crypto')
  const text = orderId + '|' + paymentId
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(text.toString())
    .digest('hex')
  
  return expectedSignature === signature
}

// Client-side payment options generator
export function generatePaymentOptions(
  order: any,
  userDetails: { name: string; email: string; contact: string },
  onSuccess: (response: any) => void,
  onError: (error: any) => void
): RazorpayPaymentOptions {
  return {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    amount: order.amount,
    currency: order.currency,
    name: 'OdooXNMIT Store',
    description: 'Purchase from OdooXNMIT Store',
    order_id: order.id,
    handler: onSuccess,
    prefill: userDetails,
    theme: {
      color: '#3B82F6',
    },
  }
}
