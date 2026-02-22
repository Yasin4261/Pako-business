<script setup>
// LoginView - View Layer
// Single Responsibility: Only handles login UI and user interactions

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store.js'

const router = useRouter()
const authStore = useAuthStore()

// Form state
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)

// Form validation
const emailError = ref('')
const passwordError = ref('')

function validateEmail() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email.value) {
    emailError.value = 'Email is required'
    return false
  }
  if (!emailRegex.test(email.value)) {
    emailError.value = 'Please enter a valid email'
    return false
  }
  emailError.value = ''
  return true
}

function validatePassword() {
  if (!password.value) {
    passwordError.value = 'Password is required'
    return false
  }
  if (password.value.length < 6) {
    passwordError.value = 'Password must be at least 6 characters'
    return false
  }
  passwordError.value = ''
  return true
}

async function handleLogin() {
  authStore.clearError()
  
  const isEmailValid = validateEmail()
  const isPasswordValid = validatePassword()
  
  if (!isEmailValid || !isPasswordValid) return

  const success = await authStore.login({
    email: email.value,
    password: password.value,
  })

  if (success) {
    router.push('/')
  }
}

function goToRegister() {
  router.push('/register')
}

onMounted(() => {
  authStore.clearError()
})
</script>

<template>
  <div class="min-h-screen min-w-full fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 overflow-auto">
    <!-- Background decoration -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-20 -right-20 sm:-top-40 sm:-right-40 w-40 sm:w-60 lg:w-80 h-40 sm:h-60 lg:h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div class="absolute -bottom-20 -left-20 sm:-bottom-40 sm:-left-40 w-40 sm:w-60 lg:w-80 h-40 sm:h-60 lg:h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div class="absolute top-20 left-20 sm:top-40 sm:left-40 w-40 sm:w-60 lg:w-80 h-40 sm:h-60 lg:h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
    </div>

    <!-- Login Card -->
    <div class="relative z-10 w-full max-w-[90%] sm:max-w-md">
      <div class="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8 lg:p-10">
        <!-- Logo & Header -->
        <div class="text-center mb-6 sm:mb-8">
          <div class="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 shadow-lg">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">Welcome Back</h1>
          <p class="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-base">Sign in to your Pako Business account</p>
        </div>

        <!-- Error Message -->
        <Transition
          enter-active-class="transition ease-out duration-300"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition ease-in duration-200"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div v-if="authStore.error" class="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl flex items-start gap-2 sm:gap-3">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-red-600 text-xs sm:text-sm">{{ authStore.error }}</p>
          </div>
        </Transition>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-4 sm:space-y-5">
          <!-- Email Field -->
          <div>
            <label for="email" class="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Email Address</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input
                id="email"
                v-model="email"
                type="email"
                placeholder="you@example.com"
                class="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                :class="{ 'border-red-300 bg-red-50': emailError }"
                @blur="validateEmail"
              />
            </div>
            <p v-if="emailError" class="mt-1.5 sm:mt-2 text-xs sm:text-sm text-red-500">{{ emailError }}</p>
          </div>

          <!-- Password Field -->
          <div>
            <label for="password" class="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Password</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                class="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-3.5 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                :class="{ 'border-red-300 bg-red-50': passwordError }"
                @blur="validatePassword"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center"
                @click="showPassword = !showPassword"
              >
                <svg v-if="!showPassword" class="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
            <p v-if="passwordError" class="mt-1.5 sm:mt-2 text-xs sm:text-sm text-red-500">{{ passwordError }}</p>
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between flex-wrap gap-2">
            <label class="flex items-center cursor-pointer">
              <input
                v-model="rememberMe"
                type="checkbox"
                class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span class="ml-2 text-xs sm:text-sm text-gray-600">Remember me</span>
            </label>
            <a href="#" class="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
              Forgot password?
            </a>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="authStore.isLoading"
            class="w-full py-3 sm:py-3.5 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-h-[44px]"
          >
            <span v-if="!authStore.isLoading">Sign In</span>
            <span v-else class="flex items-center justify-center gap-2">
              <svg class="animate-spin w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </span>
          </button>
        </form>

        <!-- Register Link -->
        <div class="mt-6 sm:mt-8 text-center">
          <p class="text-gray-600 text-sm sm:text-base">
            Don't have an account?
            <button
              @click="goToRegister"
              class="font-semibold text-blue-600 hover:text-blue-700 transition-colors ml-1"
            >
              Sign up for free
            </button>
          </p>
        </div>
      </div>

      <!-- Footer -->
      <p class="text-center text-gray-400 text-xs sm:text-sm mt-4 sm:mt-6">
        © 2026 Pako Business. All rights reserved.
      </p>
    </div>
  </div>
</template>

<style scoped>
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
</style>