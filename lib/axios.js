import axios from 'axios'

// All API calls go through the Next.js rewrite proxy (/api/* → backend).
// Use window.location.origin in browser so requests hit the same origin
// and are automatically proxied. In SSR, use the frontend URL env var.
const baseURL =
  typeof window !== 'undefined'
    ? window.location.origin
    : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

const axiosSecure = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 15000,
})

axiosSecure.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout')
    }
    return Promise.reject(error)
  }
)

export default axiosSecure
