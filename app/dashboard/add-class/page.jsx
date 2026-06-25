'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { PlusCircle, X } from 'lucide-react'
import axiosSecure from '@/lib/axios'
import { useAuth } from '@/providers/AuthProvider'
import { uploadToImgBB } from '@/utils/uploadImage'
import RoleGuard from '@/components/dashboard/RoleGuard'
import toast from 'react-hot-toast'

const CATEGORIES = ['Yoga', 'HIIT', 'Cardio', 'Strength', 'Pilates', 'CrossFit', 'Boxing', 'Swimming', 'Cycling']
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

function AddClassContent() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const [schedules, setSchedules] = useState([{ day: 'Monday', time: '09:00' }])
  const [uploading, setUploading] = useState(false)

  const mutation = useMutation({
    mutationFn: async (data) => (await axiosSecure.post('/api/classes', data)).data,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['my-classes'] }); reset(); setSchedules([{ day: 'Monday', time: '09:00' }]); toast.success('Class submitted for approval!') },
    onError: (e) => toast.error(e?.response?.data?.message || 'Failed to create class'),
  })

  const onSubmit = async (formData) => {
    setUploading(true)
    try {
      let imageUrl = formData.imageUrl
      if (formData.imageFile?.[0]) imageUrl = await uploadToImgBB(formData.imageFile[0])
      if (!imageUrl) { toast.error('Please provide a class image'); return }
      await mutation.mutateAsync({ className: formData.className, image: imageUrl, category: formData.category, difficultyLevel: formData.difficultyLevel, duration: Number(formData.duration), price: Number(formData.price), description: formData.description, trainerName: user?.name, trainerEmail: user?.email, trainerImage: user?.image || '', schedule: schedules })
    } catch { toast.error('Image upload failed') }
    finally { setUploading(false) }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-black text-white mb-2">Add New Class</h1>
      <p className="text-gray-500 text-sm mb-8">Create a class and submit for admin approval before it goes live.</p>
      <div className="card p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="label">Class Name</label>
              <input {...register('className', { required: 'Required' })} className="input" placeholder="e.g. Power Lifting 101" />
              {errors.className && <p className="text-red-400 text-xs mt-1">{errors.className.message}</p>}
            </div>
            <div>
              <label className="label">Category</label>
              <select {...register('category', { required: 'Required' })} className="input">
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category.message}</p>}
            </div>
            <div>
              <label className="label">Difficulty Level</label>
              <select {...register('difficultyLevel', { required: 'Required' })} className="input">
                <option value="">Select level</option>
                {['Beginner', 'Intermediate', 'Advanced'].map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Duration (minutes)</label>
              <input {...register('duration', { required: 'Required', min: 10 })} type="number" className="input" placeholder="60" />
            </div>
            <div>
              <label className="label">Price ($)</label>
              <input {...register('price', { required: 'Required', min: 0 })} type="number" step="0.01" className="input" placeholder="25.00" />
            </div>
          </div>
          <div>
            <label className="label">Cover Image</label>
            <input {...register('imageFile')} type="file" accept="image/*" className="input py-2 text-gray-400 cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-neon/10 file:text-neon hover:file:bg-neon/20" />
            <p className="text-xs text-gray-600 mt-1">Or paste an image URL below</p>
            <input {...register('imageUrl')} className="input mt-2" placeholder="https://example.com/image.jpg" />
          </div>
          <div>
            <label className="label">Class Schedule</label>
            <div className="space-y-2">
              {schedules.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <select value={s.day} onChange={e => setSchedules(prev => prev.map((x, j) => j === i ? { ...x, day: e.target.value } : x))} className="input flex-1 text-sm">
                    {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <input type="time" value={s.time} onChange={e => setSchedules(prev => prev.map((x, j) => j === i ? { ...x, time: e.target.value } : x))} className="input flex-1 text-sm" />
                  {schedules.length > 1 && <button type="button" onClick={() => setSchedules(prev => prev.filter((_, j) => j !== i))} className="w-8 h-8 flex items-center justify-center rounded border border-dark-border2 text-gray-500 hover:text-red-400 shrink-0"><X className="w-3.5 h-3.5" /></button>}
                </div>
              ))}
              <button type="button" onClick={() => setSchedules(prev => [...prev, { day: 'Monday', time: '09:00' }])} className="text-xs text-neon hover:underline flex items-center gap-1 mt-1">
                <PlusCircle className="w-3.5 h-3.5" /> Add Slot
              </button>
            </div>
          </div>
          <div>
            <label className="label">Description</label>
            <textarea {...register('description', { required: 'Required' })} rows={4} className="input resize-none" placeholder="Describe what students will learn..." />
            {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
          </div>
          <button type="submit" disabled={mutation.isPending || uploading} className="btn-neon w-full justify-center py-3">
            <PlusCircle className="w-4 h-4" /> {uploading ? 'Uploading image...' : mutation.isPending ? 'Submitting...' : 'Submit for Approval'}
          </button>
        </form>
      </div>
    </div>
  )
}
export default function AddClassPage() {
  return <RoleGuard roles={['trainer']}><AddClassContent /></RoleGuard>
}
