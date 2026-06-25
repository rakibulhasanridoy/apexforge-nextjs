'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Trash2, Eye, ThumbsUp } from 'lucide-react'
import axiosSecure from '@/lib/axios'
import RoleGuard from '@/components/dashboard/RoleGuard'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import toast from 'react-hot-toast'

function MyPostsContent() {
  const queryClient = useQueryClient()
  const { data: posts = [], isLoading } = useQuery({ queryKey: ['my-posts'], queryFn: async () => (await axiosSecure.get('/api/forum/my-posts')).data })
  const deleteMutation = useMutation({
    mutationFn: async (id) => axiosSecure.delete(`/api/forum/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['my-posts'] }); toast.success('Post deleted') },
    onError: () => toast.error('Delete failed'),
  })
  if (isLoading) return <LoadingSpinner fullPage={false} />
  return (
    <div>
      <h1 className="text-2xl font-black text-white mb-2">My Forum Posts</h1>
      <p className="text-gray-500 text-sm mb-8">Manage your community forum publications.</p>
      {posts.length === 0 ? (
        <div className="card p-12 text-center"><p className="text-gray-500 mb-4">No posts yet.</p><a href="/dashboard/add-post" className="btn-neon text-sm">Create First Post</a></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {posts.map(post => (
            <div key={post._id} className="card p-5 flex gap-4">
              <img src={post.image} alt={post.title} className="w-20 h-20 rounded-lg object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white text-sm mb-1 line-clamp-2">{post.title}</h3>
                <p className="text-gray-500 text-xs line-clamp-2 mb-3">{post.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-gray-600">
                    <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" />{post.likes?.length || 0}</span>
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{post.views || 0}</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  <button onClick={() => { if (confirm('Delete this post?')) deleteMutation.mutate(post._id) }} className="w-7 h-7 flex items-center justify-center rounded border border-dark-border2 text-gray-400 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
export default function MyPostsPage() {
  return <RoleGuard roles={['trainer']}><MyPostsContent /></RoleGuard>
}
