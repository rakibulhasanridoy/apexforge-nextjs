import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-dark-bg flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </div>
  )
}
