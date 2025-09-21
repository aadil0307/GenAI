import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    uid: string
    email: string
    username: string
  }
}

interface JWTPayload {
  uid: string
  email: string
  username: string
  iat?: number
  exp?: number
}

/**
 * Verify an access token directly
 */
function verifyToken(token: string): JWTPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'craftconnect-app',
      audience: 'craftconnect-users'
    }) as JWTPayload
    return decoded
  } catch (error) {
    throw new Error('Invalid or expired access token')
  }
}

/**
 * Middleware function to verify JWT tokens for API routes
 */
export function withAuth(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      // Try to get token from Authorization header first
      const authHeader = req.headers.get('Authorization')
      let token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

      if (!token) {
        // Try to get from cookies
        const accessToken = req.cookies.get('access_token')?.value
        if (accessToken) {
          token = accessToken
        }
      }

      if (token) {
        // Verify the token
        const payload = verifyToken(token)
        ;(req as AuthenticatedRequest).user = {
          uid: payload.uid,
          email: payload.email,
          username: payload.username
        }
        return handler(req as AuthenticatedRequest)
      }

      // No valid token found
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    } catch (error) {
      console.error('Auth middleware error:', error)
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }
  }
}

/**
 * Optional auth middleware - doesn't require authentication but adds user info if available
 */
export function withOptionalAuth(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      // Try to get token from Authorization header first
      const authHeader = req.headers.get('Authorization')
      let token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

      if (!token) {
        // Try to get from cookies
        const accessToken = req.cookies.get('access_token')?.value
        if (accessToken) {
          token = accessToken
        }
      }

      if (token) {
        // Verify the token
        const payload = verifyToken(token)
        ;(req as AuthenticatedRequest).user = {
          uid: payload.uid,
          email: payload.email,
          username: payload.username
        }
      }

      return handler(req as AuthenticatedRequest)
    } catch (error) {
      // Continue without authentication for optional auth
      return handler(req as AuthenticatedRequest)
    }
  }
}

/**
 * Client-side hook to get access token for API calls
 */
export function useAuthToken() {
  return {
    getAuthHeaders: async () => {
      const { ClientSessionManager } = await import('@/lib/jwt-client')
      const token = await ClientSessionManager.getValidAccessToken()
      
      return token ? {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      } : {
        'Content-Type': 'application/json'
      }
    }
  }
}