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
const totalSteps = 2

// Step 1: Customer & Delivery Info (Required fields)
const orderInfo = ref({
  // Required
  pickupAddress: '',
  deliveryAddress: '',
  endCustomerName: '',
  endCustomerPhone: '',
  priority: 'NORMAL',
  paymentType: 'CASH',
  deliveryFee: 35.50,
  // Optional
  pickupAddressDescription: '',
  pickupContactPerson: '',
  deliveryAddressDescription: '',
  packageDescription: '',
  packageWeight: null,
  packageCount: 1,
  collectionAmount: 0,
  businessNotes: ''
})

// Show/hide optional fields
const showOptionalFields = ref(false)

// Priority options - Must match backend OrderPriority enum [NORMAL, HIGH, URGENT]
const priorityOptions = [
  { id: 'NORMAL', label: 'Normal', color: 'text-blue-600 bg-blue-100' },
  { id: 'HIGH', label: 'Yüksek', color: 'text-orange-600 bg-orange-100' },
  { id: 'URGENT', label: 'Acil', color: 'text-red-600 bg-red-100' }
]

// Payment type options - Must match backend PaymentType enum
const paymentTypes = [
  { id: 'CASH', label: 'Nakit', icon: '💵' },
  { id: 'CREDIT_CARD', label: 'Kredi Kartı', icon: '💳' },
  { id: 'ONLINE', label: 'Online Ödeme', icon: '📱' }
]

// Phone number without +90 prefix (user only enters 10 digits)
const phoneNumber = ref('')

// Phone validation - must be exactly 10 digits starting with 5
const isPhoneValid = computed(() => {
  const phone = phoneNumber.value
  if (!phone) return false
  // Must be 10 digits and start with 5 (Turkish mobile)
  return /^5[0-9]{9}$/.test(phone)
})

// Format phone as user types - only allow digits
function formatPhone(event) {
  // Only allow digits
  let value = event.target.value.replace(/[^0-9]/g, '')
  
  // Remove leading 0 if present
  if (value.startsWith('0')) {
    value = value.substring(1)
  }
  
  // Limit to 10 digits
  if (value.length > 10) {
    value = value.substring(0, 10)
  }
  
  phoneNumber.value = value
  // Update the full phone with +90 prefix for API
  orderInfo.value.endCustomerPhone = value ? `+90${value}` : ''
}

// Computed
const isStepValid = computed(() => {
  if (currentStep.value === 1) {
    const hasName = orderInfo.value.endCustomerName?.trim().length > 0
    const hasValidPhone = isPhoneValid.value
    const hasPickupAddress = orderInfo.value.pickupAddress?.trim().length >= 10
    const hasDeliveryAddress = orderInfo.value.deliveryAddress?.trim().length >= 10
    
    return hasName && hasValidPhone && hasPickupAddress && hasDeliveryAddress
  }
  return orderInfo.value.deliveryFee > 0
})

// Methods
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
  // Build order data - only include non-empty optional fields
  // Clean phone number (remove spaces)
  const cleanPhone = orderInfo.value.endCustomerPhone.replace(/\s/g, '')
  
  const orderData = {
    pickupAddress: orderInfo.value.pickupAddress.trim(),
    deliveryAddress: orderInfo.value.deliveryAddress.trim(),
    endCustomerName: orderInfo.value.endCustomerName.trim(),
    endCustomerPhone: cleanPhone,
    priority: orderInfo.value.priority,
    paymentType: orderInfo.value.paymentType,
    deliveryFee: parseFloat(orderInfo.value.deliveryFee)
  }

  // Add optional fields if they have values
  if (orderInfo.value.pickupAddressDescription) {
    orderData.pickupAddressDescription = orderInfo.value.pickupAddressDescription
  }
  if (orderInfo.value.pickupContactPerson) {
    orderData.pickupContactPerson = orderInfo.value.pickupContactPerson
  }
  if (orderInfo.value.deliveryAddressDescription) {
    orderData.deliveryAddressDescription = orderInfo.value.deliveryAddressDescription
  }
  if (orderInfo.value.packageDescription) {
    orderData.packageDescription = orderInfo.value.packageDescription
  }
  if (orderInfo.value.packageWeight) {
    orderData.packageWeight = parseFloat(orderInfo.value.packageWeight)
  }
  if (orderInfo.value.packageCount > 1) {
    orderData.packageCount = parseInt(orderInfo.value.packageCount)
  }
  if (orderInfo.value.collectionAmount > 0) {
    orderData.collectionAmount = parseFloat(orderInfo.value.collectionAmount)
  }
  if (orderInfo.value.businessNotes) {
    orderData.businessNotes = orderInfo.value.businessNotes
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
  resetForm()
  emit('close')
}

function resetForm() {
  currentStep.value = 1
  showOptionalFields.value = false
  phoneNumber.value = '' // Reset phone number
  orderInfo.value = {
    pickupAddress: '',
    deliveryAddress: '',
    endCustomerName: '',
    endCustomerPhone: '',
    priority: 'NORMAL',
    paymentType: 'CASH',
    deliveryFee: 35.50,
    pickupAddressDescription: '',
    pickupContactPerson: '',
    deliveryAddressDescription: '',
    packageDescription: '',
    packageWeight: null,
    packageCount: 1,
    collectionAmount: 0,
    businessNotes: ''
  }
}

