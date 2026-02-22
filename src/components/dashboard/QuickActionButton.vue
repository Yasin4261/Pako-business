<script setup>
// QuickActionButton - Reusable Quick Action Button
// Single Responsibility: Display a quick action button

defineProps({
  icon: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'blue'
  }
})

defineEmits(['click'])

const colorClasses = {
  blue: 'from-blue-500 to-blue-600 hover:shadow-blue-500/25',
  green: 'from-green-500 to-green-600 hover:shadow-green-500/25',
  purple: 'from-purple-500 to-purple-600 hover:shadow-purple-500/25',
  orange: 'from-orange-500 to-orange-600 hover:shadow-orange-500/25'
}
</script>

<template>
  <button
    @click="$emit('click')"
    class="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all group min-h-[88px]"
  >
    <div
      :class="[
        'w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center group-hover:shadow-lg transition-shadow',
        colorClasses[color]
      ]"
    >
      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="icon" />
      </svg>
    </div>
    <span class="text-xs sm:text-sm font-medium text-gray-700 text-center">{{ label }}</span>
  </button>
</template>
