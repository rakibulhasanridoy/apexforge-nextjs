'use client'
import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useSession } from '@/lib/auth'
import axiosSecure from '@/lib/axios'

const AuthContext = createContext(null)

export default function AuthProvider({ children }) {
  const { data: session, isPending } = useSession()
  const [userProfile, setUserProfile] = useState(null)
  const [profileLoading, setProfileLoading] = useState(true)


  
  const fetchProfile = useCallback(async () => {
    try {
      const res = await axiosSecure.post('/api/jwt/token')
      setUserProfile(res.data.user)
    } catch (err) {
      console.error('Profile fetch error:', err?.response?.data || err.message)
      setUserProfile(null)
    } finally {
      setProfileLoading(false)
    }
  }, [])

  useEffect(() => {
    if (session?.user) {
      fetchProfile()
    } else if (!isPending) {
      setUserProfile(null)
      setProfileLoading(false)
    }
  }, [session, isPending, fetchProfile])

  const refreshProfile = async () => {
    if (session?.user) await fetchProfile()
  }

  return (
    <AuthContext.Provider value={{
      user: session?.user,
      userProfile,
      loading: isPending || profileLoading,
      isAuthenticated: !!session?.user,
      refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
