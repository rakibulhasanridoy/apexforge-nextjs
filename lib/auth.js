import { createAuthClient } from 'better-auth/react'

// In the browser, use the current origin (frontend URL).
// This aligns with BETTER_AUTH_URL on the server being the frontend URL,
// so all auth traffic passes through the Next.js rewrite proxy.
// In SSR / server components, fall back to the frontend URL env var.
const baseURL =
  typeof window !== 'undefined'
    ? window.location.origin
    : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export const authClient = createAuthClient({
  baseURL,
  fetchOptions: {
    credentials: 'include',
  },
})

export const { signIn, signUp, signOut, useSession } = authClient
