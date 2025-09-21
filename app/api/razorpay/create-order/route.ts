import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('=== Razorpay Order Creation API Called ===')
    
    // Check environment variables
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET
    
    console.log('Environment check:')
    console.log('Key ID exists:', !!keyId)
    console.log('Key Secret exists:', !!keySecret)
    
    if (!keyId || !keySecret) {
      console.error('Missing Razorpay credentials')
      return NextResponse.json(
        { error: 'Razorpay credentials not configured' },
        { status: 500 }
      )
    }

    const body = await request.json()
    console.log('Request body:', body)
    
    const { amount, currency = 'INR', receipt, notes } = body

    if (!amount || !receipt) {
      console.error('Missing required fields:', { amount, receipt })
      return NextResponse.json(
        { error: 'Amount and receipt are required' },
        { status: 400 }
      )
    }

    // Create order data for Razorpay API
    const orderData = {
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt,
      notes,
    }

    console.log('Creating Razorpay order with data:', orderData)

    // Call Razorpay API directly
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`,
      },
      body: JSON.stringify(orderData),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Razorpay API error:', response.status, errorData)
      throw new Error(`Razorpay API error: ${response.status} ${errorData}`)
    }

    const order = await response.json()
    console.log('Razorpay order created successfully:', order.id)

    return NextResponse.json({
      success: true,
      order,
    })
  } catch (error) {
    console.error('=== Razorpay Order Creation Error ===')
    console.error('Error details:', error)
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error')
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to create order',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}
