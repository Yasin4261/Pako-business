// API Client Configuration - Model Layer
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8081/api/v1'

// Single Responsibility: Only handles HTTP client creation and configuration
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Request interceptor - adds auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    
    // Skip auth header for login and register endpoints
    const isAuthEndpoint = config.url?.includes('/auth/login') || config.url?.includes('/auth/register')
    
    if (token && !isAuthEndpoint) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('Request with token:', config.method?.toUpperCase(), config.url)
    } else if (!isAuthEndpoint) {
      console.warn('No token found for request:', config.method?.toUpperCase(), config.url)
    }
    
    return config
  },
  (error) => Promise.reject(error)
)

// Track if we're already showing session expired modal
let isSessionExpiredShown = false

// Response interceptor - handles errors globally
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status
    
    // Handle authentication errors (401 Unauthorized, 403 Forbidden for token issues)
    if ((status === 401 || status === 403) && !isSessionExpiredShown) {
      // Check if this is a login request - don't show session expired for login failures
      const isLoginRequest = error.config?.url?.includes('/auth/login')
      const isRegisterRequest = error.config?.url?.includes('/auth/register')
      
      if (!isLoginRequest && !isRegisterRequest) {
        isSessionExpiredShown = true
        
        // Dynamic import to avoid circular dependency
        const { useSessionStore } = await import('@/stores/session.store.js')
        const sessionStore = useSessionStore()
        
        // Determine the message based on error type
        let message = 'Oturumunuz sona erdi. Güvenliğiniz için tekrar giriş yapmanız gerekmektedir.'
        
        if (status === 401) {
          message = 'Oturumunuz sona erdi. Lütfen tekrar giriş yapın.'
        } else if (status === 403) {
          message = 'Erişim yetkiniz kalmadı veya oturumunuz sona erdi. Lütfen tekrar giriş yapın.'
        }
        
        // Show the session expired modal
        sessionStore.showSessionExpired(message)
        
        // Reset flag after modal is closed (give some time)
        setTimeout(() => {
          isSessionExpiredShown = false
        }, 1000)
      }
    }
    
    return Promise.reject(error)
  }
)

// Reset session expired flag (called after successful login)
export const resetSessionExpiredFlag = () => {
  isSessionExpiredShown = false
}

export default apiClient
