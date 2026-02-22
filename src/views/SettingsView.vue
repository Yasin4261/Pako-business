<script setup>
// SettingsView - Settings & Configuration Page
// Single Responsibility: User and business settings management

import { ref, computed } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'

const isSidebarOpen = ref(false)
const activeTab = ref('profile')
const isSaving = ref(false)

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
}

function closeSidebar() {
  isSidebarOpen.value = false
}

const tabs = [
  { id: 'profile', label: 'Profil', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  { id: 'business', label: 'İşletme', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
  { id: 'notifications', label: 'Bildirimler', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
  { id: 'security', label: 'Güvenlik', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' }
]

// Profile form data
const profile = ref({
  name: 'Ahmet Yılmaz',
  email: 'ahmet@restoran.com',
  phone: '+90 532 123 45 67',
  role: 'Restoran Sahibi'
})

// Business form data
const business = ref({
  name: 'Lezzet Durağı',
  address: 'Atatürk Cad. No:123, Kadıköy',
  city: 'İstanbul',
  phone: '+90 216 345 67 89',
  email: 'info@lezzetduragi.com',
  openingHours: '09:00',
  closingHours: '23:00',
  description: 'Geleneksel Türk mutfağı ve modern lezzetler'
})

// Notification settings
const notifications = ref({
  newOrder: true,
  orderStatus: true,
  courierAssigned: true,
  dailyReport: false,
  weeklyReport: true,
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: true
})

// Security settings
const security = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordStrength = computed(() => {
  const password = security.value.newPassword
  if (!password) return { level: 0, label: '' }
  
  let score = 0
  if (password.length >= 8) score++
  if (password.match(/[a-z]/)) score++
  if (password.match(/[A-Z]/)) score++
  if (password.match(/[0-9]/)) score++
  if (password.match(/[^a-zA-Z0-9]/)) score++

  if (score <= 2) return { level: 1, label: 'Zayıf', color: 'red' }
  if (score <= 3) return { level: 2, label: 'Orta', color: 'yellow' }
  if (score <= 4) return { level: 3, label: 'Güçlü', color: 'green' }
  return { level: 4, label: 'Çok Güçlü', color: 'green' }
})

async function saveSettings() {
  isSaving.value = true
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  isSaving.value = false
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader @toggle-sidebar="toggleSidebar" />

    <div class="flex">
      <AppSidebar :is-open="isSidebarOpen" @close="closeSidebar" />

      <main class="flex-1 p-4 sm:p-6 lg:p-8">
        <div class="max-w-4xl mx-auto">
          <!-- Page Header -->
          <div class="mb-6 sm:mb-8">
            <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Ayarlar</h1>
            <p class="text-sm sm:text-base text-gray-500 mt-1">Hesap ve işletme ayarlarınızı yönetin</p>
          </div>

          <!-- Settings Content -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <!-- Tabs -->
            <div class="border-b border-gray-100">
              <div class="flex overflow-x-auto">
                <button
                  v-for="tab in tabs"
                  :key="tab.id"
                  @click="activeTab = tab.id"
                  :class="[
                    'flex items-center gap-2 px-4 sm:px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  ]"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="tab.icon" />
                  </svg>
                  <span class="hidden sm:inline">{{ tab.label }}</span>
                </button>
              </div>
            </div>

            <!-- Tab Content -->
            <div class="p-4 sm:p-6 lg:p-8">
              <!-- Profile Tab -->
              <div v-if="activeTab === 'profile'" class="space-y-6">
                <div class="flex flex-col sm:flex-row gap-6">
                  <!-- Avatar -->
                  <div class="flex flex-col items-center">
                    <div class="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mb-3">
                      {{ profile.name.charAt(0) }}
                    </div>
                    <button class="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      Fotoğraf Değiştir
                    </button>
                  </div>

                  <!-- Form Fields -->
                  <div class="flex-1 space-y-4">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Ad Soyad</label>
                        <input
                          v-model="profile.name"
                          type="text"
                          class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
                        <input
                          v-model="profile.email"
                          type="email"
                          class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                        <input
                          v-model="profile.phone"
                          type="tel"
                          class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Rol</label>
                        <input
                          v-model="profile.role"
                          type="text"
                          disabled
                          class="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Business Tab -->
              <div v-if="activeTab === 'business'" class="space-y-6">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="sm:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-2">İşletme Adı</label>
                    <input
                      v-model="business.name"
                      type="text"
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div class="sm:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Adres</label>
                    <input
                      v-model="business.address"
                      type="text"
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Şehir</label>
                    <input
                      v-model="business.city"
                      type="text"
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                    <input
                      v-model="business.phone"
                      type="tel"
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
                    <input
                      v-model="business.email"
                      type="email"
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Açılış</label>
                      <input
                        v-model="business.openingHours"
                        type="time"
                        class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Kapanış</label>
                      <input
                        v-model="business.closingHours"
                        type="time"
                        class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>
                  <div class="sm:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                    <textarea
                      v-model="business.description"
                      rows="3"
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                    ></textarea>
                  </div>
                </div>
              </div>

              <!-- Notifications Tab -->
              <div v-if="activeTab === 'notifications'" class="space-y-6">
                <div>
                  <h3 class="text-sm font-medium text-gray-900 mb-4">Sipariş Bildirimleri</h3>
                  <div class="space-y-4">
                    <label class="flex items-center justify-between">
                      <span class="text-gray-700">Yeni sipariş bildirimi</span>
                      <button
                        @click="notifications.newOrder = !notifications.newOrder"
                        :class="[
                          'w-12 h-6 rounded-full transition-colors',
                          notifications.newOrder ? 'bg-blue-500' : 'bg-gray-300'
                        ]"
                      >
                        <span
                          :class="[
                            'block w-5 h-5 bg-white rounded-full shadow transition-transform',
                            notifications.newOrder ? 'translate-x-6' : 'translate-x-1'
                          ]"
                        ></span>
                      </button>
                    </label>
                    <label class="flex items-center justify-between">
                      <span class="text-gray-700">Sipariş durum güncellemesi</span>
                      <button
                        @click="notifications.orderStatus = !notifications.orderStatus"
                        :class="[
                          'w-12 h-6 rounded-full transition-colors',
                          notifications.orderStatus ? 'bg-blue-500' : 'bg-gray-300'
                        ]"
                      >
                        <span
                          :class="[
                            'block w-5 h-5 bg-white rounded-full shadow transition-transform',
                            notifications.orderStatus ? 'translate-x-6' : 'translate-x-1'
                          ]"
                        ></span>
                      </button>
                    </label>
                    <label class="flex items-center justify-between">
                      <span class="text-gray-700">Kurye atama bildirimi</span>
                      <button
                        @click="notifications.courierAssigned = !notifications.courierAssigned"
                        :class="[
                          'w-12 h-6 rounded-full transition-colors',
                          notifications.courierAssigned ? 'bg-blue-500' : 'bg-gray-300'
                        ]"
                      >
                        <span
                          :class="[
                            'block w-5 h-5 bg-white rounded-full shadow transition-transform',
                            notifications.courierAssigned ? 'translate-x-6' : 'translate-x-1'
                          ]"
                        ></span>
                      </button>
                    </label>
                  </div>
                </div>

                <div class="border-t border-gray-100 pt-6">
                  <h3 class="text-sm font-medium text-gray-900 mb-4">Rapor Bildirimleri</h3>
                  <div class="space-y-4">
                    <label class="flex items-center justify-between">
                      <span class="text-gray-700">Günlük rapor</span>
                      <button
                        @click="notifications.dailyReport = !notifications.dailyReport"
                        :class="[
                          'w-12 h-6 rounded-full transition-colors',
                          notifications.dailyReport ? 'bg-blue-500' : 'bg-gray-300'
                        ]"
                      >
                        <span
                          :class="[
                            'block w-5 h-5 bg-white rounded-full shadow transition-transform',
                            notifications.dailyReport ? 'translate-x-6' : 'translate-x-1'
                          ]"
                        ></span>
                      </button>
                    </label>
                    <label class="flex items-center justify-between">
                      <span class="text-gray-700">Haftalık rapor</span>
                      <button
                        @click="notifications.weeklyReport = !notifications.weeklyReport"
                        :class="[
                          'w-12 h-6 rounded-full transition-colors',
                          notifications.weeklyReport ? 'bg-blue-500' : 'bg-gray-300'
                        ]"
                      >
                        <span
                          :class="[
                            'block w-5 h-5 bg-white rounded-full shadow transition-transform',
                            notifications.weeklyReport ? 'translate-x-6' : 'translate-x-1'
                          ]"
                        ></span>
                      </button>
                    </label>
                  </div>
                </div>

                <div class="border-t border-gray-100 pt-6">
                  <h3 class="text-sm font-medium text-gray-900 mb-4">Bildirim Kanalları</h3>
                  <div class="space-y-4">
                    <label class="flex items-center justify-between">
                      <span class="text-gray-700">E-posta bildirimleri</span>
                      <button
                        @click="notifications.emailNotifications = !notifications.emailNotifications"
                        :class="[
                          'w-12 h-6 rounded-full transition-colors',
                          notifications.emailNotifications ? 'bg-blue-500' : 'bg-gray-300'
                        ]"
                      >
                        <span
                          :class="[
                            'block w-5 h-5 bg-white rounded-full shadow transition-transform',
                            notifications.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                          ]"
                        ></span>
                      </button>
                    </label>
                    <label class="flex items-center justify-between">
                      <span class="text-gray-700">SMS bildirimleri</span>
                      <button
                        @click="notifications.smsNotifications = !notifications.smsNotifications"
                        :class="[
                          'w-12 h-6 rounded-full transition-colors',
                          notifications.smsNotifications ? 'bg-blue-500' : 'bg-gray-300'
                        ]"
                      >
                        <span
                          :class="[
                            'block w-5 h-5 bg-white rounded-full shadow transition-transform',
                            notifications.smsNotifications ? 'translate-x-6' : 'translate-x-1'
                          ]"
                        ></span>
                      </button>
                    </label>
                    <label class="flex items-center justify-between">
                      <span class="text-gray-700">Anlık bildirimler</span>
                      <button
                        @click="notifications.pushNotifications = !notifications.pushNotifications"
                        :class="[
                          'w-12 h-6 rounded-full transition-colors',
                          notifications.pushNotifications ? 'bg-blue-500' : 'bg-gray-300'
                        ]"
                      >
                        <span
                          :class="[
                            'block w-5 h-5 bg-white rounded-full shadow transition-transform',
                            notifications.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                          ]"
                        ></span>
                      </button>
                    </label>
                  </div>
                </div>
              </div>

              <!-- Security Tab -->
              <div v-if="activeTab === 'security'" class="space-y-6">
                <div>
                  <h3 class="text-sm font-medium text-gray-900 mb-4">Şifre Değiştir</h3>
                  <div class="space-y-4 max-w-md">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Mevcut Şifre</label>
                      <input
                        v-model="security.currentPassword"
                        type="password"
                        class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Yeni Şifre</label>
                      <input
                        v-model="security.newPassword"
                        type="password"
                        class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                      <div v-if="security.newPassword" class="mt-2">
                        <div class="flex gap-1">
                          <div
                            v-for="i in 4"
                            :key="i"
                            :class="[
                              'flex-1 h-1 rounded-full transition-colors',
                              i <= passwordStrength.level
                                ? passwordStrength.color === 'red' ? 'bg-red-500'
                                  : passwordStrength.color === 'yellow' ? 'bg-yellow-500'
                                  : 'bg-green-500'
                                : 'bg-gray-200'
                            ]"
                          ></div>
                        </div>
                        <p
                          :class="[
                            'text-xs mt-1',
                            passwordStrength.color === 'red' ? 'text-red-600'
                              : passwordStrength.color === 'yellow' ? 'text-yellow-600'
                              : 'text-green-600'
                          ]"
                        >
                          {{ passwordStrength.label }}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Şifre Tekrar</label>
                      <input
                        v-model="security.confirmPassword"
                        type="password"
                        class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                      <p
                        v-if="security.confirmPassword && security.newPassword !== security.confirmPassword"
                        class="text-xs text-red-600 mt-1"
                      >
                        Şifreler eşleşmiyor
                      </p>
                    </div>
                  </div>
                </div>

                <div class="border-t border-gray-100 pt-6">
                  <h3 class="text-sm font-medium text-gray-900 mb-4">Oturum Güvenliği</h3>
                  <div class="space-y-4">
                    <div class="p-4 bg-gray-50 rounded-xl flex items-center justify-between">
                      <div>
                        <p class="font-medium text-gray-900">İki Faktörlü Doğrulama</p>
                        <p class="text-sm text-gray-500">Hesabınıza ekstra güvenlik katmanı ekleyin</p>
                      </div>
                      <button class="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                        Etkinleştir
                      </button>
                    </div>
                    <div class="p-4 bg-gray-50 rounded-xl flex items-center justify-between">
                      <div>
                        <p class="font-medium text-gray-900">Oturum Geçmişi</p>
                        <p class="text-sm text-gray-500">Aktif oturumlarınızı görüntüleyin ve yönetin</p>
                      </div>
                      <button class="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
                        Görüntüle
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Save Button -->
              <div class="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                <button
                  @click="saveSettings"
                  :disabled="isSaving"
                  class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50 min-h-[44px]"
                >
                  <svg v-if="isSaving" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{{ isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet' }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
