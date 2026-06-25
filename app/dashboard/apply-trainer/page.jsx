'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { UserPlus, CheckCircle } from 'lucide-react'
import axiosSecure from '@/lib/axios'
import { useAuth } from '@/providers/AuthProvider'
import RoleGuard from '@/components/dashboard/RoleGuard'
import toast from 'react-hot-toast'

const SPECIALTIES = ['Yoga', 'HIIT', 'Strength Training', 'Cardio', 'Pilates', 'CrossFit', 'Boxing', 'Swimming', 'Cycling', 'Nutrition']

function ApplyContent() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const { register, handleSubmit, formState: { errors } } = useForm()
  const { data: application } = useQuery({ queryKey: ['trainer-application'], queryFn: async () => (await axiosSecure.get('/api/trainers/apply/status')).data })
  const mutation = useMutation({
    mutationFn: async (data) => (await axiosSecure.post('/api/trainers/apply', { ...data, userName: user?.name, userImage: user?.image || '' })).data,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['trainer-application'] }); toast.success('Application submitted!') },
    onError: (e) => toast.error(e?.response?.data?.message || 'Submission failed'),
  })

  if (application?.status === 'Pending') return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-black text-white mb-8">Apply as Trainer</h1>
      <div className="card p-8 text-center">
        <div className="w-16 h-16 bg-yellow-400/10 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-8 h-8 text-yellow-400" /></div>
        <h3 className="font-bold text-white mb-2">Application Under Review</h3>
        <p className="text-gray-500 text-sm">Your application is currently being reviewed by our team.</p>
        <div className="mt-4 pt-4 border-t border-dark-border text-sm space-y-1">
          <div className="flex justify-between text-gray-500"><span>Specialty</span><span className="text-white">{application.specialty?.join(', ')}</span></div>
          <div className="flex justify-between text-gray-500"><span>Experience</span><span className="text-white">{application.experience} years</span></div>
        </div>
      </div>
    </div>
  )

  if (application?.status === 'Approved') return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-black text-white mb-8">Apply as Trainer</h1>
      <div className="card p-8 text-center">
        <div className="w-16 h-16 bg-neon/10 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-8 h-8 text-neon" /></div>
        <h3 className="font-bold text-white mb-2">You're a Trainer!</h3>
        <p className="text-gray-500 text-sm">Your application was approved. You now have trainer access.</p>
      </div>
    </div>
  )

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-black text-white mb-2">Apply as Trainer</h1>
      <p className="text-gray-500 text-sm mb-8">Share your expertise with our community.</p>
      {application?.status === 'Rejected' && (
        <div className="card p-4 border-red-500/30 bg-red-500/5 mb-6">
          <p className="text-red-400 text-sm font-semibold mb-1">Previous application rejected</p>
          <p className="text-gray-400 text-xs">{application.feedback}</p>
          <p className="text-gray-500 text-xs mt-2">You may submit a new application below.</p>
        </div>
      )}
      <div className="card p-6">
        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-5">
          <div>
            <label className="label">Years of Experience</label>
            <input {...register('experience', { required: 'Required', min: { value: 0, message: 'Must be 0 or more' } })} type="number" className="input" placeholder="e.g. 5" />
            {errors.experience && <p className="text-red-400 text-xs mt-1">{errors.experience.message}</p>}
          </div>
          <div>
            <label className="label">Specialties (select all that apply)</label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {SPECIALTIES.map(s => (
                <label key={s} className="flex items-center gap-2 cursor-pointer">
                  <input {...register('specialty')} type="checkbox" value={s} className="w-4 h-4 accent-neon rounded" />
                  <span className="text-sm text-gray-400">{s}</span>
                </label>
              ))}
            </div>
          </div>
          <button type="submit" disabled={mutation.isPending} className="btn-neon w-full justify-center py-3">
            <UserPlus className="w-4 h-4" /> {mutation.isPending ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  )
}
export default function ApplyTrainerPage() {
  return <RoleGuard roles={['user']}><ApplyContent /></RoleGuard>
}
