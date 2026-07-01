'use client'
import { motion } from 'framer-motion'
import { Zap, Clock, Users, ShieldCheck, TrendingUp, Award } from 'lucide-react'

const features = [
  { icon: <Zap />, title: 'Expert Trainers', desc: 'Certified professionals dedicated to pushing your physiological limits through science-backed methodologies.' },
  { icon: <Clock />, title: 'Flexible Schedules', desc: 'Our platform operates 24/7 with a class roster that adapts to the high-performance lifestyles of our members.' },
  { icon: <Users />, title: 'Community Support', desc: 'Join a tribe of disciplined individuals who foster an environment of accountability and mutual excellence.' },
  { icon: <ShieldCheck />, title: 'Safe Environment', desc: 'All classes follow strict safety protocols and are designed for gradual, sustainable performance gains.' },
  { icon: <TrendingUp />, title: 'Progress Tracking', desc: 'Monitor your fitness journey with detailed booking history and performance analytics in your dashboard.' },
  { icon: <Award />, title: 'Certified Programs', desc: 'Every program is curated and approved to ensure it meets the highest standards in athletic training.' },
]

export default function WhyChooseUs() {
  return (
    <section className="section bg-dark-bg">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-neon text-xs font-bold tracking-widest uppercase mb-3">Why ApexForge</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Built for <span className="text-neon">Champions</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm">
            Everything you need to forge your best self, in one powerful platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              viewport={{ once: true }}
              whileHover={{ y: -6, scale: 1.015, transition: { duration: 0.2, ease: 'easeOut' } }}
              // shimmer-sweep 
              className="relative p-6 rounded-xl glass-card hover:glass-neon transition-all duration-300 group cursor-default overflow-hidden shimmer-sweep"
            >
              <motion.div
                whileHover={{ rotate: [0, -8, 8, 0], transition: { duration: 0.4 } }}
                className="relative z-10 w-10 h-10 rounded-lg bg-neon/10 flex items-center justify-center text-neon mb-4 group-hover:bg-neon/20 transition-colors"
              >
                {icon}
              </motion.div>
              <h3 className="relative z-10 font-bold text-white mb-2">{title}</h3>
              <p className="relative z-10 text-gray-500 text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
