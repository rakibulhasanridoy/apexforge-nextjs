'use client'
import { useQuery } from '@tanstack/react-query'
import { Users, Dumbbell, Calendar, DollarSign, TrendingUp, Activity } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts'
import axiosSecure from '@/lib/axios'
import { useAuth } from '@/providers/AuthProvider'
import RoleGuard from '@/components/dashboard/RoleGuard'

const PIE_COLORS = ['#c8f500', '#3b82f6', '#a855f7']

function StatCard({ icon, label, value, sub, colorClass = 'bg-neon/10 text-neon' }) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">{label}</p>
          <p className="text-3xl font-black text-white">{value}</p>
          {sub && <p className="text-xs text-neon mt-1">{sub}</p>}
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>{icon}</div>
      </div>
    </div>
  )
}

function AdminOverviewContent() {
  const { user } = useAuth()
  const { data: users = [] } = useQuery({ queryKey: ['all-users'], queryFn: async () => (await axiosSecure.get('/api/users')).data })
  const { data: classStats } = useQuery({ queryKey: ['class-stats'], queryFn: async () => (await axiosSecure.get('/api/classes/stats')).data })
  const { data: transactions = [] } = useQuery({ queryKey: ['transactions'], queryFn: async () => (await axiosSecure.get('/api/payments/transactions')).data })

  const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0)
  const roleData = [
    { name: 'Users', value: users.filter(u => u.role === 'user').length },
    { name: 'Trainers', value: users.filter(u => u.role === 'trainer').length },
    { name: 'Admins', value: users.filter(u => u.role === 'admin').length },
  ]
  const revenueData = transactions.slice(0, 7).reverse().map((t, i) => ({ name: `#${i + 1}`, revenue: t.amount }))

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white">System Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Platform-wide statistics and management controls.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard icon={<Users className="w-5 h-5" />} label="Total Users" value={users.length} sub={`${users.filter(u => u.status === 'active').length} active`} />
        <StatCard icon={<Dumbbell className="w-5 h-5" />} label="Total Classes" value={classStats?.totalClasses || 0} colorClass="bg-blue-400/10 text-blue-400" />
        <StatCard icon={<Calendar className="w-5 h-5" />} label="Total Bookings" value={classStats?.totalBookings || 0} colorClass="bg-purple-400/10 text-purple-400" />
        <StatCard icon={<DollarSign className="w-5 h-5" />} label="Revenue" value={`$${totalRevenue.toFixed(0)}`} sub="All time" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 card p-5">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-neon" /> Recent Revenue</h3>
          {revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={revenueData}>
                <defs><linearGradient id="rev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#c8f500" stopOpacity={0.2} /><stop offset="95%" stopColor="#c8f500" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#111', border: '1px solid #252525', borderRadius: '8px' }} labelStyle={{ color: '#fff' }} itemStyle={{ color: '#c8f500' }} />
                <Area type="monotone" dataKey="revenue" stroke="#c8f500" strokeWidth={2} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : <p className="text-gray-500 text-sm text-center py-10">No transaction data yet.</p>}
        </div>
        <div className="card p-5">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-neon" /> User Roles</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={roleData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" paddingAngle={3}>
                {roleData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#111', border: '1px solid #252525', borderRadius: '8px' }} />
              <Legend iconSize={8} wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="card p-5">
        <h3 className="font-bold text-white mb-4">Admin Profile</h3>
        <div className="flex items-center gap-4">
          {user?.image ? <img src={user.image} alt="" className="w-14 h-14 rounded-full object-cover border-2 border-neon/30" /> : <div className="w-14 h-14 rounded-full bg-neon/20 flex items-center justify-center text-neon text-xl font-black">{user?.name?.[0]}</div>}
          <div>
            <p className="font-bold text-white">{user?.name}</p>
            <p className="text-gray-500 text-sm">{user?.email}</p>
            <span className="inline-block mt-1 text-xs font-bold px-2 py-0.5 rounded bg-red-500/10 text-red-400">Admin</span>
          </div>
        </div>
      </div>
    </div>
  )
}
export default function AdminOverviewPage() {
  return <RoleGuard roles={['admin']}><AdminOverviewContent /></RoleGuard>
}
