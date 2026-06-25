'use client'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { ShieldCheck, ArrowLeft, Zap } from 'lucide-react'
import axiosSecure from '@/lib/axios'
import { useAuth } from '@/providers/AuthProvider'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import toast from 'react-hot-toast'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

const CARD_OPTIONS = {
  style: {
    base: { fontSize: '14px', color: '#ffffff', '::placeholder': { color: '#6b7280' }, backgroundColor: 'transparent' },
    invalid: { color: '#ef4444' },
  },
}

function CheckoutForm({ cls }) {
  const stripe = useStripe()
  const elements = useElements()
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true)
    try {
      const { data } = await axiosSecure.post('/api/payments/create-payment-intent', { amount: cls.price })
      const { error, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      })
      if (error) { toast.error(error.message); setLoading(false); return }
      if (paymentIntent.status === 'succeeded') {
        await axiosSecure.post('/api/bookings', {
          classId: cls._id, className: cls.className, trainerId: cls.trainerId,
          trainerName: cls.trainerName, userName: user?.name, price: cls.price,
          transactionId: paymentIntent.id, schedule: cls.schedule,
        })
        await axiosSecure.post('/api/payments/save-transaction', {
          classId: cls._id, className: cls.className, amount: cls.price, transactionId: paymentIntent.id,
        })
        toast.success('Payment successful!')
        router.push(`/payment/success?tid=${paymentIntent.id}&class=${encodeURIComponent(cls.className)}`)
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Payment failed. Please try again.')
    } finally { setLoading(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="label">Email Address</label>
        <input className="input" value={user?.email || ''} readOnly />
      </div>
      <div>
        <label className="label">Card Information</label>
        <div className="input cursor-text"><CardElement options={CARD_OPTIONS} /></div>
        <p className="text-xs text-gray-600 mt-1.5">Test card: 4242 4242 4242 4242 | Any future date | Any CVV</p>
      </div>
      <button type="submit" disabled={!stripe || loading} className="btn-neon w-full justify-center py-3.5 text-base font-bold">
        {loading ? 'Processing...' : <><Zap className="w-4 h-4" /> Pay Now ${cls.price}</>}
      </button>
      <p className="text-xs text-gray-600 text-center">By clicking Pay Now, you agree to ApexForge Terms of Service.</p>
    </form>
  )
}

export default function PaymentPage() {
  const { classId } = useParams()
  const router = useRouter()

  const { data: cls, isLoading } = useQuery({
    queryKey: ['class-payment', classId],
    queryFn: async () => (await axiosSecure.get(`/api/classes/${classId}`)).data,
  })

  if (isLoading) return <LoadingSpinner />
  if (!cls) return <div className="container py-20 text-center text-gray-500">Class not found.</div>

  return (
    <div className="min-h-screen bg-dark-bg py-12">
      <div className="container max-w-4xl">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Class
        </button>
        <h1 className="text-3xl font-black text-white mb-8">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card p-6">
            <h2 className="font-bold text-white mb-5">Order Summary</h2>
            <div className="flex items-center gap-4 p-4 bg-dark-card2 rounded-xl mb-5">
              <img src={cls.image} alt={cls.className} className="w-16 h-16 rounded-lg object-cover" />
              <div>
                <p className="font-bold text-white">{cls.className}</p>
                <p className="text-sm text-gray-500">Trainer: {cls.trainerName}</p>
                <p className="text-neon font-bold mt-1">${cls.price}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              {[['Subtotal', `$${cls.price}`], ['Processing Fee', '$0.00'], ['Total Due', `$${cls.price}`]].map(([k, v]) => (
                <div key={k} className={`flex justify-between ${k === 'Total Due' ? 'font-bold text-white border-t border-dark-border pt-2 mt-2' : 'text-gray-500'}`}>
                  <span>{k}</span><span>{v}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-5 text-xs text-gray-500">
              <ShieldCheck className="w-4 h-4 text-neon" /> Secure 256-bit SSL Encrypted Payment
            </div>
          </div>
          <div className="card p-6">
            <h2 className="font-bold text-white mb-2">Payment Details</h2>
            <p className="text-xs text-gray-500 mb-5">All transactions are secure and encrypted.</p>
            <Elements stripe={stripePromise}>
              <CheckoutForm cls={cls} />
            </Elements>
          </div>
        </div>
      </div>
    </div>
  )
}
