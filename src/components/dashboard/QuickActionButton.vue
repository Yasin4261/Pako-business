<script setup>
// QuickActionButton Component - Single Responsibility: Single action button
// Open/Closed: Fully customizable via props

defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'blue',
    validator: (value) => ['blue', 'purple', 'green', 'orange', 'red', 'pink'].includes(value)
  }
})

defineEmits(['click'])

const colorClasses = {
  blue: {
    bg: 'from-blue-500 to-blue-600',
    hover: 'hover:shadow-blue-500/25'
  },
  purple: {
    bg: 'from-purple-500 to-purple-600',
    hover: 'hover:shadow-purple-500/25'
  },
  green: {
    bg: 'from-green-500 to-green-600',
    hover: 'hover:shadow-green-500/25'
  },
  orange: {
    bg: 'from-orange-500 to-orange-600',
    hover: 'hover:shadow-orange-500/25'
  },
  red: {
    bg: 'from-red-500 to-red-600',
    hover: 'hover:shadow-red-500/25'
  },
  pink: {
    bg: 'from-pink-500 to-pink-600',
    hover: 'hover:shadow-pink-500/25'
  }
}
</script>

<template>
  <button
    @click="$emit('click')"
    :class="[
      'w-full p-4 sm:p-5 rounded-2xl bg-gradient-to-r text-white text-left transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5',
      colorClasses[color].bg,
      colorClasses[color].hover
    ]"
  >
    <div class="flex items-center gap-3 sm:gap-4">
      <div class="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center">
        <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="icon" />
        </svg>
      </div>
      <div>
        <p class="font-semibold text-sm sm:text-base">{{ title }}</p>
        <p v-if="description" class="text-xs sm:text-sm text-white/70">{{ description }}</p>
      </div>
    </div>
  </button>
</template>
