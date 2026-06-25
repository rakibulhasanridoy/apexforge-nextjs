'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, Zap } from 'lucide-react'
import { signUp } from '@/lib/auth'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const onSubmit = async ({ name, email, password, image }) => {
    setLoading(true)
    try {
      const { error } = await signUp.email({ name, email, password, image: image || '' })
      if (error) { toast.error(error.message || 'Registration failed'); return }
      toast.success('Account created! Welcome to ApexForge.')
      router.push('/')
    } catch { toast.error('Registration failed. Please try again.') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-neon rounded flex items-center justify-center"><Zap className="w-5 h-5 text-black" /></div>
            <span className="text-xl font-bold">Apex<span className="text-neon">Forge</span></span>
          </Link>
          <h1 className="text-2xl font-black text-white mb-1">Create Account</h1>
          <p className="text-gray-500 text-sm">Join thousands of athletes on ApexForge</p>
        </div>
        <div className="card p-7">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input {...register('name', { required: 'Name is required' })} className="input" placeholder="John Doe" />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="label">Email Address</label>
              <input {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
                className="input" placeholder="you@example.com" type="email" />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="label">Profile Image URL <span className="text-gray-600">(optional)</span></label>
              <input {...register('image')} className="input" placeholder="https://example.com/photo.jpg" />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Minimum 6 characters' },
                  pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])/, message: 'Must contain uppercase and lowercase letters' },
                })} className="input pr-10" placeholder="••••••••" type={showPass ? 'text' : 'password'} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
              <p className="text-xs text-gray-600 mt-1">Min 6 chars, one uppercase, one lowercase</p>
            </div>
            <button type="submit" disabled={loading} className="btn-neon w-full justify-center py-3 font-bold mt-2">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <Link href="/login" className="text-neon font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
