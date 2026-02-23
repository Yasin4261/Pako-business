<script setup>
// OrderDetailModal - Order Detail View Modal
// Single Responsibility: Display detailed order information

import { ref, watch, computed } from 'vue'
import { useOrderStore } from '@/stores/order.store'
import { formatPhoneDisplay } from '@/composables/usePhoneFormat'

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

const emit = defineEmits(['close', 'updated'])

const orderStore = useOrderStore()
const order = ref(null)
const isLoading = ref(false)
const activeTab = ref('details')

// Edit mode state
const isEditMode = ref(false)
const editForm = ref({})

// Cancel modal state
const showCancelModal = ref(false)
const cancelReason = ref('')

// Status config
const statusConfig = {
  PENDING: { label: 'Bekleyen', color: 'bg-yellow-100 text-yellow-700' },
  ACCEPTED: { label: 'Kabul Edildi', color: 'bg-blue-100 text-blue-700' },
  PREPARING: { label: 'Hazırlanıyor', color: 'bg-blue-100 text-blue-700' },
  READY: { label: 'Hazır', color: 'bg-purple-100 text-purple-700' },
  COURIER_ASSIGNED: { label: 'Kurye Atandı', color: 'bg-indigo-100 text-indigo-700' },
  PICKED_UP: { label: 'Alındı', color: 'bg-indigo-100 text-indigo-700' },
  IN_TRANSIT: { label: 'Yolda', color: 'bg-orange-100 text-orange-700' },
  DELIVERED: { label: 'Teslim Edildi', color: 'bg-green-100 text-green-700' },
  CANCELLED: { label: 'İptal Edildi', color: 'bg-red-100 text-red-700' }
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

// Priority options for edit mode
const priorityOptions = [
  { id: 'NORMAL', label: 'Normal' },
  { id: 'HIGH', label: 'Yüksek' },
  { id: 'URGENT', label: 'Acil' }
]

// Payment type options for edit mode
const paymentOptions = [
  { id: 'CASH', label: 'Nakit' },
  { id: 'CREDIT_CARD', label: 'Kredi Kartı' },
  { id: 'ONLINE', label: 'Online Ödeme' }
]

// Computed - can edit only if not delivered or cancelled
const canEdit = computed(() => {
  if (!order.value) return false
  return !['DELIVERED', 'CANCELLED'].includes(order.value.status)
})

// Status change loading state
const isStatusChanging = ref(false)

// Full status flow for visualization (all steps visible)
const allStatusSteps = [
  { id: 'PREPARING', label: 'Hazırlanıyor', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z', canBusinessChange: true },
  { id: 'READY', label: 'Hazır', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', canBusinessChange: true },
  { id: 'IN_TRANSIT', label: 'Yolda', icon: 'M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0', canBusinessChange: false },
  { id: 'DELIVERED', label: 'Teslim Edildi', icon: 'M5 13l4 4L19 7', canBusinessChange: false }
]

// Get current step index for full flow
const currentStepIndex = computed(() => {
  if (!order.value) return -1
  const status = order.value.status
  
  // Map status to step index
  if (status === 'PENDING' || status === 'ACCEPTED') return -1 // Before first step
  if (status === 'PREPARING') return 0
  if (status === 'READY' || status === 'COURIER_ASSIGNED' || status === 'PICKED_UP') return 1
  if (status === 'IN_TRANSIT') return 2
  if (status === 'DELIVERED') return 3
  if (status === 'CANCELLED') return -2
  
  return -1
})

// Check if business can still change status (only PENDING, PREPARING, READY)
const canBusinessChangeStatus = computed(() => {
  if (!order.value) return false
  const businessStatuses = ['PENDING', 'ACCEPTED', 'PREPARING', 'READY']
  return businessStatuses.includes(order.value.status)
})

// Get next status (only within business control)
const nextStatus = computed(() => {
  if (!canBusinessChangeStatus.value) return null
  
  // If PENDING/ACCEPTED, next is PREPARING (index 0)
  if (['PENDING', 'ACCEPTED'].includes(order.value.status)) {
    return allStatusSteps[0]
  }
  
  // If PREPARING, next is READY (index 1)
  if (order.value.status === 'PREPARING') {
    return allStatusSteps[1]
  }
  
  // If READY, no next for business
  return null
})

// Get previous status (only within business control)
const previousStatus = computed(() => {
  if (!canBusinessChangeStatus.value) return null
  
  // If READY, previous is PREPARING
  if (order.value.status === 'READY') {
    return allStatusSteps[0]
  }
  
  // If PREPARING, no previous (can't go back to PENDING)
  return null
})

// Change to specific status
async function changeToStatus(targetStatus) {
  if (isStatusChanging.value) return
  
  isStatusChanging.value = true
  
  try {
    const result = await orderStore.updateOrderStatus(order.value.orderId, targetStatus)
    
    if (result.success) {
      // Update local state immediately for UX
      order.value.status = targetStatus
      
      // Also refresh the orders list to sync everything
      await orderStore.fetchOrders()
      
      emit('updated', order.value)
    } else {
      alert(result.error || 'Durum güncellenemedi')
    }
  } finally {
    isStatusChanging.value = false
  }
}

// Change to next status
async function advanceStatus() {
  if (!nextStatus.value || isStatusChanging.value) return
  await changeToStatus(nextStatus.value.id)
}

// Change to previous status
async function revertStatus() {
  if (!previousStatus.value || isStatusChanging.value) return
  await changeToStatus(previousStatus.value.id)
}

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

// Enter edit mode
function enterEditMode() {
  editForm.value = {
    endCustomerName: order.value.endCustomerName,
    endCustomerPhone: order.value.endCustomerPhone,
    pickupAddress: order.value.pickupAddress,
    pickupAddressDescription: order.value.pickupAddressDescription || '',
    deliveryAddress: order.value.deliveryAddress,
    deliveryAddressDescription: order.value.deliveryAddressDescription || '',
    packageDescription: order.value.packageDescription || '',
    packageWeight: order.value.packageWeight,
    packageCount: order.value.packageCount,
    priority: order.value.priority,
    paymentType: order.value.paymentType,
    deliveryFee: order.value.deliveryFee,
    collectionAmount: order.value.collectionAmount || 0,
    businessNotes: order.value.businessNotes || ''
  }
  isEditMode.value = true
}

// Cancel edit mode
function cancelEditMode() {
  isEditMode.value = false
  editForm.value = {}
}

// Save edited order
async function saveOrder() {
  const result = await orderStore.updateOrder(order.value.orderId, editForm.value)
  
  if (result.success) {
    // Update local order data
    order.value = { ...order.value, ...editForm.value }
    isEditMode.value = false
    emit('updated', order.value)
  } else {
    alert(result.error || 'Sipariş güncellenemedi')
  }
}

// Open cancel modal
function openCancelModal() {
  cancelReason.value = ''
  showCancelModal.value = true
}

// Cancel order
async function confirmCancelOrder() {
  const result = await orderStore.cancelOrder(order.value.orderId, cancelReason.value)
  
  if (result.success) {
    order.value.status = 'CANCELLED'
    showCancelModal.value = false
    emit('updated', order.value)
  } else {
    alert(result.error || 'Sipariş iptal edilemedi')
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
  isEditMode.value = false
  showCancelModal.value = false
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
  <div>
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
                    <h2 class="text-lg sm:text-xl font-bold text-gray-900">
                      {{ isEditMode ? 'Siparişi Düzenle' : `#${order.orderNumber}` }}
                    </h2>
                    <!-- Status Badge -->
                    <span
                      v-if="!isEditMode"
                      :class="['px-3 py-1 rounded-full text-xs font-medium', statusConfig[order.status]?.color]"
                    >
                      {{ statusConfig[order.status]?.label }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-500">{{ formatDate(order.createdAt) }}</p>
                </div>
                <div class="flex items-center gap-2">
                  <!-- Edit Button -->
                  <button
                    v-if="canEdit && !isEditMode"
                    @click="enterEditMode"
                    class="p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Düzenle"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <!-- Close Button -->
                  <button
                    @click="closeModal"
                    class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Tabs - Hide in edit mode -->
              <div v-if="!isEditMode" class="flex gap-2 mt-4">
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
              <!-- Edit Mode Form -->
              <div v-if="isEditMode" class="space-y-6">
                <!-- Customer Info Edit -->
                <div class="bg-blue-50 rounded-xl p-4">
                  <h3 class="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Müşteri Bilgileri
                  </h3>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-xs text-gray-600 mb-1">Ad Soyad *</label>
                      <input
                        v-model="editForm.endCustomerName"
                        type="text"
                        class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label class="block text-xs text-gray-600 mb-1">Telefon *</label>
                      <input
                        v-model="editForm.endCustomerPhone"
                        type="tel"
                        class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <!-- Addresses Edit -->
                <div class="bg-gray-50 rounded-xl p-4">
                  <h3 class="text-sm font-semibold text-gray-900 mb-4">Adres Bilgileri</h3>
                  <div class="space-y-4">
                    <div>
                      <label class="block text-xs text-gray-600 mb-1">Alış Adresi *</label>
                      <textarea
                        v-model="editForm.pickupAddress"
                        rows="2"
                        class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                      ></textarea>
                    </div>
                    <div>
                      <label class="block text-xs text-gray-600 mb-1">Alış Adresi Tarifi</label>
                      <input
                        v-model="editForm.pickupAddressDescription"
                        type="text"
                        class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label class="block text-xs text-gray-600 mb-1">Teslimat Adresi *</label>
                      <textarea
                        v-model="editForm.deliveryAddress"
                        rows="2"
                        class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                      ></textarea>
                    </div>
                    <div>
                      <label class="block text-xs text-gray-600 mb-1">Teslimat Adresi Tarifi</label>
                      <input
                        v-model="editForm.deliveryAddressDescription"
                        type="text"
                        class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <!-- Order Details Edit -->
                <div class="bg-gray-50 rounded-xl p-4">
                  <h3 class="text-sm font-semibold text-gray-900 mb-4">Sipariş Detayları</h3>
                  <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                      <label class="block text-xs text-gray-600 mb-1">Öncelik</label>
                      <select
                        v-model="editForm.priority"
                        class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      >
                        <option v-for="opt in priorityOptions" :key="opt.id" :value="opt.id">
                          {{ opt.label }}
                        </option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-xs text-gray-600 mb-1">Ödeme Tipi</label>
                      <select
                        v-model="editForm.paymentType"
                        class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      >
                        <option v-for="opt in paymentOptions" :key="opt.id" :value="opt.id">
                          {{ opt.label }}
                        </option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-xs text-gray-600 mb-1">Paket Sayısı</label>
                      <input
                        v-model.number="editForm.packageCount"
                        type="number"
                        min="1"
                        class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label class="block text-xs text-gray-600 mb-1">Paket Ağırlığı (kg)</label>
                      <input
                        v-model.number="editForm.packageWeight"
                        type="number"
                        step="0.1"
                        class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label class="block text-xs text-gray-600 mb-1">Teslimat Ücreti (₺)</label>
                      <input
                        v-model.number="editForm.deliveryFee"
                        type="number"
                        step="0.01"
                        class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label class="block text-xs text-gray-600 mb-1">Tahsilat (₺)</label>
                      <input
                        v-model.number="editForm.collectionAmount"
                        type="number"
                        step="0.01"
                        class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div class="mt-4">
                    <label class="block text-xs text-gray-600 mb-1">Paket Açıklaması</label>
                    <input
                      v-model="editForm.packageDescription"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <div class="mt-4">
                    <label class="block text-xs text-gray-600 mb-1">İşletme Notları</label>
                    <textarea
                      v-model="editForm.businessNotes"
                      rows="2"
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                    ></textarea>
                  </div>
                </div>
              </div>

              <!-- Details Tab (View Mode) -->
              <div v-else-if="activeTab === 'details'" class="space-y-6">
                <!-- Status Timeline & Action -->
                <div v-if="order.status !== 'CANCELLED'" class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
                  <h3 class="text-sm font-semibold text-gray-900 mb-4">Sipariş Durumu</h3>
                  
                  <!-- Status Timeline - Full Flow -->
                  <div class="flex items-center justify-between mb-4">
                    <div
                      v-for="(step, index) in allStatusSteps"
                      :key="step.id"
                      class="flex flex-col items-center flex-1"
                    >
                      <!-- Step Circle -->
                      <button
                        @click="step.canBusinessChange && canBusinessChangeStatus && index !== currentStepIndex && changeToStatus(step.id)"
                        :disabled="!step.canBusinessChange || !canBusinessChangeStatus || index === currentStepIndex || isStatusChanging"
                        :class="[
                          'w-10 h-10 rounded-full flex items-center justify-center transition-all',
                          index <= currentStepIndex && currentStepIndex >= 0 ? 'bg-green-500 text-white' :
                          index === currentStepIndex ? 'bg-blue-500 text-white ring-4 ring-blue-200' :
                          'bg-gray-200 text-gray-400',
                          step.canBusinessChange && canBusinessChangeStatus && index !== currentStepIndex && !isStatusChanging ? 'cursor-pointer hover:ring-4 hover:ring-blue-300 hover:scale-110' : 'cursor-default'
                        ]"
                        :title="step.canBusinessChange && canBusinessChangeStatus && index !== currentStepIndex ? `${step.label} olarak değiştir` : (!step.canBusinessChange ? 'Kurye tarafından güncellenir' : '')"
                      >
                        <svg v-if="index < currentStepIndex && currentStepIndex >= 0" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="step.icon" />
                        </svg>
                      </button>
                      <!-- Step Label -->
                      <span
                        :class="[
                          'text-xs mt-2 text-center font-medium',
                          index <= currentStepIndex && currentStepIndex >= 0 ? 'text-gray-900' : 'text-gray-400',
                          !step.canBusinessChange ? 'italic' : ''
                        ]"
                      >
                        {{ step.label }}
                        <span v-if="!step.canBusinessChange" class="block text-[10px] text-gray-400">(Kurye)</span>
                      </span>
                      <!-- Connector Line -->
                      <div
                        v-if="index < allStatusSteps.length - 1"
                        :class="[
                          'absolute h-0.5 top-5',
                          index < currentStepIndex && currentStepIndex >= 0 ? 'bg-green-500' : 'bg-gray-200'
                        ]"
                        :style="{ left: `${(100 / allStatusSteps.length) * (index + 0.5)}%`, width: `${100 / allStatusSteps.length}%` }"
                      ></div>
                    </div>
                  </div>

                  <!-- Waiting/Pending Info -->
                  <div v-if="['PENDING', 'ACCEPTED'].includes(order.status)" class="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div class="flex items-center gap-2 text-yellow-700">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span class="font-medium">Sipariş bekliyor - Hazırlanmaya başlayın</span>
                    </div>
                  </div>

                  <!-- Courier Status Info (when order is with courier) -->
                  <div v-else-if="['COURIER_ASSIGNED', 'PICKED_UP', 'IN_TRANSIT'].includes(order.status)" class="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div class="flex items-center gap-2 text-blue-700">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                      </svg>
                      <span class="font-medium">Sipariş kuryede - durum kurye tarafından güncellenir</span>
                    </div>
                  </div>

                  <!-- Status Action Buttons - Previous & Next -->
                  <div v-if="canBusinessChangeStatus && (previousStatus || nextStatus)" class="pt-4 border-t border-white/50 flex gap-3">
                    <!-- Previous Status Button -->
                    <button
                      v-if="previousStatus"
                      @click="revertStatus"
                      :disabled="isStatusChanging"
                      class="flex-1 py-3 px-4 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                      </svg>
                      <span class="hidden sm:inline">{{ previousStatus.label }}</span>
                      <span class="sm:hidden">Geri</span>
                    </button>

                    <!-- Next Status Button -->
                    <button
                      v-if="nextStatus"
                      @click="advanceStatus"
                      :disabled="isStatusChanging"
                      class="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <svg v-if="isStatusChanging" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span class="hidden sm:inline">{{ isStatusChanging ? 'Güncelleniyor...' : nextStatus.label }}</span>
                      <span class="sm:hidden">{{ isStatusChanging ? '...' : 'İleri' }}</span>
                      <svg v-if="!isStatusChanging" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </div>

                  <!-- Cancel Order Button (when business can still control) -->
                  <div v-if="canBusinessChangeStatus && order.status !== 'CANCELLED'" class="pt-3">
                    <button
                      @click="showCancelModal = true"
                      class="w-full py-2.5 px-4 bg-red-50 border border-red-200 text-red-600 font-medium rounded-xl hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Siparişi İptal Et
                    </button>
                  </div>

                  <!-- Completed State -->
                  <div v-if="order.status === 'DELIVERED'" class="pt-4 border-t border-white/50 text-center">
                    <div class="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full font-medium">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Sipariş Tamamlandı
                    </div>
                  </div>
                </div>

                <!-- Cancelled State -->
                <div v-else class="bg-red-50 rounded-xl p-4 text-center">
                  <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <h3 class="text-lg font-semibold text-red-700 mb-1">Sipariş İptal Edildi</h3>
                  <p class="text-sm text-red-600">Bu sipariş iptal edilmiştir</p>
                </div>
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
                        {{ formatPhoneDisplay(order.endCustomerPhone) }}
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
                        {{ formatPhoneDisplay(order.businessPhone) }}
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
                        {{ formatPhoneDisplay(order.courierPhone) }}
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
              <!-- Edit Mode Footer -->
              <template v-if="isEditMode">
                <button
                  @click="cancelEditMode"
                  class="px-4 py-3 text-gray-700 font-medium bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors min-h-[44px]"
                >
                  Vazgeç
                </button>
                <button
                  @click="saveOrder"
                  :disabled="orderStore.isLoading"
                  class="px-6 py-3 text-white font-medium bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50 min-h-[44px] flex items-center justify-center gap-2"
                >
                  <svg v-if="orderStore.isLoading" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{{ orderStore.isLoading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet' }}</span>
                </button>
              </template>

              <!-- View Mode Footer -->
              <template v-else>
                <button
                  @click="closeModal"
                  class="px-4 py-3 text-gray-700 font-medium bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors min-h-[44px]"
                >
                  Kapat
                </button>

                <div class="flex gap-3">
                  <button
                    v-if="canEdit"
                    @click="openCancelModal"
                    class="px-4 py-3 text-red-600 font-medium bg-red-50 rounded-xl hover:bg-red-100 transition-colors min-h-[44px] flex items-center gap-2"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    İptal Et
                  </button>
                </div>
              </template>
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

    <!-- Cancel Order Modal -->
    <Transition name="modal">
      <div
        v-if="showCancelModal"
        class="fixed inset-0 z-[60] flex items-center justify-center p-4"
      >
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          @click="showCancelModal = false"
        ></div>
        <div class="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div class="p-6">
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 text-center mb-2">Siparişi İptal Et</h3>
            <p class="text-gray-500 text-center text-sm mb-4">
              Bu işlem geri alınamaz. Siparişi iptal etmek istediğinizden emin misiniz?
            </p>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">İptal Sebebi (Opsiyonel)</label>
              <textarea
                v-model="cancelReason"
                rows="2"
                placeholder="Örn: Müşteri vazgeçti"
                class="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-none"
              ></textarea>
            </div>
            <div class="flex gap-3">
              <button
                @click="showCancelModal = false"
                class="flex-1 px-4 py-3 text-gray-700 font-medium bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Vazgeç
              </button>
              <button
                @click="confirmCancelOrder"
                :disabled="orderStore.isLoading"
                class="flex-1 px-4 py-3 text-white font-medium bg-red-500 rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <svg v-if="orderStore.isLoading" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{{ orderStore.isLoading ? 'İptal Ediliyor...' : 'İptal Et' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
  </div>
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

/* Dropdown animation */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
