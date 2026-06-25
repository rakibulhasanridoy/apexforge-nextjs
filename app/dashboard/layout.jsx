'use client'
import { useAuth } from '@/providers/AuthProvider'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth()

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-dark-bg flex">
      <DashboardSidebar />
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-dark-bg/90 backdrop-blur border-b border-dark-border h-14 flex items-center px-4 lg:px-6 gap-4">
          <div className="flex-1 lg:block hidden" />
          <div className="ml-8 lg:ml-0">
            {user?.image
              ? <img src={user.image} alt="" className="w-7 h-7 rounded-full object-cover" />
              : <div className="w-7 h-7 rounded-full bg-neon/20 flex items-center justify-center text-neon text-xs font-bold">{user?.name?.[0]?.toUpperCase()}</div>
            }
          </div>
        </header>
        <main className="flex-1 p-5 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
