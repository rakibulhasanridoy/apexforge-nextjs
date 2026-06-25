export default function LoadingSpinner({ fullPage = true }) {
  if (!fullPage) return (
    <div className="flex items-center justify-center p-8">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 border-2 border-dark-border2 rounded-full" />
        <div className="absolute inset-0 border-2 border-t-neon rounded-full animate-spin" />
      </div>
    </div>
  )
  return (
    <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center gap-4">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 border-2 border-dark-border2 rounded-full" />
        <div className="absolute inset-0 border-2 border-t-neon rounded-full animate-spin" />
      </div>
      <span className="text-gray-500 text-sm tracking-widest">LOADING APEXFORGE</span>
    </div>
  )
}
