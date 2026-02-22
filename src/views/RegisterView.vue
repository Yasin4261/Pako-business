<script setup>
// RegisterView - View Layer
// Single Responsibility: Only handles registration UI and user interactions

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store.js'

const router = useRouter()
const authStore = useAuthStore()

// Form state
const name = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const confirmPassword = ref('')
const address = ref('')
const showPassword = ref(false)
const agreeTerms = ref(false)

// Form validation errors
const errors = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  address: '',
  terms: '',
})

function validateName() {
  if (!name.value.trim()) {
    errors.value.name = 'İşletme adı gereklidir'
    return false
  }
  if (name.value.length < 2) {
    errors.value.name = 'İsim en az 2 karakter olmalıdır'
    return false
  }
  errors.value.name = ''
  return true
}

function validateEmail() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email.value) {
    errors.value.email = 'E-posta adresi gereklidir'
    return false
  }
  if (!emailRegex.test(email.value)) {
    errors.value.email = 'Geçerli bir e-posta adresi giriniz'
    return false
  }
  errors.value.email = ''
  return true
}

function validatePhone() {
  const phoneRegex = /^\+?[0-9]{10,15}$/
  if (!phone.value) {
    errors.value.phone = 'Telefon numarası gereklidir'
    return false
  }
  if (!phoneRegex.test(phone.value.replace(/\s/g, ''))) {
    errors.value.phone = 'Geçerli bir telefon numarası giriniz'
    return false
  }
  errors.value.phone = ''
  return true
}

function validatePassword() {
  if (!password.value) {
    errors.value.password = 'Şifre gereklidir'
    return false
  }
  if (password.value.length < 8) {
    errors.value.password = 'Şifre en az 8 karakter olmalıdır'
    return false
  }
  errors.value.password = ''
  return true
}

function validateConfirmPassword() {
  if (!confirmPassword.value) {
    errors.value.confirmPassword = 'Lütfen şifrenizi onaylayın'
    return false
  }
  if (confirmPassword.value !== password.value) {
    errors.value.confirmPassword = 'Şifreler eşleşmiyor'
    return false
  }
  errors.value.confirmPassword = ''
  return true
}

function validateAddress() {
  if (!address.value.trim()) {
    errors.value.address = 'Adres gereklidir'
    return false
  }
  errors.value.address = ''
  return true
}

function validateTerms() {
  if (!agreeTerms.value) {
    errors.value.terms = 'Kullanım koşullarını kabul etmelisiniz'
    return false
  }
  errors.value.terms = ''
  return true
}

async function handleRegister() {
  authStore.clearError()
  
  const validations = [
    validateName(),
    validateEmail(),
    validatePhone(),
    validatePassword(),
    validateConfirmPassword(),
    validateAddress(),
    validateTerms(),
  ]
  
  if (validations.some(v => !v)) return

  const success = await authStore.register({
    name: name.value,
    email: email.value,
    phone: phone.value,
    password: password.value,
    address: address.value,
  })

  if (success) {
    router.push('/login')
  }
}

function goToLogin() {
  router.push('/login')
}

onMounted(() => {
  authStore.clearError()
})
</script>

