'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { Heart, Trash2, ArrowRight } from 'lucide-react'
import axiosSecure from '@/lib/axios'
import RoleGuard from '@/components/dashboard/RoleGuard'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import toast from 'react-hot-toast'

function FavoritesContent() {
  const queryClient = useQueryClient()
  const { data: favorites = [], isLoading } = useQuery({ queryKey: ['my-favorites'], queryFn: async () => (await axiosSecure.get('/api/trainers/favorites')).data })
  const removeMutation = useMutation({
    mutationFn: async (classId) => axiosSecure.delete(`/api/trainers/favorites/${classId}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['my-favorites'] }); toast.success('Removed from favorites') },
  })
  if (isLoading) return <LoadingSpinner fullPage={false} />
  return (
    <div>
      <h1 className="text-2xl font-black text-white mb-2">Favorite Classes</h1>
      <p className="text-gray-500 text-sm mb-8">Classes you have saved for quick access.</p>
      {favorites.length === 0 ? (
        <div className="card p-12 text-center">
          <Heart className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No favorite classes yet.</p>
          <Link href="/classes" className="btn-neon text-sm">Explore Classes</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {favorites.map(fav => (
            <div key={fav._id} className="card group hover:border-neon/30 transition-all">
              <div className="aspect-video overflow-hidden">
                {fav.classImage ? <img src={fav.classImage} alt={fav.className} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="w-full h-full bg-dark-card2 flex items-center justify-center"><Heart className="w-8 h-8 text-gray-600" /></div>}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-white mb-1">{fav.className}</h3>
                <p className="text-gray-500 text-sm mb-3">by {fav.trainerName}</p>
                <div className="flex items-center justify-between">
                  <span className="text-neon font-bold">${fav.price}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => removeMutation.mutate(fav.classId)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-dark-border2 text-gray-500 hover:text-red-400 hover:border-red-400/50 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    <Link href={`/classes/${fav.classId}`} className="w-8 h-8 flex items-center justify-center rounded-lg border border-dark-border2 text-gray-500 hover:text-neon hover:border-neon/50 transition-colors"><ArrowRight className="w-3.5 h-3.5" /></Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
export default function FavoritesPage() {
  return <RoleGuard roles={['user']}><FavoritesContent /></RoleGuard>
}
