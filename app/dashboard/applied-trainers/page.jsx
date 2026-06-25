'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { X, CheckCircle, XCircle } from 'lucide-react'
import axiosSecure from '@/lib/axios'
import RoleGuard from '@/components/dashboard/RoleGuard'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import toast from 'react-hot-toast'

function AppliedTrainersContent() {
  const queryClient = useQueryClient()
  const [selected, setSelected] = useState(null)
  const [feedback, setFeedback] = useState('')

  const { data: applications = [], isLoading } = useQuery({ queryKey: ['trainer-applications'], queryFn: async () => (await axiosSecure.get('/api/trainers/applications')).data })

  const approveMutation = useMutation({
    mutationFn: async ({ id, feedback }) => axiosSecure.patch(`/api/trainers/applications/${id}/approve`, { feedback }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['trainer-applications'] }); setSelected(null); toast.success('Trainer approved!') },
    onError: () => toast.error('Action failed'),
  })

  const rejectMutation = useMutation({
    mutationFn: async ({ id, feedback }) => axiosSecure.patch(`/api/trainers/applications/${id}/reject`, { feedback }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['trainer-applications'] }); setSelected(null); toast.success('Application rejected') },
    onError: () => toast.error('Action failed'),
  })

  if (isLoading) return <LoadingSpinner fullPage={false} />

  return (
    <div>
      <h1 className="text-2xl font-black text-white mb-2">Trainer Applications</h1>
      <p className="text-gray-500 text-sm mb-8">Review and respond to pending trainer applications.</p>

      {applications.length === 0 ? (
        <div className="card p-12 text-center"><p className="text-gray-500">No pending applications.</p></div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-border">
                  {['Applicant', 'Experience', 'Specialty', 'Applied', 'Action'].map(h => (
                    <th key={h} className="text-left text-xs text-gray-500 uppercase tracking-wider px-5 py-3.5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {applications.map(a => (
                  <tr key={a._id} className="table-row">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {a.userImage ? <img src={a.userImage} alt="" className="w-8 h-8 rounded-full object-cover" /> : <div className="w-8 h-8 rounded-full bg-neon/20 flex items-center justify-center text-neon text-xs font-bold">{a.userName?.[0]}</div>}
                        <div>
                          <p className="font-medium text-white">{a.userName}</p>
                          <p className="text-xs text-gray-500">{a.userEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-400">{a.experience} yrs</td>
                    <td className="px-5 py-4 text-gray-400 text-xs max-w-[140px] truncate">{a.specialty?.slice(0,2).join(', ')}{a.specialty?.length > 2 ? '…' : ''}</td>
                    <td className="px-5 py-4 text-gray-500 text-xs">{new Date(a.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-4">
                      <button onClick={() => { setSelected(a); setFeedback('') }} className="text-xs px-3 py-1.5 rounded border border-neon/30 text-neon hover:bg-neon/10 transition-colors">Review</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-card border border-dark-border rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-dark-border">
              <h3 className="font-bold text-white">Review Application</h3>
              <button onClick={() => setSelected(null)}><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-3 mb-5">
                {selected.userImage ? <img src={selected.userImage} alt="" className="w-12 h-12 rounded-full object-cover" /> : <div className="w-12 h-12 rounded-full bg-neon/20 flex items-center justify-center text-neon font-black">{selected.userName?.[0]}</div>}
                <div><p className="font-bold text-white">{selected.userName}</p><p className="text-gray-500 text-sm">{selected.userEmail}</p></div>
              </div>
              <div className="space-y-2 text-sm mb-5 p-4 bg-dark-card2 rounded-xl">
                <div className="flex justify-between"><span className="text-gray-500">Experience</span><span className="text-white">{selected.experience} years</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Specialty</span><span className="text-white text-right max-w-[200px]">{selected.specialty?.join(', ')}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Applied</span><span className="text-white">{new Date(selected.createdAt).toLocaleDateString()}</span></div>
              </div>
              <div className="mb-5">
                <label className="label">Feedback / Notes</label>
                <textarea value={feedback} onChange={e => setFeedback(e.target.value)} rows={3} className="input resize-none" placeholder="Write feedback for the applicant..." />
              </div>
              <div className="flex gap-3">
                <button onClick={() => approveMutation.mutate({ id: selected._id, feedback: feedback || 'Congratulations! Your application has been approved.' })} disabled={approveMutation.isPending} className="btn-neon flex-1 justify-center text-sm">
                  <CheckCircle className="w-4 h-4" /> Approve
                </button>
                <button onClick={() => { if (!feedback.trim()) { toast.error('Please write feedback before rejecting'); return } rejectMutation.mutate({ id: selected._id, feedback }) }} disabled={rejectMutation.isPending}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm font-medium transition-colors">
                  <XCircle className="w-4 h-4" /> Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default function AppliedTrainersPage() {
  return <RoleGuard roles={['admin']}><AppliedTrainersContent /></RoleGuard>
}
