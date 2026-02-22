<script setup>
// OrderCard Component - Single Responsibility: Display single order
// Liskov: Consistent interface, substitutable in any order list

defineProps({
  order: {
    type: Object,
    required: true,
    validator: (value) => {
      return value.id && value.customer && value.status
    }
  }
})

defineEmits(['view', 'assign', 'complete'])

const statusConfig = {
  pending: {
    label: 'Pending',
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
    dot: 'bg-yellow-500'
  },
  preparing: {
    label: 'Preparing',
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    dot: 'bg-blue-500'
  },
  ready: {
    label: 'Ready',
    bg: 'bg-purple-100',
    text: 'text-purple-700',
    dot: 'bg-purple-500'
  },
  'in-transit': {
    label: 'In Transit',
    bg: 'bg-orange-100',
    text: 'text-orange-700',
    dot: 'bg-orange-500 animate-pulse'
  },
  delivered: {
    label: 'Delivered',
    bg: 'bg-green-100',
    text: 'text-green-700',
    dot: 'bg-green-500'
  },
  cancelled: {
    label: 'Cancelled',
    bg: 'bg-red-100',
    text: 'text-red-700',
    dot: 'bg-red-500'
  }
}

function getStatusConfig(status) {
  return statusConfig[status] || statusConfig.pending
}
</script>

<template>
  <div class="bg-white rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 group">
    <!-- Header -->
    <div class="flex items-start justify-between mb-3">
      <div>
        <div class="flex items-center gap-2">
          <span class="text-sm sm:text-base font-semibold text-gray-900">#{{ order.id }}</span>
          <span
            :class="[
              'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
              getStatusConfig(order.status).bg,
              getStatusConfig(order.status).text
            ]"
          >
            <span :class="['w-1.5 h-1.5 rounded-full', getStatusConfig(order.status).dot]"></span>
            {{ getStatusConfig(order.status).label }}
          </span>
        </div>
        <p class="text-xs sm:text-sm text-gray-500 mt-0.5">{{ order.time }}</p>
      </div>
      <span class="text-base sm:text-lg font-bold text-gray-900">${{ order.total }}</span>
    </div>

    <!-- Customer Info -->
    <div class="flex items-center gap-3 mb-3 pb-3 border-b border-gray-100">
      <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
        <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-gray-900 truncate">{{ order.customer }}</p>
        <p class="text-xs text-gray-500 truncate">{{ order.address }}</p>
      </div>
    </div>

    <!-- Items Preview -->
    <div class="mb-4">
      <p class="text-xs text-gray-500 mb-1">{{ order.items.length }} item(s)</p>
      <p class="text-sm text-gray-700 truncate">{{ order.items.join(', ') }}</p>
    </div>

    <!-- Actions -->
    <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <button
        @click="$emit('view', order)"
        class="flex-1 py-2 text-xs sm:text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
      >
        View
      </button>
      <button
        v-if="order.status === 'pending' || order.status === 'ready'"
        @click="$emit('assign', order)"
        class="flex-1 py-2 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:shadow-lg transition-shadow"
      >
        {{ order.status === 'ready' ? 'Assign Courier' : 'Accept' }}
      </button>
      <button
        v-if="order.status === 'in-transit'"
        @click="$emit('complete', order)"
        class="flex-1 py-2 text-xs sm:text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
      >
        Complete
      </button>
    </div>
  </div>
</template>
