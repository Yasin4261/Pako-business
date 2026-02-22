<script setup>
// SettingsView - Settings Page
// Single Responsibility: Application settings and preferences

import { ref } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import { useAuthStore } from '@/stores/auth.store.js'

const authStore = useAuthStore()
const isSidebarOpen = ref(false)
const activeTab = ref('profile')

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
}

function closeSidebar() {
  isSidebarOpen.value = false
}

const tabs = [
  { id: 'profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  { id: 'business', label: 'Business', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
  { id: 'notifications', label: 'Notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
  { id: 'security', label: 'Security', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' }
]

// Profile form
const profile = ref({
  name: authStore.userName || 'John Doe',
  email: authStore.user?.email || 'john@pakobusiness.com',
  phone: '+90 555 123 4567'
})

// Business form
const business = ref({
  name: 'Pako Restaurant',
  address: '123 Main Street, Istanbul',
  workingHours: '09:00 - 22:00',
  deliveryRadius: '5',
  minOrder: '20'
})

// Notification settings
const notifications = ref({
  newOrder: true,
  orderStatus: true,
  courierAssigned: true,
  dailyReport: false,
  marketing: false,
  sound: true
})

// Security settings
const security = ref({
  twoFactor: false,
  sessionTimeout: '30'
})

const isSaving = ref(false)

async function saveSettings() {
  isSaving.value = true
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  isSaving.value = false
  alert('Settings saved successfully!')
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
            <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Settings</h1>
            <p class="text-sm sm:text-base text-gray-500 mt-1">Manage your account and preferences</p>
          </div>

          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <!-- Tabs -->
            <div class="flex border-b border-gray-100 overflow-x-auto">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                  'flex items-center gap-2 px-4 sm:px-6 py-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap',
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                ]"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="tab.icon" />
                </svg>
                {{ tab.label }}
              </button>
            </div>

            <!-- Tab Content -->
            <div class="p-4 sm:p-6 lg:p-8">
              <!-- Profile Tab -->
              <div v-if="activeTab === 'profile'" class="space-y-6">
                <div class="flex items-center gap-4 pb-6 border-b border-gray-100">
                  <div class="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl">
                    {{ profile.name.charAt(0) }}
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900">{{ profile.name }}</h3>
                    <p class="text-sm text-gray-500">{{ profile.email }}</p>
                    <button class="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                      Change Avatar
                    </button>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      v-model="profile.name"
                      type="text"
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      v-model="profile.email"
                      type="email"
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      v-model="profile.phone"
                      type="tel"
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              <!-- Business Tab -->
              <div v-if="activeTab === 'business'" class="space-y-6">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div class="sm:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                    <input
                      v-model="business.name"
                      type="text"
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div class="sm:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input
                      v-model="business.address"
                      type="text"
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Working Hours</label>
                    <input
                      v-model="business.workingHours"
                      type="text"
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Delivery Radius (km)</label>
                    <input
                      v-model="business.deliveryRadius"
                      type="number"
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Minimum Order ($)</label>
                    <input
                      v-model="business.minOrder"
                      type="number"
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              <!-- Notifications Tab -->
              <div v-if="activeTab === 'notifications'" class="space-y-4">
                <div
                  v-for="(value, key) in notifications"
                  :key="key"
                  class="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                >
                  <div>
                    <p class="font-medium text-gray-900 capitalize">{{ key.replace(/([A-Z])/g, ' $1').trim() }}</p>
                    <p class="text-sm text-gray-500">
                      {{ key === 'newOrder' ? 'Get notified when a new order arrives' :
                         key === 'orderStatus' ? 'Updates on order status changes' :
                         key === 'courierAssigned' ? 'When a courier is assigned to an order' :
                         key === 'dailyReport' ? 'Receive daily summary reports' :
                         key === 'marketing' ? 'Tips and promotional content' :
                         'Play sound for notifications' }}
                    </p>
                  </div>
                  <button
                    @click="notifications[key] = !notifications[key]"
                    :class="[
                      'w-12 h-7 rounded-full transition-colors',
                      notifications[key] ? 'bg-blue-500' : 'bg-gray-200'
                    ]"
                  >
                    <span
                      :class="[
                        'block w-5 h-5 bg-white rounded-full shadow transition-transform',
                        notifications[key] ? 'translate-x-6' : 'translate-x-1'
                      ]"
                    ></span>
                  </button>
                </div>
              </div>

              <!-- Security Tab -->
              <div v-if="activeTab === 'security'" class="space-y-6">
                <div class="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p class="font-medium text-gray-900">Two-Factor Authentication</p>
                    <p class="text-sm text-gray-500">Add an extra layer of security to your account</p>
                  </div>
                  <button
                    @click="security.twoFactor = !security.twoFactor"
                    :class="[
                      'w-12 h-7 rounded-full transition-colors',
                      security.twoFactor ? 'bg-blue-500' : 'bg-gray-200'
                    ]"
                  >
                    <span
                      :class="[
                        'block w-5 h-5 bg-white rounded-full shadow transition-transform',
                        security.twoFactor ? 'translate-x-6' : 'translate-x-1'
                      ]"
                    ></span>
                  </button>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                  <select
                    v-model="security.sessionTimeout"
                    class="w-full sm:w-48 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="120">2 hours</option>
                  </select>
                </div>

                <div class="pt-4 border-t border-gray-100">
                  <h4 class="font-medium text-gray-900 mb-4">Password</h4>
                  <button class="px-4 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors">
                    Change Password
                  </button>
                </div>

                <div class="pt-4 border-t border-gray-100">
                  <h4 class="font-medium text-red-600 mb-2">Danger Zone</h4>
                  <p class="text-sm text-gray-500 mb-4">Once you delete your account, there is no going back.</p>
                  <button class="px-4 py-2.5 bg-red-50 text-red-600 font-medium rounded-xl hover:bg-red-100 transition-colors">
                    Delete Account
                  </button>
                </div>
              </div>

              <!-- Save Button -->
              <div class="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                <button
                  @click="saveSettings"
                  :disabled="isSaving"
                  class="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50 min-h-[44px]"
                >
                  <span v-if="isSaving" class="flex items-center gap-2">
                    <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                  <span v-else>Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
