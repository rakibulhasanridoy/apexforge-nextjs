import axios from 'axios'

const baseURL = typeof window !== 'undefined'
  ? window.location.origin
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000')

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
