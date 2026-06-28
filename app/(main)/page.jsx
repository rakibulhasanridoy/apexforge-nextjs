import Banner from '@/components/home/Banner'
import WhyChooseUs from '@/components/home/WhyChooseUs'
import FeaturedClasses from '@/components/home/FeaturedClasses'
import LatestPosts from '@/components/home/LatestPosts'
import Testimonials from '@/components/home/Testimonials'
export const metadata = {
  title: 'ApexForge | Home',
  description: 'Transform your body and elevate your life with ApexForge fitness platform.',
}




export default function HomePage() {
  return (
    <>
      <Banner />
      <WhyChooseUs />
      <FeaturedClasses />
      <LatestPosts />
      <Testimonials />
    </>
  )
}
