<script setup>
// HomeView - Dashboard Page
// Single Responsibility: Only dashboard UI composition

import { ref } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import StatCard from '@/components/dashboard/StatCard.vue'
import OrderCard from '@/components/dashboard/OrderCard.vue'
import QuickActionButton from '@/components/dashboard/QuickActionButton.vue'
import ActivityItem from '@/components/dashboard/ActivityItem.vue'

const isSidebarOpen = ref(false)

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
}

function closeSidebar() {
  isSidebarOpen.value = false
}

// Demo data - In real app, this comes from store
const stats = [
  {
    title: 'Active Orders',
    value: 12,
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    trend: 12,
    color: 'blue'
  },
  {
    title: "Today's Revenue",
    value: '$1,248',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    trend: 8,
    color: 'green'
  },
  {
    title: 'Available Couriers',
    value: 5,
    icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z',
    trend: -2,
    color: 'purple'
  },
  {
    title: 'Completed Today',
    value: 34,
    icon: 'M5 13l4 4L19 7',
    trend: 15,
    color: 'orange'
  }
]

const activeOrders = [
  {
    id: '1042',
    customer: 'John Smith',
    address: '123 Main St, Apt 4B',
    items: ['2x Burger', '1x Fries', '1x Coke'],
    total: 28.50,
    status: 'preparing',
    time: '5 mins ago'
  },
  {
    id: '1041',
    customer: 'Sarah Johnson',
    address: '456 Oak Avenue',
    items: ['1x Pizza Large', '2x Salad'],
    total: 42.00,
    status: 'ready',
    time: '12 mins ago'
  },
  {
    id: '1040',
    customer: 'Mike Brown',
    address: '789 Pine Road, Suite 12',
    items: ['3x Tacos', '1x Nachos', '2x Soda'],
    total: 35.75,
    status: 'in-transit',
    time: '18 mins ago'
  },
  {
    id: '1039',
    customer: 'Emily Davis',
    address: '321 Elm Street',
    items: ['1x Pasta', '1x Bread'],
    total: 22.00,
    status: 'pending',
    time: '2 mins ago'
  }
]

const quickActions = [
  {
    title: 'New Order',
    description: 'Create manual order',
    icon: 'M12 4v16m8-8H4',
    color: 'blue'
  },
  {
    title: 'Assign Courier',
    description: '3 orders waiting',
    icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z',
    color: 'purple'
  },
  {
    title: 'View Reports',
    description: 'Daily analytics',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    color: 'green'
  }
]

const recentActivities = [
  {
    type: 'delivery',
    message: 'Order #1038 delivered successfully',
    time: '2 minutes ago'
  },
  {
    type: 'order',
    message: 'New order #1042 received from John Smith',
    time: '5 minutes ago'
  },
  {
    type: 'courier',
    message: 'Courier Ali assigned to order #1040',
    time: '10 minutes ago'
  },
  {
    type: 'payment',
    message: 'Payment received for order #1037',
    time: '15 minutes ago'
  },
  {
    type: 'order',
    message: 'Order #1041 marked as ready for pickup',
    time: '18 minutes ago'
  }
]

// Event handlers
function handleViewOrder(order) {
  console.log('View order:', order)
}

function handleAssignOrder(order) {
  console.log('Assign order:', order)
}

function handleCompleteOrder(order) {
  console.log('Complete order:', order)
}

function handleQuickAction(action) {
  console.log('Quick action:', action)
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
            <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Dashboard</h1>
            <p class="text-sm sm:text-base text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
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

          <!-- Quick Actions (Mobile: horizontal scroll, Desktop: grid) -->
          <div class="mb-6 sm:mb-8">
            <h2 class="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div class="flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0">
              <div v-for="action in quickActions" :key="action.title" class="min-w-[200px] sm:min-w-0">
                <QuickActionButton
                  :title="action.title"
                  :description="action.description"
                  :icon="action.icon"
                  :color="action.color"
                  @click="handleQuickAction(action)"
                />
              </div>
            </div>
          </div>

          <!-- Main Grid: Orders & Activity -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <!-- Active Orders - 2 columns on desktop -->
            <div class="lg:col-span-2">
              <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div class="p-4 sm:p-6 border-b border-gray-100">
                  <div class="flex items-center justify-between">
                    <div>
                      <h2 class="text-lg sm:text-xl font-semibold text-gray-900">Active Orders</h2>
                      <p class="text-sm text-gray-500 mt-0.5">{{ activeOrders.length }} orders in progress</p>
                    </div>
                    <button class="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                      View All
                    </button>
                  </div>
                </div>

                <!-- Orders List -->
                <div class="p-4 sm:p-6 space-y-4 max-h-[600px] overflow-y-auto">
                  <OrderCard
                    v-for="order in activeOrders"
                    :key="order.id"
                    :order="order"
                    @view="handleViewOrder"
                    @assign="handleAssignOrder"
                    @complete="handleCompleteOrder"
                  />
                </div>
              </div>
            </div>

            <!-- Recent Activity - 1 column -->
            <div class="lg:col-span-1">
              <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div class="p-4 sm:p-6 border-b border-gray-100">
                  <div class="flex items-center justify-between">
                    <h2 class="text-lg sm:text-xl font-semibold text-gray-900">Recent Activity</h2>
                    <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  </div>
                </div>

                <!-- Activity List -->
                <div class="divide-y divide-gray-50 max-h-[500px] overflow-y-auto">
                  <ActivityItem
                    v-for="(activity, index) in recentActivities"
                    :key="index"
                    :activity="activity"
                  />
                </div>

                <!-- View All -->
                <div class="p-4 border-t border-gray-100">
                  <button class="w-full py-2.5 text-sm font-medium text-gray-600 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    View All Activity
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
