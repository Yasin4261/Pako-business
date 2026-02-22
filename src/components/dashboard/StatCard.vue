<script setup>
// StatCard - Reusable Statistic Card Component
// Single Responsibility: Display a single statistic with trend

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
  color: {
    type: String,
    default: 'blue'
  }
})

const colorClasses = {
  blue: 'from-blue-500 to-blue-600',
  green: 'from-green-500 to-green-600',
  purple: 'from-purple-500 to-purple-600',
  orange: 'from-orange-500 to-orange-600',
  red: 'from-red-500 to-red-600'
}
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow">
    <div class="flex items-start justify-between mb-4">
      <div
        :class="[
          'w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br flex items-center justify-center',
          colorClasses[color]
        ]"
      >
        <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="icon" />
        </svg>
      </div>

      <div
        v-if="trend !== 0"
        :class="[
          'flex items-center gap-1 text-xs sm:text-sm font-medium px-2 py-1 rounded-full',
          trend > 0 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
        ]"
      >
        <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <span>%{{ Math.abs(trend) }}</span>
      </div>
    </div>

    <h3 class="text-xs sm:text-sm font-medium text-gray-500 mb-1">{{ title }}</h3>
    <p class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{{ value }}</p>
  </div>
</template>
