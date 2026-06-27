/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http',  hostname: '**' },
    ],
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
        ],
      },
    ]
  },

  // This rewrite is the bridge between the frontend and the backend.
  // All /api/* requests (auth, JWT, classes, etc.) are forwarded here.
  // NEXT_PUBLIC_API_URL must be set to your backend Vercel URL in the
  // Vercel dashboard for this to work in production.
  async rewrites() {
    const apiURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
    return [
      {
        source: '/api/:path*',
        destination: `${apiURL}/api/:path*`,
      },
    ]
  },
}

export default nextConfig
