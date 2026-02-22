<script setup>
// AppSidebar Component - Single Responsibility: Only sidebar navigation
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const route = useRoute()

const menuItems = [
  { 
    name: 'Ana Sayfa', 
    path: '/', 
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
  },
  { 
    name: 'Siparişler', 
    path: '/orders', 
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
    badge: 5
  },
  { 
    name: 'Kuryeler', 
    path: '/couriers', 
    icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z'
  },
  { 
    name: 'Menü', 
    path: '/menu', 
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
  },
  { 
    name: 'Analitik', 
    path: '/analytics', 
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
  },
  { 
    name: 'Ayarlar', 
    path: '/settings', 
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z'
  }
]

function isActive(path) {
  return route.path === path
}
</script>

<template>
  <!-- Mobile Overlay -->
  <Transition
    enter-active-class="transition-opacity ease-linear duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity ease-linear duration-300"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden"
      @click="emit('close')"
    ></div>
  </Transition>

  <!-- Sidebar -->
  <aside
    :class="[
      'fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-100 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-0 lg:h-[calc(100vh-65px)]',
      isOpen ? 'translate-x-0' : '-translate-x-full'
    ]"
  >
    <!-- Mobile Close Button -->
    <div class="flex items-center justify-between p-4 lg:hidden">
      <span class="text-lg font-bold text-gray-800">Menü</span>
      <button
        @click="emit('close')"
        class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Navigation -->
    <nav class="px-3 py-4 lg:py-6 space-y-1">
      <router-link
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        @click="emit('close')"
        :class="[
          'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group',
          isActive(item.path)
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
            : 'text-gray-600 hover:bg-gray-100'
        ]"
      >
        <svg
          class="w-5 h-5 flex-shrink-0"
          :class="isActive(item.path) ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon" />
        </svg>
        <span class="font-medium">{{ item.name }}</span>
        
        <!-- Badge -->
        <span
          v-if="item.badge"
          :class="[
            'ml-auto px-2 py-0.5 text-xs font-semibold rounded-full',
            isActive(item.path)
              ? 'bg-white/20 text-white'
              : 'bg-red-100 text-red-600'
          ]"
        >
          {{ item.badge }}
        </span>
      </router-link>
    </nav>

    <!-- Bottom Section -->
    <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
      <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-800">Planı Yükselt</p>
            <p class="text-xs text-gray-500">Daha fazla özellik alın</p>
          </div>
        </div>
        <button class="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium rounded-lg hover:shadow-lg transition-shadow">
          Şimdi Yükselt
        </button>
      </div>
    </div>
  </aside>
</template>
