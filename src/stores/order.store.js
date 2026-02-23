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
      const response = await orderService.createOrder(orderData)
      // Add new order to list
      if (response.data) {
        orders.value.unshift(response.data)
      }
      return { success: true, data: response.data }
    } catch (err) {
      console.error('Create order error:', err)
      error.value = err.response?.data?.message || 'Failed to create order'
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
      const response = await orderService.updateOrderStatus(orderId, status)
      // Update in local list - use orderId from API
      const index = orders.value.findIndex(o => o.orderId === orderId)
      if (index !== -1) {
        orders.value[index] = { ...orders.value[index], status }
      }
      return { success: true, data: response.data }
    } catch (err) {
      console.error('Update order status error:', err)
      error.value = err.response?.data?.message || 'Failed to update order status'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  async function cancelOrder(orderId, reason) {
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
    cancelOrder,
    clearError
  }
})
