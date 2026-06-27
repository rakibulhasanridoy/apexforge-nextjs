import { createAuthClient } from 'better-auth/react'

const baseURL = typeof window !== 'undefined'
  ? window.location.origin
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000')

export const authClient = createAuthClient({
  baseURL,
  fetchOptions: {
    credentials: 'include',
  },
})


export const { signIn, signUp, signOut, useSession } = authClient
