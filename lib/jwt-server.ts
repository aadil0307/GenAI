import { cookies } from 'next/headers'
import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken, generateTokenPair, type JWTPayload, type RefreshTokenPayload } from './jwt-client'

/**
 * Server-side session management utilities
 */
export class SessionManager {
  /**
   * Set session cookies (server-side)
   */
  static async setSessionCookies(accessToken: string, refreshToken: string) {
    const cookieStore = await cookies()
    
    // Set access token cookie (httpOnly, secure)
    cookieStore.set('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60, // 15 minutes
      path: '/'
    })
    
    // Set refresh token cookie (httpOnly, secure)
    cookieStore.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    })
  }

  /**
   * Get session from cookies (server-side)
   */
  static async getSessionFromCookies(): Promise<JWTPayload | null> {
    try {
      const cookieStore = await cookies()
      const accessToken = cookieStore.get('access_token')?.value
      
      if (!accessToken) return null
      
      return verifyAccessToken(accessToken)
    } catch {
      return null
    }
  }

  /**
   * Clear session cookies (server-side)
   */
  static async clearSessionCookies() {
    const cookieStore = await cookies()
    
    cookieStore.delete('access_token')
    cookieStore.delete('refresh_token')
  }

  /**
   * Refresh access token using refresh token (server-side)
   */
  static async refreshAccessToken(): Promise<{ accessToken: string; refreshToken: string } | null> {
    try {
      const cookieStore = await cookies()
      const refreshToken = cookieStore.get('refresh_token')?.value
      
      if (!refreshToken) return null
      
      const refreshPayload = verifyRefreshToken(refreshToken)
      
      // Here you would typically validate the refresh token against your database
      // For now, we'll generate new tokens
      const newAccessToken = generateAccessToken({
        uid: refreshPayload.uid,
        email: '', // You'd fetch this from your database
        username: '' // You'd fetch this from your database
      })
      
      const newRefreshToken = generateRefreshToken({ uid: refreshPayload.uid })
      
      await this.setSessionCookies(newAccessToken, newRefreshToken)
      
      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      }
    } catch {
      return null
    }
  }
}

// Re-export client utilities for convenience
export { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken, generateTokenPair, type JWTPayload, type RefreshTokenPayload }