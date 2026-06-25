'use client'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Calendar, ExternalLink } from 'lucide-react'
import axiosSecure from '@/lib/axios'
import RoleGuard from '@/components/dashboard/RoleGuard'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

function BookedClassesContent() {
  const { data: bookings = [], isLoading } = useQuery({ queryKey: ['my-bookings'], queryFn: async () => (await axiosSecure.get('/api/bookings/my-bookings')).data })
  if (isLoading) return <LoadingSpinner fullPage={false} />
  return (
    <div>
      <h1 className="text-2xl font-black text-white mb-2">Booked Classes</h1>
      <p className="text-gray-500 text-sm mb-8">All classes you have successfully registered and paid for.</p>
      {bookings.length === 0 ? (
        <div className="card p-12 text-center">
          <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No classes booked yet.</p>
          <Link href="/classes" className="btn-neon text-sm">Browse Classes</Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-border">
                  {['Class Name', 'Trainer', 'Schedule', 'Price', 'Details'].map(h => (
                    <th key={h} className="text-left text-xs text-gray-500 uppercase tracking-wider px-5 py-3.5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b._id} className="table-row">
                    <td className="px-5 py-4 font-medium text-white">{b.className}</td>
                    <td className="px-5 py-4 text-gray-400">{b.trainerName}</td>
                    <td className="px-5 py-4 text-gray-400 text-xs">{b.schedule?.map((s, i) => <span key={i} className="block">{s.day} {s.time}</span>)}</td>
                    <td className="px-5 py-4 text-neon font-semibold">${b.price}</td>
                    <td className="px-5 py-4">
                      <Link href={`/classes/${b.classId}`} className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-neon transition-colors">
                        View <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
export default function BookedClassesPage() {
  return <RoleGuard roles={['user']}><BookedClassesContent /></RoleGuard>
}
