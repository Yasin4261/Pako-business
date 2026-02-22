<script setup>
// OrderCard - Individual Order Card Component
// Single Responsibility: Display single order information

defineProps({
  order: {
    type: Object,
    required: true
  }
})

defineEmits(['view-details'])

const statusConfig = {
  pending: {
    label: 'Bekleyen',
    color: 'bg-yellow-100 text-yellow-700',
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  preparing: {
    label: 'Hazırlanıyor',
    color: 'bg-blue-100 text-blue-700',
    icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z'
  },
  ready: {
    label: 'Hazır',
    color: 'bg-purple-100 text-purple-700',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  in_transit: {
    label: 'Yolda',
    color: 'bg-indigo-100 text-indigo-700',
    icon: 'M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0'
  },
  delivered: {
    label: 'Teslim Edildi',
    color: 'bg-green-100 text-green-700',
    icon: 'M5 13l4 4L19 7'
  }
}

function getStatusConfig(status) {
  return statusConfig[status] || statusConfig.pending
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
    <!-- Header -->
    <div class="flex items-center justify-between mb-3">
      <span class="text-sm font-semibold text-gray-900">#{{ order.orderNumber }}</span>
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
        {{ order.customerName?.charAt(0) || 'M' }}
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-gray-900 truncate">{{ order.customerName }}</p>
        <p class="text-xs text-gray-500 truncate">{{ order.address }}</p>
      </div>
    </div>

    <!-- Items Preview -->
    <div class="mb-3">
      <p class="text-xs text-gray-500 mb-1">Ürünler:</p>
      <p class="text-sm text-gray-700 line-clamp-1">
        {{ order.items?.map(item => item.name).join(', ') || 'Ürün bilgisi yok' }}
      </p>
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-between pt-3 border-t border-gray-100">
      <div>
        <p class="text-lg font-bold text-gray-900">₺{{ order.total?.toFixed(2) }}</p>
        <p class="text-xs text-gray-500">{{ order.createdAt }}</p>
      </div>
      <button
        @click="$emit('view-details', order)"
        class="px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
      >
        Detay
      </button>
    </div>
  </div>
</template>
