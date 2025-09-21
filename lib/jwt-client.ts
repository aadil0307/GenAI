import jwt from 'jsonwebtoken'

// JWT Secret - in production, use a strong random secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-change-in-production'

// Token expiration times
const ACCESS_TOKEN_EXPIRY = '15m' // 15 minutes
const REFRESH_TOKEN_EXPIRY = '7d'  // 7 days

export interface JWTPayload {
  uid: string
  email: string
  username: string
  iat?: number
  exp?: number
}

export interface RefreshTokenPayload {
  uid: string
  tokenVersion?: number
  iat?: number
  exp?: number
}

/**
 * Generate an access token (short-lived)
 */
export function generateAccessToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
    issuer: 'craftconnect-app',
    audience: 'craftconnect-users'
  })
}

/**
 * Generate a refresh token (long-lived)
 */
export function generateRefreshToken(payload: Omit<RefreshTokenPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
    issuer: 'craftconnect-app',
    audience: 'craftconnect-users'
  })
}

/**
 * Verify an access token
 */
export function verifyAccessToken(token: string): JWTPayload {
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
 * Verify a refresh token
 */
export function verifyRefreshToken(token: string): RefreshTokenPayload {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET, {
      issuer: 'craftconnect-app',
      audience: 'craftconnect-users'
    }) as RefreshTokenPayload
    return decoded
  } catch (error) {
    throw new Error('Invalid or expired refresh token')
  }
}

/**
 * Check if a token is expired (without throwing)
 */
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwt.decode(token) as any
    if (!decoded || !decoded.exp) return true
    
    const currentTime = Math.floor(Date.now() / 1000)
    return decoded.exp < currentTime
  } catch {
    return true
  }
}

/**
 * Generate both access and refresh tokens
 */
export function generateTokenPair(userPayload: Omit<JWTPayload, 'iat' | 'exp'>) {
  const accessToken = generateAccessToken(userPayload)
  const refreshToken = generateRefreshToken({ uid: userPayload.uid })
  
  return {
    accessToken,
    refreshToken,
    expiresIn: 15 * 60 * 1000, // 15 minutes in milliseconds
    refreshExpiresIn: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
  }
}

/**
 * Client-side session management utilities
 */
export class ClientSessionManager {
  private static readonly ACCESS_TOKEN_KEY = 'cc_access_token'
  private static readonly REFRESH_TOKEN_KEY = 'cc_refresh_token'
  private static readonly TOKEN_EXPIRY_KEY = 'cc_token_expiry'

  /**
   * Store tokens in localStorage (client-side)
   */
  static setTokens(accessToken: string, refreshToken: string, expiresIn: number) {
    if (typeof window === 'undefined') return
    
    const expiryTime = Date.now() + expiresIn
    
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken)
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken)
    localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString())
  }

  /**
   * Get access token from localStorage (client-side)
   */
  static getAccessToken(): string | null {
    if (typeof window === 'undefined') return null
    
    return localStorage.getItem(this.ACCESS_TOKEN_KEY)
  }

  /**
   * Get refresh token from localStorage (client-side)
   */
  static getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null
    
    return localStorage.getItem(this.REFRESH_TOKEN_KEY)
  }

  /**
   * Check if access token is expired (client-side)
   */
  static isAccessTokenExpired(): boolean {
    if (typeof window === 'undefined') return true
    
    const expiryTime = localStorage.getItem(this.TOKEN_EXPIRY_KEY)
    if (!expiryTime) return true
    
    return Date.now() >= parseInt(expiryTime)
  }

  /**
   * Clear all tokens (client-side)
   */
  static clearTokens() {
    if (typeof window === 'undefined') return
    
    localStorage.removeItem(this.ACCESS_TOKEN_KEY)
    localStorage.removeItem(this.REFRESH_TOKEN_KEY)
    localStorage.removeItem(this.TOKEN_EXPIRY_KEY)
  }

  /**
   * Get valid access token (refresh if needed) (client-side)
   */
  static async getValidAccessToken(): Promise<string | null> {
    if (typeof window === 'undefined') return null
    
    const accessToken = this.getAccessToken()
    
    // If no access token, try to refresh
    if (!accessToken || this.isAccessTokenExpired()) {
      const refreshed = await this.refreshTokens()
      return refreshed ? this.getAccessToken() : null
    }
    
    return accessToken
  }

  /**
   * Refresh tokens using refresh token (client-side)
   */
  static async refreshTokens(): Promise<boolean> {
    try {
      const refreshToken = this.getRefreshToken()
      if (!refreshToken) return false
      
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      })
      
      if (!response.ok) return false
      
      const data = await response.json()
      
      this.setTokens(
        data.accessToken,
        data.refreshToken,
        data.expiresIn
      )
      
      return true
    } catch {
      return false
    }
  }
}