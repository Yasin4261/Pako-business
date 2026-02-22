<script setup>
// StatCard Component - Single Responsibility: Display single statistic
// Open/Closed: Customizable via props, no modification needed

defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  trend: {
    type: Number,
    default: 0
  },
  trendLabel: {
    type: String,
    default: 'vs last week'
  },
  color: {
    type: String,
    default: 'blue',
    validator: (value) => ['blue', 'purple', 'green', 'orange', 'red', 'pink'].includes(value)
  }
})

const colorClasses = {
  blue: {
    bg: 'bg-blue-50',
    iconBg: 'bg-blue-500',
    text: 'text-blue-600'
  },
  purple: {
    bg: 'bg-purple-50',
    iconBg: 'bg-purple-500',
    text: 'text-purple-600'
  },
  green: {
    bg: 'bg-green-50',
    iconBg: 'bg-green-500',
    text: 'text-green-600'
  },
  orange: {
    bg: 'bg-orange-50',
    iconBg: 'bg-orange-500',
    text: 'text-orange-600'
  },
  red: {
    bg: 'bg-red-50',
    iconBg: 'bg-red-500',
    text: 'text-red-600'
  },
  pink: {
    bg: 'bg-pink-50',
    iconBg: 'bg-pink-500',
    text: 'text-pink-600'
  }
}
</script>

<template>
  <div class="bg-white rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <p class="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide">{{ title }}</p>
        <p class="mt-2 text-2xl sm:text-3xl font-bold text-gray-900">{{ value }}</p>
        
        <!-- Trend -->
        <div v-if="trend !== 0" class="mt-2 flex items-center gap-1">
          <span
            :class="[
              'flex items-center text-xs sm:text-sm font-medium',
              trend > 0 ? 'text-green-600' : 'text-red-600'
            ]"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                v-if="trend > 0"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
              />
            </svg>
            {{ Math.abs(trend) }}%
          </span>
          <span class="text-xs text-gray-400">{{ trendLabel }}</span>
        </div>
      </div>
      
      <!-- Icon -->
      <div
        :class="[
          'w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shadow-lg',
          colorClasses[color].iconBg
        ]"
      >
        <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="icon" />
        </svg>
      </div>
    </div>
  </div>
</template>
