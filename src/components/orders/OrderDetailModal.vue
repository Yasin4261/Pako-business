<script setup>
// OrderDetailModal - Order Detail View Modal
// Single Responsibility: Display detailed order information

import { ref, watch, computed } from 'vue'
import { useOrderStore } from '@/stores/order.store'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  orderId: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['close', 'status-updated'])

const orderStore = useOrderStore()
const order = ref(null)
const isLoading = ref(false)
const activeTab = ref('details')

// Status config
const statusConfig = {
  PENDING: { label: 'Bekleyen', color: 'bg-yellow-100 text-yellow-700', next: 'ACCEPTED' },
  ACCEPTED: { label: 'Kabul Edildi', color: 'bg-blue-100 text-blue-700', next: 'PREPARING' },
  PREPARING: { label: 'Hazırlanıyor', color: 'bg-blue-100 text-blue-700', next: 'READY' },
  READY: { label: 'Hazır', color: 'bg-purple-100 text-purple-700', next: 'COURIER_ASSIGNED' },
  COURIER_ASSIGNED: { label: 'Kurye Atandı', color: 'bg-indigo-100 text-indigo-700', next: 'PICKED_UP' },
  PICKED_UP: { label: 'Alındı', color: 'bg-indigo-100 text-indigo-700', next: 'IN_TRANSIT' },
  IN_TRANSIT: { label: 'Yolda', color: 'bg-orange-100 text-orange-700', next: 'DELIVERED' },
  DELIVERED: { label: 'Teslim Edildi', color: 'bg-green-100 text-green-700', next: null },
  CANCELLED: { label: 'İptal Edildi', color: 'bg-red-100 text-red-700', next: null }
}

const priorityConfig = {
  LOW: { label: 'Düşük', color: 'bg-gray-100 text-gray-600' },
  NORMAL: { label: 'Normal', color: 'bg-blue-100 text-blue-600' },
  HIGH: { label: 'Yüksek', color: 'bg-orange-100 text-orange-600' },
  URGENT: { label: 'Acil', color: 'bg-red-100 text-red-600' }
}

const paymentConfig = {
  CASH: { label: 'Nakit', icon: '💵' },
  CARD: { label: 'Kredi Kartı', icon: '💳' },
  ONLINE: { label: 'Online Ödeme', icon: '📱' },
  PREPAID: { label: 'Ön Ödemeli', icon: '✅' }
}

const tabs = [
  { id: 'details', label: 'Detaylar' },
  { id: 'addresses', label: 'Adresler' },
  { id: 'courier', label: 'Kurye' }
]

// Computed
const canUpdateStatus = computed(() => {
  if (!order.value) return false
  const currentStatus = statusConfig[order.value.status]
  return currentStatus && currentStatus.next
})

const nextStatusLabel = computed(() => {
  if (!order.value) return ''
  const currentStatus = statusConfig[order.value.status]
  if (!currentStatus || !currentStatus.next) return ''
  return statusConfig[currentStatus.next]?.label || ''
})

// Methods
async function fetchOrderDetail() {
  if (!props.orderId) return
  
  isLoading.value = true
  try {
    await orderStore.fetchOrderById(props.orderId)
    order.value = orderStore.currentOrder
  } catch (error) {
    console.error('Failed to fetch order:', error)
  } finally {
    isLoading.value = false
  }
}

async function updateStatus() {
  if (!order.value || !canUpdateStatus.value) return
  
  const nextStatus = statusConfig[order.value.status].next
  const result = await orderStore.updateOrderStatus(order.value.orderId, nextStatus)
  
  if (result.success) {
    order.value.status = nextStatus
    emit('status-updated', order.value)
  }
}

