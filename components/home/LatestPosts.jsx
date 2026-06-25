'use client'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { ArrowRight, ThumbsUp, Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import axiosSecure from '@/lib/axios'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function LatestPosts() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['latest-posts'],
    queryFn: async () => (await axiosSecure.get('/api/forum/latest')).data,
  })

  if (isLoading) return <LoadingSpinner fullPage={false} />

  return (
    <section className="section bg-dark-card">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-neon text-xs font-bold tracking-widest uppercase mb-3">Community Buzz</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Latest from the <span className="text-neon">Community</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm">
            Tips, insights, and stories from our top trainers and athletes.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {posts.slice(0, 3).map((post) => (
            <motion.div
              key={post._id}
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.22, ease: 'easeOut' } }}
              className="group border border-dark-border rounded-xl overflow-hidden hover:border-neon/30 transition-all bg-dark-bg"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <span className="badge-neon capitalize mb-3 inline-block">{post.authorRole}</span>
                <h3 className="font-bold text-white text-base mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-gray-500 text-sm line-clamp-2 mb-4">{post.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3" />{post.likes?.length || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />{post.views || 0}
                    </span>
                  </div>
                  <Link href="/forum" className="text-neon text-xs font-semibold hover:underline flex items-center gap-1">
                    Read More <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link href="/forum" className="btn-outline">
            Explore Community <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
