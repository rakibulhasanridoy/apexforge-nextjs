'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Search, Filter, Clock, Users, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import axiosSecure from '@/lib/axios'
import LoadingSpinner from '@/components/shared/LoadingSpinner'




const CATEGORIES = ['All', 'Yoga', 'HIIT', 'Cardio', 'Strength', 'Pilates', 'CrossFit', 'Boxing', 'Swimming']

export default function ClassesPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [category, setCategory] = useState('All')
  const { data, isLoading } = useQuery({
    queryKey: ['classes', page, search, category],
    queryFn: async () => (await axiosSecure.get('/api/classes', { params: { page, limit: 9, search, category } })).data,
  })




  const handleSearch = (e) => { e.preventDefault(); setSearch(searchInput); setPage(1) }
  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="bg-dark-card border-b border-dark-border py-14">
        <div className="container">
          <p className="text-neon text-xs font-bold tracking-widest uppercase mb-3">Fitness Classes</p>
          <h1 className="text-4xl md:text-5xl font-black mb-2">Level Up Your <span className="text-neon">Performance</span></h1>
          <p className="text-gray-500 mb-8">Browse our elite collection of high-intensity training sessions.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <select value={category} onChange={e => { setCategory(e.target.value); setPage(1) }} className="input w-full sm:w-52">
              {CATEGORIES.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
            </select>
            <form onSubmit={handleSearch} className="flex gap-2 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input value={searchInput} onChange={e => setSearchInput(e.target.value)} className="input pl-10" placeholder="Search class names..." />
              </div>
              <button type="submit" className="btn-neon px-5">Search</button>
          </form>
          </div>
       </div>
      </div>
      <div className="container py-12">
        {isLoading ? <LoadingSpinner fullPage={false} /> : (
          <>
            {data?.classes?.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <Filter className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No classes found. Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data?.classes?.map(cls => (
                  <div key={cls._id} className="card group hover:border-neon/30 transition-all hover:-translate-y-1 duration-300">
                    <div className="relative overflow-hidden aspect-[4/3]">
                      <img src={cls.image} alt={cls.className} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <span className="absolute top-3 left-3 badge-neon capitalize">{cls.category}</span>
                      <span className="absolute bottom-3 right-3 text-xs font-bold text-white bg-black/60 px-2 py-1 rounded">${cls.price} / Session</span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-white text-lg mb-1">{cls.className}</h3>
                      <p className="text-gray-500 text-sm mb-3">with {cls.trainerName}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-neon" />{cls.duration} min</span>
                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-neon" />{cls.bookingCount} booked</span>
                        <span className="badge-gray capitalize">{cls.difficultyLevel}</span>
                      </div>
                      <Link href={`/classes/${cls._id}`} className="btn-neon w-full justify-center text-sm py-2.5">
                        View Details <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
