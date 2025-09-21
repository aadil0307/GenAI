import { NextRequest, NextResponse } from 'next/server'
import { 
  verifyRefreshToken, 
  generateTokenPair, 
  SessionManager 
} from '@/lib/jwt-server'
import { getDoc, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { refreshToken } = body

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token required' },
        { status: 400 }
      )
    }

    // Verify the refresh token
    const refreshPayload = verifyRefreshToken(refreshToken)

    // Fetch user data from Firestore to generate new access token
    const userDoc = await getDoc(doc(db, 'users', refreshPayload.uid))
    
    if (!userDoc.exists()) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const userData = userDoc.data()

    // Generate new token pair
    const tokenPair = generateTokenPair({
      uid: refreshPayload.uid,
      email: userData.email,
      username: userData.username
    })

    // Set new session cookies
    await SessionManager.setSessionCookies(
      tokenPair.accessToken,
      tokenPair.refreshToken
    )

    return NextResponse.json({
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
      expiresIn: tokenPair.expiresIn,
      refreshExpiresIn: tokenPair.refreshExpiresIn
    })
  } catch (error) {
    console.error('Token refresh error:', error)
    return NextResponse.json(
      { error: 'Failed to refresh token' },
      { status: 401 }
    )
  }
}