<script setup>
// CouriersView - Couriers Management Page
// Single Responsibility: Couriers listing and management UI

import { ref, computed } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'

const isSidebarOpen = ref(false)
const activeTab = ref('all')
const searchQuery = ref('')

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
}

function closeSidebar() {
  isSidebarOpen.value = false
}

const tabs = [
  { id: 'all', label: 'Tüm Kuryeler', count: 12 },
  { id: 'available', label: 'Uygun', count: 5 },
  { id: 'busy', label: 'Teslimat\'ta', count: 6 },
  { id: 'offline', label: 'Çevrimdışı', count: 1 }
]

// Demo couriers data - will be replaced with API data
const couriers = ref([
  {
    id: 1,
    name: 'Ali Yılmaz',
    phone: '+90 555 123 4567',
    status: 'available',
    avatar: 'A',
    rating: 4.8,
    completedToday: 8,
    totalDeliveries: 245,
    vehicle: 'Motosiklet',
    currentOrder: null
  },
  {
    id: 2,
    name: 'Mehmet Demir',
    phone: '+90 555 234 5678',
    status: 'busy',
    avatar: 'M',
    rating: 4.9,
    completedToday: 12,
    totalDeliveries: 380,
    vehicle: 'Bisiklet',
    currentOrder: '#1040'
  },
  {
    id: 3,
    name: 'Ayşe Kaya',
    phone: '+90 555 345 6789',
    status: 'available',
    avatar: 'A',
    rating: 4.7,
    completedToday: 6,
    totalDeliveries: 189,
    vehicle: 'Motosiklet',
    currentOrder: null
  },
  {
    id: 4,
    name: 'Fatma Öztürk',
    phone: '+90 555 456 7890',
    status: 'busy',
    avatar: 'F',
    rating: 4.6,
    completedToday: 10,
    totalDeliveries: 312,
    vehicle: 'Araba',
    currentOrder: '#1039'
  },
  {
    id: 5,
    name: 'Hasan Çelik',
    phone: '+90 555 567 8901',
    status: 'offline',
    avatar: 'H',
    rating: 4.5,
    completedToday: 0,
    totalDeliveries: 156,
    vehicle: 'Motosiklet',
    currentOrder: null
  },
  {
    id: 6,
    name: 'Zeynep Arslan',
    phone: '+90 555 678 9012',
    status: 'available',
    avatar: 'Z',
    rating: 4.9,
    completedToday: 9,
    totalDeliveries: 420,
    vehicle: 'Bisiklet',
    currentOrder: null
  }
])

const filteredCouriers = computed(() => {
  let list = couriers.value

  if (activeTab.value !== 'all') {
    list = list.filter(c => c.status === activeTab.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    list = list.filter(c =>
      c.name.toLowerCase().includes(query) ||
      c.phone.includes(query)
    )
  }

  return list
})

const statusConfig = {
  available: {
    label: 'Uygun',
    bg: 'bg-green-100',
    text: 'text-green-700',
    dot: 'bg-green-500'
  },
  busy: {
    label: 'Teslimat\'ta',
    bg: 'bg-orange-100',
    text: 'text-orange-700',
    dot: 'bg-orange-500 animate-pulse'
  },
  offline: {
    label: 'Çevrimdışı',
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    dot: 'bg-gray-400'
  }
}

function getStatusConfig(status) {
  return statusConfig[status] || statusConfig.offline
}

function handleAssign(courier) {
  console.log('Assign to courier:', courier)
}

function handleViewProfile(courier) {
  console.log('View profile:', courier)
}

function handleCall(courier) {
  window.open(`tel:${courier.phone}`)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader @toggle-sidebar="toggleSidebar" />

    <div class="flex">
      <AppSidebar :is-open="isSidebarOpen" @close="closeSidebar" />

      <main class="flex-1 p-4 sm:p-6 lg:p-8">
        <div class="max-w-7xl mx-auto">
          <!-- Page Header -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Kuryeler</h1>
              <p class="text-sm sm:text-base text-gray-500 mt-1">Teslimat ekibinizi yönetin</p>
            </div>
            <button class="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all min-h-[44px]">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <span>Kurye Ekle</span>
            </button>
          </div>

          <!-- Search & Filters -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6">
            <div class="flex flex-col sm:flex-row gap-4">
              <div class="flex-1 relative">
                <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="İsim veya telefon ile kurye ara..."
                  class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm sm:text-base"
                />
              </div>
            </div>

            <!-- Tabs -->
            <div class="flex gap-2 mt-4 overflow-x-auto pb-2">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                  'flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all',
                  activeTab === tab.id
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                ]"
              >
                {{ tab.label }}
                <span
                  :class="[
                    'px-2 py-0.5 rounded-full text-xs',
                    activeTab === tab.id
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-200 text-gray-600'
                  ]"
                >
                  {{ tab.count }}
                </span>
              </button>
            </div>
          </div>

          <!-- Couriers Grid -->
          <div v-if="filteredCouriers.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            <div
              v-for="courier in filteredCouriers"
              :key="courier.id"
              class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 hover:shadow-md transition-shadow"
            >
              <!-- Header -->
              <div class="flex items-start justify-between mb-4">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {{ courier.avatar }}
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900">{{ courier.name }}</h3>
                    <p class="text-sm text-gray-500">{{ courier.vehicle }}</p>
                  </div>
                </div>
                <span
                  :class="[
                    'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
                    getStatusConfig(courier.status).bg,
                    getStatusConfig(courier.status).text
                  ]"
                >
                  <span :class="['w-1.5 h-1.5 rounded-full', getStatusConfig(courier.status).dot]"></span>
                  {{ getStatusConfig(courier.status).label }}
                </span>
              </div>

              <!-- Stats -->
              <div class="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-gray-100">
                <div class="text-center">
                  <div class="text-lg font-bold text-gray-900">{{ courier.rating }}</div>
                  <div class="text-xs text-gray-500 flex items-center justify-center gap-1">
                    <svg class="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Puan
                  </div>
                </div>
                <div class="text-center">
                  <div class="text-lg font-bold text-gray-900">{{ courier.completedToday }}</div>
                  <div class="text-xs text-gray-500">Bugün</div>
                </div>
                <div class="text-center">
                  <div class="text-lg font-bold text-gray-900">{{ courier.totalDeliveries }}</div>
                  <div class="text-xs text-gray-500">Toplam</div>
                </div>
              </div>

              <!-- Current Order -->
              <div v-if="courier.currentOrder" class="mb-4 p-3 bg-orange-50 rounded-xl">
                <div class="flex items-center gap-2 text-sm">
                  <svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span class="text-orange-700">Sipariş <strong>{{ courier.currentOrder }}</strong> teslim ediliyor</span>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex gap-2">
                <button
                  @click="handleCall(courier)"
                  class="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Ara
                </button>
                <button
                  v-if="courier.status === 'available'"
                  @click="handleAssign(courier)"
                  class="flex-1 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl hover:shadow-lg transition-shadow"
                >
                  Sipariş Ata
                </button>
                <button
                  v-else
                  @click="handleViewProfile(courier)"
                  class="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Profili Gör
                </button>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 text-center">
            <div class="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Kurye bulunamadı</h3>
            <p class="text-gray-500 text-sm sm:text-base">Arama kriterlerinizi değiştirmeyi deneyin</p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
