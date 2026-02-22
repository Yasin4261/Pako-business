<script setup>
// OrdersView - Orders Management Page
// Single Responsibility: Orders listing and management UI

import { ref, computed } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import OrderCard from '@/components/dashboard/OrderCard.vue'
import CreateOrderModal from '@/components/orders/CreateOrderModal.vue'

const isSidebarOpen = ref(false)
const activeTab = ref('all')
const searchQuery = ref('')
const isCreateModalOpen = ref(false)

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
}

function closeSidebar() {
  isSidebarOpen.value = false
}

function openCreateModal() {
  isCreateModalOpen.value = true
}

function closeCreateModal() {
  isCreateModalOpen.value = false
}

function handleOrderCreated(order) {
  console.log('Order created:', order)
  // Add to local list or refresh from API
}

const tabs = [
  { id: 'all', label: 'Tüm Siparişler', count: 24 },
  { id: 'pending', label: 'Bekleyen', count: 5 },
  { id: 'preparing', label: 'Hazırlanıyor', count: 8 },
  { id: 'ready', label: 'Hazır', count: 3 },
  { id: 'in-transit', label: 'Yolda', count: 6 },
  { id: 'delivered', label: 'Teslim Edildi', count: 2 }
]

// Demo orders data - will be replaced with API data
const allOrders = ref([
  {
    id: '1042',
    customer: 'Ahmet Yılmaz',
    address: 'Atatürk Mah. 123. Sok. No:4',
    items: ['2x Burger', '1x Patates', '1x Kola'],
    total: 285.50,
    status: 'preparing',
    time: '5 dk önce'
  },
  {
    id: '1041',
    customer: 'Ayşe Demir',
    address: 'Cumhuriyet Cad. No:456',
    items: ['1x Pizza Büyük', '2x Salata'],
    total: 420.00,
    status: 'ready',
    time: '12 dk önce'
  },
  {
    id: '1040',
    customer: 'Mehmet Kaya',
    address: 'Gül Sok. No:789, Kat:3',
    items: ['3x Taco', '1x Nachos', '2x İçecek'],
    total: 357.75,
    status: 'in-transit',
    time: '18 dk önce'
  },
  {
    id: '1039',
    customer: 'Fatma Öztürk',
    address: 'Çınar Mah. No:321',
    items: ['1x Makarna', '1x Ekmek'],
    total: 220.00,
    status: 'pending',
    time: '2 dk önce'
  },
  {
    id: '1038',
    customer: 'Ali Çelik',
    address: 'Selvi Sok. No:555',
    items: ['2x Sushi Roll', '1x Miso Çorbası'],
    total: 380.00,
    status: 'delivered',
    time: '25 dk önce'
  },
  {
    id: '1037',
    customer: 'Zeynep Arslan',
    address: 'Akasya Cad. No:777',
    items: ['1x Biftek', '1x Şarap'],
    total: 650.00,
    status: 'pending',
    time: '1 dk önce'
  }
])

const filteredOrders = computed(() => {
  let orders = allOrders.value

  // Filter by tab
  if (activeTab.value !== 'all') {
    orders = orders.filter(order => order.status === activeTab.value)
  }

  // Filter by search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    orders = orders.filter(order =>
      order.id.includes(query) ||
      order.customer.toLowerCase().includes(query) ||
      order.address.toLowerCase().includes(query)
    )
  }

  return orders
})

// Event handlers
function handleViewOrder(order) {
  console.log('View order:', order)
}

function handleAssignOrder(order) {
  console.log('Assign order:', order)
}

function handleCompleteOrder(order) {
  console.log('Complete order:', order)
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
              <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Siparişler</h1>
              <p class="text-sm sm:text-base text-gray-500 mt-1">Tüm siparişleri yönetin ve takip edin</p>
            </div>
            <button
              @click="openCreateModal"
              class="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all min-h-[44px]"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>Yeni Sipariş</span>
            </button>
          </div>

          <!-- Search & Filters -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6">
            <div class="flex flex-col sm:flex-row gap-4">
              <!-- Search -->
              <div class="flex-1 relative">
                <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Sipariş ID, müşteri veya adres ile ara..."
                  class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm sm:text-base"
                />
              </div>
              
              <!-- Filter Button -->
              <button class="inline-flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-600 min-h-[44px]">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span class="hidden sm:inline">Filtreler</span>
              </button>
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
                    ? 'bg-blue-500 text-white'
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

          <!-- Orders Grid -->
          <div v-if="filteredOrders.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            <OrderCard
              v-for="order in filteredOrders"
              :key="order.id"
              :order="order"
              @view="handleViewOrder"
              @assign="handleAssignOrder"
              @complete="handleCompleteOrder"
            />
          </div>

          <!-- Empty State -->
          <div v-else class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 text-center">
            <div class="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Sipariş bulunamadı</h3>
            <p class="text-gray-500 text-sm sm:text-base">Arama veya filtre kriterlerinizi değiştirmeyi deneyin</p>
          </div>
        </div>
      </main>
    </div>

    <!-- Create Order Modal -->
    <CreateOrderModal
      :is-open="isCreateModalOpen"
      @close="closeCreateModal"
      @created="handleOrderCreated"
    />
  </div>
</template>
