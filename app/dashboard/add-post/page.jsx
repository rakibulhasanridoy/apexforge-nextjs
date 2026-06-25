'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FileText } from 'lucide-react'
import axiosSecure from '@/lib/axios'
import { useAuth } from '@/providers/AuthProvider'
import { uploadToImgBB } from '@/utils/uploadImage'
import RoleGuard from '@/components/dashboard/RoleGuard'
import toast from 'react-hot-toast'

function AddPostContent() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const [uploading, setUploading] = useState(false)
  const mutation = useMutation({
    mutationFn: async (data) => (await axiosSecure.post('/api/forum', data)).data,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['my-posts'] }); reset(); toast.success('Post published!') },
    onError: (e) => toast.error(e?.response?.data?.message || 'Failed to post'),
  })
  const onSubmit = async (formData) => {
    setUploading(true)
    try {
      let imageUrl = formData.imageUrl
      if (formData.imageFile?.[0]) imageUrl = await uploadToImgBB(formData.imageFile[0])
      if (!imageUrl) { toast.error('Please provide an image'); return }
      await mutation.mutateAsync({ title: formData.title, image: imageUrl, description: formData.description, authorName: user?.name, authorImage: user?.image || '' })
    } catch { toast.error('Image upload failed') }
    finally { setUploading(false) }
  }
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-black text-white mb-2">Add Forum Post</h1>
      <p className="text-gray-500 text-sm mb-8">Share your knowledge and insights with the community.</p>
      <div className="card p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="label">Post Title</label>
            <input {...register('title', { required: 'Required' })} className="input" placeholder="e.g. 5 Tips for Better Recovery" />
            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label className="label">Cover Image</label>
            <input {...register('imageFile')} type="file" accept="image/*" className="input py-2 text-gray-400 cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-neon/10 file:text-neon" />
            <p className="text-xs text-gray-600 mt-1">Or paste URL:</p>
            <input {...register('imageUrl')} className="input mt-2" placeholder="https://example.com/image.jpg" />
          </div>
          <div>
            <label className="label">Content</label>
            <textarea {...register('description', { required: 'Required', minLength: { value: 50, message: 'Min 50 characters' } })} rows={8} className="input resize-none" placeholder="Write your post content here..." />
            {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
          </div>
          <button type="submit" disabled={mutation.isPending || uploading} className="btn-neon w-full justify-center py-3">
            <FileText className="w-4 h-4" /> {uploading ? 'Uploading...' : mutation.isPending ? 'Publishing...' : 'Publish Post'}
          </button>
        </form>
      </div>
    </div>
  )
}
export default function AddPostPage() {
  return <RoleGuard roles={['trainer']}><AddPostContent /></RoleGuard>
}
