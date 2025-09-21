import { NextRequest, NextResponse } from 'next/server'
import { withAuth, type AuthenticatedRequest } from '@/lib/auth-middleware'

async function handler(req: AuthenticatedRequest) {
  const user = req.user!

  return NextResponse.json({
    message: 'Protected endpoint accessed successfully',
    user: {
      uid: user.uid,
      email: user.email,
      username: user.username
    },
    timestamp: new Date().toISOString()
  })
}

export const GET = withAuth(handler)
export const POST = withAuth(handler)