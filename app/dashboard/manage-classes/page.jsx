'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CheckCircle, XCircle, Trash2 } from 'lucide-react'
import axiosSecure from '@/lib/axios'
import RoleGuard from '@/components/dashboard/RoleGuard'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import toast from 'react-hot-toast'

const statusBadge = (s) => {
  const map = { Approved: 'bg-neon/10 text-neon', Pending: 'bg-yellow-400/10 text-yellow-400', Rejected: 'bg-red-500/10 text-red-400' }
  return <span className={`text-xs font-semibold px-2 py-0.5 rounded ${map[s]}`}>{s}</span>
}

function ManageClassesContent() {
  const queryClient = useQueryClient()
  const { data: classes = [], isLoading } = useQuery({ queryKey: ['all-classes-admin'], queryFn: async () => (await axiosSecure.get('/api/classes/all')).data })

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }) => axiosSecure.patch(`/api/classes/${id}/status`, { status }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['all-classes-admin'] }); toast.success('Class status updated') },
    onError: () => toast.error('Update failed'),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id) => axiosSecure.delete(`/api/classes/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['all-classes-admin'] }); toast.success('Class deleted') },
    onError: () => toast.error('Delete failed'),
  })

  if (isLoading) return <LoadingSpinner fullPage={false} />

  return (
    <div>
      <h1 className="text-2xl font-black text-white mb-2">Manage Classes</h1>
      <p className="text-gray-500 text-sm mb-8">Approve, reject, or delete fitness classes submitted by trainers.</p>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-dark-border">{['Class', 'Trainer', 'Category', 'Price', 'Status', 'Actions'].map(h => <th key={h} className="text-left text-xs text-gray-500 uppercase tracking-wider px-5 py-3.5">{h}</th>)}</tr></thead>
            <tbody>
              {classes.map(cls => (
                <tr key={cls._id} className="table-row">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img src={cls.image} alt="" className="w-9 h-9 rounded-lg object-cover" />
                      <p className="font-medium text-white max-w-[150px] truncate">{cls.className}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-400">{cls.trainerName}</td>
                  <td className="px-5 py-4 text-gray-400">{cls.category}</td>
                  <td className="px-5 py-4 text-neon font-semibold">${cls.price}</td>
                  <td className="px-5 py-4">{statusBadge(cls.status)}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      {cls.status !== 'Approved' && (
                        <button onClick={() => statusMutation.mutate({ id: cls._id, status: 'Approved' })} className="w-7 h-7 flex items-center justify-center rounded border border-neon/30 text-neon hover:bg-neon/10 transition-colors" title="Approve"><CheckCircle className="w-3.5 h-3.5" /></button>
                      )}
                      {cls.status !== 'Rejected' && (
                        <button onClick={() => statusMutation.mutate({ id: cls._id, status: 'Rejected' })} className="w-7 h-7 flex items-center justify-center rounded border border-orange-500/30 text-orange-400 hover:bg-orange-500/10 transition-colors" title="Reject"><XCircle className="w-3.5 h-3.5" /></button>
                      )}
                      <button onClick={() => { if (confirm('Delete this class?')) deleteMutation.mutate(cls._id) }} className="w-7 h-7 flex items-center justify-center rounded border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
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
export default function ManageClassesPage() {
  return <RoleGuard roles={['admin']}><ManageClassesContent /></RoleGuard>
}
