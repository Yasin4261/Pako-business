<script setup>
// ActivityItem Component - Single Responsibility: Display single activity

defineProps({
  activity: {
    type: Object,
    required: true,
    validator: (value) => {
      return value.type && value.message && value.time
    }
  }
})

const typeConfig = {
  order: {
    bg: 'bg-blue-100',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    iconColor: 'text-blue-600'
  },
  delivery: {
    bg: 'bg-green-100',
    icon: 'M5 13l4 4L19 7',
    iconColor: 'text-green-600'
  },
  courier: {
    bg: 'bg-purple-100',
    icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z',
    iconColor: 'text-purple-600'
  },
  payment: {
    bg: 'bg-orange-100',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    iconColor: 'text-orange-600'
  },
  alert: {
    bg: 'bg-red-100',
    icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    iconColor: 'text-red-600'
  }
}

function getTypeConfig(type) {
  return typeConfig[type] || typeConfig.order
}
</script>

<template>
  <div class="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
    <!-- Icon -->
    <div
      :class="[
        'w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0',
        getTypeConfig(activity.type).bg
      ]"
    >
      <svg
        :class="['w-4 h-4 sm:w-5 sm:h-5', getTypeConfig(activity.type).iconColor]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getTypeConfig(activity.type).icon" />
      </svg>
    </div>

    <!-- Content -->
    <div class="flex-1 min-w-0">
      <p class="text-sm text-gray-900">{{ activity.message }}</p>
      <p class="text-xs text-gray-500 mt-0.5">{{ activity.time }}</p>
    </div>
  </div>
</template>
