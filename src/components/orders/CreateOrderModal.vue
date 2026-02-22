<script setup>
// CreateOrderModal - New Order Creation Modal
// Single Responsibility: Handle new order creation form

import { ref, computed, watch } from 'vue'
import { useOrderStore } from '@/stores/order.store'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'created'])

const orderStore = useOrderStore()

// Form steps
const currentStep = ref(1)
const totalSteps = 3

// Step 1: Customer Info
const customerInfo = ref({
  name: '',
  phone: '',
  address: '',
  notes: ''
})

// Step 2: Menu Items
const selectedItems = ref([])

// Available menu items (demo data)
const menuItems = [
  { id: 1, name: 'Klasik Burger', price: 129.99, category: 'Burgerler' },
  { id: 2, name: 'Cheeseburger', price: 149.99, category: 'Burgerler' },
  { id: 3, name: 'Margherita Pizza', price: 169.99, category: 'Pizzalar' },
  { id: 4, name: 'Sucuklu Pizza', price: 189.99, category: 'Pizzalar' },
  { id: 5, name: 'Coca Cola', price: 29.99, category: 'İçecekler' },
  { id: 6, name: 'Taze Limonata', price: 49.99, category: 'İçecekler' },
  { id: 7, name: 'Çikolatalı Pasta', price: 89.99, category: 'Tatlılar' },
  { id: 8, name: 'Dondurma Sundae', price: 69.99, category: 'Tatlılar' }
]

// Step 3: Payment
const paymentMethod = ref('cash')

const paymentMethods = [
  { id: 'cash', label: 'Nakit', icon: '💵' },
  { id: 'card', label: 'Kredi Kartı', icon: '💳' },
  { id: 'online', label: 'Online Ödeme', icon: '📱' }
]

// Computed
const orderTotal = computed(() => {
  return selectedItems.value.reduce((total, item) => {
    return total + (item.price * item.quantity)
  }, 0)
})

const isStepValid = computed(() => {
  if (currentStep.value === 1) {
    return customerInfo.value.name && customerInfo.value.phone && customerInfo.value.address
  }
  if (currentStep.value === 2) {
    return selectedItems.value.length > 0
  }
  return true
})

// Methods
function addItem(item) {
  const existing = selectedItems.value.find(i => i.id === item.id)
  if (existing) {
    existing.quantity++
  } else {
    selectedItems.value.push({ ...item, quantity: 1 })
  }
}

function removeItem(itemId) {
  const index = selectedItems.value.findIndex(i => i.id === itemId)
  if (index > -1) {
    if (selectedItems.value[index].quantity > 1) {
      selectedItems.value[index].quantity--
    } else {
      selectedItems.value.splice(index, 1)
    }
  }
}

function nextStep() {
  if (currentStep.value < totalSteps && isStepValid.value) {
    currentStep.value++
  }
}

function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

async function createOrder() {
  const orderData = {
    customer: customerInfo.value,
    items: selectedItems.value,
    paymentMethod: paymentMethod.value,
    total: orderTotal.value
  }

  try {
    await orderStore.createOrder(orderData)
    emit('created')
    closeModal()
  } catch (error) {
    console.error('Order creation failed:', error)
  }
}

function closeModal() {
  currentStep.value = 1
  customerInfo.value = { name: '', phone: '', address: '', notes: '' }
  selectedItems.value = []
  paymentMethod.value = 'cash'
  emit('close')
}

