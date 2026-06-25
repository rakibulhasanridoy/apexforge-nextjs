'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Shield, Ban, CheckCircle } from 'lucide-react'
import axiosSecure from '@/lib/axios'
import RoleGuard from '@/components/dashboard/RoleGuard'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import toast from 'react-hot-toast'

const roleColor = { user: 'text-gray-400', trainer: 'text-blue-400', admin: 'text-red-400' }

function ManageUsersContent() {
  const queryClient = useQueryClient()
  const { data: users = [], isLoading } = useQuery({ queryKey: ['all-users'], queryFn: async () => (await axiosSecure.get('/api/users')).data })

  const statusMutation = useMutation({
    mutationFn: async ({ userId, status }) => axiosSecure.patch(`/api/users/${userId}/status`, { status }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['all-users'] }); toast.success('User status updated') },
    onError: () => toast.error('Update failed'),
  })

  const adminMutation = useMutation({
    mutationFn: async (userId) => axiosSecure.patch(`/api/users/${userId}/make-admin`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['all-users'] }); toast.success('User promoted to Admin') },
    onError: () => toast.error('Update failed'),
  })

  const statusBadge = (s) => s === 'active'
    ? <span className="text-xs font-semibold px-2 py-0.5 rounded bg-neon/10 text-neon">Active</span>
    : <span className="text-xs font-semibold px-2 py-0.5 rounded bg-red-500/10 text-red-400">Blocked</span>

  if (isLoading) return <LoadingSpinner fullPage={false} />

  return (
    <div>
      <h1 className="text-2xl font-black text-white mb-2">Manage Users</h1>
      <p className="text-gray-500 text-sm mb-8">View, block, unblock, and promote platform users.</p>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-border">
                {['User', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                  <th key={h} className="text-left text-xs text-gray-500 uppercase tracking-wider px-5 py-3.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} className="table-row">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {u.image ? <img src={u.image} alt="" className="w-8 h-8 rounded-full object-cover" /> : <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 text-xs font-bold">{u.name?.[0]}</div>}
                      <div>
                        <p className="font-medium text-white">{u.name}</p>
                        <p className="text-xs text-gray-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4"><span className={`text-xs font-semibold capitalize ${roleColor[u.role]}`}>{u.role}</span></td>
                  <td className="px-5 py-4">{statusBadge(u.status)}</td>
                  <td className="px-5 py-4 text-gray-500 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => statusMutation.mutate({ userId: u.userId, status: u.status === 'active' ? 'blocked' : 'active' })}
                        disabled={statusMutation.isPending}
                        className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded border transition-colors ${u.status === 'active' ? 'border-red-500/30 text-red-400 hover:bg-red-500/10' : 'border-neon/30 text-neon hover:bg-neon/10'}`}>
                        {u.status === 'active' ? <><Ban className="w-3 h-3" /> Block</> : <><CheckCircle className="w-3 h-3" /> Unblock</>}
                      </button>
                      {u.role !== 'admin' && (
                        <button onClick={() => { if (confirm(`Make ${u.name} an Admin?`)) adminMutation.mutate(u.userId) }}
                          className="flex items-center gap-1 text-xs px-2.5 py-1 rounded border border-purple-500/30 text-purple-400 hover:bg-purple-500/10 transition-colors">
                          <Shield className="w-3 h-3" /> Make Admin
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
export default function ManageUsersPage() {
  return <RoleGuard roles={['admin']}><ManageUsersContent /></RoleGuard>
}
