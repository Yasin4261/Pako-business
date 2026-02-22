<script setup>
// HomeView - Dashboard after login
import { useAuthStore } from '@/stores/auth.store.js'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen min-w-full fixed inset-0 bg-gradient-to-br from-gray-50 to-gray-100 overflow-auto">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 class="text-lg sm:text-xl font-bold text-gray-800">Pako Business</h1>
        </div>
        
        <div class="flex items-center gap-2 sm:gap-4">
          <span class="text-gray-600 text-sm sm:text-base hidden sm:inline">Welcome, {{ authStore.userName || 'User' }}</span>
          <button
            @click="handleLogout"
            class="px-3 sm:px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors min-h-[44px]"
          >
            Logout
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div class="bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-center">
        <div class="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <svg class="w-8 h-8 sm:w-10 sm:h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 class="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Login Successful!</h2>
        <p class="text-gray-600 mb-6 text-sm sm:text-base">Welcome to Pako Business Dashboard.</p>
        
        <!-- Quick Stats -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          <div class="bg-blue-50 rounded-xl p-4 sm:p-6">
            <div class="text-2xl sm:text-3xl font-bold text-blue-600">0</div>
            <div class="text-gray-600 text-sm sm:text-base">Active Orders</div>
          </div>
          <div class="bg-purple-50 rounded-xl p-4 sm:p-6">
            <div class="text-2xl sm:text-3xl font-bold text-purple-600">0</div>
            <div class="text-gray-600 text-sm sm:text-base">Couriers</div>
          </div>
          <div class="bg-green-50 rounded-xl p-4 sm:p-6">
            <div class="text-2xl sm:text-3xl font-bold text-green-600">$0</div>
            <div class="text-gray-600 text-sm sm:text-base">Today's Revenue</div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