<template>
  <div class="min-h-screen min-w-full fixed inset-0 flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 overflow-auto">
    <!-- Background decoration -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-20 -left-20 sm:-top-40 sm:-left-40 w-40 sm:w-60 lg:w-80 h-40 sm:h-60 lg:h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div class="absolute -bottom-20 -right-20 sm:-bottom-40 sm:-right-40 w-40 sm:w-60 lg:w-80 h-40 sm:h-60 lg:h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div class="absolute top-1/2 left-1/2 w-40 sm:w-60 lg:w-80 h-40 sm:h-60 lg:h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
    </div>

    <!-- Register Card -->
    <div class="relative z-10 w-full max-w-[95%] sm:max-w-md lg:max-w-lg">
      <div class="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 p-5 sm:p-6 lg:p-8 xl:p-10">
        <!-- Logo & Header -->
        <div class="text-center mb-5 sm:mb-6 lg:mb-8">
          <div class="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 shadow-lg">
            <svg class="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">Hesap Oluştur</h1>
          <p class="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-base">İşletmenizi Pako'ya kaydedin</p>
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

        <!-- Register Form -->
        <form @submit.prevent="handleRegister" class="space-y-3 sm:space-y-4">
          <!-- Business Name -->
          <div>
            <label for="name" class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">İşletme Adı</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <input
                id="name"
                v-model="name"
                type="text"
                placeholder="Restoran Adınız"
                class="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                :class="{ 'border-red-300 bg-red-50': errors.name }"
                @blur="validateName"
              />
            </div>
            <p v-if="errors.name" class="mt-1 text-xs sm:text-sm text-red-500">{{ errors.name }}</p>
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">E-posta Adresi</label>
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
                placeholder="ornek@email.com"
                class="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                :class="{ 'border-red-300 bg-red-50': errors.email }"
                @blur="validateEmail"
              />
            </div>
            <p v-if="errors.email" class="mt-1 text-xs sm:text-sm text-red-500">{{ errors.email }}</p>
          </div>

          <!-- Phone -->
          <div>
            <label for="phone" class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">Telefon Numarası</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <input
                id="phone"
                v-model="phone"
                type="tel"
                placeholder="+90 555 999 9999"
                class="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                :class="{ 'border-red-300 bg-red-50': errors.phone }"
                @blur="validatePhone"
              />
            </div>
            <p v-if="errors.phone" class="mt-1 text-xs sm:text-sm text-red-500">{{ errors.phone }}</p>
          </div>

          <!-- Address -->
          <div>
            <label for="address" class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">İşletme Adresi</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <input
                id="address"
                v-model="address"
                type="text"
                placeholder="İstanbul, Türkiye"
                class="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                :class="{ 'border-red-300 bg-red-50': errors.address }"
                @blur="validateAddress"
              />
            </div>
            <p v-if="errors.address" class="mt-1 text-xs sm:text-sm text-red-500">{{ errors.address }}</p>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">Şifre</label>
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
                placeholder="Min. 8 karakter"
                class="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                :class="{ 'border-red-300 bg-red-50': errors.password }"
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
            <p v-if="errors.password" class="mt-1 text-xs sm:text-sm text-red-500">{{ errors.password }}</p>
          </div>

          <!-- Confirm Password -->
          <div>
            <label for="confirmPassword" class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">Şifre Onayı</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <input
                id="confirmPassword"
                v-model="confirmPassword"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Şifrenizi onaylayın"
                class="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                :class="{ 'border-red-300 bg-red-50': errors.confirmPassword }"
                @blur="validateConfirmPassword"
              />
            </div>
            <p v-if="errors.confirmPassword" class="mt-1 text-xs sm:text-sm text-red-500">{{ errors.confirmPassword }}</p>
          </div>

          <!-- Terms & Conditions -->
          <div>
            <label class="flex items-start cursor-pointer">
              <input
                v-model="agreeTerms"
                type="checkbox"
                class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mt-0.5"
                @change="validateTerms"
              />
              <span class="ml-2 text-xs sm:text-sm text-gray-600">
                <a href="#" class="text-purple-600 hover:text-purple-700 font-medium">Kullanım Koşulları</a> 
                ve 
                <a href="#" class="text-purple-600 hover:text-purple-700 font-medium">Gizlilik Politikası</a>'nı kabul ediyorum
              </span>
            </label>
            <p v-if="errors.terms" class="mt-1 text-xs sm:text-sm text-red-500">{{ errors.terms }}</p>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="authStore.isLoading"
            class="w-full py-2.5 sm:py-3 lg:py-3.5 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-4 sm:mt-6 min-h-[44px]"
          >
            <span v-if="!authStore.isLoading">Hesap Oluştur</span>
            <span v-else class="flex items-center justify-center gap-2">
              <svg class="animate-spin w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Hesap oluşturuluyor...
            </span>
          </button>
        </form>

        <!-- Login Link -->
        <div class="mt-4 sm:mt-6 text-center">
          <p class="text-gray-600 text-sm sm:text-base">
            Zaten hesabınız var mı?
            <button
              @click="goToLogin"
              class="font-semibold text-purple-600 hover:text-purple-700 transition-colors ml-1"
            >
              Giriş yapın
            </button>
          </p>
        </div>
      </div>

      <!-- Footer -->
      <p class="text-center text-gray-400 text-xs sm:text-sm mt-4 sm:mt-6">
        © 2026 Pako Business. Tüm hakları saklıdır.
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
