// Authentication Service - Model Layer
// Single Responsibility: Only handles auth-related API calls

import apiClient from './api.client.js'

export const authService = {
  /**
   * Login with email and password
   * @param {Object} credentials - { email, password }
   * @returns {Promise<Object>} Auth response with token and user
   */
  async login(credentials) {
    const { data } = await apiClient.post('/auth/login', credentials)
    return data
  },

  /**
   * Register a new business account
   * @param {Object} userData - { name, email, phone, password, address }
   * @returns {Promise<Object>} Auth response with token and user
   */
  async register(userData) {
    const { data } = await apiClient.post('/auth/register/business', userData)
    return data
  },

  /**
   * Logout - clear local storage
   */
  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!localStorage.getItem('token')
  },

  /**
   * Get stored token
   * @returns {string|null}
   */
  getToken() {
    return localStorage.getItem('token')
  },

  /**
   * Store auth data
   * @param {string} token
   * @param {Object} user
   */
  setAuthData(token, user) {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
  }
}

export default authService
