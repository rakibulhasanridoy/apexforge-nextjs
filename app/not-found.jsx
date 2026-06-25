import Link from 'next/link'
import { Home, Zap } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center text-center px-4">
      <div className="text-8xl md:text-9xl font-black text-neon/20 mb-4">404</div>
      <div className="w-14 h-14 bg-neon/10 rounded-full flex items-center justify-center mb-6">
        <Zap className="w-7 h-7 text-neon" />
      </div>
      <h1 className="text-2xl font-black text-white mb-3">Page Not Found</h1>
      <p className="text-gray-500 max-w-sm mb-8 text-sm">The page you are looking for does not exist or has been moved.</p>
      <Link href="/" className="btn-neon"><Home className="w-4 h-4" /> Back to Home</Link>
    </div>
  )
}
