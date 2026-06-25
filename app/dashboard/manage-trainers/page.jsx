'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { UserMinus } from 'lucide-react'
import axiosSecure from '@/lib/axios'
import RoleGuard from '@/components/dashboard/RoleGuard'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import toast from 'react-hot-toast'

function ManageTrainersContent() {
  const queryClient = useQueryClient()
  const { data: trainers = [], isLoading } = useQuery({ queryKey: ['all-trainers'], queryFn: async () => (await axiosSecure.get('/api/trainers/all')).data })
  const demoteMutation = useMutation({
    mutationFn: async (userId) => axiosSecure.patch(`/api/users/${userId}/demote`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['all-trainers'] }); toast.success('Trainer demoted to User') },
    onError: () => toast.error('Action failed'),
  })
  if (isLoading) return <LoadingSpinner fullPage={false} />
  return (
    <div>
      <h1 className="text-2xl font-black text-white mb-2">Manage Trainers</h1>
      <p className="text-gray-500 text-sm mb-8">View all active trainers and manage their roles.</p>
      {trainers.length === 0 ? (
        <div className="card p-12 text-center"><p className="text-gray-500">No active trainers yet.</p></div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-dark-border">{['Trainer', 'Status', 'Joined', 'Actions'].map(h => <th key={h} className="text-left text-xs text-gray-500 uppercase tracking-wider px-5 py-3.5">{h}</th>)}</tr></thead>
              <tbody>
                {trainers.map(t => (
                  <tr key={t._id} className="table-row">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {t.image ? <img src={t.image} alt="" className="w-8 h-8 rounded-full object-cover" /> : <div className="w-8 h-8 rounded-full bg-blue-400/20 flex items-center justify-center text-blue-400 text-xs font-bold">{t.name?.[0]}</div>}
                        <div><p className="font-medium text-white">{t.name}</p><p className="text-xs text-gray-500">{t.email}</p></div>
                      </div>
                    </td>
                    <td className="px-5 py-4"><span className={`text-xs font-semibold px-2 py-0.5 rounded ${t.status === 'active' ? 'bg-neon/10 text-neon' : 'bg-red-500/10 text-red-400'}`}>{t.status}</span></td>
                    <td className="px-5 py-4 text-gray-500 text-xs">{new Date(t.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-4">
                      <button onClick={() => { if (confirm(`Demote ${t.name} to User?`)) demoteMutation.mutate(t.userId) }}
                        className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded border border-orange-500/30 text-orange-400 hover:bg-orange-500/10 transition-colors">
                        <UserMinus className="w-3 h-3" /> Demote
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
export default function ManageTrainersPage() {
  return <RoleGuard roles={['admin']}><ManageTrainersContent /></RoleGuard>
}
