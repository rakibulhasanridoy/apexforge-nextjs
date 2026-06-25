'use client'
import Link from 'next/link'
import { Zap, Facebook, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const columnVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function Footer() {
  return (
    <footer className="bg-dark-card border-t border-dark-border">
      <div className="container py-14">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
        >
          {/* Brand column */}
          <motion.div variants={columnVariants}>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-neon rounded flex items-center justify-center">
                <Zap className="w-4 h-4 text-black" />
              </div>
              <span className="text-lg font-bold">Apex<span className="text-neon">Forge</span></span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-5">
              High-performance gym management. Engineered for athletes, designed for results.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: <Facebook className="w-4 h-4" />, href: 'https://www.facebook.com/rakibulhasan.ridoy.144/' },
                { icon: <Instagram className="w-4 h-4" />, href: 'https://www.instagram.com/rakibul_h_ridoy/' },
                { icon: <Youtube className="w-4 h-4" />, href: 'https://www.youtube.com/@LifeFitnessTraining' },
              ].map(({ icon, href }, i) => (
                <motion.a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3, scale: 1.1 }}
                  transition={{ duration: 0.18 }}
                  className="w-8 h-8 rounded-lg border border-dark-border2 flex items-center justify-center text-gray-500 hover:text-neon hover:border-neon/50 transition-colors"
                >
                  {icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={columnVariants}>
            <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4">Quick Links</p>
            <ul className="space-y-2.5">
              {[
                ['/', 'Home'],
                ['/classes', 'All Classes'],
                ['/forum', 'Community Forum'],
                ['/login', 'Login'],
                ['/register', 'Register'],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-gray-500 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div variants={columnVariants}>
            <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4">Company</p>
            <ul className="space-y-2.5">
              {[
                { name: 'About Us', href: 'https://medlineplus.gov/about/' },
                { name: 'Careers', href: 'https://www.indeed.com/career-advice/careers' },
                { name: 'Privacy Policy', href: 'https://hrtechprivacy.com/brands/indeed#privacypolicy' },
                { name: 'Terms of Service', href: 'https://www.fitness.com/page/terms-of-service' },
                { name: 'Support', href: 'https://www.ithacaymca.com/programs/fitness-support-services/' },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-500 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={columnVariants}>
            <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4">Contact</p>
            <ul className="space-y-3">
              {[
                { icon: <Mail className="w-4 h-4" />, text: 'rakibulhasanridoy1@gmail.com' },
                { icon: <Phone className="w-4 h-4" />, text: '+8801742847042' },
                { icon: <MapPin className="w-4 h-4" />, text: 'Manikdi, Dhaka City' },
              ].map(({ icon, text }) => (
                <li key={text} className="flex items-start gap-2.5 text-sm text-gray-500">
                  <span className="text-neon mt-0.5 shrink-0">{icon}</span>{text}
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-dark-border mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
        >
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} ApexForge. All rights reserved by RAKIBUL HASAN RIDOY
          </p>
          <p className="text-xs text-gray-600">Engineered for High Performance.</p>
        </motion.div>
      </div>
    </footer>
  )
}
