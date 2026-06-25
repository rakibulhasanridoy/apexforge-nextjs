'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { ArrowRight, ThumbsUp, Eye, ChevronLeft, ChevronRight } from 'lucide-react'
import axiosSecure from '@/lib/axios'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

export default function ForumPage() {
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['forum', page],
    queryFn: async () => (await axiosSecure.get('/api/forum', { params: { page, limit: 6 } })).data,
  })

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="bg-dark-card border-b border-dark-border py-14 text-center">
        <p className="text-neon text-xs font-bold tracking-widest uppercase mb-3">Community Hub</p>
        <h1 className="text-4xl md:text-5xl font-black mb-3"><span className="text-neon">Community</span> Forum</h1>
        <p className="text-gray-500 max-w-xl mx-auto text-sm">Connect with trainers and athletes. Share training protocols, nutritional science, and celebrate high-performance achievements.</p>
      </div>

      <div className="container py-12">
        {isLoading ? <LoadingSpinner fullPage={false} /> : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.posts?.map(post => (
                <div key={post._id} className="card group hover:border-neon/30 transition-all duration-300 hover:-translate-y-1 flex flex-col">
                  <div className="aspect-video overflow-hidden">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      {post.authorImage
                        ? <img src={post.authorImage} alt="" className="w-7 h-7 rounded-full object-cover" />
                        : <div className="w-7 h-7 rounded-full bg-neon/20 flex items-center justify-center text-neon text-xs font-bold">{post.authorName?.[0]}</div>
                      }
                      <div>
                        <p className="text-xs font-medium text-white">{post.authorName}</p>
                        <p className="text-xs text-gray-600 capitalize">{post.authorRole}</p>
                      </div>
                    </div>
                    <h3 className="font-bold text-white mb-2 line-clamp-2 text-base flex-1">{post.title}</h3>
                    <p className="text-gray-500 text-sm line-clamp-3 mb-4">{post.description}</p>
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-dark-border">
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" />{post.likes?.length || 0}</span>
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{post.views || 0}</span>
                      </div>
                      <Link href={`/forum/${post._id}`} className="flex items-center gap-1 text-xs font-semibold text-neon hover:underline">
                        Read More <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {data?.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-dark-border2 text-gray-400 hover:text-white disabled:opacity-30 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: data.pages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${p === page ? 'bg-neon text-black' : 'border border-dark-border2 text-gray-400 hover:text-white'}`}>
                    {p}
                  </button>
                ))}
                <button onClick={() => setPage(p => Math.min(data.pages, p + 1))} disabled={page === data.pages}
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-dark-border2 text-gray-400 hover:text-white disabled:opacity-30 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
