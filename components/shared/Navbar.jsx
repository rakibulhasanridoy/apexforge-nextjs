'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, Zap, Bell, ChevronDown, LogOut, LayoutDashboard } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/providers/AuthProvider'
import { signOut } from '@/lib/auth'
import axiosSecure from '@/lib/axios'
import toast from 'react-hot-toast'

function NavItem({ href, label, end }) {
  const pathname = usePathname()
  const isActive = end ? pathname === href : pathname.startsWith(href)
  return (
    <Link
      href={href}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        isActive ? 'text-neon bg-neon/5' : 'text-gray-400 hover:text-white hover:bg-white/5'
      }`}
    >
      {label}
    </Link>
  )
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)
  const { user, userProfile, isAuthenticated } = useAuth()
  const router = useRouter()
  const dropRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const dashboardLink = () => {
    if (!userProfile) return '/dashboard/overview'
    if (userProfile.role === 'admin') return '/dashboard/admin-overview'
    if (userProfile.role === 'trainer') return '/dashboard/trainer-overview'
    return '/dashboard/overview'
  }

  const handleLogout = async () => {
    try {
      await signOut()
      await axiosSecure.post('/api/jwt/logout')
      router.push('/')
      toast.success('Logged out successfully')
    } catch {
      toast.error('Logout failed')
    }
  }

  const navLinks = [
    { href: '/', label: 'Home', end: true },
    { href: '/classes', label: 'Classes', end: false },
    { href: '/forum', label: 'Forum', end: false },
  ]

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-dark-bg/80 backdrop-blur-xl border-b border-dark-border">
      <div className="container flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 bg-neon rounded flex items-center justify-center">
            <Zap className="w-4 h-4 text-black" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            Apex<span className="text-neon">Forge</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(l => <NavItem key={l.href} {...l} />)}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-dark-border2 text-gray-500 hover:text-white hover:border-gray-600 transition-colors">
                <Bell className="w-4 h-4" />
              </button>
              <div className="relative" ref={dropRef}>
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-dark-border2 hover:border-gray-600 transition-colors"
                >
                  {user?.image
                    ? <img src={user.image} alt="" className="w-6 h-6 rounded-full object-cover" />
                    : (
                      <div className="w-6 h-6 rounded-full bg-neon/20 flex items-center justify-center text-neon text-xs font-bold">
                        {user?.name?.[0]?.toUpperCase()}
                      </div>
                    )
                  }
                  <span className="text-sm text-gray-300 max-w-[100px] truncate hidden lg:block">
                    {user?.name}
                  </span>
                  <motion.span
                    animate={{ rotate: dropOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="inline-flex"
                  >
                    <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                  </motion.span>
                </button>

                <AnimatePresence>
                  {dropOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -8 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      className="absolute right-0 mt-2 w-52 glass-dark rounded-xl overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-white/5">
                        <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        {userProfile && (
                          <span className="badge-neon mt-1 inline-block capitalize">
                            {userProfile.role}
                          </span>
                        )}
                      </div>
                      <Link
                        href={dashboardLink()}
                        onClick={() => setDropOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors border-t border-white/5"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <Link href={dashboardLink()} className="btn-neon text-sm py-2">Dashboard</Link>
            </>
          ) : (
            <Link href="/login" className="btn-neon text-sm py-2">Login</Link>
          )}
        </div>

        <button
          className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={menuOpen ? 'close' : 'open'}
              initial={{ opacity: 0, rotate: -90, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.7 }}
              transition={{ duration: 0.18 }}
              className="inline-flex"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden border-t border-dark-border overflow-hidden glass-dark"
          >
            <div className="container py-4 space-y-1">
              {navLinks.map(l => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2.5 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  {l.label}
                </Link>
              ))}
              {isAuthenticated ? (
                <>
                  <Link
                    href={dashboardLink()}
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2.5 text-sm text-neon hover:bg-neon/5 rounded-lg transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/5 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2.5 text-sm text-neon hover:bg-neon/5 rounded-lg transition-colors"
                >
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
