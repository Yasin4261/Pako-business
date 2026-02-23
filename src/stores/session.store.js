// Session Store - ViewModel Layer
// Single Responsibility: Manages session state and expiration handling

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export const useSessionStore = defineStore('session', () => {
  // State
  const isSessionExpired = ref(false)
  const sessionMessage = ref('')
  
  // Toast notification state
  const toast = ref({
    show: false,
    type: 'info',
    title: '',
    message: '',
    duration: 5000
  })

  // Actions
  
  /**
   * Show session expired modal
   * @param {string} message - Custom message to display
   */
  function showSessionExpired(message = 'Oturumunuz sona erdi. Güvenliğiniz için tekrar giriş yapmanız gerekmektedir.') {
    isSessionExpired.value = true
    sessionMessage.value = message
  }

  /**
   * Hide session expired modal
   */
  function hideSessionExpired() {
    isSessionExpired.value = false
    sessionMessage.value = ''
  }

  /**
   * Handle login redirect from session expired modal
   */
  function handleSessionLogin() {
    // Clear session state
    hideSessionExpired()
    
    // Clear auth data
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    
    // Redirect to login
    window.location.href = '/login'
  }

  /**
   * Show toast notification
   * @param {Object} options - Toast options
   */
  function showToast({ type = 'info', title = '', message, duration = 5000 }) {
    toast.value = {
      show: true,
      type,
      title,
      message,
      duration
    }

    // Auto-hide after duration
    if (duration > 0) {
      setTimeout(() => {
        hideToast()
      }, duration)
    }
  }

  /**
   * Hide toast notification
   */
  function hideToast() {
    toast.value.show = false
  }

  /**
   * Show success toast
   * @param {string} message - Message to display
   * @param {string} title - Optional title
   */
  function showSuccess(message, title = 'Başarılı') {
    showToast({ type: 'success', title, message })
  }

  /**
   * Show error toast
   * @param {string} message - Message to display
   * @param {string} title - Optional title
   */
  function showError(message, title = 'Hata') {
    showToast({ type: 'error', title, message })
  }

  /**
   * Show warning toast
   * @param {string} message - Message to display
   * @param {string} title - Optional title
   */
  function showWarning(message, title = 'Uyarı') {
    showToast({ type: 'warning', title, message })
  }

  /**
   * Show info toast
   * @param {string} message - Message to display
   * @param {string} title - Optional title
   */
  function showInfo(message, title = 'Bilgi') {
    showToast({ type: 'info', title, message })
  }

  return {
    // State
    isSessionExpired,
    sessionMessage,
    toast,
    
    // Actions
    showSessionExpired,
    hideSessionExpired,
    handleSessionLogin,
    showToast,
    hideToast,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
})
