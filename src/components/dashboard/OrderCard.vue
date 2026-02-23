<script setup>
// OrderCard - Individual Order Card Component
// Single Responsibility: Display single order information from API

import { formatPhoneDisplay } from '@/composables/usePhoneFormat'

defineProps({
  order: {
    type: Object,
    required: true
  }
})

defineEmits(['view-details'])

// Status config matching API response (UPPERCASE)
const statusConfig = {
  PENDING: {
    label: 'Bekleyen',
    color: 'bg-yellow-100 text-yellow-700',
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  ACCEPTED: {
    label: 'Kabul Edildi',
    color: 'bg-blue-100 text-blue-700',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  PREPARING: {
    label: 'Hazırlanıyor',
    color: 'bg-blue-100 text-blue-700',
    icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z'
  },
  READY: {
    label: 'Hazır',
    color: 'bg-purple-100 text-purple-700',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  COURIER_ASSIGNED: {
    label: 'Kurye Atandı',
    color: 'bg-indigo-100 text-indigo-700',
    icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
  },
  PICKED_UP: {
    label: 'Alındı',
    color: 'bg-indigo-100 text-indigo-700',
    icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4'
  },
  IN_TRANSIT: {
    label: 'Yolda',
    color: 'bg-orange-100 text-orange-700',
    icon: 'M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0'
  },
  DELIVERED: {
    label: 'Teslim Edildi',
    color: 'bg-green-100 text-green-700',
    icon: 'M5 13l4 4L19 7'
  },
  CANCELLED: {
    label: 'İptal Edildi',
    color: 'bg-red-100 text-red-700',
    icon: 'M6 18L18 6M6 6l12 12'
  }
}

// Priority config
const priorityConfig = {
  LOW: { label: 'Düşük', color: 'bg-gray-100 text-gray-600' },
  NORMAL: { label: 'Normal', color: 'bg-blue-100 text-blue-600' },
  HIGH: { label: 'Yüksek', color: 'bg-orange-100 text-orange-600' },
  URGENT: { label: 'Acil', color: 'bg-red-100 text-red-600' }
}

function getStatusConfig(status) {
  return statusConfig[status] || statusConfig.PENDING
}

function getPriorityConfig(priority) {
  return priorityConfig[priority] || priorityConfig.NORMAL
}

function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diff = Math.floor((now - date) / 1000 / 60) // minutes

  if (diff < 1) return 'Az önce'
  if (diff < 60) return `${diff} dk önce`
  if (diff < 1440) return `${Math.floor(diff / 60)} saat önce`
  return date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
    <!-- Header -->
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2">
        <span class="text-sm font-semibold text-gray-900">#{{ order.orderNumber }}</span>
        <span
          v-if="order.priority && order.priority !== 'NORMAL'"
          :class="['px-2 py-0.5 rounded-full text-xs font-medium', getPriorityConfig(order.priority).color]"
        >
          {{ getPriorityConfig(order.priority).label }}
        </span>
      </div>
      <span
        :class="[
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
          getStatusConfig(order.status).color
        ]"
      >
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getStatusConfig(order.status).icon" />
        </svg>
        {{ getStatusConfig(order.status).label }}
      </span>
    </div>

    <!-- Customer Info -->
    <div class="flex items-center gap-3 mb-3">
      <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-medium">
        {{ order.endCustomerName?.charAt(0)?.toUpperCase() || 'M' }}
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-gray-900 truncate">{{ order.endCustomerName }}</p>
        <p class="text-xs text-gray-500 truncate">{{ formatPhoneDisplay(order.endCustomerPhone) }}</p>
      </div>
    </div>

    <!-- Addresses -->
    <div class="space-y-2 mb-3">
      <!-- Pickup Address -->
      <div class="flex items-start gap-2">
        <div class="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg class="w-3 h-3 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
        </div>
        <p class="text-xs text-gray-600 line-clamp-1 flex-1">{{ order.pickupAddress }}</p>
      </div>
      <!-- Delivery Address -->
      <div class="flex items-start gap-2">
        <div class="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg class="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
        </div>
        <p class="text-xs text-gray-600 line-clamp-1 flex-1">{{ order.deliveryAddress }}</p>
      </div>
    </div>

    <!-- Package Info -->
    <div v-if="order.packageDescription" class="mb-3">
      <p class="text-xs text-gray-500 mb-1">Paket:</p>
      <p class="text-sm text-gray-700 line-clamp-1">{{ order.packageDescription }}</p>
    </div>

    <!-- Courier Info (if assigned) -->
    <div v-if="order.courierName" class="mb-3 p-2 bg-indigo-50 rounded-lg">
      <div class="flex items-center gap-2">
        <div class="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
          {{ order.courierName?.charAt(0)?.toUpperCase() }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-medium text-indigo-900 truncate">{{ order.courierName }}</p>
          <p class="text-xs text-indigo-600">{{ formatPhoneDisplay(order.courierPhone) }}</p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-between pt-3 border-t border-gray-100">
      <div>
        <p class="text-lg font-bold text-gray-900">₺{{ order.deliveryFee?.toFixed(2) }}</p>
        <p class="text-xs text-gray-500">{{ formatDate(order.createdAt) }}</p>
      </div>
      <button
        @click="$emit('view-details', order)"
        class="px-3 py-2 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
      >
        Detay
      </button>
    </div>
  </div>
</template>
