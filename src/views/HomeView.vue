<script setup>
// HomeView - Dashboard Page
// Single Responsibility: Only dashboard UI composition

import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import StatCard from '@/components/dashboard/StatCard.vue'
import OrderCard from '@/components/dashboard/OrderCard.vue'
import ActivityItem from '@/components/dashboard/ActivityItem.vue'
import CreateOrderModal from '@/components/orders/CreateOrderModal.vue'
import OrderDetailModal from '@/components/orders/OrderDetailModal.vue'
import { useOrderStore } from '@/stores/order.store.js'
import { useSessionStore } from '@/stores/session.store.js'

const router = useRouter()
const orderStore = useOrderStore()
const sessionStore = useSessionStore()

const isSidebarOpen = ref(false)
const isCreateOrderModalOpen = ref(false)
const isDetailModalOpen = ref(false)
const selectedOrderId = ref(null)

// Fetch orders on mount
onMounted(async () => {
  await orderStore.fetchOrders()
})

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
}

function closeSidebar() {
  isSidebarOpen.value = false
}

function handleOrderCreated(order) {
  sessionStore.showSuccess('Sipariş başarıyla oluşturuldu!')
  orderStore.fetchOrders() // Refresh orders
}

// Computed: Active orders (not delivered or cancelled)
const activeOrders = computed(() => {
  return orderStore.orders.filter(order => 
    !['DELIVERED', 'CANCELLED'].includes(order.status)
  ).slice(0, 5) // Show max 5 on dashboard
})

// Computed: Stats from real data
const stats = computed(() => {
  const orders = orderStore.orders
  const activeCount = orders.filter(o => !['DELIVERED', 'CANCELLED'].includes(o.status)).length
  const deliveredToday = orders.filter(o => {
    if (o.status !== 'DELIVERED') return false
    const today = new Date().toDateString()
    const orderDate = new Date(o.deliveredAt || o.updatedAt).toDateString()
    return today === orderDate
  }).length
  
  const todayRevenue = orders
    .filter(o => o.status === 'DELIVERED')
    .reduce((sum, o) => sum + (o.deliveryFee || 0), 0)

  return [
    {
      title: 'Aktif Siparişler',
      value: activeCount,
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
      trend: 0,
      color: 'blue'
    },
    {
      title: 'Bugünün Geliri',
      value: `₺${todayRevenue.toFixed(2)}`,
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      trend: 0,
      color: 'green'
    },
    {
      title: 'Bekleyen Sipariş',
      value: orders.filter(o => o.status === 'PENDING').length,
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      trend: 0,
      color: 'purple'
    },
    {
      title: 'Bugün Tamamlanan',
      value: deliveredToday,
      icon: 'M5 13l4 4L19 7',
      trend: 0,
      color: 'orange'
    }
  ]
})

// Generate activities from orders
const recentActivities = computed(() => {
  const activities = []
  const orders = [...orderStore.orders].sort((a, b) => 
    new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
  ).slice(0, 10)

  orders.forEach(order => {
    const time = formatActivityTime(order.updatedAt || order.createdAt)
    
    if (order.status === 'DELIVERED') {
      activities.push({
        type: 'delivery',
        message: `Sipariş #${order.orderNumber} başarıyla teslim edildi`,
        time
      })
    } else if (order.status === 'PENDING') {
      activities.push({
        type: 'order',
        message: `${order.endCustomerName}'dan yeni sipariş #${order.orderNumber} alındı`,
        time
      })
    } else if (order.status === 'COURIER_ASSIGNED' && order.courierName) {
      activities.push({
        type: 'courier',
        message: `Kurye ${order.courierName} sipariş #${order.orderNumber}'a atandı`,
        time
      })
    } else if (order.status === 'IN_TRANSIT') {
      activities.push({
        type: 'delivery',
        message: `Sipariş #${order.orderNumber} yolda`,
        time
      })
    } else if (order.status === 'READY') {
      activities.push({
        type: 'order',
        message: `Sipariş #${order.orderNumber} teslimata hazır`,
        time
      })
    }
  })

  return activities.slice(0, 5)
})

function formatActivityTime(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diff = Math.floor((now - date) / 1000 / 60) // minutes

  if (diff < 1) return 'Az önce'
  if (diff < 60) return `${diff} dakika önce`
  if (diff < 1440) return `${Math.floor(diff / 60)} saat önce`
  return date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' })
}

// Event handlers
function openDetailModal(orderId) {
  selectedOrderId.value = orderId
  isDetailModalOpen.value = true
}

