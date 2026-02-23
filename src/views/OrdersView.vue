<script setup>
// OrdersView - Orders Management Page
// Single Responsibility: Orders listing and management UI

import { ref, computed, onMounted } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import OrderCard from '@/components/dashboard/OrderCard.vue'
import CreateOrderModal from '@/components/orders/CreateOrderModal.vue'
import OrderDetailModal from '@/components/orders/OrderDetailModal.vue'
import { useOrderStore } from '@/stores/order.store'

const orderStore = useOrderStore()

const isSidebarOpen = ref(false)
const activeTab = ref('all')
const searchQuery = ref('')
const isCreateModalOpen = ref(false)
const isDetailModalOpen = ref(false)
const selectedOrderId = ref(null)

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

function openDetailModal(orderId) {
  selectedOrderId.value = orderId
  isDetailModalOpen.value = true
}

function closeDetailModal() {
  isDetailModalOpen.value = false
  selectedOrderId.value = null
}

function handleStatusUpdated() {
  // Refresh orders after status update
  orderStore.fetchOrders()
}

async function handleOrderCreated() {
  // Refresh orders from API
  await orderStore.fetchOrders()
}

// Tab counts computed from actual orders
const tabCounts = computed(() => {
  const orders = orderStore.orders
  return {
    all: orders.length,
    PENDING: orders.filter(o => o.status === 'PENDING').length,
    ACCEPTED: orders.filter(o => o.status === 'ACCEPTED').length,
    PREPARING: orders.filter(o => o.status === 'PREPARING').length,
    READY: orders.filter(o => o.status === 'READY').length,
    IN_TRANSIT: orders.filter(o => ['IN_TRANSIT', 'PICKED_UP', 'COURIER_ASSIGNED'].includes(o.status)).length,
    DELIVERED: orders.filter(o => o.status === 'DELIVERED').length
  }
})

const tabs = computed(() => [
  { id: 'all', label: 'Tüm Siparişler', count: tabCounts.value.all },
  { id: 'PENDING', label: 'Bekleyen', count: tabCounts.value.PENDING },
  { id: 'PREPARING', label: 'Hazırlanıyor', count: tabCounts.value.PREPARING },
  { id: 'READY', label: 'Hazır', count: tabCounts.value.READY },
  { id: 'IN_TRANSIT', label: 'Yolda', count: tabCounts.value.IN_TRANSIT },
  { id: 'DELIVERED', label: 'Teslim Edildi', count: tabCounts.value.DELIVERED }
])

const filteredOrders = computed(() => {
  let orders = orderStore.orders

  // Filter by tab
  if (activeTab.value !== 'all') {
    if (activeTab.value === 'IN_TRANSIT') {
      // Include multiple statuses for "Yolda" tab
      orders = orders.filter(order => 
        ['IN_TRANSIT', 'PICKED_UP', 'COURIER_ASSIGNED'].includes(order.status)
      )
    } else {
      orders = orders.filter(order => order.status === activeTab.value)
    }
  }

  // Filter by search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    orders = orders.filter(order =>
      order.orderNumber?.toLowerCase().includes(query) ||
      order.endCustomerName?.toLowerCase().includes(query) ||
      order.endCustomerPhone?.includes(query) ||
      order.deliveryAddress?.toLowerCase().includes(query) ||
      order.pickupAddress?.toLowerCase().includes(query)
    )
  }

  return orders
})

// Event handlers
function handleViewOrder(order) {
  openDetailModal(order.orderId)
}

// Fetch orders on mount
onMounted(async () => {
  await orderStore.fetchOrders()
})
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
                  placeholder="Sipariş no, müşteri, telefon veya adres ile ara..."
                  class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm sm:text-base"
                />
              </div>
              
              <!-- Refresh Button -->
              <button
                @click="orderStore.fetchOrders()"
                :disabled="orderStore.isLoading"
                class="inline-flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-600 min-h-[44px] disabled:opacity-50"
              >
                <svg
                  :class="['w-5 h-5', orderStore.isLoading && 'animate-spin']"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span class="hidden sm:inline">Yenile</span>
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

          <!-- Loading State -->
          <div v-if="orderStore.isLoading && orderStore.orders.length === 0" class="flex justify-center py-12">
            <div class="flex flex-col items-center gap-4">
              <svg class="w-10 h-10 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p class="text-gray-500">Siparişler yükleniyor...</p>
            </div>
          </div>

          <!-- Error State -->
          <div v-else-if="orderStore.error" class="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-red-800 mb-2">Hata Oluştu</h3>
            <p class="text-red-600 mb-4">{{ orderStore.error }}</p>
            <button
              @click="orderStore.fetchOrders()"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Tekrar Dene
            </button>
          </div>

          <!-- Orders Grid -->
          <div v-else-if="filteredOrders.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            <OrderCard
              v-for="order in filteredOrders"
              :key="order.orderId"
              :order="order"
              @view-details="handleViewOrder"
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
            <p class="text-gray-500 text-sm sm:text-base mb-4">
              {{ searchQuery ? 'Arama kriterlerinizi değiştirmeyi deneyin' : 'Henüz sipariş bulunmuyor' }}
            </p>
            <button
              @click="openCreateModal"
              class="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-shadow"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Yeni Sipariş Oluştur
            </button>
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

    <!-- Order Detail Modal -->
    <OrderDetailModal
      :is-open="isDetailModalOpen"
      :order-id="selectedOrderId"
      @close="closeDetailModal"
      @status-updated="handleStatusUpdated"
    />
  </div>
</template>
