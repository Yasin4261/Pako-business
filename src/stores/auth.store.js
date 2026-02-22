// Authentication Store - ViewModel Layer
// Handles state management and business logic for authentication

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService from '@/services/auth.service.js'

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
      
      // Handle different API response formats
      const authToken = response.token || response.accessToken || response.data?.token
      const userData = response.user || response.data?.user || { email: credentials.email }
      
      if (!authToken) {
        throw new Error('No token received from server')
      }
      
      token.value = authToken
      user.value = userData
      authService.setAuthData(authToken, userData)
      return true
    } catch (err) {
      console.error('Login error:', err)
      error.value = err.response?.data?.message || err.message || 'Login failed. Please try again.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function register(userData) {
    isLoading.value = true
    error.value = null

    try {
      await authService.register(userData)
      // Don't auto-login after registration, redirect to login page
      return true
    } catch (err) {
      error.value = err.response?.data?.message || 'Registration failed. Please try again.'
      return false
    } finally {
      isLoading.value = false
    }
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
    // Getters
    isAuthenticated,
    userName,
    // Actions
    login,
    register,
    logout,
    initializeAuth,
    clearError,
  }
})
