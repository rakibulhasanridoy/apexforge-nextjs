/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
    domains: [
      'lh3.googleusercontent.com',
      'lh4.googleusercontent.com', 
      'lh5.googleusercontent.com',
      'lh6.googleusercontent.com',
      'i.ibb.co',
      'ibb.co',
    ],
  },
}
export default nextConfig