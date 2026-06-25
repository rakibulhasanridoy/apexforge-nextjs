'use client'
import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ThumbsUp, ThumbsDown, MessageCircle, Send, Edit2, Trash2, Eye, Reply } from 'lucide-react'
import axiosSecure from '@/lib/axios'
import { useAuth } from '@/providers/AuthProvider'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import toast from 'react-hot-toast'

export default function ForumPostPage() {
  const { id } = useParams()
  const { user, userProfile } = useAuth()
  const queryClient = useQueryClient()
  const [comment, setComment] = useState('')
  const [editId, setEditId] = useState(null)
  const [editContent, setEditContent] = useState('')
  const [replyTo, setReplyTo] = useState(null)
  const [replyContent, setReplyContent] = useState('')

  const { data: post, isLoading } = useQuery({
    queryKey: ['post', id],
    queryFn: async () => (await axiosSecure.get(`/api/forum/${id}`)).data,
  })

  const { data: comments = [] } = useQuery({
    queryKey: ['comments', id],
    queryFn: async () => (await axiosSecure.get(`/api/forum/${id}/comments`)).data,
  })

  const reactMutation = useMutation({
    mutationFn: async (type) => (await axiosSecure.post(`/api/forum/${id}/react`, { type })).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['post', id] }),
    onError: (e) => toast.error(e?.response?.data?.message || 'Error'),
  })

  const commentMutation = useMutation({
    mutationFn: async (content) => (await axiosSecure.post(`/api/forum/${id}/comments`, { content, userName: user?.name, userImage: user?.image || '' })).data,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['comments', id] }); setComment(''); toast.success('Comment posted!') },
    onError: (e) => toast.error(e?.response?.data?.message || 'Error'),
  })

  const editMutation = useMutation({
    mutationFn: async ({ cid, content }) => (await axiosSecure.put(`/api/forum/comments/${cid}`, { content })).data,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['comments', id] }); setEditId(null); toast.success('Updated') },
  })

  const deleteMutation = useMutation({
    mutationFn: async (cid) => axiosSecure.delete(`/api/forum/comments/${cid}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['comments', id] }); toast.success('Deleted') },
  })

  const replyMutation = useMutation({
    mutationFn: async ({ cid, content }) => (await axiosSecure.post(`/api/forum/comments/${cid}/replies`, { content, userName: user?.name, userImage: user?.image || '' })).data,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['comments', id] }); setReplyTo(null); setReplyContent(''); toast.success('Reply posted!') },
    onError: (e) => toast.error(e?.response?.data?.message || 'Error'),
  })

  if (isLoading) return <LoadingSpinner />
  if (!post) return <div className="container py-20 text-center text-gray-500">Post not found.</div>

  const hasLiked = post.likes?.includes(userProfile?.userId)
  const hasDisliked = post.dislikes?.includes(userProfile?.userId)

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="container py-10 max-w-4xl mx-auto">
        <div className="mb-6">
          <span className="badge-neon capitalize mb-4 inline-block">{post.authorRole}</span>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">{post.title}</h1>
          <div className="flex items-center gap-3 mb-6">
            {post.authorImage
              ? <img src={post.authorImage} alt="" className="w-10 h-10 rounded-full object-cover border border-dark-border2" />
              : <div className="w-10 h-10 rounded-full bg-neon/20 flex items-center justify-center text-neon font-bold">{post.authorName?.[0]}</div>
            }
            <div>
              <p className="font-semibold text-white text-sm">{post.authorName}</p>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span>{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{post.views} views</span>
              </div>
            </div>
          </div>
        </div>

        <div className="aspect-video overflow-hidden rounded-xl mb-8 border border-dark-border">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </div>

        <p className="text-gray-300 leading-relaxed mb-8 text-sm md:text-base whitespace-pre-wrap">{post.description}</p>

        <div className="flex items-center gap-3 py-5 border-y border-dark-border mb-10">
          <button onClick={() => reactMutation.mutate('like')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${hasLiked ? 'border-neon bg-neon/10 text-neon' : 'border-dark-border2 text-gray-400 hover:border-gray-500 hover:text-white'}`}>
            <ThumbsUp className={`w-4 h-4 ${hasLiked ? 'fill-neon' : ''}`} /> {post.likes?.length || 0}
          </button>
          <button onClick={() => reactMutation.mutate('dislike')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${hasDisliked ? 'border-red-500 bg-red-500/10 text-red-400' : 'border-dark-border2 text-gray-400 hover:border-gray-500 hover:text-white'}`}>
            <ThumbsDown className={`w-4 h-4 ${hasDisliked ? 'fill-red-400' : ''}`} /> {post.dislikes?.length || 0}
          </button>
          <span className="ml-2 flex items-center gap-1 text-sm text-gray-500"><MessageCircle className="w-4 h-4" />{comments.length} comments</span>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-bold text-white mb-4">Leave a Comment</h3>
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-full bg-neon/20 flex items-center justify-center text-neon font-bold shrink-0 text-sm">{user?.name?.[0]?.toUpperCase()}</div>
            <div className="flex-1">
              <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3} className="input resize-none mb-2" placeholder="Share your thoughts..." />
              <button onClick={() => comment.trim() && commentMutation.mutate(comment)} disabled={!comment.trim() || commentMutation.isPending} className="btn-neon text-sm py-2">
                <Send className="w-3.5 h-3.5" /> Post Comment
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          {comments.map(c => (
            <div key={c._id} className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {c.userImage ? <img src={c.userImage} alt="" className="w-8 h-8 rounded-full object-cover" /> : <div className="w-8 h-8 rounded-full bg-neon/20 flex items-center justify-center text-neon text-xs font-bold">{c.userName?.[0]}</div>}
                  <div>
                    <p className="text-sm font-semibold text-white">{c.userName}</p>
                    <p className="text-xs text-gray-600">{new Date(c.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                {(c.userId === userProfile?.userId || userProfile?.role === 'admin') && (
                  <div className="flex items-center gap-2">
                    {c.userId === userProfile?.userId && (
                      <button onClick={() => { setEditId(c._id); setEditContent(c.content) }} className="text-gray-500 hover:text-neon p-1"><Edit2 className="w-3.5 h-3.5" /></button>
                    )}
                    <button onClick={() => deleteMutation.mutate(c._id)} className="text-gray-500 hover:text-red-400 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                )}
              </div>
              {editId === c._id ? (
                <div className="space-y-2">
                  <textarea value={editContent} onChange={e => setEditContent(e.target.value)} rows={2} className="input resize-none text-sm" />
                  <div className="flex gap-2">
                    <button onClick={() => editMutation.mutate({ cid: c._id, content: editContent })} className="btn-neon text-xs py-1.5 px-3">Save</button>
                    <button onClick={() => setEditId(null)} className="btn-ghost text-xs py-1.5 px-3">Cancel</button>
                  </div>
                </div>
              ) : <p className="text-gray-300 text-sm mb-3">{c.content}</p>}
              {c.replies?.map((r, i) => (
                <div key={i} className="ml-6 mt-3 pl-3 border-l border-dark-border2 flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-gray-400 text-xs font-bold shrink-0">{r.userName?.[0]}</div>
                  <div><p className="text-xs font-semibold text-gray-300">{r.userName}</p><p className="text-xs text-gray-500 mt-0.5">{r.content}</p></div>
                </div>
              ))}
              <button onClick={() => setReplyTo(replyTo === c._id ? null : c._id)} className="mt-3 flex items-center gap-1 text-xs text-gray-500 hover:text-neon transition-colors">
                <Reply className="w-3 h-3" /> Reply
              </button>
              {replyTo === c._id && (
                <div className="mt-3 flex gap-2">
                  <input value={replyContent} onChange={e => setReplyContent(e.target.value)} className="input text-sm flex-1 py-2" placeholder="Write a reply..." />
                  <button onClick={() => replyContent.trim() && replyMutation.mutate({ cid: c._id, content: replyContent })} className="btn-neon text-xs py-2 px-3"><Send className="w-3 h-3" /></button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
