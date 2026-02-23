// Authentication Store - ViewModel Layer
// Handles state management and business logic for authentication

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService from '@/services/auth.service.js'
import { resetSessionExpiredFlag } from '@/services/api.client.js'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const userName = computed(() => user.value?.name ?? '')

  // Actions
  async function login(credentials) {
    isLoading.value = true
    error.value = null

    try {
      const response = await authService.login(credentials)
      console.log('Login response:', response)
      
      // Backend returns: { code: 200, data: { token, userId, email, name, userType, status }, message }
      const authToken = response.data?.token || response.token
      const userData = response.data ? {
        userId: response.data.userId,
        email: response.data.email,
        name: response.data.name,
        userType: response.data.userType,
        status: response.data.status
      } : { email: credentials.email }
      
      if (!authToken) {
        console.error('No token found in response:', response)
        throw new Error('No token received from server')
      }
      
      token.value = authToken
      user.value = userData
      authService.setAuthData(authToken, userData)
      
      // Reset session expired flag after successful login
      resetSessionExpiredFlag()
      
      return true
    } catch (err) {
      console.error('Login error:', err)
      
      // User-friendly error messages in Turkish
      if (err.response?.status === 401) {
        error.value = 'Giriş başarısız. Hesabınız onay bekliyor olabilir veya bilgileriniz hatalı.'
      } else if (err.response?.status === 404) {
        error.value = 'Kullanıcı bulunamadı. Lütfen önce kayıt olun.'
      } else if (!err.response) {
        error.value = 'Sunucuya bağlanılamıyor. Lütfen sunucunun çalıştığından emin olun.'
      } else {
        error.value = err.response?.data?.message || err.message || 'Giriş başarısız. Lütfen tekrar deneyin.'
      }
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Store success message for displaying after redirect
  const successMessage = ref(null)

  async function register(userData) {
    isLoading.value = true
    error.value = null

    try {
      const response = await authService.register(userData)
      // Store the success message from backend
      successMessage.value = response.message || 'Kayıt başarılı!'
      return true
    } catch (err) {
      error.value = err.response?.data?.message || 'Kayıt başarısız. Lütfen tekrar deneyin.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  function clearSuccessMessage() {
    successMessage.value = null
  }

  function logout() {
    authService.logout()
    token.value = null
    user.value = null
  }

  function initializeAuth() {
    try {
      const storedToken = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')
      
      if (storedToken && storedUser) {
        token.value = storedToken
        user.value = JSON.parse(storedUser)
      }
    } catch (error) {
      // Clear corrupted data from localStorage
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      token.value = null
      user.value = null
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    user,
    token,
    isLoading,
    error,
    successMessage,
    // Getters
    isAuthenticated,
    userName,
    // Actions
    login,
    register,
    logout,
    initializeAuth,
    clearError,
    clearSuccessMessage,
  }
})
