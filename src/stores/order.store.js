// Order Store - ViewModel Layer
// Single Responsibility: Order state management and business logic

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import orderService from '@/services/order.service.js'

export const useOrderStore = defineStore('order', () => {
  // State
  const orders = ref([])
  const currentOrder = ref(null)
  const isLoading = ref(false)
  const error = ref(null)
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0
  })

  // Getters - Status values are UPPERCASE from API
  const pendingOrders = computed(() => orders.value.filter(o => o.status === 'PENDING'))
  const activeOrders = computed(() => orders.value.filter(o => 
    ['PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'COURIER_ASSIGNED', 'PICKED_UP', 'IN_TRANSIT'].includes(o.status)
  ))
  const completedOrders = computed(() => orders.value.filter(o => o.status === 'DELIVERED'))

  // Actions
  async function createOrder(orderData) {
    isLoading.value = true
    error.value = null

    try {
      console.log('Creating order with data:', JSON.stringify(orderData, null, 2))
      const response = await orderService.createOrder(orderData)
      console.log('Create order response:', response)
      // Add new order to list
      if (response.data) {
        orders.value.unshift(response.data)
      }
      return { success: true, data: response.data }
    } catch (err) {
      console.error('Create order error:', err)
      console.error('Error response data:', err.response?.data)
      // Log validation errors in detail
      if (err.response?.data?.validationErrors?.length > 0) {
        console.error('Validation errors:', err.response.data.validationErrors)
      }
      error.value = err.response?.data?.message || 'Sipariş oluşturulamadı'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  async function fetchOrders(params = {}) {
    isLoading.value = true
    error.value = null

    try {
      const response = await orderService.getOrders(params)
      orders.value = response.data || response || []
      if (response.pagination) {
        pagination.value = response.pagination
      }
      return true
    } catch (err) {
      console.error('Fetch orders error:', err)
      error.value = err.response?.data?.message || 'Failed to fetch orders'
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function fetchOrderById(orderId) {
    isLoading.value = true
    error.value = null

    try {
      const response = await orderService.getOrderById(orderId)
      currentOrder.value = response.data || response
      return true
    } catch (err) {
      console.error('Fetch order error:', err)
      error.value = err.response?.data?.message || 'Failed to fetch order'
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function updateOrderStatus(orderId, status) {
    isLoading.value = true
    error.value = null

    try {
      console.log('Updating order status:', { orderId, status })
      const response = await orderService.updateOrderStatus(orderId, status)
      console.log('Update status response:', response)
      // Update in local list - use orderId from API
      const index = orders.value.findIndex(o => o.orderId === orderId)
      if (index !== -1) {
        orders.value[index] = { ...orders.value[index], status }
      }
      return { success: true, data: response.data }
    } catch (err) {
      console.error('Update order status error:', err)
      console.error('Error response:', err.response?.data)
      console.error('Error status:', err.response?.status)
      error.value = err.response?.data?.message || 'Failed to update order status'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  async function updateOrder(orderId, orderData) {
    isLoading.value = true
    error.value = null

    try {
      const response = await orderService.updateOrder(orderId, orderData)
      // Update in local list
      const index = orders.value.findIndex(o => o.orderId === orderId)
      if (index !== -1) {
        orders.value[index] = { ...orders.value[index], ...response.data }
      }
      return { success: true, data: response.data }
    } catch (err) {
      console.error('Update order error:', err)
      error.value = err.response?.data?.message || 'Sipariş güncellenemedi'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  async function cancelOrder(orderId, reason = '') {
    isLoading.value = true
    error.value = null

    try {
      const response = await orderService.cancelOrder(orderId, reason)
      // Update in local list - use orderId from API, status is UPPERCASE
      const index = orders.value.findIndex(o => o.orderId === orderId)
      if (index !== -1) {
        orders.value[index] = { ...orders.value[index], status: 'CANCELLED' }
      }
      return { success: true, data: response.data }
    } catch (err) {
      console.error('Cancel order error:', err)
      error.value = err.response?.data?.message || 'Failed to cancel order'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    orders,
    currentOrder,
    isLoading,
    error,
    pagination,
    // Getters
    pendingOrders,
    activeOrders,
    completedOrders,
    // Actions
    createOrder,
    fetchOrders,
    fetchOrderById,
    updateOrderStatus,
    updateOrder,
    cancelOrder,
    clearError
  }
})
