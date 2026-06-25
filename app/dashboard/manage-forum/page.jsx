'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Trash2, ThumbsUp, Eye } from 'lucide-react'
import axiosSecure from '@/lib/axios'
import RoleGuard from '@/components/dashboard/RoleGuard'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import toast from 'react-hot-toast'

function ManageForumContent() {
  const queryClient = useQueryClient()
  const { data: posts = [], isLoading } = useQuery({ queryKey: ['all-posts-admin'], queryFn: async () => (await axiosSecure.get('/api/forum/all/manage')).data })
  const deleteMutation = useMutation({
    mutationFn: async (id) => axiosSecure.delete(`/api/forum/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['all-posts-admin'] }); toast.success('Post deleted') },
    onError: () => toast.error('Delete failed'),
  })
  if (isLoading) return <LoadingSpinner fullPage={false} />
  return (
    <div>
      <h1 className="text-2xl font-black text-white mb-2">Manage Forum</h1>
      <p className="text-gray-500 text-sm mb-8">Moderate all community forum posts and delete inappropriate content.</p>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-dark-border">{['Post', 'Author', 'Role', 'Engagement', 'Date', 'Action'].map(h => <th key={h} className="text-left text-xs text-gray-500 uppercase tracking-wider px-5 py-3.5">{h}</th>)}</tr></thead>
            <tbody>
              {posts.map(post => (
                <tr key={post._id} className="table-row">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img src={post.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      <p className="font-medium text-white line-clamp-1 max-w-[160px]">{post.title}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-400">{post.authorName}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded capitalize ${post.authorRole === 'admin' ? 'bg-red-500/10 text-red-400' : 'bg-blue-400/10 text-blue-400'}`}>{post.authorRole}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" />{post.likes?.length || 0}</span>
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{post.views || 0}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-500 text-xs">{new Date(post.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-4">
                    <button onClick={() => { if (confirm('Delete this post?')) deleteMutation.mutate(post._id) }} className="w-7 h-7 flex items-center justify-center rounded border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
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
export default function ManageForumPage() {
  return <RoleGuard roles={['admin']}><ManageForumContent /></RoleGuard>
}
