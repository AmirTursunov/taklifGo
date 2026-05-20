'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useSession, signOut as nextAuthSignOut } from 'next-auth/react'
import { auth, db } from './firebase'
import { signInWithCustomToken, signOut as firebaseSignOut } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'

// Standard interface that perfectly mimics the original Firebase Auth User shape
export interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const syncSessions = async () => {
      // 1. NextAuth Status is loading
      if (status === 'loading') {
        setLoading(true)
        return
      }

      // 2. NextAuth Session is authenticated
      if (status === 'authenticated' && session?.user) {
        const nextAuthUser = session.user as any
        const uid = nextAuthUser.id || nextAuthUser.email || 'anonymous'
        
        const mappedUser: AuthUser = {
          uid: uid,
          email: nextAuthUser.email || null,
          displayName: nextAuthUser.name || null,
          photoURL: nextAuthUser.image || null,
        }

        setUser(mappedUser)

        // Silently synchronize client-side Firebase Auth using custom token
        const firebaseToken = nextAuthUser.firebaseToken
        if (firebaseToken) {
          try {
            const currentFirebaseUser = auth.currentUser
            // Only sign in if Firebase client auth is not already signed in with the same UID
            if (!currentFirebaseUser || currentFirebaseUser.uid !== uid) {
              await signInWithCustomToken(auth, firebaseToken)
              console.log("Firebase Auth synchronized successfully via custom token")
            }
          } catch (tokenErr) {
            console.error("Firebase custom token authentication failed:", tokenErr)
          }
        }

        // Sync user details to Firestore for Admin Panel compatibility
        try {
          await setDoc(doc(db, "users", uid), {
            uid: uid,
            email: mappedUser.email,
            displayName: mappedUser.displayName,
            photoURL: mappedUser.photoURL,
            lastSeen: serverTimestamp(),
          }, { merge: true })
        } catch (e) {
          console.error("Error syncing user metadata to Firestore:", e)
        }

        setLoading(false)
      } else {
        // 3. NextAuth Session is unauthenticated
        setUser(null)
        try {
          if (auth.currentUser) {
            await firebaseSignOut(auth)
          }
        } catch (e) {
          console.error("Error during Firebase client logout:", e)
        }
        setLoading(false)
      }
    }

    syncSessions()
  }, [session, status])

  const logout = async () => {
    setLoading(true)
    try {
      // Sign out from both NextAuth and Firebase
      await nextAuthSignOut({ redirect: false })
      if (auth.currentUser) {
        await firebaseSignOut(auth)
      }
      setUser(null)
    } catch (err) {
      console.error("Logout error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
