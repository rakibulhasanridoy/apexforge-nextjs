'use client'
import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, ArrowRight, LayoutDashboard } from 'lucide-react'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

function SuccessContent() {
  const searchParams = useSearchParams()
  const tid = searchParams.get('tid')
  const className = searchParams.get('class')

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="w-20 h-20 bg-neon/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-neon" />
        </div>
        <h1 className="text-3xl font-black text-white mb-3">Booking Confirmed!</h1>
        <p className="text-gray-500 mb-2">
          Your spot in <span className="text-white font-semibold">{className ? decodeURIComponent(className) : 'the class'}</span> has been secured.
        </p>
        {tid && <p className="text-xs text-gray-600 mb-8 font-mono">Transaction ID: {tid}</p>}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dashboard/booked-classes" className="btn-neon justify-center">
            <LayoutDashboard className="w-4 h-4" /> My Bookings
          </Link>
          <Link href="/classes" className="btn-ghost justify-center">
            Browse More <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SuccessContent />
    </Suspense>
  )
}
