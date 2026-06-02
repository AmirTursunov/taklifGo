import * as admin from 'firebase-admin'

// Initialize Firebase Admin only if private key is present (only used for custom token minting in NextAuth)
if (!admin.apps.length) {
  try {
    if (process.env.FIREBASE_PRIVATE_KEY) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID || 'invitation-28b16',
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      })
      console.log('Firebase Admin initialized successfully for Custom Tokens')
    }
  } catch (error) {
    console.error('Firebase Admin init error:', error)
  }
}

const FIREBASE_API_KEY = "AIzaSyAi7LtxLWbaVaEMGyu9JpY8T_4045GjzLQ"
const PROJECT_ID = "invitation-28b16"
const BASE_REST_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`

export const DbService = {
  // ── USER OPERATIONS ──
  async getUserByPhone(phone: string): Promise<any | null> {
    const cleanPhone = phone.trim()
    try {
      const res = await fetch(`${BASE_REST_URL}:runQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          structuredQuery: {
            from: [{ collectionId: 'users' }],
            where: {
              fieldFilter: {
                field: { fieldPath: 'phone' },
                op: 'EQUAL',
                value: { stringValue: cleanPhone }
              }
            },
            limit: 1
          }
        })
      })

      if (!res.ok) {
        throw new Error(`Firestore REST error: ${res.statusText}`)
      }

      const results = await res.json()
      if (!results || results.length === 0 || !results[0].document) {
        return null
      }

      const doc = results[0].document
      const fields = doc.fields
      const name = doc.name
      const uid = name.split('/').pop()

      return {
        id: uid,
        uid: uid,
        phone: fields.phone?.stringValue || '',
        email: fields.email?.stringValue || '',
        displayName: fields.displayName?.stringValue || '',
        photoURL: fields.photoURL?.stringValue || '',
        passwordHash: fields.passwordHash?.stringValue || '',
        provider: fields.provider?.stringValue || '',
      }
    } catch (err) {
      console.error('DbService getUserByPhone error:', err)
      return null
    }
  },

  async createUser(uid: string, data: any): Promise<void> {
    try {
      const fields: any = {}
      for (const [key, val] of Object.entries(data)) {
        if (typeof val === 'string') {
          fields[key] = { stringValue: val }
        } else if (typeof val === 'number') {
          fields[key] = { integerValue: val.toString() }
        }
      }

      const res = await fetch(`${BASE_REST_URL}/users/${uid}?key=${FIREBASE_API_KEY}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields })
      })

      if (!res.ok) {
        const errText = await res.text()
        throw new Error(`Firestore REST write error: ${errText}`)
      }
    } catch (err) {
      console.error('DbService createUser error:', err)
      throw err
    }
  },

  async updateUser(uid: string, data: any): Promise<void> {
    try {
      const fields: any = {}
      const updateMasks: string[] = []
      
      for (const [key, val] of Object.entries(data)) {
        if (typeof val === 'string') {
          fields[key] = { stringValue: val }
          updateMasks.push(`updateMask.fieldPaths=${key}`)
        } else if (typeof val === 'number') {
          fields[key] = { integerValue: val.toString() }
          updateMasks.push(`updateMask.fieldPaths=${key}`)
        }
      }

      const maskQuery = updateMasks.join('&')
      const res = await fetch(`${BASE_REST_URL}/users/${uid}?key=${FIREBASE_API_KEY}&${maskQuery}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields })
      })

      if (!res.ok) {
        const errText = await res.text()
        throw new Error(`Firestore REST update error: ${errText}`)
      }
    } catch (err) {
      console.error('DbService updateUser error:', err)
      throw err
    }
  },

  // ── PASSWORD RESET OPERATIONS ──
  async savePasswordResetToken(token: string, data: any): Promise<void> {
    try {
      const fields: any = {}
      for (const [key, val] of Object.entries(data)) {
        if (typeof val === 'string') {
          fields[key] = { stringValue: val }
        } else if (typeof val === 'number') {
          fields[key] = { integerValue: val.toString() }
        }
      }

      const res = await fetch(`${BASE_REST_URL}/password_resets/${token}?key=${FIREBASE_API_KEY}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields })
      })

      if (!res.ok) {
        const errText = await res.text()
        throw new Error(`Firestore REST write error: ${errText}`)
      }
    } catch (err) {
      console.error('DbService savePasswordResetToken error:', err)
      throw err
    }
  },

  async getPasswordResetToken(token: string): Promise<any | null> {
    try {
      const res = await fetch(`${BASE_REST_URL}/password_resets/${token}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })

      if (!res.ok) {
        return null
      }

      const doc = await res.json()
      const fields = doc.fields
      return {
        token: fields.token?.stringValue || '',
        email: fields.email?.stringValue || '',
        expiresAt: parseInt(fields.expiresAt?.integerValue || '0', 10),
        lang: fields.lang?.stringValue || 'uz',
      }
    } catch (err) {
      console.error('DbService getPasswordResetToken error:', err)
      return null
    }
  },

  async deletePasswordResetToken(token: string): Promise<void> {
    try {
      await fetch(`${BASE_REST_URL}/password_resets/${token}?key=${FIREBASE_API_KEY}`, {
        method: 'DELETE'
      })
    } catch (err) {
      console.error('DbService deletePasswordResetToken error:', err)
    }
  }
}
