'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap, LayoutDashboard, Calendar, Heart, UserPlus, PlusCircle,
  List, FileText, Users, ClipboardList, Shield, Dumbbell,
  CreditCard, MessageSquare, LogOut, Menu, X
} from 'lucide-react'
import { useAuth } from '@/providers/AuthProvider'
import { signOut } from '@/lib/auth'
import axiosSecure from '@/lib/axios'
import toast from 'react-hot-toast'

const userLinks = [
  { href: '/dashboard/overview', icon: <LayoutDashboard className="w-4 h-4" />, label: 'Overview' },
  { href: '/dashboard/booked-classes', icon: <Calendar className="w-4 h-4" />, label: 'Booked Classes' },
  { href: '/dashboard/favorites', icon: <Heart className="w-4 h-4" />, label: 'Favorites' },
  { href: '/dashboard/apply-trainer', icon: <UserPlus className="w-4 h-4" />, label: 'Apply as Trainer' },
]
const trainerLinks = [
  { href: '/dashboard/trainer-overview', icon: <LayoutDashboard className="w-4 h-4" />, label: 'Overview' },
  { href: '/dashboard/add-class', icon: <PlusCircle className="w-4 h-4" />, label: 'Add Class' },
  { href: '/dashboard/my-classes', icon: <Dumbbell className="w-4 h-4" />, label: 'My Classes' },
  { href: '/dashboard/add-post', icon: <FileText className="w-4 h-4" />, label: 'Add Forum Post' },
  { href: '/dashboard/my-posts', icon: <List className="w-4 h-4" />, label: 'My Posts' },
]
const adminLinks = [
  { href: '/dashboard/admin-overview', icon: <LayoutDashboard className="w-4 h-4" />, label: 'Overview' },
  { href: '/dashboard/manage-users', icon: <Users className="w-4 h-4" />, label: 'Manage Users' },
  { href: '/dashboard/applied-trainers', icon: <ClipboardList className="w-4 h-4" />, label: 'Applications' },
  { href: '/dashboard/manage-trainers', icon: <Shield className="w-4 h-4" />, label: 'Manage Trainers' },
  { href: '/dashboard/manage-classes', icon: <Dumbbell className="w-4 h-4" />, label: 'Manage Classes' },
  { href: '/dashboard/admin-add-post', icon: <FileText className="w-4 h-4" />, label: 'Add Forum Post' },
  { href: '/dashboard/manage-forum', icon: <MessageSquare className="w-4 h-4" />, label: 'Manage Forum' },
  { href: '/dashboard/transactions', icon: <CreditCard className="w-4 h-4" />, label: 'Transactions' },
]

function SidebarContent({ onLinkClick }) {
  const { user, userProfile } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  const links = userProfile?.role === 'admin'
    ? adminLinks
    : userProfile?.role === 'trainer'
    ? trainerLinks
    : userLinks

  const roleLabel = userProfile?.role
    ? userProfile.role.charAt(0).toUpperCase() + userProfile.role.slice(1)
    : ''
  const roleColor =
    userProfile?.role === 'admin'
      ? 'text-red-400'
      : userProfile?.role === 'trainer'
      ? 'text-blue-400'
      : 'text-neon'

  const handleLogout = async () => {
    try {
      await signOut()
      await axiosSecure.post('/api/jwt/logout')
      router.push('/')
      toast.success('Logged out')
    } catch {
      toast.error('Logout failed')
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-dark-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-neon rounded flex items-center justify-center">
            <Zap className="w-4 h-4 text-black" />
          </div>
          <span className="text-base font-bold">Apex<span className="text-neon">Forge</span></span>
        </Link>
        <p className="text-xs text-gray-600 mt-0.5 tracking-wider uppercase">Management</p>
      </div>

      <div className="p-4 border-b border-dark-border">
        <div className="flex items-center gap-3">
          {user?.image
            ? <img src={user.image} alt="" className="w-9 h-9 rounded-full object-cover border border-dark-border2" />
            : (
              <div className="w-9 h-9 rounded-full bg-neon/20 flex items-center justify-center text-neon font-bold text-sm">
                {user?.name?.[0]?.toUpperCase()}
              </div>
            )
          }
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
            <p className={`text-xs font-medium ${roleColor}`}>{roleLabel}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 overflow-y-auto">
        <p className="text-xs text-gray-600 uppercase tracking-widest px-3 mb-2 mt-1">
          {roleLabel} Menu
        </p>
        {links.map(l => {
          const isActive = pathname === l.href
          return (
            <Link
              key={l.href}
              href={l.href}
              onClick={onLinkClick}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium mb-0.5 transition-colors ${
                isActive
                  ? 'bg-neon/10 text-neon border border-neon/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {l.icon}{l.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-dark-border">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </div>
  )
}

export default function DashboardSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:w-60 lg:flex lg:flex-col bg-dark-card border-r border-dark-border z-40">
        <SidebarContent />
      </div>

      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3.5 left-4 z-50 w-8 h-8 flex items-center justify-center rounded-lg bg-dark-card border border-dark-border text-gray-400 hover:text-white"
      >
        <Menu className="w-4 h-4" />
      </button>

      {/* Mobile drawer with AnimatePresence */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              key="drawer"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="fixed inset-y-0 left-0 w-64 bg-dark-card border-r border-dark-border z-50 lg:hidden flex flex-col"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <SidebarContent onLinkClick={() => setMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
