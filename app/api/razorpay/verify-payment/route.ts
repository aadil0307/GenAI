import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    console.log('=== Razorpay Payment Verification API Called ===')
    
    const body = await request.json()
    console.log('Verification request body:', body)
    
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.error('Missing payment verification parameters')
      return NextResponse.json(
        { error: 'Missing required payment verification parameters' },
        { status: 400 }
      )
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET
    
    if (!keySecret) {
      console.error('Razorpay key secret not configured')
      return NextResponse.json(
        { error: 'Payment verification not configured' },
        { status: 500 }
      )
    }

    // Verify payment signature
    const text = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(text.toString())
      .digest('hex')
    
    const isValid = expectedSignature === razorpay_signature
    
    console.log('Payment signature verification:', {
      expected: expectedSignature.substring(0, 10) + '...',
      received: razorpay_signature.substring(0, 10) + '...',
      isValid
    })

    if (isValid) {
      console.log('Payment verified successfully')
      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully',
      })
    } else {
      console.error('Payment verification failed - signature mismatch')
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('=== Payment Verification Error ===')
    console.error('Error details:', error)
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error')
    
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    )
  }
}
