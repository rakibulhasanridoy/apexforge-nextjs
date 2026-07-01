'use client'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Zap, ArrowLeft } from 'lucide-react'
import { signIn } from '@/lib/auth'
import toast from 'react-hot-toast'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get('from') || '/'

  const onSubmit = async ({ email, password }) => {
    setLoading(true)
    try {
      const { error } = await signIn.email({ email, password })
      if (error) { toast.error(error.message || 'Invalid credentials'); return }
      toast.success('Welcome back!')
      router.push(from)
    } catch { toast.error('Login failed. Please try again.') }
    finally { setLoading(false) }
  }

  const handleGoogle = async () => {
    try {
      await signIn.social({ provider: 'google', callbackURL: `${window.location.origin}${from}` })
    } catch { toast.error('Google login failed.') }
  }

  return (
    <div className="min-h-screen flex">

      {/* Left — athletic split panel, hidden below lg so the form gets full width on mobile */}
      <div className="hidden lg:flex lg:w-[46%] relative overflow-hidden">
        <img
          src="https://i.ibb.co.com/737z0kz/vecteezy-handsome-young-man-working-out-in-the-gym-bodybuilding-33504866.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center scale-105"
          style={{ filter: 'blur(3px)' }}
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-dark-bg/90" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-neon/15 rounded-full blur-3xl" />

        <Link href="/" className="relative z-10 inline-flex items-center gap-2 m-10 w-fit text-gray-300 hover:text-white text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 my-auto px-12 py-10 max-w-xl"
        >
          <p className="text-neon text-sm font-bold tracking-widest uppercase mb-4">Performance Redefined</p>
          <h1 className="text-6xl xl:text-7xl font-black text-white leading-[0.95] mb-6">
            Forge your <span className="text-neon">peak</span>.
          </h1>
          <p className="text-gray-300 text-base leading-relaxed mb-10 max-w-sm">
            Every rep, every session, every result — tracked and trained with the platform built for athletes who don't settle.
          </p>
          <div className="flex items-center gap-10 pt-7 border-t border-white/10">
            <div><p className="text-3xl font-black text-white">12.4k</p><p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Athletes</p></div>
            <div><p className="text-3xl font-black text-white">200+</p><p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Trainers</p></div>
            <div><p className="text-3xl font-black text-white">98%</p><p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Satisfaction</p></div>
          </div>
        </motion.div>
      </div>

      {/* Right — the actual sign-in form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-dark-bg overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-sm"
        >
          {/* Logo — replaces what the navbar used to provide, also shown on mobile where the left panel is hidden */}
          <div className="flex items-center justify-between mb-10 lg:hidden">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-8 h-8 bg-neon rounded flex items-center justify-center"><Zap className="w-5 h-5 text-white" /></div>
              <span className="text-xl font-bold text-white">Apex<span className="text-neon">Forge</span></span>
            </Link>
          </div>
          <Link href="/" className="hidden lg:inline-flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-neon rounded flex items-center justify-center"><Zap className="w-5 h-5 text-white" /></div>
            <span className="text-xl font-bold text-white">Apex<span className="text-neon">Forge</span></span>
          </Link>

          <h2 className="text-2xl font-black text-white mb-1">Welcome back</h2>
          <p className="text-gray-500 text-sm mb-8">Sign in to continue your training journey</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">Email Address</label>
              <input {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
                className="input" placeholder="you@example.com" type="email" />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input {...register('password', { required: 'Password is required' })}
                  className="input pr-10" placeholder="••••••••" type={showPass ? 'text' : 'password'} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <button type="submit" disabled={loading} className="btn-neon w-full justify-center py-3 font-bold mt-2">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-dark-border" /></div>
            <div className="relative text-center"><span className="px-3 bg-dark-bg text-xs text-gray-500">OR</span></div>
          </div>

          <button onClick={handleGoogle} className="w-full flex items-center justify-center gap-3 py-3 rounded-lg border border-dark-border2 text-sm font-medium text-gray-300 hover:border-gray-500 hover:text-white transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>

          <p className="text-center text-sm text-gray-500 mt-8">
            Don't have an account?{' '}
            <Link href="/register" className="text-neon font-semibold hover:underline">Sign up</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LoginForm />
    </Suspense>
  )
}