// Reset form when modal closes
watch(() => props.isOpen, (isOpen) => {
  if (!isOpen) {
    currentStep.value = 1
    customerInfo.value = { name: '', phone: '', address: '', notes: '' }
    selectedItems.value = []
    paymentMethod.value = 'cash'
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
          <!-- Header -->
          <div class="p-4 sm:p-6 border-b border-gray-100">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-lg sm:text-xl font-bold text-gray-900">Yeni Sipariş Oluştur</h2>
                <p class="text-sm text-gray-500 mt-1">Adım {{ currentStep }} / {{ totalSteps }}</p>
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

            <!-- Progress Bar -->
            <div class="flex gap-2 mt-4">
              <div
                v-for="step in totalSteps"
                :key="step"
                :class="[
                  'flex-1 h-1 rounded-full transition-colors',
                  step <= currentStep ? 'bg-blue-500' : 'bg-gray-200'
                ]"
              ></div>
            </div>
          </div>

          <!-- Body -->
          <div class="flex-1 overflow-y-auto p-4 sm:p-6">
            <!-- Step 1: Customer Info -->
            <div v-if="currentStep === 1" class="space-y-4">
              <h3 class="text-sm font-semibold text-gray-900 mb-4">Müşteri Bilgileri</h3>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Müşteri Adı *</label>
                <input
                  v-model="customerInfo.name"
                  type="text"
                  placeholder="Ad Soyad"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Telefon *</label>
                <input
                  v-model="customerInfo.phone"
                  type="tel"
                  placeholder="+90 5XX XXX XX XX"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Teslimat Adresi *</label>
                <textarea
                  v-model="customerInfo.address"
                  rows="2"
                  placeholder="Tam adres giriniz"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                ></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Sipariş Notu</label>
                <textarea
                  v-model="customerInfo.notes"
                  rows="2"
                  placeholder="İsteğe bağlı notlar..."
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                ></textarea>
              </div>
            </div>

            <!-- Step 2: Menu Items -->
            <div v-if="currentStep === 2" class="space-y-4">
              <h3 class="text-sm font-semibold text-gray-900 mb-4">Ürün Seçimi</h3>

              <!-- Selected Items -->
              <div v-if="selectedItems.length > 0" class="bg-blue-50 rounded-xl p-4 mb-4">
                <p class="text-sm font-medium text-blue-900 mb-3">Seçilen Ürünler ({{ selectedItems.length }})</p>
                <div class="space-y-2">
                  <div
                    v-for="item in selectedItems"
                    :key="item.id"
                    class="flex items-center justify-between bg-white rounded-lg p-2"
                  >
                    <span class="text-sm text-gray-900">{{ item.name }} x{{ item.quantity }}</span>
                    <div class="flex items-center gap-2">
                      <span class="text-sm font-medium text-gray-900">₺{{ (item.price * item.quantity).toFixed(2) }}</span>
                      <button
                        @click="removeItem(item.id)"
                        class="p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="mt-3 pt-3 border-t border-blue-200 flex justify-between">
                  <span class="font-medium text-blue-900">Toplam:</span>
                  <span class="font-bold text-blue-900">₺{{ orderTotal.toFixed(2) }}</span>
                </div>
              </div>

              <!-- Menu Items -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  v-for="item in menuItems"
                  :key="item.id"
                  @click="addItem(item)"
                  class="flex items-center justify-between p-3 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                >
                  <div>
                    <p class="font-medium text-gray-900 text-sm">{{ item.name }}</p>
                    <p class="text-xs text-gray-500">{{ item.category }}</p>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="font-semibold text-blue-600">₺{{ item.price.toFixed(2) }}</span>
                    <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>

            <!-- Step 3: Payment -->
            <div v-if="currentStep === 3" class="space-y-4">
              <h3 class="text-sm font-semibold text-gray-900 mb-4">Ödeme Yöntemi</h3>

              <!-- Payment Methods -->
              <div class="space-y-2">
                <button
                  v-for="method in paymentMethods"
                  :key="method.id"
                  @click="paymentMethod = method.id"
                  :class="[
                    'w-full flex items-center gap-4 p-4 border-2 rounded-xl transition-all',
                    paymentMethod === method.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  ]"
                >
                  <span class="text-2xl">{{ method.icon }}</span>
                  <span class="font-medium text-gray-900">{{ method.label }}</span>
                  <div
                    v-if="paymentMethod === method.id"
                    class="ml-auto w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
                  >
                    <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </button>
              </div>

              <!-- Order Summary -->
              <div class="bg-gray-50 rounded-xl p-4 mt-6">
                <h4 class="font-semibold text-gray-900 mb-3">Sipariş Özeti</h4>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Müşteri:</span>
                    <span class="font-medium text-gray-900">{{ customerInfo.name }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Telefon:</span>
                    <span class="font-medium text-gray-900">{{ customerInfo.phone }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Ürün Sayısı:</span>
                    <span class="font-medium text-gray-900">{{ selectedItems.length }} ürün</span>
                  </div>
                  <div class="pt-2 mt-2 border-t border-gray-200 flex justify-between">
                    <span class="font-semibold text-gray-900">Toplam Tutar:</span>
                    <span class="font-bold text-lg text-blue-600">₺{{ orderTotal.toFixed(2) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="p-4 sm:p-6 border-t border-gray-100 flex justify-between gap-3">
            <button
              v-if="currentStep > 1"
              @click="prevStep"
              class="px-4 sm:px-6 py-3 text-gray-700 font-medium bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors min-h-[44px]"
            >
              Geri
            </button>
            <div v-else></div>

            <button
              v-if="currentStep < totalSteps"
              @click="nextStep"
              :disabled="!isStepValid"
              class="px-4 sm:px-6 py-3 text-white font-medium bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
            >
              Devam
            </button>
            <button
              v-else
              @click="createOrder"
              :disabled="orderStore.isLoading"
              class="px-4 sm:px-6 py-3 text-white font-medium bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all disabled:opacity-50 min-h-[44px] flex items-center gap-2"
            >
              <svg v-if="orderStore.isLoading" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ orderStore.isLoading ? 'Oluşturuluyor...' : 'Siparişi Oluştur' }}</span>
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