function formatDate(dateString) {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function closeModal() {
  order.value = null
  activeTab.value = 'details'
  emit('close')
}

// Watch for orderId changes to fetch new data
watch(() => props.orderId, (newId) => {
  if (newId && props.isOpen) {
    fetchOrderDetail()
  }
}, { immediate: true })

watch(() => props.isOpen, (isOpen) => {
  if (isOpen && props.orderId) {
    fetchOrderDetail()
  } else if (!isOpen) {
    order.value = null
    activeTab.value = 'details'
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          @click="closeModal"
        ></div>

        <!-- Modal Content -->
        <div class="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          <!-- Loading State -->
          <div v-if="isLoading" class="flex items-center justify-center py-20">
            <div class="flex flex-col items-center gap-4">
              <svg class="w-10 h-10 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p class="text-gray-500">Sipariş yükleniyor...</p>
            </div>
          </div>

          <!-- Order Content -->
          <template v-else-if="order">
            <!-- Header -->
            <div class="p-4 sm:p-6 border-b border-gray-100">
              <div class="flex items-start justify-between">
                <div>
                  <div class="flex items-center gap-3 mb-2">
                    <h2 class="text-lg sm:text-xl font-bold text-gray-900">#{{ order.orderNumber }}</h2>
                    <span
                      :class="['px-3 py-1 rounded-full text-xs font-medium', statusConfig[order.status]?.color]"
                    >
                      {{ statusConfig[order.status]?.label }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-500">{{ formatDate(order.createdAt) }}</p>
                </div>
                <button
                  @click="closeModal"
                  class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <!-- Tabs -->
              <div class="flex gap-2 mt-4">
                <button
                  v-for="tab in tabs"
                  :key="tab.id"
                  @click="activeTab = tab.id"
                  :class="[
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  ]"
                >
                  {{ tab.label }}
                </button>
              </div>
            </div>

            <!-- Body -->
            <div class="flex-1 overflow-y-auto p-4 sm:p-6">
              <!-- Details Tab -->
              <div v-if="activeTab === 'details'" class="space-y-6">
                <!-- Customer Info -->
                <div class="bg-gray-50 rounded-xl p-4">
                  <h3 class="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Müşteri Bilgileri
                  </h3>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p class="text-xs text-gray-500 mb-1">Ad Soyad</p>
                      <p class="font-medium text-gray-900">{{ order.endCustomerName }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500 mb-1">Telefon</p>
                      <a :href="`tel:${order.endCustomerPhone}`" class="font-medium text-blue-600 hover:underline">
                        {{ order.endCustomerPhone }}
                      </a>
                    </div>
                  </div>
                </div>

                <!-- Order Info -->
                <div class="bg-gray-50 rounded-xl p-4">
                  <h3 class="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Sipariş Bilgileri
                  </h3>
                  <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                      <p class="text-xs text-gray-500 mb-1">Öncelik</p>
                      <span :class="['px-2 py-1 rounded-full text-xs font-medium', priorityConfig[order.priority]?.color]">
                        {{ priorityConfig[order.priority]?.label }}
                      </span>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500 mb-1">Ödeme Tipi</p>
                      <p class="font-medium text-gray-900">
                        {{ paymentConfig[order.paymentType]?.icon }} {{ paymentConfig[order.paymentType]?.label }}
                      </p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500 mb-1">Paket Sayısı</p>
                      <p class="font-medium text-gray-900">{{ order.packageCount }} adet</p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500 mb-1">Paket Ağırlığı</p>
                      <p class="font-medium text-gray-900">{{ order.packageWeight ? `${order.packageWeight} kg` : '-' }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500 mb-1">Teslimat Ücreti</p>
                      <p class="font-medium text-green-600">₺{{ order.deliveryFee?.toFixed(2) }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500 mb-1">Tahsilat</p>
                      <p class="font-medium text-gray-900">{{ order.collectionAmount > 0 ? `₺${order.collectionAmount.toFixed(2)}` : '-' }}</p>
                    </div>
                  </div>
                  <div v-if="order.packageDescription" class="mt-4 pt-4 border-t border-gray-200">
                    <p class="text-xs text-gray-500 mb-1">Paket Açıklaması</p>
                    <p class="font-medium text-gray-900">{{ order.packageDescription }}</p>
                  </div>
                  <div v-if="order.businessNotes" class="mt-4 pt-4 border-t border-gray-200">
                    <p class="text-xs text-gray-500 mb-1">İşletme Notları</p>
                    <p class="font-medium text-gray-900">{{ order.businessNotes }}</p>
                  </div>
                </div>

                <!-- Timestamps -->
                <div class="bg-gray-50 rounded-xl p-4">
                  <h3 class="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Zaman Bilgileri
                  </h3>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p class="text-xs text-gray-500 mb-1">Sipariş Tarihi</p>
                      <p class="font-medium text-gray-900">{{ formatDate(order.orderDate) }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500 mb-1">Son Güncelleme</p>
                      <p class="font-medium text-gray-900">{{ formatDate(order.updatedAt) }}</p>
                    </div>
                    <div v-if="order.scheduledPickupTime">
                      <p class="text-xs text-gray-500 mb-1">Planlanan Alış Zamanı</p>
                      <p class="font-medium text-gray-900">{{ formatDate(order.scheduledPickupTime) }}</p>
                    </div>
                    <div v-if="order.estimatedDeliveryTime">
                      <p class="text-xs text-gray-500 mb-1">Tahmini Teslimat</p>
                      <p class="font-medium text-gray-900">{{ formatDate(order.estimatedDeliveryTime) }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Addresses Tab -->
              <div v-if="activeTab === 'addresses'" class="space-y-6">
                <!-- Pickup Address -->
                <div class="bg-orange-50 rounded-xl p-4">
                  <h3 class="text-sm font-semibold text-orange-900 mb-3 flex items-center gap-2">
                    <div class="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                      <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                    </div>
                    Alış Adresi
                  </h3>
                  <p class="font-medium text-gray-900 mb-2">{{ order.pickupAddress }}</p>
                  <p v-if="order.pickupAddressDescription" class="text-sm text-gray-600 mb-2">
                    <span class="text-gray-500">Tarif:</span> {{ order.pickupAddressDescription }}
                  </p>
                  <p v-if="order.pickupContactPerson" class="text-sm text-gray-600">
                    <span class="text-gray-500">İletişim:</span> {{ order.pickupContactPerson }}
                  </p>
                </div>

                <!-- Delivery Address -->
                <div class="bg-green-50 rounded-xl p-4">
                  <h3 class="text-sm font-semibold text-green-900 mb-3 flex items-center gap-2">
                    <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                    </div>
                    Teslimat Adresi
                  </h3>
                  <p class="font-medium text-gray-900 mb-2">{{ order.deliveryAddress }}</p>
                  <p v-if="order.deliveryAddressDescription" class="text-sm text-gray-600">
                    <span class="text-gray-500">Tarif:</span> {{ order.deliveryAddressDescription }}
                  </p>
                </div>

                <!-- Business Info -->
                <div class="bg-blue-50 rounded-xl p-4">
                  <h3 class="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    <div class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    İşletme Bilgileri
                  </h3>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p class="text-xs text-gray-500 mb-1">İşletme Adı</p>
                      <p class="font-medium text-gray-900">{{ order.businessName }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500 mb-1">İşletme Telefon</p>
                      <a :href="`tel:${order.businessPhone}`" class="font-medium text-blue-600 hover:underline">
                        {{ order.businessPhone }}
                      </a>
                    </div>
                    <div v-if="order.businessContactPerson">
                      <p class="text-xs text-gray-500 mb-1">İletişim Kişisi</p>
                      <p class="font-medium text-gray-900">{{ order.businessContactPerson }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Courier Tab -->
              <div v-if="activeTab === 'courier'" class="space-y-6">
                <div v-if="order.courierId" class="bg-indigo-50 rounded-xl p-4">
                  <h3 class="text-sm font-semibold text-indigo-900 mb-3 flex items-center gap-2">
                    <div class="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                      <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                    </div>
                    Atanan Kurye
                  </h3>
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {{ order.courierName?.charAt(0)?.toUpperCase() }}
                    </div>
                    <div class="flex-1">
                      <p class="font-semibold text-gray-900">{{ order.courierName }}</p>
                      <a :href="`tel:${order.courierPhone}`" class="text-sm text-blue-600 hover:underline">
                        {{ order.courierPhone }}
                      </a>
                    </div>
                    <a
                      :href="`tel:${order.courierPhone}`"
                      class="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </a>
                  </div>
                  <div v-if="order.courierNotes" class="mt-4 pt-4 border-t border-indigo-200">
                    <p class="text-xs text-gray-500 mb-1">Kurye Notları</p>
                    <p class="font-medium text-gray-900">{{ order.courierNotes }}</p>
                  </div>
                </div>

                <div v-else class="bg-gray-50 rounded-xl p-8 text-center">
                  <div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">Kurye Bekleniyor</h3>
                  <p class="text-gray-500 text-sm">Sistem uygun bir kurye atayacak</p>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="p-4 sm:p-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3 sm:justify-between">
              <button
                @click="closeModal"
                class="px-4 py-3 text-gray-700 font-medium bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors min-h-[44px]"
              >
                Kapat
              </button>

              <div class="flex gap-3">
                <button
                  v-if="order.status !== 'CANCELLED' && order.status !== 'DELIVERED'"
                  class="px-4 py-3 text-red-600 font-medium bg-red-50 rounded-xl hover:bg-red-100 transition-colors min-h-[44px]"
                >
                  İptal Et
                </button>
                <button
                  v-if="canUpdateStatus"
                  @click="updateStatus"
                  :disabled="orderStore.isLoading"
                  class="px-4 py-3 text-white font-medium bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50 min-h-[44px] flex items-center gap-2"
                >
                  <svg v-if="orderStore.isLoading" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{{ nextStatusLabel }} Olarak İşaretle</span>
                </button>
              </div>
            </div>
          </template>

          <!-- Error State -->
          <div v-else class="p-8 text-center">
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Sipariş Bulunamadı</h3>
            <p class="text-gray-500 mb-4">Sipariş detayları yüklenemedi</p>
            <button
              @click="closeModal"
              class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
}
</style>
