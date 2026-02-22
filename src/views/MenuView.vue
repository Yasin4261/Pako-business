<script setup>
// MenuView - Restaurant Menu Management Page
// Single Responsibility: Menu items listing and management UI

import { ref, computed } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'

const isSidebarOpen = ref(false)
const activeCategory = ref('all')
const searchQuery = ref('')
const isAddModalOpen = ref(false)

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
}

function closeSidebar() {
  isSidebarOpen.value = false
}

const categories = [
  { id: 'all', label: 'All Items', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
  { id: 'burgers', label: 'Burgers', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  { id: 'pizza', label: 'Pizza', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { id: 'drinks', label: 'Drinks', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  { id: 'desserts', label: 'Desserts', icon: 'M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z' }
]

// Demo menu items - will be replaced with API data
const menuItems = ref([
  {
    id: 1,
    name: 'Classic Burger',
    description: 'Juicy beef patty with lettuce, tomato, and special sauce',
    price: 12.99,
    category: 'burgers',
    image: '🍔',
    available: true,
    popular: true
  },
  {
    id: 2,
    name: 'Cheese Burger',
    description: 'Classic burger with melted cheddar cheese',
    price: 14.99,
    category: 'burgers',
    image: '🍔',
    available: true,
    popular: false
  },
  {
    id: 3,
    name: 'Margherita Pizza',
    description: 'Fresh tomatoes, mozzarella, and basil',
    price: 16.99,
    category: 'pizza',
    image: '🍕',
    available: true,
    popular: true
  },
  {
    id: 4,
    name: 'Pepperoni Pizza',
    description: 'Loaded with pepperoni and extra cheese',
    price: 18.99,
    category: 'pizza',
    image: '🍕',
    available: true,
    popular: false
  },
  {
    id: 5,
    name: 'Coca Cola',
    description: 'Refreshing cola drink, 330ml',
    price: 2.99,
    category: 'drinks',
    image: '🥤',
    available: true,
    popular: false
  },
  {
    id: 6,
    name: 'Fresh Lemonade',
    description: 'Homemade lemonade with mint',
    price: 4.99,
    category: 'drinks',
    image: '🍋',
    available: false,
    popular: false
  },
  {
    id: 7,
    name: 'Chocolate Cake',
    description: 'Rich chocolate cake with cream',
    price: 8.99,
    category: 'desserts',
    image: '🍰',
    available: true,
    popular: true
  },
  {
    id: 8,
    name: 'Ice Cream Sundae',
    description: 'Vanilla ice cream with chocolate sauce',
    price: 6.99,
    category: 'desserts',
    image: '🍨',
    available: true,
    popular: false
  }
])

const filteredItems = computed(() => {
  let items = menuItems.value

  if (activeCategory.value !== 'all') {
    items = items.filter(item => item.category === activeCategory.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    items = items.filter(item =>
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    )
  }

  return items
})

function toggleAvailability(item) {
  item.available = !item.available
}

function handleEdit(item) {
  console.log('Edit item:', item)
}

function handleDelete(item) {
  console.log('Delete item:', item)
}
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
              <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Menu</h1>
              <p class="text-sm sm:text-base text-gray-500 mt-1">Manage your restaurant menu items</p>
            </div>
            <button
              @click="isAddModalOpen = true"
              class="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all min-h-[44px]"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Item</span>
            </button>
          </div>

          <!-- Categories & Search -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6">
            <!-- Search -->
            <div class="relative mb-4">
              <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search menu items..."
                class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm sm:text-base"
              />
            </div>

            <!-- Categories -->
            <div class="flex gap-2 overflow-x-auto pb-2">
              <button
                v-for="cat in categories"
                :key="cat.id"
                @click="activeCategory = cat.id"
                :class="[
                  'flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all',
                  activeCategory === cat.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                ]"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="cat.icon" />
                </svg>
                {{ cat.label }}
              </button>
            </div>
          </div>

          <!-- Menu Items Grid -->
          <div v-if="filteredItems.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            <div
              v-for="item in filteredItems"
              :key="item.id"
              :class="[
                'bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group',
                !item.available && 'opacity-60'
              ]"
            >
              <!-- Image/Emoji -->
              <div class="h-32 sm:h-40 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-5xl sm:text-6xl relative">
                {{ item.image }}
                
                <!-- Popular Badge -->
                <span
                  v-if="item.popular"
                  class="absolute top-3 left-3 px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded-full"
                >
                  Popular
                </span>

                <!-- Availability Toggle -->
                <button
                  @click="toggleAvailability(item)"
                  :class="[
                    'absolute top-3 right-3 w-10 h-6 rounded-full transition-colors',
                    item.available ? 'bg-green-500' : 'bg-gray-300'
                  ]"
                >
                  <span
                    :class="[
                      'block w-4 h-4 bg-white rounded-full shadow transition-transform',
                      item.available ? 'translate-x-5' : 'translate-x-1'
                    ]"
                  ></span>
                </button>
              </div>

              <!-- Content -->
              <div class="p-4">
                <div class="flex items-start justify-between mb-2">
                  <h3 class="font-semibold text-gray-900">{{ item.name }}</h3>
                  <span class="text-lg font-bold text-blue-600">${{ item.price.toFixed(2) }}</span>
                </div>
                <p class="text-sm text-gray-500 mb-4 line-clamp-2">{{ item.description }}</p>

                <!-- Actions -->
                <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    @click="handleEdit(item)"
                    class="flex-1 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    @click="handleDelete(item)"
                    class="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 text-center">
            <div class="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
              🍽️
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">No menu items found</h3>
            <p class="text-gray-500 text-sm sm:text-base mb-4">Add your first menu item to get started</p>
            <button
              @click="isAddModalOpen = true"
              class="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-shadow"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Item
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
