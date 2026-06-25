'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Play, ChevronDown } from 'lucide-react'

const stats = [
  { value: '12.4k', label: 'Active Athletes' },
  { value: '200+', label: 'Expert Trainers' },
  { value: '98%', label: 'Satisfaction Rate' },
]

export default function Banner() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-dark-bg">
      {/* Hero Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://i.ibb.co.com/737z0kz/vecteezy-handsome-young-man-working-out-in-the-gym-bodybuilding-33504866.jpg"
          alt="Hero Background"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/75" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/60 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent" />
      </div>

      {/* Neon glow */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-neon/8 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="container relative z-10 py-20">
        <div className="max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-neon uppercase border border-neon/30 bg-neon/5 px-3 py-1.5 rounded mb-6">
              <span className="w-1.5 h-1.5 bg-neon rounded-full animate-pulse" /> Performance Redefined
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-black leading-none mb-6">
            Transform Your <span className="text-neon">Body</span>,<br />
            Elevate Your <span className="text-neon">Life</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-300 text-lg max-w-xl leading-relaxed mb-10">
            ApexForge combines scientific training methodologies with elite coaching to unlock your peak physical potential. Every rep. Every session. Every result.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4 mb-16">
            <Link href="/classes" className="btn-neon px-7 py-3 text-base font-bold">
              Explore Classes <ArrowRight className="w-4 h-4" />
            </Link>
            <button className="btn-ghost px-7 py-3 text-base">
              <Play className="w-4 h-4" /> Watch Demo
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }}
            className="flex items-center gap-8 pt-8 border-t border-white/10">
            {stats.map(({ value, label }) => (
              <div key={label}>
                <p className="text-2xl font-black text-neon">{value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <motion.div
        animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-500 z-10">
        <ChevronDown className="w-5 h-5" />
      </motion.div>
    </section>
  )
}