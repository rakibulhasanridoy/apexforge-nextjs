'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/providers/AuthProvider'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

export default function RoleGuard({ children, roles }) {
  const { userProfile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && userProfile && !roles.includes(userProfile.role)) {
      if (userProfile.role === 'admin') router.replace('/dashboard/admin-overview')
      else if (userProfile.role === 'trainer') router.replace('/dashboard/trainer-overview')
      else router.replace('/dashboard/overview')
    }
    if (!loading && !userProfile) router.replace('/login')
  }, [userProfile, loading, roles, router])

  if (loading) return <LoadingSpinner fullPage={false} />
  if (!userProfile || !roles.includes(userProfile.role)) return null
  return <>{children}</>
}
