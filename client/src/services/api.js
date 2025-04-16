import axios from "axios"

// Create axios instance with base URL
const api = axios.create({
  baseURL: "https://ideaincubator-api.onrender.com//api", // Adjust this to your backend URL
})

// Add a request interceptor to include the auth token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token")
      // Optional: Redirect to login page
      // window.location.href = '/login';
    }
    return Promise.reject(error)
  },
)

export default api
