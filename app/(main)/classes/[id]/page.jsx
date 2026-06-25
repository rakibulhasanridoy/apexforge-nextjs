'use client'
import { useParams, useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Clock, Users, Star, Heart, Zap, Calendar, ArrowRight, CheckCircle } from 'lucide-react'
import axiosSecure from '@/lib/axios'
import { useAuth } from '@/providers/AuthProvider'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import toast from 'react-hot-toast'

export default function ClassDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const { userProfile } = useAuth()
  const queryClient = useQueryClient()

  const { data: cls, isLoading } = useQuery({
    queryKey: ['class', id],
    queryFn: async () => (await axiosSecure.get(`/api/classes/${id}`)).data,
  })

  const { data: bookingCheck } = useQuery({
    queryKey: ['booking-check', id],
    queryFn: async () => (await axiosSecure.get(`/api/bookings/check/${id}`)).data,
    enabled: !!userProfile,
  })

  const { data: favCheck } = useQuery({
    queryKey: ['fav-check', id],
    queryFn: async () => (await axiosSecure.get(`/api/trainers/favorites/check/${id}`)).data,
    enabled: !!userProfile,
  })

  const favMutation = useMutation({
    mutationFn: async () => {
      if (favCheck?.isFavorite) {
        await axiosSecure.delete(`/api/trainers/favorites/${id}`)
      } else {
        await axiosSecure.post('/api/trainers/favorites', {
          classId: id, className: cls.className, classImage: cls.image,
          category: cls.category, trainerName: cls.trainerName, price: cls.price,
        })
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fav-check', id] })
      toast.success(favCheck?.isFavorite ? 'Removed from favorites' : 'Added to favorites!')
    },
    onError: (e) => toast.error(e?.response?.data?.message || 'Error'),
  })

  const handleBookNow = () => {
    if (userProfile?.status === 'blocked') return toast.error('Action restricted by Admin.')
    if (bookingCheck?.booked) return toast.error('You have already booked this class.')
    router.push(`/payment/${id}`)
  }

  if (isLoading) return <LoadingSpinner />
  if (!cls) return <div className="container py-20 text-center text-gray-500">Class not found.</div>

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img src={cls.image} alt={cls.className} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/50 to-transparent" />
        <div className="absolute bottom-8 left-0 container">
          <span className="badge-neon capitalize mb-3 inline-block">{cls.category} • {cls.difficultyLevel}</span>
          <h1 className="text-3xl md:text-5xl font-black text-white">{cls.className}</h1>
        </div>
      </div>

      <div className="container py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-xl font-bold text-white mb-3">About This Class</h2>
              <p className="text-gray-400 leading-relaxed">{cls.description}</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: <Clock className="w-5 h-5 text-neon" />, label: 'Duration', value: `${cls.duration} min` },
                { icon: <Users className="w-5 h-5 text-neon" />, label: 'Bookings', value: cls.bookingCount },
                { icon: <Star className="w-5 h-5 text-neon" />, label: 'Level', value: cls.difficultyLevel },
              ].map(({ icon, label, value }) => (
                <div key={label} className="card p-4 text-center">
                  <div className="flex justify-center mb-2">{icon}</div>
                  <p className="text-xs text-gray-500 mb-1">{label}</p>
                  <p className="text-white font-bold text-sm">{value}</p>
                </div>
              ))}
            </div>
            {cls.schedule?.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Upcoming Sessions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {cls.schedule.map((s, i) => (
                    <div key={i} className="card p-4 flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-neon shrink-0" />
                      <div>
                        <p className="text-neon text-xs font-bold uppercase">{s.day}</p>
                        <p className="text-white font-bold">{s.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="card p-5 flex items-center gap-4">
              {cls.trainerImage
                ? <img src={cls.trainerImage} alt={cls.trainerName} className="w-14 h-14 rounded-full object-cover border-2 border-neon/30" />
                : <div className="w-14 h-14 rounded-full bg-neon/20 flex items-center justify-center text-neon text-xl font-black">{cls.trainerName?.[0]}</div>
              }
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-white">{cls.trainerName}</p>
                  <span className="badge-neon">Trainer</span>
                </div>
                <p className="text-gray-500 text-sm">{cls.trainerEmail}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="card p-6 sticky top-24">
              <div className="mb-6">
                <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Session Price</p>
                <p className="text-4xl font-black text-neon">${cls.price}<span className="text-gray-500 text-lg font-normal"> / class</span></p>
              </div>
              <button onClick={handleBookNow} disabled={bookingCheck?.booked}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-all mb-3 ${bookingCheck?.booked ? 'bg-dark-border2 text-gray-500 cursor-not-allowed' : 'bg-neon text-black hover:bg-neon-dark'}`}>
                {bookingCheck?.booked ? <><CheckCircle className="w-4 h-4" /> Already Booked</> : <><Zap className="w-4 h-4" /> Book Now</>}
              </button>
              <button onClick={() => favMutation.mutate()} disabled={favMutation.isPending}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm border transition-all ${favCheck?.isFavorite ? 'border-neon bg-neon/10 text-neon' : 'border-dark-border2 text-gray-400 hover:border-gray-500 hover:text-white'}`}>
                <Heart className={`w-4 h-4 ${favCheck?.isFavorite ? 'fill-neon text-neon' : ''}`} />
                {favCheck?.isFavorite ? 'Saved to Favorites' : 'Add to Favorites'}
              </button>
              <div className="mt-5 pt-5 border-t border-dark-border space-y-3">
                {[['Category', cls.category], ['Difficulty', cls.difficultyLevel], ['Duration', `${cls.duration} min`], ['Total Bookings', cls.bookingCount]].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm">
                    <span className="text-gray-500">{k}</span>
                    <span className="text-white font-medium capitalize">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
