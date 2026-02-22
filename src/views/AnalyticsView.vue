<script setup>
// AnalyticsView - Analytics & Reports Page
// Single Responsibility: Display business analytics and reports

import { ref } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import StatCard from '@/components/dashboard/StatCard.vue'

const isSidebarOpen = ref(false)
const selectedPeriod = ref('week')

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
}

function closeSidebar() {
  isSidebarOpen.value = false
}

const periods = [
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'This Week' },
  { id: 'month', label: 'This Month' },
  { id: 'year', label: 'This Year' }
]

// Demo stats
const stats = [
  {
    title: 'Total Revenue',
    value: '$12,458',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    trend: 12,
    color: 'green'
  },
  {
    title: 'Total Orders',
    value: '486',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    trend: 8,
    color: 'blue'
  },
  {
    title: 'Avg. Order Value',
    value: '$25.64',
    icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
    trend: 5,
    color: 'purple'
  },
  {
    title: 'Delivery Time',
    value: '28 min',
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    trend: -3,
    color: 'orange'
  }
]

// Demo chart data
const revenueByDay = [
  { day: 'Mon', value: 1200 },
  { day: 'Tue', value: 1800 },
  { day: 'Wed', value: 1400 },
  { day: 'Thu', value: 2200 },
  { day: 'Fri', value: 2800 },
  { day: 'Sat', value: 3200 },
  { day: 'Sun', value: 2400 }
]

const maxRevenue = Math.max(...revenueByDay.map(d => d.value))

// Top selling items
const topItems = [
  { name: 'Classic Burger', orders: 156, revenue: '$1,872', growth: 12 },
  { name: 'Margherita Pizza', orders: 134, revenue: '$2,142', growth: 8 },
  { name: 'Cheese Burger', orders: 98, revenue: '$1,470', growth: -2 },
  { name: 'Coca Cola', orders: 245, revenue: '$735', growth: 15 },
  { name: 'Chocolate Cake', orders: 67, revenue: '$602', growth: 5 }
]

// Performance metrics
const performanceMetrics = [
  { label: 'Order Completion Rate', value: 94, color: 'green' },
  { label: 'Customer Satisfaction', value: 88, color: 'blue' },
  { label: 'On-Time Delivery', value: 82, color: 'purple' },
  { label: 'Repeat Customers', value: 45, color: 'orange' }
]
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
              <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Analytics</h1>
              <p class="text-sm sm:text-base text-gray-500 mt-1">Track your business performance</p>
            </div>

            <!-- Period Selector -->
            <div class="flex gap-2 bg-white rounded-xl p-1 shadow-sm border border-gray-100">
              <button
                v-for="period in periods"
                :key="period.id"
                @click="selectedPeriod = period.id"
                :class="[
                  'px-3 sm:px-4 py-2 text-sm font-medium rounded-lg transition-all',
                  selectedPeriod === period.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow'
                    : 'text-gray-600 hover:bg-gray-100'
                ]"
              >
                {{ period.label }}
              </button>
            </div>
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

          <!-- Charts Row -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <!-- Revenue Chart -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-lg font-semibold text-gray-900">Revenue Overview</h2>
                <span class="text-sm text-gray-500">This Week</span>
              </div>

              <!-- Simple Bar Chart -->
              <div class="flex items-end justify-between h-48 gap-2 sm:gap-4">
                <div
                  v-for="data in revenueByDay"
                  :key="data.day"
                  class="flex-1 flex flex-col items-center gap-2"
                >
                  <div class="w-full relative group">
                    <div
                      :style="{ height: `${(data.value / maxRevenue) * 160}px` }"
                      class="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-lg transition-all hover:from-blue-600 hover:to-purple-600"
                    ></div>
                    <!-- Tooltip -->
                    <div class="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      ${{ data.value.toLocaleString() }}
                    </div>
                  </div>
                  <span class="text-xs text-gray-500">{{ data.day }}</span>
                </div>
              </div>
            </div>

            <!-- Performance Metrics -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <h2 class="text-lg font-semibold text-gray-900 mb-6">Performance Metrics</h2>

              <div class="space-y-5">
                <div v-for="metric in performanceMetrics" :key="metric.label">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm text-gray-600">{{ metric.label }}</span>
                    <span class="text-sm font-semibold text-gray-900">{{ metric.value }}%</span>
                  </div>
                  <div class="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      :class="[
                        'h-full rounded-full transition-all duration-500',
                        metric.color === 'green' && 'bg-green-500',
                        metric.color === 'blue' && 'bg-blue-500',
                        metric.color === 'purple' && 'bg-purple-500',
                        metric.color === 'orange' && 'bg-orange-500'
                      ]"
                      :style="{ width: `${metric.value}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Top Selling Items -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="p-4 sm:p-6 border-b border-gray-100">
              <h2 class="text-lg font-semibold text-gray-900">Top Selling Items</h2>
            </div>

            <!-- Table -->
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                    <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                    <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                    <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Growth</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr v-for="(item, index) in topItems" :key="item.name" class="hover:bg-gray-50 transition-colors">
                    <td class="px-4 sm:px-6 py-4">
                      <div class="flex items-center gap-3">
                        <span class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                          {{ index + 1 }}
                        </span>
                        <span class="font-medium text-gray-900 text-sm sm:text-base">{{ item.name }}</span>
                      </div>
                    </td>
                    <td class="px-4 sm:px-6 py-4 text-gray-600 text-sm sm:text-base">{{ item.orders }}</td>
                    <td class="px-4 sm:px-6 py-4 font-medium text-gray-900 text-sm sm:text-base">{{ item.revenue }}</td>
                    <td class="px-4 sm:px-6 py-4">
                      <span
                        :class="[
                          'inline-flex items-center gap-1 text-sm font-medium',
                          item.growth >= 0 ? 'text-green-600' : 'text-red-600'
                        ]"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            v-if="item.growth >= 0"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                          />
                          <path
                            v-else
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                          />
                        </svg>
                        {{ Math.abs(item.growth) }}%
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
