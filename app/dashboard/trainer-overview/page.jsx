'use client'
import { useQuery } from '@tanstack/react-query'
import { Dumbbell, Users, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import axiosSecure from '@/lib/axios'
import { useAuth } from '@/providers/AuthProvider'
import RoleGuard from '@/components/dashboard/RoleGuard'

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

function TrainerOverviewContent() {
  const { user, userProfile } = useAuth()
  const { data: stats } = useQuery({ queryKey: ['trainer-stats'], queryFn: async () => (await axiosSecure.get('/api/classes/trainer-stats')).data })
  const { data: myClasses = [] } = useQuery({ queryKey: ['my-classes'], queryFn: async () => (await axiosSecure.get('/api/classes/my-classes')).data })
  const chartData = myClasses.slice(0, 6).map(c => ({ name: c.className.substring(0, 12), bookings: c.bookingCount }))

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white">Trainer Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back, {user?.name?.split(' ')[0]}.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <StatCard icon={<Dumbbell className="w-5 h-5" />} label="Total Classes" value={stats?.totalClasses || 0} sub="Live rotations" />
        <StatCard icon={<Users className="w-5 h-5" />} label="Total Students" value={stats?.totalStudents || 0} sub="Across all classes" />
        <StatCard icon={<TrendingUp className="w-5 h-5" />} label="Approved Classes" value={myClasses.filter(c => c.status === 'Approved').length} sub="Running now" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-5">
          <h3 className="font-bold text-white mb-5">Class Bookings</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#111', border: '1px solid #252525', borderRadius: '8px' }} labelStyle={{ color: '#fff' }} itemStyle={{ color: '#E63946' }} />
                <Bar dataKey="bookings" fill="#E63946" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-gray-500 text-sm text-center py-10">No class data yet.</p>}
        </div>
        <div className="card p-5">
          <h3 className="font-bold text-white mb-4">Profile</h3>
          <div className="flex items-center gap-3 mb-5">
            {user?.image ? <img src={user.image} alt="" className="w-12 h-12 rounded-full object-cover border-2 border-neon/30" /> : <div className="w-12 h-12 rounded-full bg-neon/20 flex items-center justify-center text-neon text-lg font-black">{user?.name?.[0]}</div>}
            <div><p className="font-bold text-white">{user?.name}</p><span className="badge-neon">Trainer</span></div>
          </div>
          <div className="space-y-2 text-sm">
            {[['Email', user?.email], ['Status', userProfile?.status], ['Classes', stats?.totalClasses || 0]].map(([k, v]) => (
              <div key={k} className="flex justify-between py-1.5 border-b border-dark-border last:border-0">
                <span className="text-gray-500">{k}</span><span className="text-white capitalize font-medium truncate max-w-[150px]">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
export default function TrainerOverviewPage() {
  return <RoleGuard roles={['trainer']}><TrainerOverviewContent /></RoleGuard>
}
