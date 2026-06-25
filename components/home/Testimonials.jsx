'use client'
import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  { name: 'Sarah M.', role: 'Elite Athlete', text: 'ApexForge completely transformed my training. The trainers are world-class and the platform is seamless.', rating: 5, avatar: 'SM' },
  { name: 'James K.', role: 'Powerlifter', text: 'The booking system is incredible. I can plan my entire week in minutes and the class variety is unmatched.', rating: 5, avatar: 'JK' },
  { name: 'Priya R.', role: 'Yoga Instructor', text: 'As a trainer, managing my classes has never been easier. The dashboard gives me full control over my schedule.', rating: 5, avatar: 'PR' },
  { name: 'Marcus T.', role: 'CrossFit Enthusiast', text: 'The community forum is a goldmine of knowledge. I have learned more here than anywhere else online.', rating: 5, avatar: 'MT' },
]

export default function Testimonials() {
  return (
    <section className="section bg-dark-card">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-neon text-xs font-bold tracking-widest uppercase mb-3">Testimonials</p>
          <h2 className="text-3xl md:text-4xl font-bold">
            What Our <span className="text-neon">Athletes</span> Say
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map(({ name, role, text, rating, avatar }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, transition: { duration: 0.22, ease: 'easeOut' } }}
              className="p-6 rounded-xl glass-card hover:glass-neon transition-all duration-300 group relative overflow-hidden"
            >
              {/* Subtle neon glow in corner */}
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-neon/5 rounded-full blur-2xl pointer-events-none group-hover:bg-neon/10 transition-colors duration-500" />

              <Quote className="w-6 h-6 text-neon/30 mb-3" />

              <div className="flex gap-1 mb-4">
                {Array(rating).fill(0).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-neon text-neon" />
                ))}
              </div>

              <p className="text-gray-300 text-sm leading-relaxed mb-5 italic">"{text}"</p>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-neon/20 flex items-center justify-center text-neon text-xs font-bold shrink-0 ring-1 ring-neon/20">
                  {avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{name}</p>
                  <p className="text-xs text-gray-500">{role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