function closeDetailModal() {
  isDetailModalOpen.value = false
  selectedOrderId.value = null
}

function handleViewOrder(order) {
  openDetailModal(order.orderId)
}

function handleStatusUpdated() {
  orderStore.fetchOrders()
  sessionStore.showSuccess('Sipariş durumu güncellendi!')
}

function goToAllOrders() {
  router.push('/orders')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <AppHeader @toggle-sidebar="toggleSidebar" />

    <div class="flex">
      <!-- Sidebar -->
      <AppSidebar :is-open="isSidebarOpen" @close="closeSidebar" />

      <!-- Main Content -->
      <main class="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-0">
        <div class="max-w-7xl mx-auto">
          <!-- Page Title -->
          <div class="mb-6 sm:mb-8">
            <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Kontrol Paneli</h1>
            <p class="text-sm sm:text-base text-gray-500 mt-1">Tekrar hoş geldiniz! Bugün neler olduğuna bakalım.</p>
          </div>

          <!-- Stats Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <StatCard
              v-for="stat in stats"
              :key="stat.title"
              :title="stat.title"
              :value="stat.value"
              :icon="stat.icon"
              :trend="stat.trend"
              :color="stat.color"
            />
          </div>

          <!-- Main Grid: Orders & Activity -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <!-- Active Orders - 2 columns on desktop -->
            <div class="lg:col-span-2">
              <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div class="p-4 sm:p-6 border-b border-gray-100">
                  <div class="flex items-center justify-between">
                    <div>
                      <h2 class="text-lg sm:text-xl font-semibold text-gray-900">Aktif Siparişler</h2>
                      <p class="text-sm text-gray-500 mt-0.5">{{ activeOrders.length }} sipariş işlemde</p>
                    </div>
                    <button 
                      @click="goToAllOrders"
                      class="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Tümünü Gör
                    </button>
                  </div>
                </div>

                <!-- Loading State -->
                <div v-if="orderStore.isLoading" class="p-8 flex items-center justify-center">
                  <div class="flex flex-col items-center gap-3">
                    <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p class="text-sm text-gray-500">Siparişler yükleniyor...</p>
                  </div>
                </div>

                <!-- Error State -->
                <div v-else-if="orderStore.error" class="p-8">
                  <div class="text-center">
                    <div class="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                      <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p class="text-gray-600 mb-4">{{ orderStore.error }}</p>
                    <button 
                      @click="orderStore.fetchOrders()"
                      class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Tekrar Dene
                    </button>
                  </div>
                </div>

                <!-- Empty State -->
                <div v-else-if="activeOrders.length === 0" class="p-8">
                  <div class="text-center">
                    <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <p class="text-gray-600 mb-4">Aktif sipariş bulunmuyor</p>
                    <button 
                      @click="isCreateOrderModalOpen = true"
                      class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Yeni Sipariş Oluştur
                    </button>
                  </div>
                </div>

                <!-- Orders List -->
                <div v-else class="p-4 sm:p-6 space-y-4 max-h-[600px] overflow-y-auto">
                  <OrderCard
                    v-for="order in activeOrders"
                    :key="order.orderId"
                    :order="order"
                    @view-details="handleViewOrder"
                  />
                </div>
              </div>
            </div>

            <!-- Recent Activity - 1 column -->
            <div class="lg:col-span-1">
              <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div class="p-4 sm:p-6 border-b border-gray-100">
                  <div class="flex items-center justify-between">
                    <h2 class="text-lg sm:text-xl font-semibold text-gray-900">Son Aktiviteler</h2>
                    <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  </div>
                </div>

                <!-- Activity List -->
                <div v-if="recentActivities.length > 0" class="divide-y divide-gray-50 max-h-[500px] overflow-y-auto">
                  <ActivityItem
                    v-for="(activity, index) in recentActivities"
                    :key="index"
                    :activity="activity"
                  />
                </div>

                <!-- Empty State -->
                <div v-else class="p-8 text-center">
                  <div class="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p class="text-sm text-gray-500">Henüz aktivite yok</p>
                </div>

                <!-- View All -->
                <div class="p-4 border-t border-gray-100">
                  <button 
                    @click="goToAllOrders"
                    class="w-full py-2.5 text-sm font-medium text-gray-600 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    Tüm Aktiviteleri Gör
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Create Order Modal -->
    <CreateOrderModal
      :is-open="isCreateOrderModalOpen"
      @close="isCreateOrderModalOpen = false"
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
