<script setup>
// ActivityItem - Activity Feed Item Component
// Single Responsibility: Display single activity item

defineProps({
  activity: {
    type: Object,
    required: true
  }
})

const typeConfig = {
  order: {
    color: 'bg-blue-100 text-blue-600',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
  },
  delivery: {
    color: 'bg-green-100 text-green-600',
    icon: 'M5 13l4 4L19 7'
  },
  courier: {
    color: 'bg-purple-100 text-purple-600',
    icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
  },
  payment: {
    color: 'bg-orange-100 text-orange-600',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  }
}

function getTypeConfig(type) {
  return typeConfig[type] || typeConfig.order
}
</script>

<template>
  <div class="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
    <div
      :class="[
        'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
        getTypeConfig(activity.type).color
      ]"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getTypeConfig(activity.type).icon" />
      </svg>
    </div>

    <div class="flex-1 min-w-0">
      <p class="text-sm text-gray-900 leading-snug">{{ activity.message }}</p>
      <p class="text-xs text-gray-500 mt-1">{{ activity.time }}</p>
    </div>
  </div>
</template>
