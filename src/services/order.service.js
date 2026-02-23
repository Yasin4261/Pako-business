// Order Service - Model Layer
// Single Responsibility: Only handles order-related API calls

import apiClient from './api.client.js'

export const orderService = {
  /**
   * Create a new order
   * @param {Object} orderData - Order details
   * @returns {Promise<Object>} Created order
   */
  async createOrder(orderData) {
    const { data } = await apiClient.post('/business/orders', orderData)
    return data
  },

  /**
   * Get all orders
   * @param {Object} params - Query params (status, page, limit)
   * @returns {Promise<Object>} Orders list
   */
  async getOrders(params = {}) {
    const { data } = await apiClient.get('/business/orders', { params })
    return data
  },

  /**
   * Get single order by ID
   * @param {string} orderId - Order ID
   * @returns {Promise<Object>} Order details
   */
  async getOrderById(orderId) {
    const { data } = await apiClient.get(`/business/orders/${orderId}`)
    return data
  },

  /**
   * Update order status
   * @param {string} orderId - Order ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Updated order
   */
  async updateOrderStatus(orderId, status) {
    const { data } = await apiClient.patch(`/business/orders/${orderId}/status`, { status })
    return data
  },

  /**
   * Update order details
   * @param {string} orderId - Order ID
   * @param {Object} orderData - Updated order data
   * @returns {Promise<Object>} Updated order
   */
  async updateOrder(orderId, orderData) {
    const { data } = await apiClient.put(`/business/orders/${orderId}`, orderData)
    return data
  },

  /**
   * Cancel order
   * @param {string} orderId - Order ID
   * @param {string} reason - Cancellation reason (optional)
   * @returns {Promise<Object>} Cancelled order
   */
  async cancelOrder(orderId, reason = '') {
    const url = reason 
      ? `/business/orders/${orderId}/cancel?reason=${encodeURIComponent(reason)}`
      : `/business/orders/${orderId}/cancel`
    const { data } = await apiClient.post(url)
    return data
  }
}

export default orderService
