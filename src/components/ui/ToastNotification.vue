<!-- Toast Notification Component -->
<!-- Single Responsibility: Only handles toast notifications display -->
<script setup>
import { computed } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'info', // info, success, warning, error
    validator: (value) => ['info', 'success', 'warning', 'error'].includes(value)
  },
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 5000
  },
  position: {
    type: String,
    default: 'top-right', // top-right, top-left, bottom-right, bottom-left, top-center
    validator: (value) => ['top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center'].includes(value)
  }
})

const emit = defineEmits(['close'])

// Position classes
const positionClasses = computed(() => {
  const positions = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2'
  }
  return positions[props.position]
})

// Type-based styling
const typeConfig = computed(() => {
  const configs = {
    info: {
      bgClass: 'bg-blue-50 border-blue-200',
      iconBgClass: 'bg-blue-100',
      iconClass: 'text-blue-600',
      titleClass: 'text-blue-900',
      messageClass: 'text-blue-700',
      icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />`
    },
    success: {
      bgClass: 'bg-green-50 border-green-200',
      iconBgClass: 'bg-green-100',
      iconClass: 'text-green-600',
      titleClass: 'text-green-900',
      messageClass: 'text-green-700',
      icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />`
    },
    warning: {
      bgClass: 'bg-amber-50 border-amber-200',
      iconBgClass: 'bg-amber-100',
      iconClass: 'text-amber-600',
      titleClass: 'text-amber-900',
      messageClass: 'text-amber-700',
      icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />`
    },
    error: {
      bgClass: 'bg-red-50 border-red-200',
      iconBgClass: 'bg-red-100',
      iconClass: 'text-red-600',
      titleClass: 'text-red-900',
      messageClass: 'text-red-700',
      icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />`
    }
  }
  return configs[props.type]
})

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-2 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-2 scale-95"
    >
      <div
        v-if="show"
        :class="[
          'fixed z-[110] w-full max-w-sm',
          positionClasses
        ]"
      >
        <div
          :class="[
            'flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-sm',
            typeConfig.bgClass
          ]"
        >
          <!-- Icon -->
          <div
            :class="[
              'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
              typeConfig.iconBgClass
            ]"
          >
            <svg
              :class="['w-5 h-5', typeConfig.iconClass]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              v-html="typeConfig.icon"
            />
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <h4
              v-if="title"
              :class="['font-semibold text-sm', typeConfig.titleClass]"
            >
              {{ title }}
            </h4>
            <p
              :class="[
                'text-sm leading-relaxed',
                typeConfig.messageClass,
                title ? 'mt-1' : ''
              ]"
            >
              {{ message }}
            </p>
          </div>

          <!-- Close Button -->
          <button
            @click="handleClose"
            class="flex-shrink-0 p-1 rounded-lg text-gray-400 hover:text-gray-600 
                   hover:bg-white/50 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
