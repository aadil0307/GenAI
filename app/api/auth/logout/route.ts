import { NextRequest, NextResponse } from 'next/server'
import { SessionManager } from '@/lib/jwt-server'

export async function POST(request: NextRequest) {
  try {
    // Clear session cookies
    await SessionManager.clearSessionCookies()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    )
  }
}