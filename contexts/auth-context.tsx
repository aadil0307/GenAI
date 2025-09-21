"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState, useCallback } from "react"
import {
  type User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { 
  generateTokenPair, 
  ClientSessionManager, 
  verifyAccessToken,
  type JWTPayload 
} from "@/lib/jwt-client"

interface UserProfile {
  uid: string
  email: string
  username: string
  createdAt: Date
  firstName?: string
  lastName?: string
  phone?: string
  address?: string
  bio?: string
  profileImage?: string
}

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  sessionActive: boolean
  accessToken: string | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, username: string) => Promise<void>
  logout: () => Promise<void>
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>
  refreshSession: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [sessionActive, setSessionActive] = useState(false)
  const [accessToken, setAccessToken] = useState<string | null>(null)

  // Initialize session from stored tokens
  useEffect(() => {
    const initializeSession = async () => {
      const token = ClientSessionManager.getAccessToken()
      if (token && !ClientSessionManager.isAccessTokenExpired()) {
        try {
          const payload = verifyAccessToken(token)
          setAccessToken(token)
          setSessionActive(true)
        } catch {
          // Token is invalid, clear it
          ClientSessionManager.clearTokens()
        }
      }
    }

    initializeSession()
  }, [])

  // Generate JWT tokens when user signs in via Firebase
  const generateUserSession = useCallback(async (user: User, profile: UserProfile) => {
    try {
      const tokenPair = generateTokenPair({
        uid: user.uid,
        email: user.email!,
        username: profile.username
      })

      // Store tokens client-side
      ClientSessionManager.setTokens(
        tokenPair.accessToken,
        tokenPair.refreshToken,
        tokenPair.expiresIn
      )

      // Also send to server for HttpOnly cookies
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken: tokenPair.accessToken,
          refreshToken: tokenPair.refreshToken
        }),
      }).catch(() => {
        // Fallback: continue with client-side storage only
        console.warn('Failed to set server-side session cookies')
      })

      setAccessToken(tokenPair.accessToken)
      setSessionActive(true)
    } catch (error) {
      console.error('Failed to generate user session:', error)
    }
  }, [])

  // Refresh session function
  const refreshSession = useCallback(async (): Promise<boolean> => {
    try {
      const success = await ClientSessionManager.refreshTokens()
      if (success) {
        const newToken = ClientSessionManager.getAccessToken()
        setAccessToken(newToken)
        setSessionActive(true)
        return true
      } else {
        setAccessToken(null)
        setSessionActive(false)
        return false
      }
    } catch {
      setAccessToken(null)
      setSessionActive(false)
      return false
    }
  }, [])

  // Auto-refresh tokens before expiry
  useEffect(() => {
    const checkAndRefreshToken = async () => {
      if (sessionActive && ClientSessionManager.isAccessTokenExpired()) {
        await refreshSession()
      }
    }

    // Check every 5 minutes
    const interval = setInterval(checkAndRefreshToken, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [sessionActive, refreshSession])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth state changed:", user ? user.uid : "No user")
      setUser(user)

      if (user) {
        try {
          // Fetch user profile from Firestore
          console.log("Fetching user profile for:", user.uid)
          const userDoc = await getDoc(doc(db, "users", user.uid))
          let profile: UserProfile

          if (userDoc.exists()) {
            profile = userDoc.data() as UserProfile
            console.log("User profile loaded:", profile)
            setUserProfile(profile)
          } else {
            console.log("User profile not found, creating basic profile")
            // Create a basic profile if it doesn't exist
            profile = {
              uid: user.uid,
              email: user.email!,
              username: user.displayName || user.email!.split('@')[0],
              createdAt: new Date(),
            }
            await setDoc(doc(db, "users", user.uid), profile)
            setUserProfile(profile)
          }

          // Generate JWT session for authenticated user
          await generateUserSession(user, profile)
        } catch (error) {
          console.error("Error fetching user profile:", error)
          // Create fallback profile
          const fallbackProfile: UserProfile = {
            uid: user.uid,
            email: user.email!,
            username: user.displayName || user.email!.split('@')[0],
            createdAt: new Date(),
          }
          setUserProfile(fallbackProfile)
          await generateUserSession(user, fallbackProfile)
        }
      } else {
        setUserProfile(null)
        setAccessToken(null)
        setSessionActive(false)
        ClientSessionManager.clearTokens()
        
        // Clear server-side session
        fetch('/api/auth/logout', { method: 'POST' }).catch(() => {
          // Ignore errors for logout
        })
      }

      setLoading(false)
    })

    return unsubscribe
  }, [generateUserSession])

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const signUp = async (email: string, password: string, username: string) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password)

    // Update user profile
    await updateProfile(user, { displayName: username })

    // Create user document in Firestore
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      username,
      createdAt: new Date(),
    }

    await setDoc(doc(db, "users", user.uid), userProfile)
    setUserProfile(userProfile)
  }

  const logout = async () => {
    await signOut(auth)
  }

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error("No user logged in")

    const updatedProfile = { ...userProfile, ...updates }
    await setDoc(doc(db, "users", user.uid), updatedProfile, { merge: true })
    setUserProfile(updatedProfile as UserProfile)

    // Update Firebase Auth profile if username changed
    if (updates.username) {
      await updateProfile(user, { displayName: updates.username })
    }
  }

  const value = {
    user,
    userProfile,
    loading,
    sessionActive,
    accessToken,
    signIn,
    signUp,
    logout,
    updateUserProfile,
    refreshSession,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
