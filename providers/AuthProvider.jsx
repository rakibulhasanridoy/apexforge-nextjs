'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { useSession } from '@/lib/auth'
import axiosSecure from '@/lib/axios'

const AuthContext = createContext(null)

export default function AuthProvider({ children }) {
  const { data: session, isPending } = useSession()
  const [userProfile, setUserProfile] = useState(null)
  const [profileLoading, setProfileLoading] = useState(true)

  useEffect(() => {
    if (session?.user) {
      axiosSecure.post('/api/jwt/token')
        .then(res => { setUserProfile(res.data.user); setProfileLoading(false) })
        .catch(() => { setUserProfile(null); setProfileLoading(false) })
    } else if (!isPending) {
      setUserProfile(null)
      setProfileLoading(false)
    }
  }, [session, isPending])

  const refreshProfile = async () => {
    if (session?.user) {
      const res = await axiosSecure.post('/api/jwt/token')
      setUserProfile(res.data.user)
    }
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
