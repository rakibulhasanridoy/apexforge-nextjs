'use client'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Clock, Users, ArrowRight, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import axiosSecure from '@/lib/axios'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function FeaturedClasses() {
  const { data: classes = [], isLoading } = useQuery({
    queryKey: ['featured-classes'],
    queryFn: async () => (await axiosSecure.get('/api/classes/featured')).data,
  })

  if (isLoading) return <LoadingSpinner fullPage={false} />

  return (
    <section className="section bg-dark-bg">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-12"
        >
          <div className="text-left">
            <p className="text-neon text-xs font-bold tracking-widest uppercase mb-3">Featured Training</p>
            <h2 className="text-3xl md:text-4xl font-bold">
              High-Intensity Programs<br />
              <span className="text-neon">Engineered for Results</span>
            </h2>
          </div>
          <Link href="/classes" className="hidden md:flex items-center gap-1 text-sm text-neon hover:underline">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {classes.map((cls) => (
            <motion.div
              key={cls._id}
              variants={cardVariants}
              whileHover={{ y: -7, transition: { duration: 0.22, ease: 'easeOut' } }}
              className="card group hover:border-neon/30 transition-all duration-300"
            >
              <div className="relative overflow-hidden aspect-[4/3]">
                <img
                  src={cls.image}
                  alt={cls.className}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <span className="absolute top-3 left-3 badge-neon capitalize">{cls.category}</span>
                <span className="absolute bottom-3 right-3 text-xs font-bold text-white bg-black/60 px-2 py-1 rounded">
                  ${cls.price} / Session
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-white mb-1 text-lg">{cls.className}</h3>
                <p className="text-gray-500 text-sm mb-4">with {cls.trainerName}</p>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-neon" />{cls.duration} min
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-neon" />{cls.bookingCount} Booked
                  </span>
                </div>
                <Link href={`/classes/${cls._id}`} className="btn-neon w-full justify-center text-sm py-2.5">
                  Book Spot <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-8 md:hidden">
          <Link href="/classes" className="btn-outline">
            View All Classes <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
