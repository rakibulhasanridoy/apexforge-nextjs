export default function SectionTitle({ label, title, highlight, subtitle }) {
  return (
    <div className="text-center mb-12">
      {label && <p className="text-neon text-xs font-bold tracking-widest uppercase mb-3">{label}</p>}
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
        {title} {highlight && <span className="text-neon">{highlight}</span>}
      </h2>
      {subtitle && <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">{subtitle}</p>}
    </div>
  )
}
