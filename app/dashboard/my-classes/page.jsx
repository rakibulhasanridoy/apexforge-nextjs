'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Edit2, Trash2, Users, X } from 'lucide-react'
import axiosSecure from '@/lib/axios'
import RoleGuard from '@/components/dashboard/RoleGuard'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import toast from 'react-hot-toast'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const CATEGORIES = ['Yoga', 'HIIT', 'Cardio', 'Strength', 'Pilates', 'CrossFit', 'Boxing', 'Swimming']

const statusBadge = (s) => {
  const map = { Approved: 'bg-neon/10 text-neon', Pending: 'bg-yellow-400/10 text-yellow-400', Rejected: 'bg-red-500/10 text-red-400' }
  return <span className={`text-xs font-semibold px-2 py-0.5 rounded ${map[s]}`}>{s}</span>
}

function MyClassesContent() {
  const queryClient = useQueryClient()
  const [editClass, setEditClass] = useState(null)
  const [studentsModal, setStudentsModal] = useState(null)
  const [students, setStudents] = useState([])
  const [editSchedules, setEditSchedules] = useState([])

  const { data: classes = [], isLoading } = useQuery({ queryKey: ['my-classes'], queryFn: async () => (await axiosSecure.get('/api/classes/my-classes')).data })

  const deleteMutation = useMutation({
    mutationFn: async (id) => axiosSecure.delete(`/api/classes/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['my-classes'] }); toast.success('Class deleted') },
    onError: () => toast.error('Delete failed'),
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => (await axiosSecure.put(`/api/classes/${id}`, data)).data,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['my-classes'] }); setEditClass(null); toast.success('Class updated!') },
    onError: () => toast.error('Update failed'),
  })

  const openStudents = async (cls) => {
    setStudentsModal(cls)
    const res = await axiosSecure.get(`/api/classes/${cls._id}/students`)
    setStudents(res.data)
  }

  const openEdit = (cls) => { setEditClass(cls); setEditSchedules(cls.schedule?.length ? cls.schedule : [{ day: 'Monday', time: '09:00' }]) }

  const handleUpdate = async (e) => {
    e.preventDefault()
    const fd = new FormData(e.target)
    await updateMutation.mutateAsync({ id: editClass._id, data: { className: fd.get('className'), category: fd.get('category'), difficultyLevel: fd.get('difficultyLevel'), duration: Number(fd.get('duration')), price: Number(fd.get('price')), description: fd.get('description'), schedule: editSchedules } })
  }

  if (isLoading) return <LoadingSpinner fullPage={false} />

  return (
    <div>
      <h1 className="text-2xl font-black text-white mb-2">My Classes</h1>
      <p className="text-gray-500 text-sm mb-8">Manage all classes you have created.</p>

      {classes.length === 0 ? (
        <div className="card p-12 text-center"><p className="text-gray-500 mb-4">No classes yet.</p><a href="/dashboard/add-class" className="btn-neon text-sm">Create First Class</a></div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-dark-border">{['Class Name', 'Category', 'Price', 'Bookings', 'Status', 'Actions'].map(h => <th key={h} className="text-left text-xs text-gray-500 uppercase tracking-wider px-5 py-3.5">{h}</th>)}</tr></thead>
              <tbody>
                {classes.map(cls => (
                  <tr key={cls._id} className="table-row">
                    <td className="px-5 py-4 font-medium text-white">{cls.className}</td>
                    <td className="px-5 py-4 text-gray-400">{cls.category}</td>
                    <td className="px-5 py-4 text-neon font-semibold">${cls.price}</td>
                    <td className="px-5 py-4 text-gray-400">{cls.bookingCount}</td>
                    <td className="px-5 py-4">{statusBadge(cls.status)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(cls)} className="w-7 h-7 flex items-center justify-center rounded border border-dark-border2 text-gray-400 hover:text-neon transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => openStudents(cls)} className="w-7 h-7 flex items-center justify-center rounded border border-dark-border2 text-gray-400 hover:text-blue-400 transition-colors"><Users className="w-3.5 h-3.5" /></button>
                        <button onClick={() => { if (confirm('Delete this class?')) deleteMutation.mutate(cls._id) }} className="w-7 h-7 flex items-center justify-center rounded border border-dark-border2 text-gray-400 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {editClass && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-card border border-dark-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-dark-border">
              <h3 className="font-bold text-white">Edit Class</h3>
              <button onClick={() => setEditClass(null)}><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <form onSubmit={handleUpdate} className="p-5 space-y-4">
              <div><label className="label">Class Name</label><input name="className" defaultValue={editClass.className} className="input" required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Category</label><select name="category" defaultValue={editClass.category} className="input">{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                <div><label className="label">Difficulty</label><select name="difficultyLevel" defaultValue={editClass.difficultyLevel} className="input">{['Beginner', 'Intermediate', 'Advanced'].map(l => <option key={l} value={l}>{l}</option>)}</select></div>
                <div><label className="label">Duration (min)</label><input name="duration" type="number" defaultValue={editClass.duration} className="input" /></div>
                <div><label className="label">Price ($)</label><input name="price" type="number" step="0.01" defaultValue={editClass.price} className="input" /></div>
              </div>
              <div>
                <label className="label">Schedule</label>
                {editSchedules.map((s, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <select value={s.day} onChange={e => setEditSchedules(prev => prev.map((x, j) => j === i ? { ...x, day: e.target.value } : x))} className="input flex-1 text-sm">{DAYS.map(d => <option key={d} value={d}>{d}</option>)}</select>
                    <input type="time" value={s.time} onChange={e => setEditSchedules(prev => prev.map((x, j) => j === i ? { ...x, time: e.target.value } : x))} className="input flex-1 text-sm" />
                  </div>
                ))}
              </div>
              <div><label className="label">Description</label><textarea name="description" defaultValue={editClass.description} rows={3} className="input resize-none" /></div>
              <div className="flex gap-3">
                <button type="submit" disabled={updateMutation.isPending} className="btn-neon flex-1 justify-center">{updateMutation.isPending ? 'Saving...' : 'Save Changes'}</button>
                <button type="button" onClick={() => setEditClass(null)} className="btn-ghost flex-1 justify-center">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {studentsModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-card border border-dark-border rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-dark-border">
              <h3 className="font-bold text-white">Students — {studentsModal.className}</h3>
              <button onClick={() => setStudentsModal(null)}><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-5">
              {students.length === 0 ? <p className="text-gray-500 text-sm text-center py-6">No students booked yet.</p> : (
                <div className="space-y-3">
                  {students.map(s => (
                    <div key={s._id} className="flex items-center gap-3 p-3 bg-dark-card2 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-neon/20 flex items-center justify-center text-neon text-xs font-bold">{s.userName?.[0]}</div>
                      <div><p className="text-sm font-medium text-white">{s.userName}</p><p className="text-xs text-gray-500">{s.userEmail}</p></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default function MyClassesPage() {
  return <RoleGuard roles={['trainer']}><MyClassesContent /></RoleGuard>
}
