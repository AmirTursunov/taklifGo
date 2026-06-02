import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { DbService } from '@/lib/db-service'
import * as admin from 'firebase-admin'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        phone: { label: 'Phone', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.password) {
          throw new Error('missing-credentials')
        }

        const inputPhone = credentials.phone.toLowerCase().trim()
        const adminEmail = (process.env.ADMIN_EMAIL || 'admintaklif@gmail.com').toLowerCase().trim()
        const adminPhone = (process.env.ADMIN_PHONE || '+998901234567').trim()
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin_123321'

        // Check if credentials match the static admin credentials from .env.local
        if ((inputPhone === adminEmail || inputPhone === adminPhone) && credentials.password === adminPassword) {
          let uid = 'admin-uid'
          let displayName = 'Admin'
          let photoURL = ''

          try {
            const existingUser = await DbService.getUserByEmail(adminEmail)
            if (existingUser) {
              uid = existingUser.uid || existingUser.id
              displayName = existingUser.displayName || 'Admin'
              photoURL = existingUser.photoURL || ''
            } else {
              // Auto-create admin in DB so they have an entry
              await DbService.createUser(uid, {
                uid,
                email: adminEmail,
                displayName: 'Admin',
                createdAt: Date.now(),
                lastSeen: Date.now(),
              })
            }
          } catch (e) {
            console.error('Error syncing admin with Firestore:', e)
          }

          let firebaseToken = ''
          if (admin.apps.length) {
            try {
              firebaseToken = await admin.auth().createCustomToken(uid)
            } catch (tokenErr) {
              console.error('Error minting Custom Token in NextAuth authorize:', tokenErr)
            }
          }

          return {
            id: uid,
            email: adminEmail,
            name: displayName,
            image: photoURL,
            firebaseToken,
          }
        }

        // 1. Fetch user using DbService (Supports Firestore and Local JSON seamlessly)
        const userData = await DbService.getUserByPhone(credentials.phone)
        if (!userData) {
          // Fallback to email check in case admin or someone typed email
          const userByEmail = await DbService.getUserByEmail?.(credentials.phone)
          if (!userByEmail) {
            throw new Error('user-not-found')
          }
          Object.assign(userData || {}, userByEmail)
        }

        // 2. If it's a social-only login (no password hash)
        if (!userData.passwordHash) {
          throw new Error('social-account-exists')
        }

        // 3. Verify password
        const passwordMatch = await bcrypt.compare(credentials.password, userData.passwordHash)
        if (!passwordMatch) {
          throw new Error('invalid-password')
        }

        const uid = userData.uid || userData.id

        // 4. Generate Firebase Custom Token dynamically if Admin is initialized
        let firebaseToken = ''
        if (admin.apps.length) {
          try {
            firebaseToken = await admin.auth().createCustomToken(uid)
          } catch (tokenErr) {
            console.error('Error minting Custom Token in NextAuth authorize:', tokenErr)
          }
        }

        return {
          id: uid,
          email: userData.email || '',
          phone: userData.phone || credentials.phone,
          name: userData.displayName || userData.name || '',
          image: userData.photoURL || userData.image || '',
          firebaseToken,
        }
      },
    }),
    // Only register Google Provider if variables are set
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        const email = user.email?.toLowerCase().trim()
        if (!email) return false

        try {
          const existingUser = await DbService.getUserByEmail(email)
          let uid = ''
          
          if (!existingUser) {
            uid = crypto.randomUUID()
            await DbService.createUser(uid, {
              uid,
              email,
              displayName: user.name || '',
              photoURL: user.image || '',
              provider: 'google',
              createdAt: Date.now(),
              lastSeen: Date.now(),
            })
          } else {
            uid = existingUser.uid || existingUser.id
            await DbService.updateUser(uid, {
              displayName: user.name || '',
              photoURL: user.image || '',
              lastSeen: Date.now(),
            })
          }

          // Mint Firebase Custom Token for Google user if Admin is set up
          if (admin.apps.length) {
            try {
              ;(user as any).firebaseToken = await admin.auth().createCustomToken(uid)
            } catch (tokenErr) {
              console.error('Error minting Custom Token for Google user:', tokenErr)
            }
          }
          user.id = uid
        } catch (err) {
          console.error('Google NextAuth sign-in Firestore sync error:', err)
          return false
        }
      }
      return true
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.firebaseToken = (user as any).firebaseToken || ''
      }
      if (trigger === 'update' && session) {
        token.firebaseToken = session.firebaseToken || token.firebaseToken
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        ;(session.user as any).id = token.id
        ;(session.user as any).firebaseToken = token.firebaseToken
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 Days session
  },
  secret: process.env.NEXTAUTH_SECRET || 'a-very-secret-key-that-is-at-least-32-characters-long-1234567890',
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