// Reset form when modal closes
watch(() => props.isOpen, (isOpen) => {
  if (!isOpen) {
    resetForm()
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
            <!-- Step 1: Customer & Address Info -->
            <div v-if="currentStep === 1" class="space-y-5">
              <!-- Customer Section -->
              <div>
                <h3 class="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span class="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  Müşteri Bilgileri
                </h3>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Müşteri Adı *</label>
                    <input
                      v-model="orderInfo.endCustomerName"
                      type="text"
                      placeholder="Ad Soyad"
                      :class="[
                        'w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all',
                        orderInfo.endCustomerName && orderInfo.endCustomerName.trim().length < 2
                          ? 'border-red-300 focus:border-red-500'
                          : 'border-gray-200 focus:border-blue-500'
                      ]"
                    />
                    <p v-if="orderInfo.endCustomerName && orderInfo.endCustomerName.trim().length < 2" class="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                      <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                      </svg>
                      En az 2 karakter giriniz
                    </p>
                    <p v-else-if="orderInfo.endCustomerName && orderInfo.endCustomerName.trim().length >= 2" class="text-xs text-green-500 mt-1.5 flex items-center gap-1">
                      <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                      Geçerli
                    </p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Telefon *</label>
                    <div class="relative flex">
                      <!-- Fixed +90 Prefix -->
                      <div class="flex items-center px-4 py-3 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl">
                        <span class="text-gray-600 font-medium">+90</span>
                      </div>
                      <!-- Phone Input -->
                      <input
                        :value="phoneNumber"
                        @input="formatPhone"
                        type="tel"
                        inputmode="numeric"
                        placeholder="5XX XXX XX XX"
                        maxlength="10"
                        :class="[
                          'flex-1 px-4 py-3 border rounded-r-xl focus:ring-2 focus:ring-blue-500/20 transition-all',
                          phoneNumber && !isPhoneValid 
                            ? 'border-red-300 focus:border-red-500' 
                            : 'border-gray-200 focus:border-blue-500'
                        ]"
                      />
                    </div>
                    <p v-if="phoneNumber && !isPhoneValid" class="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                      <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                      </svg>
                      5 ile başlayan 10 haneli numara giriniz
                    </p>
                    <p v-else-if="phoneNumber && isPhoneValid" class="text-xs text-green-500 mt-1.5 flex items-center gap-1">
                      <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                      Geçerli numara
                    </p>
                  </div>
                </div>
              </div>

              <!-- Pickup Address Section -->
              <div>
                <h3 class="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span class="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  Alış Adresi
                </h3>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Alış Adresi *</label>
                  <textarea
                    v-model="orderInfo.pickupAddress"
                    rows="2"
                    placeholder="Paket alınacak adres (en az 10 karakter)"
                    :class="[
                      'w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all resize-none',
                      orderInfo.pickupAddress && orderInfo.pickupAddress.length < 10
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-gray-200 focus:border-blue-500'
                    ]"
                  ></textarea>
                  <p v-if="orderInfo.pickupAddress && orderInfo.pickupAddress.length < 10" class="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                    <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    En az 10 karakter gerekli ({{ orderInfo.pickupAddress?.length || 0 }}/10)
                  </p>
                  <p v-else-if="orderInfo.pickupAddress && orderInfo.pickupAddress.length >= 10" class="text-xs text-green-500 mt-1.5 flex items-center gap-1">
                    <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    Geçerli adres
                  </p>
                </div>
              </div>

              <!-- Delivery Address Section -->
              <div>
                <h3 class="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span class="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                  Teslimat Adresi
                </h3>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Teslimat Adresi *</label>
                  <textarea
                    v-model="orderInfo.deliveryAddress"
                    rows="2"
                    placeholder="Paket teslim edilecek adres (en az 10 karakter)"
                    :class="[
                      'w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all resize-none',
                      orderInfo.deliveryAddress && orderInfo.deliveryAddress.length < 10
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-gray-200 focus:border-blue-500'
                    ]"
                  ></textarea>
                  <p v-if="orderInfo.deliveryAddress && orderInfo.deliveryAddress.length < 10" class="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                    <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    En az 10 karakter gerekli ({{ orderInfo.deliveryAddress?.length || 0 }}/10)
                  </p>
                  <p v-else-if="orderInfo.deliveryAddress && orderInfo.deliveryAddress.length >= 10" class="text-xs text-green-500 mt-1.5 flex items-center gap-1">
                    <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    Geçerli adres
                  </p>
                </div>
              </div>

              <!-- Optional Fields Toggle -->
              <button
                @click="showOptionalFields = !showOptionalFields"
                class="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                <svg
                  :class="['w-4 h-4 transition-transform', showOptionalFields && 'rotate-180']"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
                {{ showOptionalFields ? 'Ek bilgileri gizle' : 'Ek bilgiler ekle (isteğe bağlı)' }}
              </button>

              <!-- Optional Fields -->
              <Transition name="slide">
                <div v-if="showOptionalFields" class="space-y-4 pt-2">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Alış Adresi Tarifi</label>
                      <input
                        v-model="orderInfo.pickupAddressDescription"
                        type="text"
                        placeholder="Örn: Köşe bina, kırmızı kapı"
                        class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Alış Yeri İletişim Kişisi</label>
                      <input
                        v-model="orderInfo.pickupContactPerson"
                        type="text"
                        placeholder="Teslim alınacak kişi adı"
                        class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Teslimat Adresi Tarifi</label>
                      <input
                        v-model="orderInfo.deliveryAddressDescription"
                        type="text"
                        placeholder="Örn: Ofis binası 3. kat"
                        class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Paket Açıklaması</label>
                      <input
                        v-model="orderInfo.packageDescription"
                        type="text"
                        placeholder="Örn: 2x Pizza, 1x İçecek"
                        class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Paket Ağırlığı (kg)</label>
                      <input
                        v-model="orderInfo.packageWeight"
                        type="number"
                        step="0.1"
                        min="0"
                        placeholder="Örn: 1.5"
                        class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Paket Sayısı</label>
                      <input
                        v-model="orderInfo.packageCount"
                        type="number"
                        min="1"
                        class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">İşletme Notları</label>
                    <textarea
                      v-model="orderInfo.businessNotes"
                      rows="2"
                      placeholder="Kurye için özel notlar (Örn: Sıcak tutulmalı)"
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                    ></textarea>
                  </div>
                </div>
              </Transition>
            </div>

            <!-- Step 2: Payment & Priority -->
            <div v-if="currentStep === 2" class="space-y-6">
              <!-- Priority Selection -->
              <div>
                <h3 class="text-sm font-semibold text-gray-900 mb-4">Öncelik Seviyesi</h3>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    v-for="priority in priorityOptions"
                    :key="priority.id"
                    @click="orderInfo.priority = priority.id"
                    :class="[
                      'p-3 rounded-xl border-2 text-center font-medium transition-all',
                      orderInfo.priority === priority.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    ]"
                  >
                    <span :class="['text-sm', priority.color, 'px-2 py-1 rounded-full']">
                      {{ priority.label }}
                    </span>
                  </button>
                </div>
              </div>

              <!-- Payment Type -->
              <div>
                <h3 class="text-sm font-semibold text-gray-900 mb-4">Ödeme Yöntemi</h3>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    v-for="payment in paymentTypes"
                    :key="payment.id"
                    @click="orderInfo.paymentType = payment.id"
                    :class="[
                      'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                      orderInfo.paymentType === payment.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    ]"
                  >
                    <span class="text-2xl">{{ payment.icon }}</span>
                    <span class="text-sm font-medium text-gray-700">{{ payment.label }}</span>
                  </button>
                </div>
              </div>

              <!-- Delivery Fee & Collection Amount -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Teslimat Ücreti (₺) *</label>
                  <input
                    v-model="orderInfo.deliveryFee"
                    type="number"
                    step="0.50"
                    min="0"
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Tahsilat Tutarı (₺)</label>
                  <input
                    v-model="orderInfo.collectionAmount"
                    type="number"
                    step="0.50"
                    min="0"
                    placeholder="0.00"
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                  <p class="text-xs text-gray-500 mt-1">Müşteriden tahsil edilecek ek tutar</p>
                </div>
              </div>

              <!-- Order Summary -->
              <div class="bg-gray-50 rounded-xl p-4 mt-6">
                <h4 class="font-semibold text-gray-900 mb-3">Sipariş Özeti</h4>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Müşteri:</span>
                    <span class="font-medium text-gray-900">{{ orderInfo.endCustomerName }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Telefon:</span>
                    <span class="font-medium text-gray-900">{{ orderInfo.endCustomerPhone }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Öncelik:</span>
                    <span :class="['font-medium px-2 py-0.5 rounded-full text-xs', priorityOptions.find(p => p.id === orderInfo.priority)?.color]">
                      {{ priorityOptions.find(p => p.id === orderInfo.priority)?.label }}
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Ödeme:</span>
                    <span class="font-medium text-gray-900">
                      {{ paymentTypes.find(p => p.id === orderInfo.paymentType)?.icon }}
                      {{ paymentTypes.find(p => p.id === orderInfo.paymentType)?.label }}
                    </span>
                  </div>
                  <div class="pt-2 mt-2 border-t border-gray-200 flex justify-between">
                    <span class="font-semibold text-gray-900">Teslimat Ücreti:</span>
                    <span class="font-bold text-lg text-blue-600">₺{{ parseFloat(orderInfo.deliveryFee).toFixed(2) }}</span>
                  </div>
                  <div v-if="orderInfo.collectionAmount > 0" class="flex justify-between">
                    <span class="text-gray-600">Tahsilat:</span>
                    <span class="font-medium text-green-600">₺{{ parseFloat(orderInfo.collectionAmount).toFixed(2) }}</span>
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

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
