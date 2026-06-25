'use client'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Calendar, Heart, User, Clock } from 'lucide-react'
import axiosSecure from '@/lib/axios'
import { useAuth } from '@/providers/AuthProvider'
import RoleGuard from '@/components/dashboard/RoleGuard'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

function StatCard({ icon, label, value, sub }) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">{label}</p>
          <p className="text-3xl font-black text-white">{value}</p>
          {sub && <p className="text-xs text-neon mt-1">{sub}</p>}
        </div>
        <div className="w-10 h-10 bg-neon/10 rounded-lg flex items-center justify-center text-neon">{icon}</div>
      </div>
    </div>
  )
}

function UserOverviewContent() {
  const { user, userProfile } = useAuth()
  const { data: bookings = [] } = useQuery({ queryKey: ['my-bookings'], queryFn: async () => (await axiosSecure.get('/api/bookings/my-bookings')).data })
  const { data: favorites = [] } = useQuery({ queryKey: ['my-favorites'], queryFn: async () => (await axiosSecure.get('/api/trainers/favorites')).data })
  const { data: application } = useQuery({ queryKey: ['trainer-application'], queryFn: async () => (await axiosSecure.get('/api/trainers/apply/status')).data })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white">Member Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Good to see you, {user?.name?.split(' ')[0]}. Keep pushing your limits.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        <StatCard icon={<Calendar className="w-5 h-5" />} label="Booked Classes" value={bookings.length} sub="Total sessions" />
        <StatCard icon={<Heart className="w-5 h-5" />} label="Favorites" value={favorites.length} sub="Curated sessions" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2"><User className="w-4 h-4 text-neon" /> Profile Details</h3>
          <div className="flex items-center gap-4 mb-5">
            {user?.image
              ? <img src={user.image} alt="" className="w-14 h-14 rounded-full object-cover border-2 border-neon/30" />
              : <div className="w-14 h-14 rounded-full bg-neon/20 flex items-center justify-center text-neon text-xl font-black">{user?.name?.[0]}</div>
            }
            <div>
              <p className="font-bold text-white">{user?.name}</p>
              <p className="text-gray-500 text-sm">{user?.email}</p>
              <span className="badge-neon capitalize mt-1 inline-block">{userProfile?.role}</span>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            {[['Status', userProfile?.status], ['Role', userProfile?.role], ['Member Since', userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : '—']].map(([k, v]) => (
              <div key={k} className="flex justify-between py-1.5 border-b border-dark-border last:border-0">
                <span className="text-gray-500">{k}</span>
                <span className="text-white capitalize font-medium">{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-5">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Clock className="w-4 h-4 text-neon" /> Trainer Application</h3>
          {application ? (
            <div>
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold mb-4 ${
                application.status === 'Pending' ? 'bg-yellow-400/10 text-yellow-400' :
                application.status === 'Approved' ? 'bg-neon/10 text-neon' : 'bg-red-500/10 text-red-400'
              }`}>
                {application.status === 'Pending' ? '⏳' : application.status === 'Approved' ? '✅' : '❌'} {application.status}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Specialty</span><span className="text-white text-right max-w-[160px]">{application.specialty?.join(', ')}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Experience</span><span className="text-white">{application.experience} years</span></div>
              </div>
              {application.status === 'Rejected' && application.feedback && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-xs font-semibold text-red-400 mb-1">Admin Feedback</p>
                  <p className="text-xs text-gray-400">{application.feedback}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500 text-sm mb-4">You haven't applied to become a trainer yet.</p>
              <Link href="/dashboard/apply-trainer" className="btn-neon text-sm">Apply Now</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function OverviewPage() {
  return <RoleGuard roles={['user']}><UserOverviewContent /></RoleGuard>
}
